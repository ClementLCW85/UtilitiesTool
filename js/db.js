// Initialize Firebase Connection
(function() {
    if (!window.firebase || !window.firebaseConfig) {
        console.error("Firebase SDK not loaded or Config missing.");
        return;
    }

    // Initialize Firebase
    const app = firebase.initializeApp(window.firebaseConfig);
    const db = firebase.firestore();

    // Enable persistence with modern FirestoreSettings.cache (resolves deprecation warning)
    try {
        // Check for modern cache setting factory functions (capitalized in some compat versions)
        const cacheFn = firebase.firestore.persistentLocalCache || firebase.firestore.PersistentLocalCache;
        const tabMgrFn = firebase.firestore.persistentSingleTabManager || firebase.firestore.PersistentSingleTabManager;

        if (cacheFn) {
            db.settings({
                cache: cacheFn({
                    tabManager: tabMgrFn ? tabMgrFn() : undefined
                })
            });
        } else {
            // Fallback for older versions or where cache settings are differently exposed
            db.enablePersistence().catch(err => {
                if (err.code !== 'failed-precondition' && err.code !== 'unimplemented') {
                    console.warn("Firebase persistence error:", err);
                }
            });
        }
    } catch (err) {
        console.warn("Firebase settings error:", err);
    }

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
