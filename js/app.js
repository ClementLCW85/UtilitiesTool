document.addEventListener('DOMContentLoaded', () => {
    console.log('Seapark Utility Tracker App Initialized');

    // Simple test to check if DB is accessible (Client side check)
    if (window.db) {
        console.log("Database Object is available:", window.db);
    } else {
        console.warn("Database Object not found. check js/db.js loading.");
    }

    // Initialize Auth Module
    if (window.auth) {
        window.auth.init();
        console.log("Auth Module Initialized");
    } else {
        console.error("Auth Module (window.auth) not found. Check js/auth.js loading.");
    }

    // Navigation Logic
    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
});

function handleNavigation() {
    const hash = window.location.hash || '#dashboard';
    const sections = document.querySelectorAll('.view-section');
    
    sections.forEach(section => {
        section.style.display = 'none';
        if ('#' + section.id === hash) {
            section.style.display = 'block';
        }
    });

    console.log("Navigated to:", hash);
}
