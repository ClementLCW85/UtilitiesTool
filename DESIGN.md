# Design Documentation: Seapark Apartment Block E Utility Tracker

## 1. Project Overview
The **Seapark Apartment Block E Utility Tracker** is a web-based application designed to manage and visualize utility bill collections and owner contributions. Its primary goal is to provide transparency to residents regarding the detailed financial break-even status of the block's utility management, specifically focusing on the common area electricity bills.

## 2. Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Backend/Database:** Google Firebase (Firestore) - NoSQL Database.
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

### Collection: `system`
Stores global aggregates.
- Document: `stats`
    - `totalBillsAmount` (Number): Sum of all `bills`.
    - `unitTarget` (Number): `totalBillsAmount` / 44.
    - `lastUpdated` (Timestamp).

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
2.  **Admin:**
    -   Secure Login.
    -   Record/Edit/Delete Monthly Bills.
    -   Record/View Unit Payments.
    -   Manage Special Cases (Hardship units).

## 7. System Flows
-   **Startup:** App loads `db.js` -> Checks Auth -> Fetches Data -> Renders Dashboard.
-   **Bill Recording:** Admin validates form -> Saves `Bill` -> Triggers `calculateGlobalBreakEven` -> Updates `system/stats`.
-   **Payment Recording:** Admin selects Unit -> Input Amount -> Batch Write (Create `Payment` doc + Increment `Unit.totalContributed`).

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
