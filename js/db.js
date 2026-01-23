// Initialize Firebase Connection
(function() {
    if (!window.firebase || !window.firebaseConfig) {
        console.error("Firebase SDK not loaded or Config missing.");
        return;
    }

    // Initialize Firebase
    const app = firebase.initializeApp(window.firebaseConfig);
    const db = firebase.firestore();
    // Enable offline persistence if possible
    db.enablePersistence()
        .catch((err) => {
            if (err.code == 'failed-precondition') {
                 // Multiple tabs open, persistence can only be enabled in one tab at a a time.
                 console.warn("Firebase persistence failed: Multiple tabs open");
            } else if (err.code == 'unimplemented') {
                 // The current browser does not support all of the features required to enable persistence
                 console.warn("Firebase persistence failed: Browser not supported");
            }
        });

    // Validating Config
    const isMock = window.firebaseConfig.projectId === "YOUR_PROJECT_ID";
    
    if (isMock) {
        console.log("⚠️ Application is running with MOCK CONFIG. Database operations will fail unless a valid config is provided in js/config.js");
    } else {
        console.log("✅ Firebase Initialized with Project ID:", window.firebaseConfig.projectId);
    }

    // Expose DB globally
    window.db = db;
})();
