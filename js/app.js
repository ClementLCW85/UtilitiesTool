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

    // Bind Public Payment Form Logic
    bindPublicPaymentForm();
    
    // Populate UnitsDropdown
    populateUnitDropdown();

    // Bind Bill History Table Events
    bindBillHistoryEvents();

    // Bind Payment History Logic
    bindPaymentHistoryEvents();

    // Bind Unit Status Management
    bindUnitManagement();

    // Bind Threshold Override
    bindThresholdManagement();

    // Bind Data Export
    bindDataExport();

    // Bind Archive Management
    bindArchiveEvents();

    // Bind Collection Rounds Management
    bindCollectionRoundManagement();

    // Listen for Auth to fetch data
    if (window.firebase) {
        window.firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                fetchBills();
                fetchCollectionRounds();
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
const targets = ['payment-unit', 'history-unit-select', 'admin-unit-select', 'public-payment-unit'];
    
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
        
        // Handle Threshold Override
        if (stats.isOverrideEnabled && stats.overrideTarget !== undefined) {
             dashboardTarget = stats.overrideTarget;
             // UI hint could be added here that target is overridden
        } else {
             dashboardTarget = stats.unitTarget || 0;
        }

        // Update Stats DOM
        document.getElementById('stat-total-bills').innerText = formatCurrency(stats.totalBillsAmount);
        
        // Display "Manual" label if overridden
        const targetEl = document.getElementById('stat-unit-target');
        targetEl.innerText = formatCurrency(dashboardTarget);
        if (stats.isOverrideEnabled) {
            targetEl.innerText += " (M)";
            targetEl.title = "Manual Override Active";
        }

        document.getElementById('stat-total-collected').innerText = formatCurrency(totalCollected);

        // Break-even definition: TotalCollected vs TotalBills
        // (Note: Some might argue break-even is vs Target * 44, but semantically TotalBills is the 'Cost')
        const diff = totalCollected - stats.totalBillsAmount;
        const statusEl = document.getElementById('stat-status');
        statusEl.innerText = (diff >= 0 ? "+" : "") + formatCurrency(diff);
        statusEl.style.color = diff >= 0 ? "var(--success-color)" : "var(--error-color)";

        // Render Chart
        renderChart(dashboardUnits, dashboardTarget);

    } catch (error) {
        console.error("Dashboard Load Error:", error);
        const msg = document.getElementById('chart-loading-msg');
        if(msg) msg.innerText = "Error loading data.";
    }
}

function formatCurrency(num) {
    return 'RM ' + (num || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Chart.js Logic
function renderChart(units, target) {
    const ctx = document.getElementById('unit-bar-chart');
    if (!ctx) return;

    // Sort units
    units.sort((a, b) => a.unitNumber.localeCompare(b.unitNumber));

    const labels = units.map(u => u.unitNumber);
    const data = units.map(u => u.totalContributed);
    const backgroundColors = units.map(u => u.isHighlighted ? 'rgba(255, 159, 64, 0.7)' : 'rgba(54, 162, 235, 0.7)');
    const borderColors = units.map(u => u.isHighlighted ? 'rgba(255, 159, 64, 1)' : 'rgba(54, 162, 235, 1)');
    const tickColors = units.map(u => u.isHighlighted ? 'orange' : '#666');

    // Target Line Data (same value for all points)
    const targetData = new Array(units.length).fill(target);

    // Dynamic Width Adjustment for Visualization
    // Always fit to container (remove scroll requirement)
    ctx.style.minWidth = '0'; 
    ctx.style.width = '100%'; 

    if (unitChartInstance) {
        unitChartInstance.destroy();
    }

    unitChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    type: 'line',
                    label: 'Target (' + formatCurrency(target) + ')',
                    data: targetData,
                    borderColor: 'red',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    order: 0
                },
                {
                    type: 'bar',
                    label: 'Contributed',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Important for scroll
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            if (context.dataset.type === 'bar') {
                                const unit = units[context.dataIndex];
                                if (unit.isHighlighted && unit.publicNote) {
                                    return `Note: ${unit.publicNote}`;
                                }
                            }
                            return null;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: tickColors,
                        autoSkip: false, // Ensure all 44 labels show if possible, might need adjustment if too crowded
                        maxRotation: 90,
                        minRotation: 90 // Vertical labels to fit 44
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

     const loadingMsg = document.getElementById('chart-loading-msg');
     if(loadingMsg) loadingMsg.style.display = 'none';
}

function bindChartEvents() {
    // Filter buttons
    const buttons = document.querySelectorAll('.floor-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
             // Remove active class
             buttons.forEach(b => b.classList.remove('active'));
             e.target.classList.add('active');
             
             const floor = e.target.getAttribute('data-floor');
             filterChart(floor);
        });
    });
}

function filterChart(floor) {
    if (!dashboardUnits.length) return;
    
    let filtered = dashboardUnits;
    if (floor !== 'all') {
        filtered = dashboardUnits.filter(u => {
            // E-1xx, E-2xx. 3rd char is floor.
            // E-101 -> index 2 is '1'
            return u.unitNumber.charAt(2) === floor;
        });
    }
    renderChart(filtered, dashboardTarget);
}

// Bill Management
function bindBillForm() {
    const form = document.getElementById('bill-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('bill-form-status');
        status.textContent = "Saving...";
        status.style.color = "blue";

        const month = document.getElementById('bill-month').value;
        const year = document.getElementById('bill-year').value;
        const amount = document.getElementById('bill-amount').value;
        const date = document.getElementById('bill-date').value;

        try {
            const bill = new window.Models.Bill(month, year, amount, date);
            await window.db.collection('bills').doc(bill.id).set(bill.toFirestore());
            
            // Recalculate Global Stats
            await calculateGlobalBreakEven();

            status.textContent = "Bill Saved!";
            status.style.color = "green";
            form.reset();
            fetchBills(); // Refresh list
        } catch (error) {
            console.error(error);
            status.textContent = "Error saving bill.";
            status.style.color = "red";
        }
    });
}

async function fetchBills() {
    const tbody = document.querySelector('#bill-history-table tbody');
    if (!tbody) return;

    try {
        const snapshot = await window.db.collection('bills').orderBy('createdAt', 'desc').get();
        tbody.innerHTML = '';
        
        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="5">No bills recorded.</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const bill = doc.data();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${bill.month}</td>
                <td>${bill.year}</td>
                <td>${formatCurrency(bill.amount)}</td>
                <td>${bill.issueDate}</td>
                <td>
                    <button type="button" class="delete-bill-btn" data-id="${doc.id}">Delete</button>
                    <!-- Edit not fully implemented in this snippet -->
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error("Fetch bills error", e);
    }
}

function bindBillHistoryEvents() {
    const table = document.getElementById('bill-history-table');
    table.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-bill-btn')) {
            if(!confirm("Are you sure? This will affect global stats.")) return;
            
            const id = e.target.getAttribute('data-id');
            try {
                await window.db.collection('bills').doc(id).delete();
                await calculateGlobalBreakEven();
                fetchBills();
            } catch(err) {
                alert("Error deleting bill");
            }
        }
    });
}

async function calculateGlobalBreakEven() {
    // Sum all bills
    const snapshot = await window.db.collection('bills').get();
    let total = 0;
    snapshot.forEach(doc => total += (doc.data().amount || 0));

    const unitTarget = total / 44;

    // Use merge to preserve 'isOverrideEnabled' and 'overrideTarget'
    await window.db.collection('system').doc('stats').set({
        totalBillsAmount: total,
        unitTarget: unitTarget,
        lastUpdated: new Date()
    }, { merge: true });
    console.log("Global Stats Updated:", total, unitTarget);
}

// Payment Management
function bindPaymentForm() {
    const form = document.getElementById('payment-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('payment-form-status');
        status.textContent = "Processing...";
        status.style.color = "blue";

        const unitNum = document.getElementById('payment-unit').value;
        const amount = parseFloat(document.getElementById('payment-amount').value);
        const date = document.getElementById('payment-date').value;
        const ref = document.getElementById('payment-ref').value;
        
        // Handle File Upload
        const fileInput = document.getElementById('payment-receipt-file');
        const file = fileInput.files[0];
        let receiptUrl = "";

        if (file) {
            status.textContent = "Uploading Receipt to Drive...";
            try {
                // Determine if DriveService is ready
                if (!window.DriveService) {
                     throw new Error("Drive Service not loaded.");
                }
                receiptUrl = await window.DriveService.uploadFile(file);
                console.log("Uploaded Receipt:", receiptUrl);
                status.textContent = "Saving Payment Record...";
            } catch (uploadError) {
                console.error("Drive Upload Error:", uploadError);
                status.textContent = "Upload Failed: " + (uploadError.message || uploadError);
                status.style.color = "red";
                return; // Stop processing
            }
        }

        try {
            const batch = window.db.batch();
            
            // 1. Create Payment Record
            const paymentRef = window.db.collection('payments').doc();
            const payment = new window.Models.Payment(unitNum, amount, date, ref, receiptUrl);
            batch.set(paymentRef, payment.toFirestore());

            // 2. Increment Unit Total
            const unitRef = window.db.collection('units').doc(unitNum);
            // We need current total to add safely, or use FieldValue.increment if available in compat
            // Using increment is safer
            const increment = window.firebase.firestore.FieldValue.increment(amount);
            batch.update(unitRef, { totalContributed: increment });

            await batch.commit();

            status.textContent = "Payment Recorded!";
            status.style.color = "green";
            form.reset();
            
            // Update Dashboard Data if needed or just notify
        } catch (error) {
            console.error(error);
            status.textContent = "Error recording payment.";
            status.style.color = "red";
        }
    });
}

// Public Payment Submission
function bindPublicPaymentForm() {
    const form = document.getElementById('public-payment-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('public-payment-status');
        status.textContent = "Processing... (Please wait for prompt)";
        status.style.color = "blue";

        const unitNum = document.getElementById('public-payment-unit').value;
        const amount = parseFloat(document.getElementById('public-payment-amount').value);
        const date = document.getElementById('public-payment-date').value;
        const ref = document.getElementById('public-payment-ref').value;
        
        // Handle File Upload - Required
        const fileInput = document.getElementById('public-payment-receipt');
        const file = fileInput.files[0];
        let receiptUrl = "";

        if (!file) {
            status.textContent = "Error: Receipt file is required.";
            status.style.color = "red";
            return;
        }

        status.textContent = "Uploading Receipt...";
        try {
            if (!window.DriveService) {
                 throw new Error("Drive Service not loaded.");
            }
            
            // PAY-5: Use Proxy Upload (No-Login)
            if (window.googleConfig.scriptUrl) {
                 status.textContent = "Uploading Receipt (Secure Proxy)...";
                 receiptUrl = await window.DriveService.uploadViaProxy(file);
            } else {
                 console.warn("GAS Script URL not found, falling back to Auth method.");
                 status.textContent = "Authenticating with Google & Uploading...";
                 receiptUrl = await window.DriveService.uploadFile(file);
            }

            console.log("Uploaded Receipt:", receiptUrl);
            status.textContent = "Receipt Uploaded. Saving Record...";
        } catch (uploadError) {
            console.error("Drive Upload Error:", uploadError);
            status.textContent = "Upload Failed: " + (uploadError.message || uploadError);
            status.style.color = "red";
            return; 
        }

        try {
            const batch = window.db.batch();
            
            // 1. Create Payment Record (Same Collection)
            const paymentRef = window.db.collection('payments').doc();
            const payment = new window.Models.Payment(unitNum, amount, date, ref, receiptUrl);
            batch.set(paymentRef, payment.toFirestore());

            // 2. Increment Unit Total
            const unitRef = window.db.collection('units').doc(unitNum);
            const increment = window.firebase.firestore.FieldValue.increment(amount);
            batch.update(unitRef, { totalContributed: increment });

            await batch.commit();

            status.textContent = "Payment Submitted Successfully! Thank you.";
            status.style.color = "green";
            form.reset();
        } catch (error) {
            console.error(error);
            status.textContent = "Error saving payment to database.";
            status.style.color = "red";
        }
    });
}

function bindPaymentHistoryEvents() {
    const select = document.getElementById('history-unit-select');
    if (!select) return;

    select.addEventListener('change', async (e) => {
        const unitId = e.target.value;
        const tbody = document.querySelector('#payment-history-table tbody');
        tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
        
        if (!unitId) {
            tbody.innerHTML = '<tr><td colspan="5">Select a unit to view history.</td></tr>';
            return;
        }

        try {
            const snapshot = await window.db.collection('payments')
                .where('unitNumber', '==', unitId)
                .orderBy('date', 'desc') 
                .get();

            tbody.innerHTML = '';
            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="5">No payments found for this unit.</td></tr>';
                return;
            }

            snapshot.forEach(doc => {
                const data = doc.data();
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${data.date}</td>
                    <td>${formatCurrency(data.amount)}</td>
                    <td>${data.reference || '-'}</td>
                    <td>${data.receiptUrl ? '<a href="' + data.receiptUrl + '" target="_blank">View</a>' : '-'}</td>
                    <td><button class="delete-payment-btn" data-id="${doc.id}" style="background-color:#dc3545; padding: 2px 8px; font-size: 0.8rem;">Delete</button></td>
                `;
                tbody.appendChild(tr);
            });
            
            // Bind delete buttons
            document.querySelectorAll('.delete-payment-btn').forEach(btn => {
                btn.addEventListener('click', (ev) => {
                    const id = ev.target.getAttribute('data-id');
                    archivePayment(id, unitId);
                });
            });

        } catch (error) {
            console.error("Payment history error.", error);
            tbody.innerHTML = '<tr><td colspan="5">Error loading history.</td></tr>';
        }
    });
}

function archivePayment(paymentId, unitId) {
    if(!confirm("Are you sure you want to DELETE this payment? It will be moved to the archive and deducted from the unit sum.")) return;

    const paymentRef = window.db.collection('payments').doc(paymentId);
    const archiveRef = window.db.collection('archived_payments').doc(paymentId); // Keep ID
    const unitRef = window.db.collection('units').doc(unitId);

    window.db.runTransaction(async (transaction) => {
        const paymentDoc = await transaction.get(paymentRef);
        if (!paymentDoc.exists) throw "Payment does not exist!";
        
        const paymentData = paymentDoc.data();
        const amount = paymentData.amount; // Ensure number

        // 1. Create Archive Record using Model
        const archivedData = new window.Models.ArchivedPayment({...paymentData, id: paymentId}).toFirestore();
        transaction.set(archiveRef, archivedData);

        // 2. Decrement Unit Total
        const decrement = window.firebase.firestore.FieldValue.increment(-amount);
        transaction.update(unitRef, { totalContributed: decrement });

        // 3. Delete Original
        transaction.delete(paymentRef);
    }).then(() => {
        alert("Payment Archived.");
        // Refresh Table
        const select = document.getElementById('history-unit-select');
        select.dispatchEvent(new Event('change')); 
    }).catch((error) => {
        console.error("Archive failed: ", error);
        alert("Failed to archive payment.");
    });
}

// ADM-1 Unit Status Management
function bindUnitManagement() {
    console.log("Binding Unit Management...");
    const select = document.getElementById('admin-unit-select');
    const form = document.getElementById('unit-status-form');
    const check = document.getElementById('unit-highlight-check');
    const note = document.getElementById('unit-note-input');
    const status = document.getElementById('unit-status-form-status');

    if (!select || !form) return;

    // Load data when unit selected
    select.addEventListener('change', async () => {
        const unitId = select.value;
        if (!unitId) {
            check.checked = false;
            note.value = '';
            return;
        }
        
        try {
            const doc = await window.db.collection('units').doc(unitId).get();
            if (doc.exists) {
                const data = doc.data();
                check.checked = !!data.isHighlighted;
                note.value = data.publicNote || '';
            }
        } catch (e) {
            console.error(e);
        }
    });

    // Handle Update
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const unitId = select.value;
        if (!unitId) {
            alert("Select a unit first.");
            return;
        }

        status.textContent = "Updating...";
        status.style.color = "blue";

        try {
            await window.db.collection('units').doc(unitId).update({
                isHighlighted: check.checked,
                publicNote: note.value.trim()
            });

            status.textContent = "Unit Updated Successfully!";
            status.style.color = "green";
            
            // Refresh Dashboard data implicitly when user goes back
            // Or force reload
            loadDashboardData(); 
        } catch (err) {
            console.error(err);
            status.textContent = "Update failed.";
            status.style.color = "red";
        }
    });
}

// ADM-2 Manual Threshold Override
function bindThresholdManagement() {
    console.log("Binding Threshold Management...");
    const form = document.getElementById('threshold-form');
    const check = document.getElementById('threshold-override-check');
    const amount = document.getElementById('threshold-amount');
    const status = document.getElementById('threshold-form-status');

    if (!form) return;

    // Fetch current settings on load (or when section becomes visible, but we do it once here)
    // We can reuse the loadDashboardData fetch if we stored it globally, but fetching fresh is safer for Admin
    // Since this is Admin specific, we'll fetch once logic binds.
    window.db.collection('system').doc('stats').get().then(doc => {
        if(doc.exists) {
            const data = doc.data();
            if (data.isOverrideEnabled) {
                check.checked = true;
                amount.disabled = false;
                amount.value = data.overrideTarget || '';
            } else {
                check.checked = false;
                amount.disabled = true;
                // Suggest current auto target
                amount.placeholder = (data.unitTarget || 0).toFixed(2);
            }
        }
    });

    // Toggle Input
    check.addEventListener('change', () => {
        amount.disabled = !check.checked;
        if (check.checked && !amount.value) {
            // If enabling, maybe prefill with placeholder
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        status.textContent = "Saving Settings...";
        status.style.color = "blue";

        const isEnabled = check.checked;
        const val = parseFloat(amount.value);

        if (isEnabled && (isNaN(val) || val < 0)) {
            status.textContent = "Invalid Amount.";
            status.style.color = "red";
            return;
        }

        try {
            await window.db.collection('system').doc('stats').set({
                isOverrideEnabled: isEnabled,
                overrideTarget: isEnabled ? val : 0 // Save 0 or persist old, doesn't matter if disabled
            }, { merge: true });

            status.textContent = "Settings Saved!";
            status.style.color = "green";
            loadDashboardData(); // Refresh UI immediately
        } catch(err) {
            console.error(err);
            status.textContent = "Error saving settings.";
            status.style.color = "red";
        }
    });
}

// ADM-3 Data Export
function bindDataExport() {
    const btn = document.getElementById('export-data-btn');
    const status = document.getElementById('export-status');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        status.textContent = "Generating Export...";
        status.style.color = "blue";
        btn.disabled = true;

        try {
            // Fetch Bills
            const billsSnap = await window.db.collection('bills').get();
            const bills = [];
            billsSnap.forEach(doc => bills.push(doc.data()));

            // Fetch Payments
            const paymentsSnap = await window.db.collection('payments').get();
            const payments = [];
            paymentsSnap.forEach(doc => payments.push(doc.data()));

            // Fetch Units (to backup notes/highlight status)
            const unitsSnap = await window.db.collection('units').get();
            const units = [];
            unitsSnap.forEach(doc => units.push(doc.data()));

            // Fetch System Stats (manual override settings)
            const statsSnap = await window.db.collection('system').doc('stats').get();
            const stats = statsSnap.exists ? statsSnap.data() : {};

            const exportData = {
                exportedAt: new Date().toISOString(),
                stats: stats,
                units: units,
                bills: bills,
                payments: payments
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `seapark_backup_${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            status.textContent = "Export Complete!";
            status.style.color = "green";
        } catch (err) {
            console.error(err);
            status.textContent = "Export Failed.";
            status.style.color = "red";
        } finally {
            btn.disabled = false;
        }
    });
}

// PAY-6 Archive Management
function bindArchiveEvents() {
    const toggleBtn = document.getElementById('toggle-archive-btn');
    const section = document.getElementById('archived-payments-section');
    
    if (!toggleBtn || !section) return;

    toggleBtn.addEventListener('click', () => {
        if (section.style.display === 'none') {
            section.style.display = 'block';
            toggleBtn.textContent = 'Hide Archived Payments';
            loadArchivedPayments(); // Load data when opening
        } else {
            section.style.display = 'none';
            toggleBtn.textContent = 'View Archived Payments';
        }
    });
}

function loadArchivedPayments() {
    const tbody = document.querySelector('#archived-history-table tbody');
    tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';

    window.db.collection('archived_payments')
        .orderBy('archivedAt', 'desc')
        .limit(50) // Limit display
        .get()
        .then(snapshot => {
             tbody.innerHTML = '';
             if(snapshot.empty) {
                 tbody.innerHTML = '<tr><td colspan="5">No archived payments found.</td></tr>';
                 return;
             }

             snapshot.forEach(doc => {
                 const data = doc.data();
                 const archivedDate = data.archivedAt && data.archivedAt.toDate ? 
                                    data.archivedAt.toDate().toLocaleDateString() : 
                                    'Unknown';

                 const tr = document.createElement('tr');
                 tr.innerHTML = `
                    <td>${data.unitNumber}</td>
                    <td>${data.date}</td>
                    <td>${formatCurrency(data.amount)}</td>
                    <td>${archivedDate}</td>
                    <td><button class="delete-permanent-btn" data-id="${doc.id}" style="background-color:#dc3545; padding: 2px 8px; font-size: 0.8rem;">Permanently Delete</button></td>
                 `;
                 tbody.appendChild(tr);
             });

             // Bind permanent delete
             document.querySelectorAll('.delete-permanent-btn').forEach(btn => {
                btn.addEventListener('click', (ev) => {
                    const id = ev.target.getAttribute('data-id');
                    deleteArchivedPayment(id);
                });
            });
        })
        .catch(err => {
            console.error("Error loading archive:", err);
            tbody.innerHTML = '<tr><td colspan="5">Error loading archive.</td></tr>';
        });
}

function deleteArchivedPayment(docId) {
    if(!confirm("WARNING: This will PERMANENTLY DELETE this record from the archive. This action cannot be undone. Are you sure?")) return;

    window.db.collection('archived_payments').doc(docId).delete()
        .then(() => {
            alert("Record permanently deleted.");
            loadArchivedPayments(); // Refresh
        })
        .catch(err => {
            console.error(err);
            alert("Failed to delete record.");
        });
}

// --- Collection Rounds Management ---

let editingRoundId = null;

function bindCollectionRoundManagement() {
    initRoundUnitSelector();
    bindRoundForm();
}

function initRoundUnitSelector() {
    const list = document.getElementById('round-unit-list');
    if (!list) return;

    list.innerHTML = "";
    for (let i = 0; i < 44; i++) {
        const unitId = window.Models.SchemaService.formatUnitId(i);
        // Create Checkbox Wrapper
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.fontSize = '12px';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = unitId;
        input.id = `chk-${unitId}`;
        input.className = 'round-unit-chk';
        input.style.width = 'auto';
        input.style.marginRight = '4px';
        input.checked = true; // Default Select All

        const label = document.createElement('label');
        label.htmlFor = `chk-${unitId}`;
        label.textContent = unitId;
        label.style.margin = '0';
        label.style.cursor = 'pointer';

        div.appendChild(input);
        div.appendChild(label);
        list.appendChild(div);
    }

    // Bind "Select All"
    const allChk = document.getElementById('round-all-units');
    if (allChk) {
        allChk.checked = true;
        allChk.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.round-unit-chk');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
        });
    }
}

function bindRoundForm() {
    const form = document.getElementById('collection-round-form');
    if (!form) return;

    // Reset / Cancel Button
    const cancelBtn = document.getElementById('round-cancel-btn');
    cancelBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('round-id').value = "";
        document.getElementById('round-submit-btn').textContent = "Save Collection Round";
        cancelBtn.style.display = "none";
        editingRoundId = null;
        // Reset Selector
        document.getElementById('round-all-units').checked = true;
        document.querySelectorAll('.round-unit-chk').forEach(cb => cb.checked = true);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('round-form-status');
        status.textContent = "Saving...";
        status.style.color = "blue";

        const title = document.getElementById('round-title').value;
        const amount = document.getElementById('round-amount').value;
        const date = document.getElementById('round-start-date').value;
        const remarks = document.getElementById('round-remarks').value;
        
        // Get Participating Units
        const participating = [];
        document.querySelectorAll('.round-unit-chk:checked').forEach(cb => {
            participating.push(cb.value);
        });

        if (participating.length === 0) {
            status.textContent = "Error: At least one unit must participate.";
            status.style.color = "red";
            return;
        }

        try {
            const round = new window.Models.CollectionRound(title, amount, date, participating, remarks);
            
            // If editing, preserve ID and CreatedAt
            if (editingRoundId) {
                // Use set/update
                await window.db.collection('collection_rounds').doc(editingRoundId).set(round.toFirestore());
            } else {
                // Create New
                await window.db.collection('collection_rounds').add(round.toFirestore());
            }

            status.textContent = "Round Saved Successfully!";
            status.style.color = "green";
            
            // Reset Form (Trigger Cancel logic to clean up UI)
            cancelBtn.click();
            
            fetchCollectionRounds();

        } catch (error) {
            console.error("Error saving round:", error);
            status.textContent = "Error saving round: " + error.message;
            status.style.color = "red";
        }
    });
}

function fetchCollectionRounds() {
    window.db.collection('collection_rounds').orderBy('startDate', 'desc').get()
        .then((snapshot) => {
            const tbody = document.querySelector('#collection-rounds-table tbody');
            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="5">No collection rounds found.</td></tr>';
                return;
            }

            tbody.innerHTML = '';
            snapshot.forEach((doc) => {
                const round = window.Models.CollectionRound.fromFirestore(doc);
                const tr = document.createElement('tr');
                
                const unitCount = round.participatingUnitIds.length;
                const unitText = unitCount === 44 ? "All (44)" : `${unitCount} Units`;

                tr.innerHTML = `
                    <td>${round.title}</td>
                    <td>RM ${round.targetAmount.toFixed(2)}</td>
                    <td>${round.startDate}</td>
                    <td title="${round.participatingUnitIds.join(', ')}">${unitText}</td>
                    <td>
                        <button class="edit-round-btn small-btn" data-id="${doc.id}">Edit</button>
                        <button class="delete-round-btn small-btn danger" data-id="${doc.id}">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Bind Row Actions
            document.querySelectorAll('.edit-round-btn').forEach(btn => {
                btn.addEventListener('click', (e) => openRoundEdit(e.target.dataset.id));
            });
            document.querySelectorAll('.delete-round-btn').forEach(btn => {
                btn.addEventListener('click', (e) => deleteRound(e.target.dataset.id));
            });

        })
        .catch((error) => {
            console.error("Error fetching rounds:", error);
            const tbody = document.querySelector('#collection-rounds-table tbody');
            tbody.innerHTML = '<tr><td colspan="5">Error loading rounds.</td></tr>';
        });
}

async function deleteRound(id) {
    if (!confirm("Are you sure you want to delete this Collection Round?")) return;
    try {
        await window.db.collection('collection_rounds').doc(id).delete();
        fetchCollectionRounds();
    } catch (e) {
        alert("Error deleting round: " + e.message);
    }
}

async function openRoundEdit(id) {
    try {
        const doc = await window.db.collection('collection_rounds').doc(id).get();
        if (!doc.exists) return;

        const round = window.Models.CollectionRound.fromFirestore(doc);
        
        document.getElementById('round-id').value = round.id;
        document.getElementById('round-title').value = round.title;
        document.getElementById('round-amount').value = round.targetAmount;
        document.getElementById('round-start-date').value = round.startDate;
        document.getElementById('round-remarks').value = round.remarks;
        
        // Update Units
        const allChk = document.getElementById('round-all-units');
        allChk.checked = false; // Reset first
        
        const checkboxes = document.querySelectorAll('.round-unit-chk');
        let allChecked = true;
        checkboxes.forEach(cb => {
            if (round.participatingUnitIds.includes(cb.value)) {
                cb.checked = true;
            } else {
                cb.checked = false;
                allChecked = false;
            }
        });
        if (allChecked) allChk.checked = true;

        editingRoundId = round.id;
        document.getElementById('round-submit-btn').textContent = "Update Collection Round";
        document.getElementById('round-cancel-btn').style.display = "inline-block";
        
        // Scroll to form
        document.getElementById('collection-rounds-section').scrollIntoView();

    } catch (e) {
        console.error("Edit error:", e);
        alert("Could not load round details.");
    }
}
