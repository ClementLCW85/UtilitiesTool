# Master Development Plan

This document tracks the execution progress of the Seapark Apartment Block E Utility Tracker.
Updates to this document should happen after completing each user story.

## 📌 Current Focus
**Active Task:** None
**Next Priority:** INF-4 (Define Data Models)

## 📊 Progress Tracker

### 1. Epic: Infrastructure & Core Setup
- [x] **INF-1** Set up Repository & Hosting
  - *Status:* Completed. Project scaffolded, Git initialized, GitHub Actions workflow created.
- [x] **INF-2** Database Connection Setup
  - *Status:* Completed. Firebase SDK Integration added. `js/config.js` created for user credentials.
- [x] **INF-3** Admin Authentication
  - *Status:* Completed. Implemented via Firebase Auth (Email/Password) with a hardcoded admin email.
- [ ] **INF-4** Define Data Models

### 2. Epic: Monthly Bill Management (Admin)
- [ ] **BILL-1** Record New Bill
- [ ] **BILL-2** Bill History View
- [ ] **BILL-3** Auto-Calculate Global Break-Even

### 3. Epic: Owner Payment Management (Admin)
- [ ] **PAY-1** Record Unit Payment
- [ ] **PAY-2** Receipt Link Input
- [ ] **PAY-3** Payment History per Unit

### 4. Epic: Public Dashboard & Visualization
- [ ] **DASH-1** Dashboard Layout & Data Fetching
- [ ] **DASH-2** Unit Bar Chart Component
- [ ] **DASH-3** Global Break-Even Threshold Line
- [ ] **DASH-4** Highlighted Unit Status
- [ ] **DASH-5** Mobile Responsiveness

### 5. Epic: Unit & System Administration
- [ ] **ADM-1** Unit Status Management
- [ ] **ADM-2** Manual Threshold Override
- [ ] **ADM-3** Data Export

## 📝 Notes & Decisions
- **Hosting:** GitHub Pages via GitHub Actions.
- **Database Strategy:** Firebase Firestore (Free Tier). Configuration via `js/config.js`.
