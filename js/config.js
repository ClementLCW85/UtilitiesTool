// Firebase Configuration
// TODO: Replace with your actual Firebase project configuration
// You can get this from the Firebase Console > Project Settings > General > Your Apps > SDK Setup and Configuration

const firebaseConfig = {
    apiKey: "AIzaSyCI4SXFX9b8KMcoJPF6mwdvQfWL_Kbjn9w",
    authDomain: "seaparkapartmentblocke.firebaseapp.com",
    projectId: "seaparkapartmentblocke",
    storageBucket: "seaparkapartmentblocke.firebasestorage.app",
    messagingSenderId: "182471854682",
    appId: "1:182471854682:web:80880b743920d210d3a663",
    measurementId: "G-G78Z21PH3M"
};



// Google Drive API Configuration (OAuth 2.0)
// NOTE: 'client_secret' is NOT needed for this client-side implicit flow and should NOT be exposed here.
const googleConfig = {
    clientId: "182471854682-im86f1tue1ifo7brqujhtec7b2r7fgps.apps.googleusercontent.com", 
    // Scope for Drive API: 'https://www.googleapis.com/auth/drive.file' allows access only to files created by this app.
    scopes: "https://www.googleapis.com/auth/drive.file",
    // Google Apps Script Proxy URL for Public No-Auth Uploads
    // Follow DEPLOY_INSTRUCTIONS.md to get this URL
    scriptUrl: "https://script.google.com/macros/s/AKfycbzBOitKYDRq-v4JQc9-myXsvFop7FC-Mt3IqZU0EUaEu-s5laahV27tq4U51UK8DSWNNA/exec",
    // Optional: ID of the folder where receipts should be stored
    // If empty, files will be saved in root
    folderId: "1VY6uns6MEDtAJoWQ7kUgZf7xa44b1M6n"
};




// Export config for use in other modules
// Note: In a real module system we would use 'export', but for simple browser inclusion we'll stick to global or window scope 
// or simpler, just let this file run before the app initialization.
window.firebaseConfig = firebaseConfig;
window.googleConfig = googleConfig;
