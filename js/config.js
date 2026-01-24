// Firebase Configuration
// TODO: Replace with your actual Firebase project configuration
// You can get this from the Firebase Console > Project Settings > General > Your Apps > SDK Setup and Configuration

const firebaseConfig = {
    apiKey: "***REMOVED***",
    authDomain: "***REMOVED***.firebaseapp.com",
    projectId: "***REMOVED***",
    storageBucket: "***REMOVED***.firebasestorage.app",
    messagingSenderId: "***REMOVED***",
    appId: "1:***REMOVED***:web:80880b743920d210d3a663",
    measurementId: "***REMOVED***"
};


// Google Drive API Configuration (OAuth 2.0)
// TODO: Replace with your actual OAuth 2.0 Client ID from Google Cloud Console
const googleConfig = {
    clientId: "YOUR_GOOGLE_CLIENT_ID", // e.g., "1234567890-abc.apps.googleusercontent.com"
    // Scope for Drive API: 'https://www.googleapis.com/auth/drive.file' allows access only to files created by this app.
    scopes: "https://www.googleapis.com/auth/drive.file"
};

// Export config for use in other modules
// Note: In a real module system we would use 'export', but for simple browser inclusion we'll stick to global or window scope 
// or simpler, just let this file run before the app initialization.
window.firebaseConfig = firebaseConfig;
window.googleConfig = googleConfig;
