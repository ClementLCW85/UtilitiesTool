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
        this.month = Number(month); // Ensure Number for correct sorting
        this.year = Number(year);   // Ensure Number for correct sorting
        this.id = `${this.year}-${this.month}`; // Unique ID: "2023-11"
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

/**
 * ArchivedPayment Model
 * Represents a payment removed from the active ledger.
 */
class ArchivedPayment extends Payment {
    constructor(paymentData) {
        super(paymentData.unitNumber, paymentData.amount, paymentData.date, paymentData.reference, paymentData.receiptUrl);
        // Retain original creation date if available
        if (paymentData.createdAt) {
             // Handle both Timestamp and Date objects
             this.createdAt = paymentData.createdAt.toDate ? paymentData.createdAt.toDate() : new Date(paymentData.createdAt);
        }
        this.originalId = paymentData.id || "unknown";
        this.archivedAt = new Date();
        this.source = paymentData.source || 'deleted';
        this.rejectionReason = paymentData.rejectionReason || '';
    }

    toFirestore() {
        const data = super.toFirestore();
        data.archivedAt = this.archivedAt;
        data.originalId = this.originalId;
        // Apply original createdAt to preserve history
        data.createdAt = this.createdAt;
        data.source = this.source;
        data.rejectionReason = this.rejectionReason;
        return data;
    }
}

/**
 * CollectionRound Model
 * Represents a specific call for funds (e.g., "Special Levy 2024").
 */
class CollectionRound {
    constructor(title, targetAmount, startDate, participatingUnitIds = [], remarks = "") {
        this.title = title;
        this.targetAmount = Number(targetAmount);
        this.startDate = startDate; // YYYY-MM-DD
        this.participatingUnitIds = participatingUnitIds; // Array of string IDs
        this.remarks = remarks;
        this.createdAt = new Date();
    }

    toFirestore() {
        return {
            title: this.title,
            targetAmount: this.targetAmount,
            startDate: this.startDate,
            participatingUnitIds: this.participatingUnitIds,
            remarks: this.remarks,
            createdAt: this.createdAt
        };
    }

    static fromFirestore(doc) {
        const data = doc.data();
        const round = new CollectionRound(
            data.title,
            data.targetAmount,
            data.startDate,
            data.participatingUnitIds,
            data.remarks
        );
        round.id = doc.id;
        round.createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : new Date();
        return round;
    }
}

// Service to help with Data Management
const SchemaService = {
    // Generate standard Unit ID string (E-101 to E-111, E-201 to E-211, etc.)
    formatUnitId: function(index) {
        // index: 0 to 43
        const block = Math.floor(index / 11) + 1; // 1 to 4
        const unit = (index % 11) + 1; // 1 to 11
        const unitStr = unit < 10 ? `0${unit}` : `${unit}`;
        return `E-${block}${unitStr}`;
    },

    // Seed the database with 44 empty units if they don't exist
    initUnits: async function() {
        try {
            const unitsRef = window.db.collection('units');
            const snapshot = await unitsRef.get();

            if (snapshot.empty) {
                console.log("Seeding Database with 44 Units...");
                const batch = window.db.batch();

                for (let i = 0; i < 44; i++) {
                    const unitId = this.formatUnitId(i);
                    const newUnit = new Unit(unitId, `Owner ${unitId}`);
                    const docRef = unitsRef.doc(unitId);
                    batch.set(docRef, newUnit.toFirestore());
                }

                await batch.commit();
                console.log("✅ Seeding Complete: 44 Units Created.");
                alert("Database Initialized with 44 Units.");
            } else {
                console.log("Database contains units. Checking for data integrity...");
                await this.fixInvalidUnits(snapshot.docs);
            }
        } catch (error) {
            console.error("Init Error:", error);
            if (error && (error.code === 'permission-denied' || error.message.includes("Cloud Firestore API has not been used"))) {
               console.warn("API Not Enabled: Please enable Cloud Firestore in the Firebase Console and Create the Database.");
            }
        }
    },

    // Migration helper to fix incorrectly formatted IDs (e.g. E-2010 -> E-210)
    fixInvalidUnits: async function(existingDocs) {
        if (!existingDocs || existingDocs.length === 0) return;
        
        const batch = window.db.batch();
        let changesCount = 0;
        const unitsRef = window.db.collection('units');
        
        // Map existing IDs for quick lookups
        const existingIds = new Set(existingDocs.map(d => d.id));

        for (let i = 0; i < 44; i++) {
            const block = Math.floor(i / 11) + 1;
            const unit = (i % 11) + 1;
            
            // Old Logic that produced errors
            const wrongId = `E-${block}0${unit}`;
            // New Correct Logic
            const correctId = this.formatUnitId(i);

            if (wrongId !== correctId && existingIds.has(wrongId)) {
                // If the correct ID already exists, do nothing (avoid overwrite)
                if (existingIds.has(correctId)) continue; 

                console.log(`Migrating Data: ${wrongId} -> ${correctId}`);
                
                // Get data from wrong doc
                const wrongDoc = existingDocs.find(d => d.id === wrongId);
                const data = wrongDoc.data();
                data.unitNumber = correctId; // Update internal field

                // Schedule Create & Delete
                batch.set(unitsRef.doc(correctId), data);
                batch.delete(unitsRef.doc(wrongId));
                changesCount++;
            }
        }

        if (changesCount > 0) {
            await batch.commit();
            console.log(`✅ Fixed ${changesCount} invalid unit IDs.`);
            alert(`System updated: Fixed ${changesCount} invalid unit IDs in the database.`);
        }
    }
};

// Export to global scope
window.Models = {
    Unit,
    Bill,
    Payment,
    ArchivedPayment,
    CollectionRound,
    SchemaService
};
