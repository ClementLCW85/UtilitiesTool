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

    // Bind Unit Status Management
    bindUnitManagement();

    // Bind Threshold Override
    bindThresholdManagement();

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
const targets = ['payment-unit', 'history-unit-select', 'admin-unit-select'];
    
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
        const receipt = document.getElementById('payment-receipt').value;

        try {
            const batch = window.db.batch();
            
            // 1. Create Payment Record
            const paymentRef = window.db.collection('payments').doc();
            const payment = new window.Models.Payment(unitNum, amount, date, ref, receipt);
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

function bindPaymentHistoryEvents() {
    const select = document.getElementById('history-unit-select');
    if (!select) return;

    select.addEventListener('change', async (e) => {
        const unitId = e.target.value;
        const tbody = document.querySelector('#payment-history-table tbody');
        tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
        
        if (!unitId) {
            tbody.innerHTML = '<tr><td colspan="4">Select a unit to view history.</td></tr>';
            return;
        }

        try {
            const snapshot = await window.db.collection('payments')
                .where('unitNumber', '==', unitId)
                .orderBy('date', 'desc') // Requires Index probably, if fails try without orderBy or create index
                .get();

            tbody.innerHTML = '';
            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="4">No payments found for this unit.</td></tr>';
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
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error("Payment history error. Might need composite index.", error);
            tbody.innerHTML = '<tr><td colspan="4">Error loading history (Check Console).</td></tr>';
        }
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

