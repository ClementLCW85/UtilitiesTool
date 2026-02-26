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

**Version:** 1.0.0
**Last Updated:** 2024-05-24
