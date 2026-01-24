# Commit and Push Changes Prompt

**Action:** Run the code formatting script before any git actions, then stage, commit, and push changes with a feature log summary as per project rules.

## Instructions
1. Run the formatting script: `powershell -ExecutionPolicy Bypass -File tools/format_files.ps1`
2. Stage all modified files for commit.
3. Use a commit message that summarizes the changes made, referencing the relevant feature/user story (e.g., PAY-4 Public Payment Submission).
4. After committing, push the changes to the remote repository (origin/master).
5. Ensure all markdown files use CRLF line endings and spaces for indentation as per project rules.
6. Consult `DESIGN.md` Section 8 (Feature Log) and append a summary of currently available features to the commit message as required by `.github/copilot-instructions.md`.

**Use a standard LLM in Agent Mode for this task to ensure git commands are executed sequentially.**

## Action
1. Run the formatting script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File tools/format_files.ps1
   ```
2. Stage all changes:
   ```shell
   git add .
   ```
3. Commit with a message that includes a feature log summary from `DESIGN.md` Section 8.
4. Push to `origin/master`.

## Example Commit Message Format
```
PAY-4 Public Payment Submission: Implemented public payment form, Drive upload, and Firestore integration.

---
**Current System Capabilities:**
- Core Infrastructure & Auth (Available)
- Bill Management: Create, Read, Update, Delete, Auto-Calc (Available)
- Payment Recording (Available)
- Public Payment Submission (Available)
- Dashboard & Visualization (Available)
- Unit Status Management (Available)
- Manual Threshold Override (Available)
- Data Export (Available)
