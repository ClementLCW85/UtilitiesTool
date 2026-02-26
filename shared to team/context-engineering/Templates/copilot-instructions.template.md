# Project Context: [Project Name]

**Purpose:** High-level AI instructions auto-loaded by GitHub Copilot  
**When to Create:** Week 1 of Context Engineering setup  
**Owner:** Architect  
**Location in Project:** `.github/copilot-instructions.md` (root level)  
**Learn More:** [Core Concepts](../Core/03_Core_Concepts.md) § "AI-Native Files (.github/ folder)"

---

## Overview
[2-3 sentence project description]

**Example:**
> This is an FSM (Field Service Management) system for managing ATM/CQM maintenance 
> operations. We track service records, schedule technicians, and manage parts inventory 
> across 9 banks in Hong Kong.

---

## Stack Summary
- **Backend:** [e.g., .NET 10, ASP.NET Core, EF Core 9]
- **Frontend:** [e.g., Blazor Server, React, Angular]
- **Database:** [e.g., SQL Server 2022, PostgreSQL]
- **Testing:** [e.g., xUnit, NSubstitute, Playwright]
- **Deployment:** [e.g., Azure App Service, AWS, On-premise]

---

## Architecture
- **Pattern:** [e.g., Clean Architecture with CQRS, Layered, Microservices]
- **Layers:** [e.g., Domain → Application → Infrastructure → Presentation]
- **Rule:** [e.g., UI never talks to database directly]

---

## Core Rules
1. **[Rule Category]:** [Specific rule]
2. **[Rule Category]:** [Specific rule]
3. **[Rule Category]:** [Specific rule]
4. **[Rule Category]:** [Specific rule]
5. **[Rule Category]:** [Specific rule]

**Examples:**
- **Async Everything:** All I/O operations use async/await
- **Error Handling:** Use Result\<T> pattern (no exceptions for flow control)
- **Dependency Injection:** Constructor injection always
- **Naming:** PascalCase for public, camelCase for private, _underscore for fields

---

## Active Sprint
- **Current Sprint:** [e.g., Sprint 3 - Technician Scheduling]
- **Focus Features:** See docs/context-engineering/FEATURES.md

---

## References
- **Detailed Stack:** docs/context-engineering/TECH_STACK.md
- **Architecture Deep Dive:** docs/context-engineering/ARCHITECTURE.md
- **Anti-Patterns:** docs/context-engineering/ANTI_PATTERNS.md
- **Code Examples:** examples/

---

## Participants to Use
- **@workspace** - For solution-wide questions
- **@terminal** - For Git/command-line help
- **#file** - To reference specific files

---

## Special Constraints
[List project-specific constraints]

**Examples:**
- No third-party UI libraries (Blazor components only)
- All dates must use UTC
- Sensitive data must be encrypted at rest
- Maximum API response time: 200ms
- Support IE11 (if applicable)

---

**Note for AI:** Read referenced docs before generating code. Always mimic patterns from examples/ folder.
