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
// NOTE: 'client_secret' is NOT needed for this client-side implicit flow and should NOT be exposed here.
const googleConfig = {
    clientId: "***REMOVED***", 
    // Scope for Drive API: 'https://www.googleapis.com/auth/drive.file' allows access only to files created by this app.
    scopes: "https://www.googleapis.com/auth/drive.file",
    // Google Apps Script Proxy URL for Public No-Auth Uploads and Email Service
    // Follow DEPLOY_INSTRUCTIONS.md to get this URL
    scriptUrl: "https://script.google.com/macros/s/AKfycbwK7eIwVQfba-d2kXJVXPFc0JA9T-yu2w4qj_c46QSFrYE1HijxYAhg__vvNAMVuf97lg/exec",
    // Optional: ID of the folder where receipts should be stored
    // If empty, files will be saved in root
    folderId: "***REMOVED***"
};




// Export config for use in other modules
// Note: In a real module system we would use 'export', but for simple browser inclusion we'll stick to global or window scope 
// or simpler, just let this file run before the app initialization.
window.firebaseConfig = firebaseConfig;
window.googleConfig = googleConfig;
