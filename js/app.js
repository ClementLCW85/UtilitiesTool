document.addEventListener('DOMContentLoaded', () => {
    console.log('Seapark Utility Tracker App Initialized');
    console.log('App Version: 1.1 - BILL-3 Calc Enabled'); // Version check

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

    // Initial Dashboard Load
    if (!window.location.hash || window.location.hash === '#dashboard') {
        loadDashboardData();
    }
    
    // Bind Chart Controls
    bindChartEvents();

    // Bind Bill Form Logic
    bindBillForm();

    // Bind Payment Form Logic
    bindPaymentForm();
    
    // Populate UnitsDropdown
    populateUnitDropdown();

    // Bind Bill History Table Events
    bindBillHistoryEvents();

    // Bind Payment History Logic
    bindPaymentHistoryEvents();

    // Listen for Auth to fetch data
    if (window.firebase) {
        window.firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                fetchBills();
            } else {
                // Clear table on logout
                const tbody = document.querySelector('#bill-history-table tbody');
                if (tbody) tbody.innerHTML = '';
            }
        });
    }
});

// Global variable to track editing state
let editingBillId = null;
let unitChartInstance = null; // Track Chart.js instance
let dashboardUnits = []; // Store fetched units
let dashboardTarget = 0; // Store target value

function populateUnitDropdown() {
    const targets = ['payment-unit', 'history-unit-select'];
    
    targets.forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;

        // Clear existing options except first
        select.innerHTML = '<option value="">--Select Unit--</option>';
        
        for (let i = 0; i < 44; i++) {
             const unitId = window.Models.SchemaService.formatUnitId(i);
             const option = document.createElement('option');
             option.value = unitId;
             option.textContent = unitId;
             select.appendChild(option);
        }
    });
}

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
    
    // Refresh Dashboard Data if active
    if (hash === '#dashboard') {
        loadDashboardData();
    }
}

async function loadDashboardData() {
    console.log("Loading Dashboard Data...");
    try {
        // 1. Fetch Global Stats (Total Bills)
        const statsDoc = await window.db.collection('system').doc('stats').get();
        const stats = statsDoc.exists ? statsDoc.data() : { totalBillsAmount: 0, unitTarget: 0 };
        
        // 2. Fetch All Units (Total Collected)
        const unitsSnapshot = await window.db.collection('units').get();
        let totalCollected = 0;
        const unitsData = [];

        unitsSnapshot.forEach(doc => {
            const data = doc.data();
            totalCollected += (data.totalContributed || 0);
            unitsData.push(data);
        });
        
        // Store globally for filtering
        dashboardUnits = unitsData;
        dashboardTarget = stats.unitTarget;

        // 3. Render Stats
        updateDashboardStats(stats.totalBillsAmount, stats.unitTarget, totalCollected);

        // 4. Render Chart (Default: All)
        filterAndRenderChart('all');

    } catch (error) {
        console.error("Error loading dashboard data:", error);
    }
}

function updateDashboardStats(totalBills, unitTarget, totalCollected) {
    const totalBillsEl = document.getElementById('stat-total-bills');
    const unitTargetEl = document.getElementById('stat-unit-target');
    const totalCollectedEl = document.getElementById('stat-total-collected');
    const statusEl = document.getElementById('stat-status');

    if(totalBillsEl) totalBillsEl.textContent = `RM ${totalBills.toFixed(2)}`;
    if(unitTargetEl) unitTargetEl.textContent = `RM ${unitTarget.toFixed(2)}`;
    if(totalCollectedEl) totalCollectedEl.textContent = `RM ${totalCollected.toFixed(2)}`;

    const diff = totalCollected - totalBills;
    if(statusEl) {
        statusEl.textContent = `RM ${diff.toFixed(2)}`;
        statusEl.style.color = diff >= 0 ? 'green' : 'red';
    }
}

function renderUnitBarChart(units, targetValue = 0) {
console.log("Rendering Unit Bar Chart...", units ? units.length : 0, "units found.");
const ctx = document.getElementById('unit-bar-chart');
if(!ctx) {
    console.error("Canvas element #unit-bar-chart not found in DOM.");
    return;
}
    
// Sort units by ID (E-101 .. E-411)
units.sort((a, b) => a.unitNumber.localeCompare(b.unitNumber));

const labels = units.map(u => u.unitNumber);
const data = units.map(u => u.totalContributed);
const targetData = new Array(units.length).fill(targetValue);
    
// Destroy previous chart if exists to avoid "Canvas is already in use" error
if (unitChartInstance) {
    console.log("Destroying existing chart instance.");
    unitChartInstance.destroy();
}
    
try {
    unitChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Contributed (RM)',
                data: data,
                backgroundColor: '#0078d7',
                borderColor: '#005a9e',
                borderWidth: 1,
                order: 2
            },
            {
                type: 'line',
                label: 'Target Break-Even (RM)',
                data: targetData,
                borderColor: '#ff0000',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
                order: 1
            }]
        },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 90,
                            minRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount (RM)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
        console.log("Chart rendered successfully.");
    } catch (e) {
        console.error("Error creating Chart.js instance:", e);
    }

    const loadingMsg = document.getElementById('chart-loading-msg');
    if(loadingMsg) loadingMsg.style.display = 'none';
}

function bindBillForm() {
    const billForm = document.getElementById('bill-form');
    if (!billForm) return;

    billForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = billForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Processing...";

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
            
            // Check if we are updating an existing entry that changed its ID (month/year changed)
            if (editingBillId && editingBillId !== bill.id) {
                 // Delete the old record
                 await window.db.collection('bills').doc(editingBillId).delete();
            }

            // Save to Firestore
            // Use set with merge:true or just set() since ID is deterministic (yyyy-mm)
            await window.db.collection('bills').doc(bill.id).set(bill.toFirestore());

            // Success
            statusSpan.textContent = `Bill for ${month}/${year} recorded successfully!`;
            statusSpan.style.color = "green";
            billForm.reset();
            
            // Reset Edit State
            editingBillId = null;
            submitBtn.textContent = "Save Bill"; 
            
            // Refresh Bill List
            await fetchBills();

            // Trigger auto-calculate break-even (BILL-3 future implementation hook)
            console.log("Bill Saved. Triggering global calculation...");
            await calculateGlobalBreakEven();

        } catch (error) {
            console.error("Error saving bill:", error);
            
            let displayError = error.message;
            if (error.message.includes("Cloud Firestore API has not been used")) {
               displayError = "API Disabled context: Please enable Firestore Database in the Firebase Console for this project.";
               alert(displayError); // Alert is more visible for admin actions
            }

            statusSpan.textContent = "Error: " + displayError;
            statusSpan.style.color = "red";
            submitBtn.textContent = originalBtnText; 
            // Better to revert to "Save Bill" or "Update Bill" depending on state
            if(editingBillId) submitBtn.textContent = "Update Bill";
            else submitBtn.textContent = "Save Bill";
        } finally {
            submitBtn.disabled = false;
        }
    });
}

function bindPaymentForm() {
    const paymentForm = document.getElementById('payment-form');
    if (!paymentForm) return;

    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = paymentForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        const statusSpan = document.getElementById('payment-form-status');
        statusSpan.textContent = "Processing Payment...";
        statusSpan.style.color = "blue";

        const unitNumber = document.getElementById('payment-unit').value;
        const amount = parseFloat(document.getElementById('payment-amount').value);
        const date = document.getElementById('payment-date').value;
        const reference = document.getElementById('payment-ref').value;
        const receiptUrl = document.getElementById('payment-receipt').value;

        try {
            if (!unitNumber || !amount || !date) {
                throw new Error("Please fill in all required fields.");
            }

            // Create Payment Object
            const payment = new window.Models.Payment(unitNumber, amount, date, reference, receiptUrl);

            // Using Batch to ensure atomic update of Payment Record AND Unit Total
            const batch = window.db.batch();

            // 1. New Payment Document (Auto-ID)
            const paymentRef = window.db.collection('payments').doc();
            batch.set(paymentRef, payment.toFirestore());

            // 2. Update Unit Total Contributed
            const unitRef = window.db.collection('units').doc(unitNumber);
            // We need to use Firestore Increment for safety
            batch.update(unitRef, {
                totalContributed: firebase.firestore.FieldValue.increment(amount)
            });

            await batch.commit();

            statusSpan.textContent = `Payment of RM${amount.toFixed(2)} for ${unitNumber} recorded!`;
            statusSpan.style.color = "green";
            paymentForm.reset();

        } catch (error) {
            console.error("Error saving payment:", error);
            statusSpan.textContent = "Error: " + error.message;
            statusSpan.style.color = "red";
        } finally {
            submitBtn.disabled = false;
        }
    });
}

// Fetch and Display Bills
async function fetchBills() {
    try {
        const snapshot = await window.db.collection('bills')
            .orderBy('year', 'desc')
            .orderBy('month', 'desc')
            .get();
            
        const bills = [];
        snapshot.forEach(doc => {
            bills.push({ id: doc.id, ...doc.data() });
        });
        
        renderBillTable(bills);
    } catch (error) {
        console.error("Error fetching bills:", error);
        const tbody = document.querySelector('#bill-history-table tbody');
        
        let errorMsg = "Error loading bills.";
        if (error.message.includes("Cloud Firestore API has not been used") || error.code === 'permission-denied') {
            errorMsg = "API Error: Please enable Firestore in Firebase Console.";
        } else if (error.message.includes("requires an index") || error.code === 'failed-precondition') {
            errorMsg = "Index Missing: Open Developer Console (F12) and click the Firebase link to create the index.";
        }
        
        if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="color:red">${errorMsg}</td></tr>`;
    }
}

function renderBillTable(bills) {
    const tbody = document.querySelector('#bill-history-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (bills.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No bills recorded yet.</td></tr>';
        return;
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    bills.forEach(bill => {
        const tr = document.createElement('tr');
        const monthName = monthNames[parseInt(bill.month) - 1] || bill.month;
        
        tr.innerHTML = `
            <td>${monthName}</td>
            <td>${bill.year}</td>
            <td>${parseFloat(bill.amount).toFixed(2)}</td>
            <td>${bill.issueDate}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${bill.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${bill.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function bindBillHistoryEvents() {
    const table = document.getElementById('bill-history-table');
    if (!table) return;

    table.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            await handleDeleteBill(id);
        }
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            handleEditBill(id);
        }
    });
}

async function handleDeleteBill(id) {
    if (!confirm("Are you sure you want to delete this bill?")) return;
    
    try {
        await window.db.collection('bills').doc(id).delete();
        // Refresh list
        fetchBills();
        
        // Trigger auto-calculate break-even
        calculateGlobalBreakEven();

        // Show status
        const statusSpan = document.getElementById('bill-history-status');
        if(statusSpan) {
            statusSpan.textContent = "Bill deleted.";
            statusSpan.style.color = "green";
            setTimeout(() => statusSpan.textContent = "", 3000);
        }
    } catch (error) {
        console.error("Error deleting bill:", error);
        alert("Failed to delete bill: " + error.message);
    }
}

async function handleEditBill(id) {
     try {
        const doc = await window.db.collection('bills').doc(id).get();
        if (!doc.exists) {
            alert("Bill not found!");
            return;
        }
        const data = doc.data();
        
        // Populate inputs
        document.getElementById('bill-month').value = data.month;
        document.getElementById('bill-year').value = data.year;
        document.getElementById('bill-amount').value = data.amount;
        document.getElementById('bill-date').value = data.issueDate;
        
        // Scroll to form
        const form = document.getElementById('bill-form');
        form.scrollIntoView({ behavior: 'smooth' });
        
        // Set Global Edit State
        editingBillId = id;

        // Update Button Text
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = "Update Bill";

        const statusSpan = document.getElementById('bill-form-status');
        statusSpan.textContent = "Editing Bill " + id + ". Adjust details and Save.";
        statusSpan.style.color = "blue";
        
     } catch (error) {
         console.error("Error loading bill for edit:", error);
         alert("Error loading bill.");
     }
}

// BILL-3: Global Break-Even Calculation
async function calculateGlobalBreakEven() {
    console.log("Starting Global Break-Even Calculation...");
    try {
        const snapshot = await window.db.collection('bills').get();
        let totalAmount = 0;
        
        snapshot.forEach(doc => {
            const data = doc.data();
            totalAmount += (Number(data.amount) || 0);
        });

        const globalStats = {
            totalBillsAmount: totalAmount,
            unitTarget: totalAmount / 44, // 44 Units
            lastUpdated: new Date()
        };

        // Save to 'system/stats'
        await window.db.collection('system').doc('stats').set(globalStats);
        
        console.log("Global Break-Even Updated:", globalStats);
        return globalStats;
        
    } catch (error) {
        console.error("Error calculating global break-even:", error);
    }
}

function bindPaymentHistoryEvents() {
    const select = document.getElementById('history-unit-select');
    if (!select) return;

    select.addEventListener('change', (e) => {
        const unitId = e.target.value;
        if (unitId) {
            fetchPaymentHistory(unitId);
        } else {
            document.querySelector('#payment-history-table tbody').innerHTML = 
                '<tr><td colspan="4">Select a unit to view history.</td></tr>';
        }
    });
}

async function fetchPaymentHistory(unitId) {
    const tbody = document.querySelector('#payment-history-table tbody');
    tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

    try {
        // Query payments for the unit
        // Note: Ordering by date might require a composite index (unitNumber + date).
        // To keep it simple and avoid index creation blocks, we fetch by unit and sort client-side.
        const snapshot = await window.db.collection('payments')
            .where('unitNumber', '==', unitId)
            .get();

        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="4">No payments recorded for this unit.</td></tr>';
            return;
        }

        const payments = [];
        snapshot.forEach(doc => payments.push(doc.data()));
        
        // Sort descending by date
        payments.sort((a, b) => new Date(b.date) - new Date(a.date));

        tbody.innerHTML = '';
        payments.forEach(p => {
             const row = document.createElement('tr');
             const receiptLink = p.receiptUrl ? `<a href="${p.receiptUrl}" target="_blank">View</a>` : '-';
             
             row.innerHTML = `
                <td>${p.date}</td>
                <td>${p.amount.toFixed(2)}</td>
                <td>${p.reference || '-'}</td>
                <td>${receiptLink}</td>
             `;
             tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching payment history:", error);
        tbody.innerHTML = `<tr><td colspan="4" style="color:red">Error: ${error.message}</td></tr>`;
    }
}

function bindChartEvents() {
    const buttons = document.querySelectorAll('.floor-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');
            
            const floor = e.target.dataset.floor;
            filterAndRenderChart(floor);
        });
    });
}

function filterAndRenderChart(floor) {
    if (!dashboardUnits || dashboardUnits.length === 0) return;

    let filteredUnits = [];
    const canvas = document.getElementById('unit-bar-chart');

    if (floor === 'all') {
        filteredUnits = [...dashboardUnits];
        if (canvas) canvas.style.minWidth = '1200px';
    } else {
        // Filter by Unit Number pattern "E-{floor}.."
        const prefix = `E-${floor}`;
        filteredUnits = dashboardUnits.filter(u => u.unitNumber.startsWith(prefix));
        if (canvas) canvas.style.minWidth = '600px';
    }

    renderUnitBarChart(filteredUnits, dashboardTarget);
}
