// Firebase Configuration
// TODO: Replace with your actual Firebase project configuration
// You can get this from the Firebase Console > Project Settings > General > Your Apps > SDK Setup and Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Export config for use in other modules
// Note: In a real module system we would use 'export', but for simple browser inclusion we'll stick to global or window scope 
// or simpler, just let this file run before the app initialization.
window.firebaseConfig = firebaseConfig;
