# Format Codebase Trigger

**Action:** Execute the project's code formatting script to enforce standards (CRLF/Spaces for MD, LF/2 Spaces for JS).

## Context Files
- `tools/format_files.ps1`: The PowerShell script that performs the formatting.
- `.github/copilot-instructions.md`: Defines the standards being enforced.

## Instructions
1. Open a terminal in the project root.
2. Run the following command:
   ```powershell
   powershell -ExecutionPolicy Bypass -File tools/format_files.ps1
   ```
3. Report the output (which files were formatted).

