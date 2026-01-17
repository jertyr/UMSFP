UMSFP - Progress Tracker
=========================

A simple, positive goal-tracking web app that helps you set goals, check in weekly, and celebrate your progress.

## Features

- **Google Sign-In**: Secure authentication with your Google account
- **Cloud Sync**: Your data syncs across all your devices
- **Simple Goal Creation**: Set a goal with a target number and optional deadline
- **Flexible Goal Types**: Track goals where you want to go above, below, or hit an exact target
- **Weekly Check-ins**: Log your progress with optional notes
- **Positive Encouragement**: Get uplifting messages based on your progress
- **Progress Visualization**: See your journey with stats and history
- **Privacy First**: Your data is private and only accessible to you

## How to Use

1. **Sign In**:
   - Click "Sign in with Google"
   - Authorize with your Google account
   - Your data will sync across all devices

2. **Create a Goal**:
   - Click "New Goal"
   - Enter your goal (e.g., "Lose weight", "Run 7 miles/week", "Zero outbursts")
   - Set your target number
   - Choose if success means being above, below, or equal to that target
   - Optionally add starting value and target date

3. **Check In**:
   - Click "Check In" on any goal
   - Enter your current value
   - Add notes if you want
   - Get immediate encouraging feedback!

4. **Track Progress**:
   - View your progress percentage
   - See check-in history
   - Celebrate achievements

## Examples

- **Weight Loss**: Target 187, direction "below or equal", start at 217
- **Zero Outbursts**: Target 0, direction "equal", check in weekly with count
- **Running**: Target 7, direction "above or equal", track miles per week

## Setup

**Important:** You need to set up Firebase before using this app. See [SETUP.md](SETUP.md) for detailed instructions.

### Quick Start:
1. Create a Firebase project
2. Enable Google Authentication
3. Create a Firestore database
4. Update `firebase-config.js` with your Firebase credentials
5. Open `index.html` in your browser (or deploy to GitHub Pages)

Full setup takes about 10 minutes. See [SETUP.md](SETUP.md) for step-by-step guide.

## Deployment

### GitHub Pages (Recommended)
1. Update `firebase-config.js` with your Firebase credentials
2. Push to GitHub
3. Go to Settings → Pages
4. Select your branch and save
5. Add your GitHub Pages URL to Firebase authorized domains

Your app will be live at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

## Tech Stack

- Pure HTML/CSS/JavaScript (no build tools needed)
- **Firebase Authentication** - Google OAuth sign-in
- **Cloud Firestore** - Cloud database with real-time sync
- **Firebase SDK** (CDN) - No npm or build process required
- GitHub Pages ready