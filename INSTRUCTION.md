# AI Instructions

## Purpose
This file provides specific operational instructions for the AI assistant ("GitHub Copilot") when working on the **Seapark Apartment Block E Utility Tracker** project.

## Operational Rules

### 1. Feature Logging
**trigger:** Every time you generate a commit message, pull request description, or build log summary.
**action:** You **MUST** consult the `DESIGN.md` file, Section 8 ("Feature Log"), and append a brief summary of the *currently available features* to your output.

**Format Example:**
```text
[Commit Message / Summary]

---
**Current System Capabilities:**
- Core Infrastructure & Auth (Available)
- Bill Management: Create, Read, Update, Delete, Auto-Calc (Available)
- Payment Recording (Available)
[... list others from DESIGN.md ...]
```

### 2. Design Consistency
**trigger:** When implementing new features.
**action:** Verify that the implementation aligns with the `Database Design` and `System Flows` defined in `DESIGN.md`. If a deviation is required (refactoring), you must update `DESIGN.md` first.

### 3. Feature Flag updates
**trigger:** When a User Story (e.g., "PAY-1") is completed.
**action:**
1. Update `MasterPlan.md` (Progress).
2. Update `DESIGN.md` (Section 8 - Feature Log) to mark the feature as "✅ Available".

---
*End of Instructions*
