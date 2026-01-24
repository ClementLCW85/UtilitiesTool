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
    clientId: "***REMOVED***-eui3ncg12rg8mi7o89hjuicgi04n89r9.apps.googleusercontent.com", 
    // Scope for Drive API: 'https://www.googleapis.com/auth/drive.file' allows access only to files created by this app.
    scopes: "https://www.googleapis.com/auth/drive.file"
};



// Export config for use in other modules
// Note: In a real module system we would use 'export', but for simple browser inclusion we'll stick to global or window scope 
// or simpler, just let this file run before the app initialization.
window.firebaseConfig = firebaseConfig;
window.googleConfig = googleConfig;
