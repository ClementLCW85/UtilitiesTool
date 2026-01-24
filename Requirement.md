# Requirements Definition: Seapark Apartment Block E - Utility Bill Tracker

## 1. Project Overview
The goal is to develop a web-based application to manage and track the collection of funds for the electric utility bill of the common area in *Block E of Seapark Apartment*. The system will track monthly bills and contributions made by unit owners to ensure transparency and proper fund management.

## 2. Infrastructure & Constraints
- **Hosting:** The solution must be hosted on a permanent free platform (e.g., GitHub Pages, Firebase Hosting, Vercel, or Netlify).
- **Database:** Must utilize a free storage solution (e.g., Google Sheets as backend, Firebase Realtime Database free tier, or local storage/JSON if static).

## 3. Key Functional Requirements

### 3.1 Monthly Bill Management
- The system must accommodate a new electric utility bill issued every month.
- Capability to record the details of each month's bill (e.g., Billing Month, Total Amount Due, Bill Date).

### 3.2 Owner Contributions (Payment Recording)
- The system must record payments made by each unit owner towards the electric utilities account.
- **Scope:** The system will manage a fixed list of **44 Units** in Block E.
- Each transaction record should include:
    - Unit Number / Owner Name
    - Amount Paid
    - Date of Payment
- **Public Submission:** Residents must be able to submit payment records via a public interface.
    - **Proof of Payment:** Capability to upload an image file (receipt). These images must be stored in the same **Google Drive** location used for Admin uploads.
    - **Seamless Experience:** Residents must NOT be required to sign in with a Google Account to upload files. The system must proxy the upload to the Admin's drive securely.
- Owners can contribute varying amounts each month.

### 3.3 Contribution Tracking & Dashboard
- **Total Contributions per Owner:** The website must calculate and display the total amount contributed by each unit owner covering the entire history.
- **Visual Dashboard:** A public dashboard featuring a **bar chart** that visualizes the total contributed amount per unit.
- **Break-Even Threshold:** The bar chart must include a **threshold line** representing the **Cumulative Break-Even Point** (Total amount of all utilities bills issued to date). This indicates the target "Zero Debt" level for the block.
- **Highlighted Units:** The dashboard must visually distinguish specific units (e.g., different bar color or icon) that have special status (e.g., financial hardship, deceased owner). A public note should be visible for these highlighted units to explain the status.
- **Transparency:** The data should be presented clearly so owners can verify their total contributions against the recorded electric account.

### 3.4 Administration (Restricted Access)
- **Admin Interface:** A secured interface restricted to administrators.
    - **Authentication:** Secured via a single **Master Password**.
- **Payment Recording:** Admins can manually add payment records for each unit/owner.
    - **Proof of Payment:** Capability to upload an image file (receipt). The system will upload this file to the Admin's **Google Drive** using the Drive API and store the resulting shareable link.
- **Payment Record Management:**
    - **Removal & Archiving:** Admins can remove payment records from the active database. Removed records are moved to an archive table and must not be included in the calculation of total collected funds.
    - **Archive Cleanup:** Admins can permanently delete records from the archive database.
- **Threshold & Bill Management:** Admins record the monthly bill amounts, which automatically updates the global "Break-Even Threshold."
- **Unit Management:**
    - **Highlighting:** Admins can flag specific units as "Highlighted" and append a text note (e.g., "Critical Illness - Exempt").

### 3.5 Collection Rounds Management
- The system must define distinct "Collection Rounds" (e.g., "Special Maintenance Levy").
- **Round Definition:**
    - **Total Target Amount:** How much needs to be collected in this round.
    - **Participating Units:** Identification of which specific units are involved (e.g., all 44, or a specific subset).
    - **Start Date:** The effective date of the collection round.
    - **Remarks:** Explanation of why this collection is required.
- **Admin Capabilities:**
    - Create new Collection Rounds.
    - Modify existing Collection Rounds (e.g., change the target amount or involved units).
- **Public Dashboard:**
    - **Active Round:** Display the details of the latest/current collection round.
    - **History:** Provide a view to list past collection rounds for transparency.

## 4. Next Steps
This requirements document will be used to generate the **Product Backlog** and strictly guide the **Feature Design** phase.