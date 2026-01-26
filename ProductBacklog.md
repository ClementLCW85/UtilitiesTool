# Product Backlog: Seapark Apartment Block E - Utilitybill Tracker

## 1. Epic: Infrastructure & Core Setup
**Goal:** Establish the hosting, database, and security foundation.

| ID | Title | Description | Priority | Dependencies |
|----|-------|-------------|----------|--------------|
| INF-1 | Set up Repository & Hosting | Initialize Git repo and configure automated deployment to GitHub Pages (or Vercel). | High | - |
| INF-2 | Database Connection Setup | Configure connection to Google Sheets (via API or published CSV) or Firebase Realtime DB (Free Tier). | High | INF-1 |
| INF-3 | Admin Authentication | Implement a simple "Master Password" login screen to protect the Admin Interface. | High | INF-1 |
| INF-4 | Define Data Models | Design JSON/Schema structure for `Units`, `Bills`, and `Payments`. | High | INF-2 |

## 2. Epic: Monthly Bill Management (Admin)
**Goal:** Allow administrators to input and track the monthly utility bills.

| ID | Title | Description | Priority | Dependencies |
|----|-------|-------------|----------|--------------|
| BILL-1 | Record New Bill | Form for Admin to input: Month, Year, Total Amount, Issue Date. | High | INF-3, INF-4 |
| BILL-2 | Bill History View | List view of all recorded bills with ability to edit/delete distinct records. | Medium | BILL-1 |
| BILL-3 | Auto-Calculate Global Break-Even | System updates the "Global Break-Even Threshold" (Cumulative Total of All Bills) whenever a bill is added/modified. | High | BILL-1 |

## 3. Epic: Owner Payment Management (Admin)
**Goal:** Enable recording of unit contributions.

| ID | Title | Description | Priority | Dependencies |
|----|-------|-------------|----------|--------------|
| PAY-1 | Record Unit Payment | Form for Admin to select Unit (1-44), Input Amount, Date, and Optional Reference Note. | High | INF-3, INF-4 |
| PAY-2 | Receipt Image Upload | File upload interface to select image/pdf. System handles upload to Google Drive via API and retrieves web view link. | High | PAY-1 |
| PAY-3 | Payment History per Unit | Admin view to see ledger of payments for a specific unit. | Medium | PAY-1 |
| PAY-4 | Public Payment Submission | Interface for residents to submit payment records and upload receipts. | High | PAY-2 |
| PAY-5 | Seamless Public Upload (GAS Proxy) | Implement Google Apps Script proxy to allow public uploads without user Google Auth. | High | PAY-4 |
| PAY-6 | Payment Removal & Archiving | Admin capability to archive records (remove from totals) and permanently delete them from archive. | High | PAY-1 |
| PAY-7 | Admin Approval Queue | Admin UI to view "Pending" public payments. Features: Edit Amount/Ref, Approve (Move to Active), Reject (Move to Archive). | High | PAY-4 |
| PAY-8 | Rejected Payment Archiving | Store rejected payments in `archived_payments` with a specific flag. Admin can filter Archive view to see "Rejected" vs "Deleted". | Medium | PAY-7, PAY-6 |

## 4. Epic: Public Dashboard & Visualization
**Goal:** Transparently display contributions and status to all users.

| ID | Title | Description | Priority | Dependencies |
|----|-------|-------------|----------|--------------|
| DASH-1 | Dashboard Layout & Data Fetching | Main landing page that fetches and aggregates Bill and Payment data on load. | High | INF-2, INF-4 |
| DASH-2 | Unit Bar Chart Component | Implement a bar chart displaying "Total Contributed" per Unit (1-44). | High | DASH-1, PAY-1 |
| DASH-3 | Global Break-Even Threshold Line | **Logic Clarification required:** Add a horizontal line across the chart. <br> *Decision:* Line represents (Total Cumulative Bills / 44 Units) to show "Target per Unit". <br> *Alt:* If chart is aggregate, line is Total Bills. | High | DASH-2, BILL-3 |
| DASH-4 | Highlighted Unit Status | Visual indicator (color/icon) for specific units flagged as "Special Case" (e.g., Hardship). Display public note on hover/click. | Medium | DASH-2, ADM-1 |
| DASH-5 | Mobile Responsiveness | Ensure chart and data tables are readable on mobile devices. | Medium | DASH-1 |
| DASH-6 | Chart Enhancements | Add "Contributions per Unit" title, Axis Titles (Y: RM, X: Units), and enable Public Note tooltip on X-axis labels. | Medium | DASH-2 |
| DASH-7 | Layout & Context | Move Chart to Top. Add text explaining "Beginning Date" and cumulative nature of stats. | High | DASH-1 |
| DASH-8 | Pending Payment Visualization | Update Bar Chart to show Pending Payments as a stacked, dotted/lighter bar segment on top of confirmed contributions. | High | DASH-2, PAY-7 |

## 5. Epic: Unit & System Administration
**Goal:** Manage unit status and system configuration.

| ID | Title | Description | Priority | Dependencies |
|----|-------|-------------|----------|--------------|
| ADM-1 | Unit Status Management | Admin interface to toggle "Highlighted" status for a unit and edit the associated Public Note. | Medium | INF-3, INF-4 |
| ADM-2 | Manual Threshold Override | Option for Admin to manually set the Threshold Line value (overriding the auto-sum) if needed for adjustments. | Low | DASH-3 |
| ADM-3 | Data Export | Button to download current state (bills/payments) as JSON/CSV for backup. | Low | BILL-1, PAY-1 |
| ADM-4 | Unclaimed Funds Management | Admin interface to set a floating "Unclaimed" amount (payments not linked to units). visualized as a special unit in Dashboard. | High | ADM-2 |
| ADM-5 | Detailed Unclaimed Funds | Enhancement to ADM-4. Track unclaimed funds as individual records (Date, Amount, Remarks). Allow conversion to valid Unit Payment or Archiving. | High | ADM-4 |

## 6. Epic: Collection Rounds Management
**Goal:** Manage and visualize specific fundraising rounds.

| ID | Title | Description | Priority | Dependencies |
|----|-------|-------------|----------|--------------|
| COL-1 | Define Collection Round (Admin) | Form to Create/Edit a Round: Title, Amount, Start Date, Remarks, and Participating Units (Multi-select). | High | INF-4 |
| COL-2 | Collection Round Visualization (Public) | Dashboard component to show the Latest Round details and a clickable list/modal for History. | High | COL-1 |
| COL-3 | Extended Round Details | Add Description text, Avg Cost/Unit, Participant Count, and Toggleable Unit List to widget. | High | COL-2 |
