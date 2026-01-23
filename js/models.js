// Data Models and Schema Definitions

/**
 * Unit Model
 * Represents one of the 44 apartment units.
 */
class Unit {
    constructor(unitNumber, ownerName = "", totalContributed = 0) {
        this.unitNumber = unitNumber; // ID: "E-01", "E-02", etc.
        this.ownerName = ownerName;
        this.totalContributed = totalContributed;
        this.isHighlighted = false; // For special status (e.g., hardship)
        this.publicNote = ""; // Publicly visible note for highlighted units
    }

    // Convert to regular object for Firestore
    toFirestore() {
        return {
            unitNumber: this.unitNumber,
            ownerName: this.ownerName,
            totalContributed: Number(this.totalContributed),
            isHighlighted: this.isHighlighted,
            publicNote: this.publicNote
        };
    }
}

/**
 * Bill Model
 * Represents a monthly utility bill.
 */
class Bill {
    constructor(month, year, amount, issueDate) {
        this.id = `${year}-${month}`; // Unique ID: "2023-11"
        this.month = month; // 1-12
        this.year = year; // 2023
        this.amount = Number(amount);
        this.issueDate = issueDate; // String YYYY-MM-DD or Timestamp
        this.createdAt = new Date();
    }

    toFirestore() {
        return {
            month: this.month,
            year: this.year,
            amount: this.amount,
            issueDate: this.issueDate,
            createdAt: this.createdAt
        };
    }
}

/**
 * Payment Model
 * Represents a single contribution from a unit.
 */
class Payment {
    constructor(unitNumber, amount, date, reference = "", receiptUrl = "") {
        this.unitNumber = unitNumber;
        this.amount = Number(amount);
        this.date = date; // YYYY-MM-DD
        this.reference = reference;
        this.receiptUrl = receiptUrl; // Google Drive Link
        this.createdAt = new Date();
    }

    toFirestore() {
        return {
            unitNumber: this.unitNumber,
            amount: this.amount,
            date: this.date,
            reference: this.reference,
            receiptUrl: this.receiptUrl,
            createdAt: this.createdAt
        };
    }
}

// Service to help with Data Management
const SchemaService = {
    // Generate standard Unit ID string (e.g., 1 -> "E-01")
    formatUnitId: function(num) {
        return `E-${String(num).padStart(2, '0')}`;
    },

    // Seed the database with 44 empty units if they don't exist
    initUnits: async function() {
        const unitsRef = window.db.collection('units');
        const snapshot = await unitsRef.get();

        if (snapshot.empty) {
            console.log("Seeding Database with 44 Units...");
            const batch = window.db.batch();

            for (let i = 1; i <= 44; i++) {
                const unitId = this.formatUnitId(i);
                const newUnit = new Unit(unitId, `Owner ${unitId}`);
                const docRef = unitsRef.doc(unitId);
                batch.set(docRef, newUnit.toFirestore());
            }

            await batch.commit();
            console.log("✅ Seeding Complete: 44 Units Created.");
            alert("Database Initialized with 44 Units.");
        } else {
            console.log("Database already contains units. Skipping seed.");
        }
    }
};

// Export to global scope
window.Models = {
    Unit,
    Bill,
    Payment,
    SchemaService
};
