# AI Instructions

## Purpose
This file provides specific operational instructions for the AI assistant ("GitHub Copilot") when working on the **Seapark Apartment Block E Utility Tracker** project.

## Project File & Folder Structure

- **Root Directory**: Contains all main project files and documentation.
    - `Requirement.md` — Project requirements and scope
    - `MasterPlan.md` — Master development plan and progress
    - `README.md` — Project overview, deployment, and configuration
    - `DESIGN.md` — System design, architecture, and feature log
    - `ProductBacklog.md` — Product backlog and user stories
    - `DEPLOY_INSTRUCTIONS.md` — Deployment and integration instructions
    - `fix_eol.ps1` — Script for normalizing EOL in markdown files
- **js/**: All JavaScript source files (frontend logic, models, database, authentication, Drive integration)
- **css/**: Stylesheets for the web application
- **google-apps-script/**: Google Apps Script backend code for Drive proxy uploads
- **tools/**: Utility scripts for formatting and enforcing code standards (e.g., `format_files.ps1`)
- **.github/**: GitHub-specific configuration and automation
    - `copilot-instructions.md` — This file (AI operational rules)
    - **prompts/**: All prompt files for Copilot and automation triggers (e.g., `commit-and-push.prompt.md`, `ai-task-trigger.prompt.md`, `format-code.prompt.md`). **All prompt files must be placed in this folder.**
    - **workflows/**: GitHub Actions workflow files (e.g., `deploy.yml`)

## Operational Rules

### 0. Code Formatting & Standards (Strict)
**trigger:** Whenever any file is created or modified.
**action:** You **MUST** ensure the following standards are applied. After making edits, you SHOULD run `powershell -File tools/format_files.ps1` to enforce compliance.

#### Markdown (`.md`)
- **Indentation:** Spaces (Use 4 spaces).
- **Line Sequence:** CRLF (`\r\n`).
- **Encoding:** UTF-8.

#### JavaScript (`.js`)
- **Indentation:** 2 Spaces.
- **Line Sequence:** CRLF (`\r\n`).
- **Encoding:** UTF-8.
- **EOF:** File must end with a single CRLF newline character.

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

