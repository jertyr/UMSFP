# Firebase Setup Guide

This app now uses Firebase for Google authentication and cloud data storage. Follow these steps to set it up:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** (or select existing project)
3. Enter project name (e.g., "Progress Tracker")
4. Follow the prompts (you can disable Google Analytics if you want)
5. Click **"Create project"**

## Step 2: Enable Google Authentication

1. In your Firebase project, click **"Authentication"** in the left sidebar
2. Click **"Get started"** if it's your first time
3. Go to the **"Sign-in method"** tab
4. Click on **"Google"**
5. Toggle the **"Enable"** switch
6. Set a project support email
7. Click **"Save"**

## Step 3: Create Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose a location (pick the closest region to you)
5. Click **"Enable"**

## Step 4: Set Up Security Rules

1. In Firestore, click the **"Rules"** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

**What this does:** Users can only read/write their own data

## Step 5: Add Web App to Firebase

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"**
4. Click the **Web icon** `</>`
5. Enter an app nickname (e.g., "Progress Tracker Web")
6. **Do NOT** check "Firebase Hosting" (we'll use GitHub Pages)
7. Click **"Register app"**

## Step 6: Get Your Firebase Config

1. You'll see a code snippet with `firebaseConfig`
2. Copy the `firebaseConfig` object (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

## Step 7: Update firebase-config.js

1. Open `firebase-config.js` in this project
2. Replace the placeholder values with your actual config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",           // Replace this
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // Replace this
    projectId: "YOUR_PROJECT_ID",     // Replace this
    storageBucket: "YOUR_PROJECT_ID.appspot.com",   // Replace this
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // Replace this
    appId: "YOUR_APP_ID"              // Replace this
};
```

3. Save the file

## Step 8: Add Authorized Domain (for GitHub Pages)

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add these domains:
   - `localhost` (for local testing - usually already there)
   - `YOUR_USERNAME.github.io` (replace with your GitHub username)
3. Click **"Add domain"**

Example: If your GitHub username is `jertyr`, add `jertyr.github.io`

## Step 9: Test Locally

1. Open `index.html` in your browser
2. You should see the login screen
3. Click "Sign in with Google"
4. Authenticate with your Google account
5. Create a goal and test it out!

## Step 10: Deploy to GitHub Pages

1. Commit and push your changes (with updated firebase-config.js)
2. Go to your GitHub repo: Settings → Pages
3. Select your branch as the source
4. Save and wait for deployment
5. Visit your GitHub Pages URL

**Note:** Make sure you added your GitHub Pages domain to Firebase authorized domains (Step 8)

## Troubleshooting

### "Firebase configuration needed" error
- Make sure you updated `firebase-config.js` with your actual Firebase config

### "auth/unauthorized-domain" error
- Add your domain to Firebase authorized domains (Step 8)

### "Missing or insufficient permissions" error
- Check your Firestore security rules (Step 4)
- Make sure you're signed in

### Login popup blocked
- Allow popups for your site in browser settings
- Try clicking the login button again

## Data Structure

Your data is stored in Firestore like this:

```
users/
  └── {userId}/
      └── goals/
          └── {goalId}/
              ├── title
              ├── target
              ├── direction
              ├── startValue
              ├── targetDate
              ├── createdAt
              └── checkIns[]
```

Each user's data is completely isolated and private.

## Cost

Firebase has a generous **free tier**:
- **Authentication**: Unlimited users
- **Firestore**: 1GB storage, 50k reads/day, 20k writes/day

For personal use, you'll likely never hit these limits!
