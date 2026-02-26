# Technology Stack

**Purpose:** Detailed inventory of all technologies, frameworks, and libraries  
**When to Create:** Week 1 of Context Engineering setup  
**Owner:** Architect / Tech Lead  
**Location in Project:** [TECH STACK](docs/context-engineering/TECH_STACK.md)  
**Learn More:** [Core Concepts](../Core/03_Core_Concepts.md) § "Human-Readable Documentation"

---

## Backend (Serverless)

### Platform
- **Primary:** Google Firebase
- **Services Used:** 
  - Firestore (Database)
  - Firebase Authentication (Identity)
- **Middleware:** Google Apps Script (Web App proxy for public uploads)

### API Framework
- **Style:** Direct SDK access (Client-to-Service) + REST (Apps Script)
- **Versioning:** No explicit versioning (Rolling updates)

### Data Access
- **Primary:** Firebase JS SDK (v9+)
- **Pattern:** Direct collection references
- **Security:** Firebase Security Rules (Firestore Rules)

---

## Frontend

### Framework
- **Primary:** Vanilla JavaScript (ES6+)
- **Structure:** Modular JS files (MVC-lite pattern)
- **No Build Step:** Raw ES6 modules served directly
- **State Management:** Simple In-Memory State (`app.js` variables) + Observable Listeners

### UI Library
- **Styling:** CSS3 (Custom `style_v2.css`)
- **Theme:** CSS Variables for theming (ADM-7)
- **Responsive:** CSS Media Queries

### Build Tools
- **Bundler:** None (Native ES Modules)
- **Transpiler:** None (Browserslist targeting modern browsers)
- **Linting:** None currently (Recommended: ESLint)

---

## Database

### Primary Database
- **Type:** Google Cloud Firestore (NoSQL)
- **Structure:** Document-Collection Model
- **Connection:** via `js/config.js` and `js/db.js`

### Storage
- **Primary:** Google Drive (Admin's personal drive via Apps Script proxy)
- **Reason:** Cost-saving for public submissions without Auth

---

## Testing (Recommended - Not Implemented)

### Unit Testing
- **Framework:** Jest (Planned)
- **Target:** `js/models.js`, Calculation logic (`calculateGlobalBreakEven`)
- **Coverage Target:** 70% (Core Logic)
- **Mocking:** `jest.mock` for Firebase calls

### E2E Testing
- **Framework:** Playwright (Planned)
- **Browser Coverage:** Chromium, Firefox, WebKit
- **Environment:** Local or CI (Headless)
- **Scope:** Critical paths (Bill creation, Payment submission)

---

## DevOps & Deployment

### CI/CD
- **Platform:** GitHub Actions
- **Pipeline Location:** `.github/workflows/`
- **Workflow:**
    1. **Build/Check:** Validate HTML/CSS/JS syntax.
    2. **Test:** Run Unit/E2E tests (Future).
    3. **Deploy:** Push to GitHub Pages branch.

### Hosting
- **Environment:** GitHub Pages (Static Hosting)
- **Environments Strategy:**
    - **Production:** Deployed from `main` or `master` branch to public URL via GitHub Actions.
    - **Dev/Staging:** Manual or Future Implementation.

### Monitoring
- **Logging:** `console.log` (Client-side), Firebase Console (Backend)
- **Uptime:** GitHub Status

---

## Security

### Authentication
- **Method:** Firebase Authentication (Email/Password)
- **Scope:** Admin Only (Residents are unauthenticated public users)

### Authorization
- **Model:**
    - **Admin:** Full Read/Write access (enforced by Firestore Rules).
    - **Public:** Limited Read (Dashboard data), Append-Only (Pending Payments).

### Data Protection
- **In Transit:** HTTPS (Enforced by GitHub Pages & Firebase).
- **At Rest:** Google Cloud Encrypted.

---

## External Dependencies

### Third-Party APIs
| API | Purpose | Authentication | Rate Limit |
|-----|---------|----------------|------------|
| Google Drive API | Image Storage | OAuth2 via Apps Script | Drive Quota |
| Firebase SDK | Data & Auth | API Key + App ID | Firestore Quota |

---

## Development Tools

### IDE
- **Primary:** Visual Studio Code / VS 2026
- **Extensions:** Live Server, Prettier

### Version Control
- **System:** Git
- **Repository:** GitHub
- **Branching Strategy:** 
  - `main`: Production Release
  - `dev`: Active Development & Integration
  - `feature/*`: Specific feature work

---

## Performance Targets (General Public Usage)

| Metric | Target | Measurement Tool |
|--------|--------|------------------|
| **Page Load (LCP)** | < 2.5s | Lighthouse / DevTools |
| **First Input Delay** | < 100ms | Lighthouse |
| **API/DB Latency** | < 1s | Network Tab |
| **Concurrent Users** | ~50 (Low volume) | Estimation |

---

## Browser Support

| Browser | Minimum Version | Priority |
|---------|-----------------|----------|
| Chrome | Last 2 Versions | High |
| Edge | Last 2 Versions | High |
| Firefox | Last 2 Versions | Medium |
| Safari (iOS/Mac) | Last 2 Versions | High |
| IE / Legacy | Not Supported | None |

---

**Version:** 1.0.0
**Last Updated:** 2024-05-24
