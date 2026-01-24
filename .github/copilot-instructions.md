# AI Instructions

## Purpose
This file provides specific operational instructions for the AI assistant ("GitHub Copilot") when working on the **Seapark Apartment Block E Utility Tracker** project.

## Key Project File Locations

The following important project files are located in the repository root:
- `Requirement.md` — Project requirements and scope
- `MasterPlan.md` — Master development plan and progress
- `README.md` — Project overview, deployment, and configuration
- `DESIGN.md` — System design, architecture, and feature log

## Operational Rules


### 0. Markdown Newline Format
**rule:** All markdown (`.md`) files generated or modified for this project **MUST** use CRLF (`\r\n`) as the newline format.

### 0.1 Markdown Indentation
**rule:** All markdown (`.md`) files generated or modified for this project **MUST** use **Tabs** (`\t`) for indentation instead of spaces.

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

