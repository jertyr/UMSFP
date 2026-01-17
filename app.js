// Initialize Firebase
let auth;
let db;
let currentUser = null;
let currentGoalId = null;
let goals = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
});

function initializeFirebase() {
    try {
        // Initialize Firebase with config
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();

        // Set up auth state listener
        auth.onAuthStateChanged(handleAuthStateChanged);

        // Set up login button
        document.getElementById('google-login-btn').addEventListener('click', signInWithGoogle);
        document.getElementById('logout-btn').addEventListener('click', signOut);
    } catch (error) {
        console.error('Firebase initialization error:', error);
        alert('Firebase configuration needed. Please check firebase-config.js');
    }
}

// Authentication handlers
function handleAuthStateChanged(user) {
    if (user) {
        currentUser = user;
        showMainApp(user);
        loadGoalsFromFirestore();
    } else {
        currentUser = null;
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
}

function showMainApp(user) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';

    // Update user info in header
    document.getElementById('user-name').textContent = user.displayName || 'User';
    document.getElementById('user-avatar').src = user.photoURL || '';

    showDashboard();
}

async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error('Login error:', error);
        alert('Failed to sign in. Please try again.');
    }
}

async function signOut() {
    if (confirm('Are you sure you want to sign out?')) {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }
}

// Firestore data operations
async function loadGoalsFromFirestore() {
    if (!currentUser) return;

    try {
        const goalsRef = db.collection('users').doc(currentUser.uid).collection('goals');
        const snapshot = await goalsRef.orderBy('createdAt', 'desc').get();

        goals = [];
        snapshot.forEach(doc => {
            goals.push({ id: doc.id, ...doc.data() });
        });

        renderGoals();
    } catch (error) {
        console.error('Error loading goals:', error);
        alert('Failed to load goals. Please refresh the page.');
    }
}

async function saveGoalToFirestore(goal) {
    if (!currentUser) return;

    try {
        const goalsRef = db.collection('users').doc(currentUser.uid).collection('goals');
        await goalsRef.doc(goal.id).set(goal);
    } catch (error) {
        console.error('Error saving goal:', error);
        throw error;
    }
}

async function deleteGoalFromFirestore(goalId) {
    if (!currentUser) return;

    try {
        await db.collection('users').doc(currentUser.uid).collection('goals').doc(goalId).delete();
    } catch (error) {
        console.error('Error deleting goal:', error);
        throw error;
    }
}

// Show/hide views
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });
    document.getElementById(viewId).style.display = 'block';
}

// Dashboard
function showDashboard() {
    showView('dashboard');
    renderGoals();
}

function renderGoals() {
    const goalsList = document.getElementById('goals-list');
    const emptyState = document.getElementById('empty-state');

    if (goals.length === 0) {
        goalsList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    goalsList.innerHTML = goals.map(goal => {
        const latest = getLatestValue(goal);
        const progress = calculateProgress(goal);
        const isAchieved = checkIfAchieved(goal);

        return `
            <div class="goal-card">
                <h3>${goal.title}</h3>
                <div class="goal-stats">
                    <div class="stat-row">
                        <span class="stat-label">Current:</span>
                        <span class="stat-value">${latest !== null ? latest : 'No check-ins yet'}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Target:</span>
                        <span class="stat-value">${goal.target}</span>
                    </div>
                    ${goal.targetDate ? `
                    <div class="stat-row">
                        <span class="stat-label">Target Date:</span>
                        <span class="stat-value">${new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                    ` : ''}
                    ${goal.startValue !== null ? `
                    <div class="stat-row">
                        <span class="stat-label">Started at:</span>
                        <span class="stat-value">${goal.startValue}</span>
                    </div>
                    ` : ''}
                </div>
                ${progress !== null ? `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                </div>
                <div style="text-align: center; color: var(--text-light); font-size: 0.9rem; margin-top: 8px;">
                    ${Math.round(progress)}% ${isAchieved ? '🎉' : 'progress'}
                </div>
                ` : ''}
                <div class="goal-actions">
                    <button class="btn-check-in" onclick="showCheckInForm('${goal.id}')">Check In</button>
                    <button class="btn-view" onclick="showProgress('${goal.id}')">View</button>
                    <button class="btn-delete" onclick="deleteGoal('${goal.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// New Goal Form
function showNewGoalForm() {
    showView('new-goal-form');
    document.getElementById('goal-form').reset();
}

function cancelGoalForm() {
    showDashboard();
}

async function saveGoal(event) {
    event.preventDefault();

    const title = document.getElementById('goal-title').value;
    const target = parseFloat(document.getElementById('goal-target').value);
    const direction = document.getElementById('goal-direction').value;
    const startValue = document.getElementById('goal-start').value;
    const targetDate = document.getElementById('goal-date').value;

    const goal = {
        id: generateId(),
        title,
        target,
        direction,
        startValue: startValue ? parseFloat(startValue) : null,
        targetDate: targetDate || null,
        checkIns: [],
        createdAt: new Date().toISOString()
    };

    try {
        await saveGoalToFirestore(goal);
        goals.push(goal);
        showDashboard();
    } catch (error) {
        alert('Failed to save goal. Please try again.');
    }
}

// Check-in Form
function showCheckInForm(goalId) {
    currentGoalId = goalId;
    const goal = goals.find(g => g.id === goalId);

    showView('check-in-form');
    document.getElementById('check-in-title').textContent = `Check in: ${goal.title}`;
    document.getElementById('check-in-label').textContent = `Current value`;
    document.getElementById('checkin-form').reset();
}

function cancelCheckIn() {
    currentGoalId = null;
    showDashboard();
}

async function saveCheckIn(event) {
    event.preventDefault();

    const value = parseFloat(document.getElementById('check-in-value').value);
    const notes = document.getElementById('check-in-notes').value;

    const goal = goals.find(g => g.id === currentGoalId);

    const checkIn = {
        id: generateId(),
        value,
        notes,
        date: new Date().toISOString()
    };

    goal.checkIns.push(checkIn);

    try {
        await saveGoalToFirestore(goal);
        showProgress(currentGoalId);
        currentGoalId = null;
    } catch (error) {
        alert('Failed to save check-in. Please try again.');
        goal.checkIns.pop(); // Revert the change
    }
}

// Progress View
function showProgress(goalId) {
    const goal = goals.find(g => g.id === goalId);
    showView('progress-view');

    const content = document.getElementById('progress-content');
    const latest = getLatestValue(goal);
    const isAchieved = checkIfAchieved(goal);
    const message = getEncouragementMessage(goal);
    const progress = calculateProgress(goal);

    // Calculate stats
    const totalCheckIns = goal.checkIns.length;
    const changeFromStart = goal.startValue !== null && latest !== null
        ? (latest - goal.startValue).toFixed(1)
        : null;
    const distanceToGoal = latest !== null
        ? Math.abs(goal.target - latest).toFixed(1)
        : null;

    content.innerHTML = `
        <div class="encouragement-card">
            <h2>${isAchieved ? '🎉' : '✨'} ${goal.title}</h2>
            <p>${message}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <h4>Current Value</h4>
                <div class="value">${latest !== null ? latest : '-'}</div>
            </div>
            <div class="stat-card">
                <h4>Target</h4>
                <div class="value">${goal.target}</div>
            </div>
            ${changeFromStart !== null ? `
            <div class="stat-card">
                <h4>Change</h4>
                <div class="value">${changeFromStart > 0 ? '+' : ''}${changeFromStart}</div>
            </div>
            ` : ''}
            ${distanceToGoal !== null ? `
            <div class="stat-card">
                <h4>To Goal</h4>
                <div class="value">${distanceToGoal}</div>
            </div>
            ` : ''}
            <div class="stat-card">
                <h4>Check-ins</h4>
                <div class="value">${totalCheckIns}</div>
            </div>
            ${progress !== null ? `
            <div class="stat-card">
                <h4>Progress</h4>
                <div class="value">${Math.round(progress)}%</div>
            </div>
            ` : ''}
        </div>

        ${goal.checkIns.length > 0 ? `
        <div class="check-ins-list">
            <h3>Check-in History</h3>
            ${goal.checkIns.slice().reverse().map(checkIn => `
                <div class="check-in-item">
                    <div class="date">${new Date(checkIn.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</div>
                    <div class="value">${checkIn.value}</div>
                    ${checkIn.notes ? `<div class="notes">${checkIn.notes}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : '<p style="text-align: center; color: var(--text-light);">No check-ins yet. Start tracking your progress!</p>'}
    `;
}

// Helper functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getLatestValue(goal) {
    if (goal.checkIns.length === 0) return null;
    return goal.checkIns[goal.checkIns.length - 1].value;
}

function checkIfAchieved(goal) {
    const latest = getLatestValue(goal);
    if (latest === null) return false;

    switch (goal.direction) {
        case 'below':
            return latest <= goal.target;
        case 'above':
            return latest >= goal.target;
        case 'equal':
            return latest === goal.target;
        default:
            return false;
    }
}

function calculateProgress(goal) {
    const latest = getLatestValue(goal);
    if (latest === null || goal.startValue === null) return null;

    const start = goal.startValue;
    const target = goal.target;
    const current = latest;

    if (start === target) return 100;

    const totalDistance = Math.abs(target - start);
    const currentDistance = Math.abs(current - start);

    let progress = (currentDistance / totalDistance) * 100;

    // For "below" goals, we're reducing, so flip the logic
    if (goal.direction === 'below' && current < start) {
        progress = (Math.abs(start - current) / Math.abs(start - target)) * 100;
    } else if (goal.direction === 'above' && current > start) {
        progress = (Math.abs(current - start) / Math.abs(target - start)) * 100;
    }

    return Math.max(0, Math.min(progress, 100));
}

function getEncouragementMessage(goal) {
    const latest = getLatestValue(goal);
    const isAchieved = checkIfAchieved(goal);

    if (latest === null) {
        return "Start your journey! Your first check-in is the most important step.";
    }

    if (isAchieved) {
        const messages = [
            "Amazing! You've reached your goal! 🎉",
            "You did it! Incredible work! 🌟",
            "Goal achieved! You're unstoppable! 💪",
            "Success! This is what dedication looks like! ✨"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Calculate if making progress
    const progress = calculateProgress(goal);

    if (progress === null) {
        return "Thank you for checking in! Every step counts.";
    }

    if (progress > 75) {
        return "You're so close! Keep up the amazing work! 🚀";
    }

    if (progress > 50) {
        return "Great progress! You're past the halfway point! 💪";
    }

    if (progress > 25) {
        return "Steady progress! Keep moving forward! ✨";
    }

    if (progress > 0) {
        return "You're making progress! Every step forward counts! 🌱";
    }

    // If no progress or moving backwards
    if (goal.checkIns.length > 1) {
        const previous = goal.checkIns[goal.checkIns.length - 2].value;
        const improvementDirection = goal.direction === 'below' ? latest < previous : latest > previous;

        if (improvementDirection) {
            return "Moving in the right direction! Keep it up! 📈";
        }
    }

    return "Thank you for showing up and being honest. Tomorrow is a new opportunity! 🌟";
}

async function deleteGoal(goalId) {
    if (confirm('Are you sure you want to delete this goal?')) {
        try {
            await deleteGoalFromFirestore(goalId);
            goals = goals.filter(g => g.id !== goalId);
            showDashboard();
        } catch (error) {
            alert('Failed to delete goal. Please try again.');
        }
    }
}
