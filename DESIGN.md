# Design Documentation: Seapark Apartment Block E Utility Tracker

## 1. Project Overview
The **Seapark Apartment Block E Utility Tracker** is a web-based application designed to manage and visualize utility bill collections and owner contributions. Its primary goal is to provide transparency to residents regarding the detailed financial break-even status of the block's utility management, specifically focusing on the common area electricity bills.

## 2. Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Backend/Database:** Google Firebase (Firestore) - NoSQL Database.
- **Middleware:** Google Apps Script (Serverless Proxy for Public Uploads).
- **File Storage:** Google Drive API (Store images in Admin's Drive).
- **Authentication:** Google Firebase Auth (Email/Password).
- **Hosting:** GitHub Pages (Static Hosting).
- **CI/CD:** GitHub Actions (Automated Deployment).

## 3. System Architecture
The system follows a client-serverless architecture:
- **Client:** Static files (`index.html`, `js/*.js`, `css/*.css`) served via GitHub Pages.
- **Service Layer:** Firebase SDKs integrated directly into the client handle Data Access (DAO) and Authentication.
- **Data Layer:** Firestore holds all application state.

## 4. Database Design (Firestore Schema)

### Collection: `units`
Represents the 44 apartment units (E-101 to E-411).
- `unitNumber` (String, PK): e.g., "E-101".
- `ownerName` (String): e.g., "Owner E-101".
- `totalContributed` (Number): Cumulative amount paid by this unit.
- `isHighlighted` (Boolean): Flag for special status (e.g., Hardship).
- `publicNote` (String): Note visible on the dashboard.

### Collection: `bills`
Represents monthly utility bills received from the provider.
- `id` (String, PK): Format "YYYY-M" (e.g., "2024-1").
- `month` (Number): 1-12.
- `year` (Number): 2024.
- `amount` (Number): Total bill amount.
- `issueDate` (String): ISO Date YYYY-MM-DD.
- `createdAt` (Timestamp).

### Collection: `payments`
Represents individual payments made by owners.
- `id` (Auto-ID).
- `unitNumber` (String): Foreign Key to `units`.
- `amount` (Number): Payment value.
- `date` (String): Payment date.
- `reference` (String): Optional note.
- `receiptUrl` (String): Link to proof of payment (optional).
- `createdAt` (Timestamp).

### Collection: `archived_payments`
Stores payments that were removed from the active ledger.
- Same schema as `payments`, plus:
- `archivedAt` (Timestamp).

### Collection: `system`
Stores global aggregates.
- Document: `stats`
- `totalBillsAmount` (Number): Sum of all `bills`.
- `unitTarget` (Number): `totalBillsAmount` / 44.
- `isOverrideEnabled` (Boolean): If true, use `overrideTarget`.
- `lastUpdated` (Timestamp).

### Collection: `collection_rounds`
Represents specific calls for funds or levies.
- `id` (Auto-ID).
- `title` (String): e.g., "Lift Maintenance 2024".
- `targetAmount` (Number): Total to collect in this round.
- `startDate` (String): ISO Date YYYY-MM-DD.
- `participatingUnitIds` (Array of Strings): List of `unitNumber`s effectively involved.
- `remarks` (String): Explanation for the residents.
- `createdAt` (Timestamp).

## 5. Modules & Code Structure
- **`index.html`**: Single Page Application (SPA) container. Switches views via hash routing.
- **`css/style.css`**: Global styling.
- **`js/config.js`**: Firebase configuration object.
- **`js/db.js`**: Firebase initialization and offline persistence setup.
- **`js/models.js`**: Class definitions (`Unit`, `Bill`, `Payment`) and Schema helper methods (`initUnits`, `fixInvalidUnits`).
- **`js/auth.js`**: Authentication logic wrapper.
- **`js/app.js`**: Main application logic, UI binding, event handling, and routing.

## 6. User Roles
1.  **Public User (Resident):**
-   View Dashboard (Charts, Tables).
-   See which units have contributed vs target.
-   View Total Break-even status.
-   Submit Payment Records (with Receipt).
2.  **Admin:**
        -   Secure Login.
        -   Record/Edit/Delete Monthly Bills.
        -   Record/View Unit Payments.
        -   Manage Special Cases (Hardship units).

## 7. System Flows
-   **Startup:** App loads `db.js` -> Checks Auth -> Fetches Data -> Renders Dashboard.
-   **Bill Recording:** Admin validates form -> Saves `Bill` -> Triggers `calculateGlobalBreakEven` -> Updates `system/stats`.
-   **Payment Recording:** Admin selects Unit -> Input Amount -> Uploads Image -> App sends to Google Drive -> Returns URL -> Batch Write (Create `Payment` doc with URL + Increment `Unit.totalContributed`).
-   **Public Submission:** Resident selects Unit -> Input Amount -> Selects File -> App POSTs Base64 data to GAS Web App -> GAS saves to Admin Drive -> Returns URL -> App writes to Firestore.

## 8. Feature Log (Current Capabilities)
*Updated interactively during development.*

| Feature ID | Feature Name | Description | Status |
| :--- | :--- | :--- | :--- |
| **INF-X** | **Core Infrastructure** | Hosting, DB Connection, Data Models, CI/CD. | ✅ Available |
| **INF-3** | **Admin Auth** | Login/Logout protected views. | ✅ Available |
| **BILL-1** | **Record Bill** | Form to input monthly electricity bill details. | ✅ Available |
| **BILL-2** | **Bill History** | View, Edit, and Delete historical bill records. | ✅ Available |
| **BILL-3** | **Auto-Calc Stats** | Automatic calculation of Global Break-even & Per-Unit Target. | ✅ Available |
| **PAY-1** | **Record Payment** | Admin form to record owner payments affecting unit totals. | ✅ Available |
| **PAY-2** | **Receipt Input** | Optional link field for payment proof in Admin Form. | ✅ Available |
| **PAY-3** | **Payment History** | Admin view to filter and list payment records per Unit. | ✅ Available |
| **DASH-1**| **Stats Overview** | Dashboard cards for Total Bills, Unit Target, and Total Collected. | ✅ Available |
| **DASH-2**| **Unit Bar Chart** | Bar chart visualization of contributions per unit (1-44). | ✅ Available |
| **DASH-3**| **Threshold Line** | Visual target break-even line on the unit bar chart. | ✅ Available |
| **DASH-4**| **Highlighted Status**| Visual indicator (Orange bar) and Tooltip note for special units. | ✅ Available |
| **DASH-5**| **Mobile Responsive** | Fluid layout and horizontally scrolling tables for small screens. | ✅ Available |
| **ADM-1** | **Unit Status Mgmt** | Admin interface to toggle Highlight status and edit Public Notes. | ✅ Available |
| **ADM-2** | **Manual Override** | Manual override for Global Break-Even Threshold Target. | ✅ Available |
| **ADM-3** | **Data Backup** | JSON Export of full database state. | ✅ Available |
| **PAY-4** | **Public Payment** | Residents can submit payments and receipts (Google Drive) via public UI. | ✅ Available |
| **PAY-5** | **Seamless Upload**| Google Apps Script proxy for public receipt uploads (No Login required). | ✅ Available |
| **PAY-6** | **Payment Archive** | Admin can archive/soft-delete payments and permanently delete them from archive. | ✅ Available |
| **COL-1** | **Define Rounds** | Admin interface to define specific collection rounds and participants. | ✅ Available |
| **COL-2** | **Round Visualization** | Public Dashboard showing active round, progress, and history. | ✅ Available |

## 9. UI/UX Specifications

### Public Dashboard Layout
1.  **Order:** Bar Chart (Top) -> Stats Overview -> Active Fund Round -> Other Sections.
2.  **Stats Logic:**
    -   **Beginning Date:** Earliest recorded bill date.
    -   **Cumulative Totals:** All sums are calculated from this date forward.
    -   **Description:** Dashboard must explicitly state this period.

### Component Behaviors
*   **Unit Bar Chart:**
    -   **Title:** "Contributions per Unit".
    -   **Y-Axis:** Label "RM (Payment up to date)".
    -   **X-Axis:** Label "Total Units Available (44 units)".
    -   **Tooltips:** Hovering over the X-Axis Label (Unit ID) displays the Public Note if highlighted (in addition to bar hover).
*   **Active Round Widget:**
    -   **Description:** Explanatory text about the nature of the active fund.
    -   **Metrics:** Show "Expected Avg/Unit" (Target / Count) and "Participating Count".
    -   **Unit List:** Toggleable view of all participating unit numbers.

