# Anti-Patterns: What NOT to Do

**Purpose:** Document common mistakes and why they're problematic  
**When to Create:** After identifying recurring code smells  
**Owner:** Architect  
**Location in Project:** [ANTI PATTERNS](docs/context-engineering/ANTI_PATTERNS.md)  
**Learn More:** [Core Concepts](../Core/03_Core_Concepts.md) § "Human-Readable Documentation"

---

## JavaScript / Frontend Anti-Patterns

### AP-100: Global Namespace Pollution

**Category:** Code Quality

**What it is:**
Defining variables or functions at the top level of a file without `const/let` or modules, making them accessible via `window`.

**Why it's bad:**
- Name collisions between scripts.
- Hard to debug state changes.
- Security risk (exposing internal helpers).

**What to do instead:**
Use ES6 Modules (`import`/`export`) or IIFE.

**Example Violation:**
```javascript
// ❌ BAD
var currentUser = null; // Attached to window.currentUser
function init() { ... }
```

**Correct Approach:**
```javascript
// ✅ GOOD
const currentUser = null; // Scoped to module
export function init() { ... }
```

---

### AP-101: Mixing DOM Manipulation with Business Logic

**Category:** Architecture

**What it is:**
Embedding calculation or data logic inside event listeners or UI rendering functions.

**Why it's bad:**
- Logic cannot be tested without a browser.
- Hard to reuse login across different views.
- "Spaghetti code".

**Correct Approach:**
Separate logic into `models.js` or pure functions, call them from `app.js`.

---

### AP-102: Callback Hell

**Category:** Code Quality

**What it is:**
Nested callbacks for asynchronous operations.

**Why it's bad:**
- Unreadable.
- Error handling is difficult.

**What to do instead:**
Use `async/await` patterns.

**Example Violation:**
```javascript
// ❌ BAD
getData(function(a) {
    getMore(a, function(b) {
        render(b);
    });
});
```

**Correct Approach:**
```javascript
// ✅ GOOD
const a = await getData();
const b = await getMore(a);  
render(b);  
```  

---  

### AP-103: Inline Style Manipulation  

**Category:** Presentation  

**What it is:**  
Using JavaScript to directly modify `.style` properties (e.g., `element.style.color = 'red'`) instead of toggling CSS classes.  

**Why it's bad:**  
- Breaks separation of concerns (styling in logic).  
- Harder to maintain theme consistency.  
- Overrides CSS stylesheet declarations due to high specificity.  

**What to do instead:**  
Define states in CSS and use `element.classList.add()` or `toggle()`.  

---  

### AP-104: Silent Error Catching  

**Category:** User Experience / Debugging  

**What it is:**  
Using `try/catch` blocks that only log to `console.error` without informing the user that an operation failed.  

**Why it's bad:**  
- Users are left wondering why a button click "did nothing".  
- Difficult to troubleshoot in production without access to client logs.  

**What to do instead:**  
Always provide UI feedback (e.g., Toast notifications, error messages) in the `catch` block.  

---  

### AP-105: Prohibited DOM Access in Models  

**Category:** Architecture  

**What it is:**  
Referencing `document` or specific DOM elements inside classes defined in `models.js`.  

**Why it's bad:**  
- Couples data structure to a specific UI implementation.  
- Prevents unit testing of models in non-browser environments (like Node.js).  

**What to do instead:**  
Models should only hold data and pure logic. DOM updates belong in `app.js`.  

---  

## Firebase / Backend Anti-Patterns

### AP-200: Unbounded Collection Reads

**Category:** Performance & Cost

**What it is:**
Reading an entire collection just to count items or display a subset.

**Why it's bad:**
- **Cost:** Firebase charges per document read. Reading 1000 docs to display 10 = waste.
- **Performance:** Slow network transfer.

**What to do instead:**
Use `limit()`, cursor pagination, or Aggregation queries (`count()`).

**Example Violation:**
```javascript
// ❌ BAD
const snapshot = await getDocs(collection(db, "payments"));
const count = snapshot.size; // Reads ALL documents ($$$)
```

**Correct Approach:**
```javascript
// ✅ GOOD
const snapshot = await getCountFromServer(collection(db, "payments"));
const count = snapshot.data().count; // Reads 1 meta-document ($)
```

---

### AP-201: Client-Side Filtering

**Category:** Performance

**What it is:**
Downloading all data and filtering it with JavaScript `.filter()`.

**Why it's bad:**
- Wastes bandwidth and read quota.
- Slow on mobile devices.

**What to do instead:**
Use Firestore `query()` with `where()` clauses.

**Example Violation:**
```javascript
// ❌ BAD
const allBills = await getAllBills();
const unpayed = allBills.filter(b => !b.paid);
```

**Correct Approach:**
```javascript
// ✅ GOOD
const q = query(collection(db, "bills"), where("paid", "==", false));  
const unpayed = await getDocs(q);  
```  

---  

### AP-203: Firestore N+1 Read Queries  

**Category:** Performance & Cost  

**What it is:**  
Performing a database read (e.g., `getDoc`) inside a loop that iterates over the results of another query.  

**Why it's bad:**  
- **Cost:** Exponential increase in document reads.  
- **Latency:** Multiple sequential network roundtrips slow down the UI rendering.  

**What to do instead:**  
Use `where("field", "in", [...])` for batch lookups or denormalize data to include necessary fields in the parent document.  

---  

### AP-202: Publicly Writable Collections (in Rules)

**Category:** Security

**What it is:**
Setting Firestore Security Rules to `allow write: if true`.

**Why it's bad:**
- Any user (or bot) can delete your entire database.
- Malicious data injection.

**What to do instead:**
Lock down writes to `request.auth != null` or use Google Apps Script proxy for public validated ingestion.

---

## Google Apps Script Anti-Patterns

### AP-300: Synchronous Heavy Processing

**Category:** Reliability

**What it is:**
Doing complex data work (image processing, big loops) inside the `doPost` web app trigger.

**Why it's bad:**
- Web App triggers have a time limit (30s - 6m).
- Client browser hangs waiting for response.

**What to do instead:**
Quickly save raw data and return "OK". Use time-driven triggers for heavy processing.  

---  

### AP-301: Hardcoded External Service URLs  

**Category:** Maintainability  

**What it is:**  
Embedding the Google Apps Script Web App URL or Firebase Project IDs directly in application logic files.  

**Why it's bad:**  
- Switching from dev to production requires editing multiple files.  
- High risk of pointing to the wrong environment after a redeploy.  

**What to do instead:**  
Centralize all external endpoints and configuration in `js/config.js`.  

---  

---

## Development Workflow Anti-Patterns

### AP-400: Committing Unformatted Code

**Category:** Code Quality / Maintainability

**What it is:**
Committing code without running the project's formatting script, resulting in inconsistent line endings (LF vs CRLF) and indentation (tabs vs spaces).

**Why it's bad:**
- Creates unnecessary diff noise in PRs (whitespace changes mixed with actual logic changes).
- Cross-platform development issues (Windows CRLF vs Unix LF).
- Inconsistent code style reduces readability.

**What to do instead:**
Always run the formatting script before committing:
```powershell
powershell -ExecutionPolicy Bypass -File tools/format_files.ps1
```

**What the script enforces:**
| File Type | Line Endings | Indentation |
|-----------|--------------|-------------|
| Markdown (`.md`) | CRLF | 4 spaces |
| JavaScript (`.js`) | CRLF | 2 spaces |

---

**Version: 1.2.0**  
**Last Updated: 2026-03-04**  
