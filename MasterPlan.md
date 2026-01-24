# Master Development Plan

This document tracks the execution progress of the Seapark Apartment Block E Utility Tracker.
Updates to this document should happen after completing each user story.

## 📌 Current Focus
**Active Task:** ADM-2 (Manual Threshold Override)
**Next Priority:** ADM-3 (Data Export)

## 📊 Progress Tracker

### 1. Epic: Infrastructure & Core Setup
- [x] **INF-1** Set up Repository & Hosting
  - *Status:* Completed. Project scaffolded, Git initialized, GitHub Actions workflow created.
- [x] **INF-2** Database Connection Setup
  - *Status:* Completed. Firebase SDK Integration added. `js/config.js` created for user credentials.
- [x] **INF-3** Admin Authentication
  - *Status:* Completed. Implemented via Firebase Auth (Email/Password) with a hardcoded admin email.
- [x] **INF-4** Define Data Models
  - *Status:* Completed. `js/models.js` created with Unit, Bill, Payment classes. DB seeded with 44 Units.

### 2. Epic: Monthly Bill Management (Admin)
- [x] **BILL-1** Record New Bill
  - *Status:* Completed. Admin Form created and connected to Firestore `bills` collection.
- [x] **BILL-2** Bill History View
  - *Status:* Completed. Implemented Bill History Table with Edit/Delete functionality in Admin Dashboard.
- [x] **BILL-3** Auto-Calculate Global Break-Even
  - *Status:* Completed. Implemented automatic recalculation of total bills amount and per-unit target to `system/stats` on every bill change.

### 3. Epic: Owner Payment Management (Admin)
- [x] **PAY-1** Record Unit Payment
  - *Status:* Completed. Implemented Payment Form in Admin UI with Unit selection and amount input. Payments increment Unit totals atomically.
- [x] **PAY-2** Receipt Link Input
  - *Status:* Completed. Added optional URL field to Payment Form and saved to Firestore.
- [x] **PAY-3** Payment History per Unit
  - *Status:* Completed. Implemented History Section with Unit Dropdown and Table in Admin UI.

### 4. Epic: Public Dashboard & Visualization
- [x] **DASH-1** Dashboard Layout & Data Fetching
  - *Status:* Completed. Added Stats Grid to Dashboard fetching aggregated Bills and summing Unit Contributions.
- [x] **DASH-2** Unit Bar Chart Component
  - *Status:* Completed. Implemented responsive bar chart using Chart.js visualization of contribution per unit.
- [x] **DASH-3** Global Break-Even Threshold Line
  - *Status:* Completed. Added horizontal line to Chart.js representing the target share per unit.
- [x] **DASH-4** Highlighted Unit Status
  - *Status:* Completed. Implemented logic to color bars orange if `isHighlighted` is true, and show `publicNote` in tooltip.
- [x] **DASH-5** Mobile Responsiveness
  - *Status:* Completed. Implemented CSS Media Queries for layout adjustments and Horizontal Scroll for data tables.

### 5. Epic: Unit & System Administration
- [x] **ADM-1** Unit Status Management
  - *Status:* Completed. Admin interface implemented to toggle Highlight and edit Public Note.
- [ ] **ADM-2** Manual Threshold Override
- [ ] **ADM-3** Data Export

## 📝 Notes & Decisions
- **Hosting:** GitHub Pages via GitHub Actions.
- **Database Strategy:** Firebase Firestore (Free Tier). Configuration via `js/config.js`.
