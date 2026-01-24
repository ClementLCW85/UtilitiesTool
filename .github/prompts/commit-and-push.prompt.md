# Commit and Push Changes Prompt

**Action:** Run the code formatting script before any git actions, then stage, commit, and push changes with a feature log summary as per project rules.

## Instructions
1. Run the formatting script: `powershell -ExecutionPolicy Bypass -File tools/format_files.ps1`
2. Stage all modified files for commit.
3. Use a commit message that summarizes the changes made, referencing the relevant feature/user story.
4. **IMPORTANT**: When constructing the `git commit` command, avoid using characters that may break the shell command line (like unescaped quotes or specific special characters causing parsing errors). If complex messages or special characters (like `:`) are needed, prefer writing the message to a temporary file (e.g., `.git-commit-msg`) and using `git commit -F .git-commit-msg` to ensure safety and correctness.
5. After committing, push the changes to the remote repository (origin/master).
6. Ensure all markdown files use CRLF line endings and spaces for indentation as per project rules.
7. Consult `DESIGN.md` Section 8 (Feature Log) and append a summary of currently available features to the commit message as required by `.github/copilot-instructions.md`.

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
3. Prepare the commit message securely (using a file to avoid partial command execution errors):
   - Create `.git-commit-msg` with the full message (including the Feature Log).
   - Run: `git commit -F .git-commit-msg`
   - Remove the temporary file: `rm .git-commit-msg` (or `Remove-Item` in PowerShell)
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
