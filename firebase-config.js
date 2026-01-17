// Firebase Configuration
// TODO: Replace with your Firebase project config
// Get this from: Firebase Console > Project Settings > Your Apps > Firebase SDK snippet

const firebaseConfig = {
    apiKey: "AIzaSyAtCBEnD_b_zIZUI3fiKYQ4c4QsctddIuM",
    authDomain: "progress-tracker-jtyr.firebaseapp.com",
    projectId: "progress-tracker-jtyr",
    storageBucket: "progress-tracker-jtyr.firebasestorage.app",
    messagingSenderId: "339744442808",
    appId: "1:339744442808:web:656239da4388b3f0b7a74d"
};

// Instructions to set up:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Enable Google Authentication:
//    - Go to Authentication > Sign-in method
//    - Enable "Google" provider
// 4. Enable Firestore Database:
//    - Go to Firestore Database
//    - Create database in production mode
//    - Start with these security rules:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
*/
// 5. Get your config:
//    - Go to Project Settings > Your Apps
//    - Click "Add app" > Web
//    - Copy the firebaseConfig object and replace above
