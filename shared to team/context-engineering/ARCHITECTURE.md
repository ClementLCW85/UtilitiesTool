# Architecture Documentation

**Purpose:** Deep dive into architecture patterns, layer responsibilities, and design principles  
**When to Create:** Week 1 of Context Engineering setup  
**Owner:** Architect  
**Location in Project:** [ARCHITECTURE](docs/context-engineering/ARCHITECTURE.md)  
**Learn More:** [Core Concepts](../Core/03_Core_Concepts.md) § "Human-Readable Documentation"

---

## Overview

**Architecture Pattern:** Client-Serverless (BaaS - Backend as a Service)

**Core Principle:** Thick Client with Direct-to-Database secure access.

**Description:**
The application relies on a "Thick Client" approach where the browser handles all presentation and business logic execution. Data persistence and authentication are offloaded to managed services (Firebase) accessed directly via client-side SDKs, secured by server-side rules.

---

## Directory Structure

```
UtilitiesTool/
├── js/                  # Logic & Data Access Layers
│   ├── models.js        # Domain Entities & Schema Definitions
│   ├── db.js            # Infrastructure (Firebase Connection)
│   ├── auth.js          # Infrastructure (Auth Wrappers)
│   ├── drive.js         # Infrastructure (External API Adapter)
│   ├── config.js        # Configuration
│   └── app.js           # Application Layer (Controller/UI Binding)
├── css/                 # Presentation Layer
│   └── style_v2.css     # Styling
├── google-apps-script/  # Backend (Middleware Proxy)
├── tools/               # DevOps Scripts
├── .github/             # CI/CD Workflows
└── docs/                # Documentation
```

---

## Layer Responsibilities

### Presentation Layer (HTML/CSS)

**Purpose:** Renders the user interface and captures inputs.

**Contains:**
- `index.html` (View Structure)
- `css/style_v2.css` (Styling)

**Dependencies:**
- ✅ Can reference: Assets
- ❌ Cannot reference: JS Logic directly (bound via listeners in `app.js`)

---

### Application Layer (Controller)

**Purpose:** Orchestrates user interactions, updates UI, and manages application state.

**Contains:**
- `js/app.js`

**Responsibilities:**
- Event Handling (Clicks, Form submissions)
- Routing (Simple hash-based view switching)
- UI Manipulation (DOM updates)

**Dependencies:**
- ✅ Can reference: Models, Infrastructure

---

### Domain Layer (Models)

**Purpose:** Defines data structures and business rules.

**Contains:**
- `js/models.js` (`Unit`, `Bill`, `Payment` classes)

**Rules:**
- Definition of Data Schemas
- Validation logic
- Calculation logic (Break-even math)

---

### Infrastructure Layer (Data Access)

**Purpose:** Handles communication with external services.

**Contains:**
- `js/db.js` (Firestore operations)
- `js/auth.js` (Firebase Auth)
- `js/drive.js` (Google Drive upload proxy)

**Dependencies:**
- ✅ Can reference: Firebase SDK, Google Apps Script Endpoint
- ❌ Cannot reference: UI elements (Keep it pure)

---

## Data Flow

### Write Flow (User Action)

```
User Click -> Event Listener (app.js) -> Validator (app.js/models.js) -> Service Call (db.js) -> Firebase SDK -> Firestore
```

### Read Flow (Hybrid)

```
1. Dashboard (Public): App Load -> async .get() -> DOM Update (One-time fetch)
2. Admin Queues: Firestore (Update) -> onSnapshot Listener -> DOM Update (Real-time)
```

---

## Design Patterns Used

| Pattern | Where Applied | Purpose | Example |
|---------|---------------|---------|---------|
| **Observer (Pub/Sub)** | `db.js` / `app.js` | Real-time UI updates (Admin Queues) | `onSnapshot` listeners |
| **Singleton** | `js/db.js` | Single DB connection instance | `db` export |
| **Module Pattern** | `js/*.js` | Separation of concerns | `export class`, `export const` |
| **Proxy** | Google Apps Script | Bystassing CORS/Auth for public uploads | `Code.gs` |

---

## Deployment Architecture

### Deployment Flow

```
[Developer] -> (Push) -> [Feature Branch]
                          ↓
                       (PR / Merge)
                          ↓
[Main Branch] -> (Action) -> [Production Environment] (GitHub Pages)
```

---

## Cross-Cutting Concerns

### Error Handling
- **Strategy:** `try-catch` blocks in Async functions.
- **Reporting:** Console logs (Client), UI Alerts (`alert()` or Toast messages) for user feedback.

### Security
- **Auth:** Firebase Auth (Admin), Anonymous (Public).
- **Rules:** Firestore Security Rules (Managed via Firebase Console).
- **Secrets:** API Keys (Publicly visible but domain-restricted via Google Console).

### Performance
- **Strategy:** Hybrid (Cached One-time reads for Dashboard, Real-time listeners for Queues).
- **Optimization:** Single-page loads (SPA), Caching via Browser and Firebase offline persistence.

---

**Version:** 1.0.0
**Last Updated:** 2024-05-24
