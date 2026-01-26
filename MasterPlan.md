# Master Development Plan

This document tracks the execution progress of the Seapark Apartment Block E Utility Tracker.
Updates to this document should happen after completing each user story.

## 📌 Current Focus
**Active Task:** None (All Tasks Completed)
**Next Priority:** Maintenance & Documentation


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

### 3. Epic: Owner Payment Management
- [x] **PAY-1** Record Unit Payment
    - *Status:* Completed. Implemented Payment Form in Admin UI with Unit selection and amount input. Payments increment Unit totals atomically.
- [x] **PAY-2** Receipt Image Upload & Drive Integration
    - *Status:* Completed. Implemented Google Drive API File Upload (Multipart) and integrated with Payment Form.
- [x] **PAY-3** Payment History per Unit
    - *Status:* Completed. Implemented History Section with Unit Dropdown and Table in Admin UI.
- [x] **PAY-4** Public Payment Submission
    - *Status:* Completed. Implemented public form with Google Drive receipt upload and Firestore batch write.
- [x] **PAY-5** Seamless Public Upload (GAS Proxy)
    - *Status:* Completed. Implemented Google Apps Script proxy code and updated frontend to allow no-auth uploads.
- [x] **PAY-6** Payment Removal & Archiving
    - *Status:* Completed. Admin capability to archive records (remove from totals) and permanently delete them from archive.
- [x] **PAY-7** Admin Approval Queue
- *Status:* Completed. Implemented Admin UI for Pending Payments, Approve/Reject logic, and Public Submission redirection.
- [x] **PAY-8** Rejected Payment Archiving
- *Status:* Completed. Implemented rejection source tracking and Admin Archive filtering.

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
- [x] **DASH-6** Chart Enhancements
- *Status:* Completed. Added Title, Axis Labels, and MinBarLength for interactivity.
- [x] **DASH-7** Layout & Stats Context
- *Status:* Completed. Top-Chart Layout, Date Context.
- [x] **DASH-8** Pending Payment Visualization
- *Status:* Completed. Added stacked dotted bar segment for pending amounts in chart.

### 5. Epic: Unit & System Administration
- [x] **ADM-1** Unit Status Management
    - *Status:* Completed. Admin interface implemented to toggle Highlight and edit Public Note.
- [x] **ADM-2** Manual Threshold Override
    - *Status:* Completed. Implemented manual target override in Admin/System Config and updated Dashboard logic.
- [x] **ADM-3** Data Export
- *Status:* Completed. Implemented JSON export of Bills, Payments, Units, and System Stats.
- [x] **ADM-4** Unclaimed Funds Management
- *Status:* Completed. Admin interface to manage floating amounts and visualization in Dashboard.
- [x] **ADM-5** Detailed Unclaimed Funds
- *Status:* Completed. Transition `unclaimedAmount` to collection-based tracking with Conversion/Archive features.

### 6. Epic: Collection Rounds Management
- [x] **COL-1** Define Collection Round
    - *Status:* Completed. Admin interface implemented to Create/Edit rounds with unit selection.
- [x] **COL-2** Dashboard Round Display
- *Status:* Completed. Public dashboard widget created with `loadLatestRound` and history toggle.
- [x] **COL-3** Extended Round Details
- *Status:* Completed. Added Avg/Cost, Count, and Toggleable Unit List.

## 📝 Notes & Decisions
- **Hosting:** GitHub Pages via GitHub Actions.
- **Database Strategy:** Firebase Firestore (Free Tier). Configuration via `js/config.js`.
