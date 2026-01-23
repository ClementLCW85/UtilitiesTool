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

    // Check for Unit initialization (One-time check for development/first run)
    // In production, this might be triggered manually by Admin
    if (window.Models && window.Models.SchemaService) {
        // Auto-check on load (Safe because it checks if valid non-empty collection exists first)
        window.Models.SchemaService.initUnits().catch(err => console.error("Init Error:", err));
    }

    // Navigation Logic
    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);

    // Bind Bill Form Logic
    bindBillForm();
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

function bindBillForm() {
    const billForm = document.getElementById('bill-form');
    if (!billForm) return;

    billForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const statusSpan = document.getElementById('bill-form-status');
        statusSpan.textContent = "Saving...";
        statusSpan.style.color = "blue";

        // Get values
        const month = document.getElementById('bill-month').value;
        const year = document.getElementById('bill-year').value;
        const amount = document.getElementById('bill-amount').value;
        const issueDate = document.getElementById('bill-date').value;

        try {
            // Validation
            if (!month || !year || !amount || !issueDate) {
                throw new Error("All fields are required.");
            }

            // Create Bill Object
            const bill = new window.Models.Bill(month, year, amount, issueDate);
            
            // Save to Firestore
            // Use set with merge:true or just set() since ID is deterministic (yyyy-mm)
            await window.db.collection('bills').doc(bill.id).set(bill.toFirestore());

            // Success
            statusSpan.textContent = `Bill for ${month}/${year} recorded successfully!`;
            statusSpan.style.color = "green";
            billForm.reset();
            
            // Trigger auto-calculate break-even (BILL-3 future implementation hook)
            console.log("Bill Saved. Triggering global calculation...");

        } catch (error) {
            console.error("Error saving bill:", error);
            statusSpan.textContent = "Error: " + error.message;
            statusSpan.style.color = "red";
        }
    });
}
