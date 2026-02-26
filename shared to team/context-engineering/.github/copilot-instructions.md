# Project Context: Seapark Apartment Block E Utility Tracker

**Purpose:** High-level AI instructions auto-loaded by GitHub Copilot  
**When to Create:** Week 1 of Context Engineering setup  
**Owner:** Architect  
**Location in Project:** `.github/copilot-instructions.md` (root level)  
**Learn More:** [Core Concepts](../Core/03_Core_Concepts.md) § "AI-Native Files (.github/ folder)"

---

## Overview
Seapark Apartment Block E Utility Tracker is an HTML/JavaScript web application for tracking utility bills and payments. It features a dashboard for residents and admins to manage utility records, designed for a community environment.

> This is a community portal for Seapark Apartment residents to track utility usage and bills.
> We handle monthly billing, payment recording, and administrative oversight for Block E.

---

## Stack Summary
- **Backend:** Google Apps Script (Middleware Proxy), Firebase (Serverless)
- **Frontend:** Vanilla JavaScript (ES6+), CSS3
- **Database:** Google Firestore (NoSQL)
- **Testing:** Manual Testing (No automated framework currently)
- **Deployment:** GitHub Pages (Static Hosting)

---

## Architecture
- **Pattern:** Client-Serverless (BaaS - Backend as a Service)
- **Layers:** Presentation (HTML/CSS) → Application/Logic (JS) → Infrastructure (Firebase/Apps Script)
- **Rule:** Thick Client with Direct-to-Database secure access.

---

## Core Rules
1. **Feature Logging:** Every time you generate a commit message, pull request description, or build log summary, you **MUST** consult the `docs/context-engineering/FEATURES.md` file, and append a brief summary of the *currently available features* to your output.
2. **Design Consistency:** When implementing new features, verify that the implementation aligns with the `Layer Responsibilities` and `Data Flow` defined in `docs/context-engineering/ARCHITECTURE.md`. If a deviation is required (refactoring), you must update `docs/context-engineering/ARCHITECTURE.md` first.
3. **Feature Flag updates:** When a User Story (e.g., "PAY-1") is completed: 1. Update `docs/ProductBacklog.md` (Status) and `docs/SprintLog.md` (Progress). 2. Update `docs/context-engineering/FEATURES.md` to mark the feature as "Available".
4. **File Creation Robustness:** Use `Set-Content` in PowerShell to create files, ensuring robustness in the environment.
5. **No Compilation:** This project does not require a `run_build` or compilation step in its plans.


- **Async Everything:** All I/O operations (Firebase, Fetch) use async/await
- **Error Handling:** Use `try/catch` blocks and log errors to console/UI
- **Naming:** camelCase for variables/functions, PascalCase for classes
- **DOM Manipulation:** Use `document.getElementById` or `querySelector` caching

---

## Active Sprint
- **Current Sprint:** SPR-02 - Enhancement Sprint
- **Focus Features:** See docs/context-engineering/FEATURES.md

---

## References
- **Detailed Stack:** docs/context-engineering/TECH_STACK.md
- **Architecture Deep Dive:** docs/context-engineering/ARCHITECTURE.md
- **Anti-Patterns:** docs/context-engineering/ANTI_PATTERNS.md

---

## Participants to Use
- **@workspace** - For solution-wide questions
- **@terminal** - For Git/command-line help
- **#file** - To reference specific files

---

## Special Constraints
- No compilation/build steps needed.
- Use `Set-Content` for creating files in PowerShell.

---

**Note for AI:** Read referenced docs before generating code. Always mimic patterns from js/ folder.

