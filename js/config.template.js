// Firebase Configuration
// This file is generated from config.template.js during CI/CD.
// For local development, copy this file to js/config.js and fill in your values.
// IMPORTANT: Never commit js/config.js to version control.

const firebaseConfig = {
    apiKey: "__FIREBASE_API_KEY__",
    authDomain: "__FIREBASE_AUTH_DOMAIN__",
    projectId: "__FIREBASE_PROJECT_ID__",
    storageBucket: "__FIREBASE_STORAGE_BUCKET__",
    messagingSenderId: "__FIREBASE_MESSAGING_SENDER_ID__",
    appId: "__FIREBASE_APP_ID__",
    measurementId: "__FIREBASE_MEASUREMENT_ID__"
};

// Google Drive API Configuration (OAuth 2.0)
// NOTE: 'client_secret' is NOT needed for this client-side implicit flow and should NOT be exposed here.
const googleConfig = {
    clientId: "__GOOGLE_CLIENT_ID__",
    // Scope for Drive API: 'https://www.googleapis.com/auth/drive.file' allows access only to files created by this app.
    scopes: "https://www.googleapis.com/auth/drive.file",
    // Google Apps Script Proxy URL for Public No-Auth Uploads and Email Service
    scriptUrl: "__GOOGLE_SCRIPT_URL__",
    // Optional: ID of the folder where receipts should be stored
    // If empty, files will be saved in root
    folderId: "__GOOGLE_FOLDER_ID__",
    // Admin email for the single admin account
    adminEmail: "__ADMIN_EMAIL__"
};

// Export config for use in other modules
window.firebaseConfig = firebaseConfig;
window.googleConfig = googleConfig;
