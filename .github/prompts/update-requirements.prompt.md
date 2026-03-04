# Update Requirements Prompt

**Action:** Update the specified documentation files with the provided changes, ensuring consistency across the project regarding the new feature or fix.

## Instructions
1.  **Analyze the Request:** Understand the new feature, fix, or modification being introduced.
2.  **Product Backlog:** Update `ProductBacklog.md` if the change involves a new requirement or user story. Add a new row to the table in the appropriate Epic section.
3.  **Architecture Docs:** Update `docs/context-engineering/ARCHITECTURE.md` if the change affects the system architecture, database schema, or UI/UX.
    *   **Feature Log:** If the feature is completed, update `docs/context-engineering/FEATURES.md` to mark the feature status as "Done".
4.  **Requirements:** Update `Requirement.md` if the fundamental project requirements have changed.
5.  **README:** Update `README.md` if the changes affect deployment, configuration, or general usage instructions.
6.  **Deploy Instructions:** Update `DEPLOY_INSTRUCTIONS.md` if the changes affect the deployment process (e.g., Google Apps Script).
7.  **Context Engineering:** Do NOT update `docs/context-engineering/FEATURES.md`. New requirements do not automatically belong to the current active sprint.
8.  **Format:** Ensure all markdown files follow the project's formatting standards (CRLF line endings, 4-space indentation).
9.  **Plan:** Create a plan to update the files sequentially.

## Example Usage
**User:** "I've added a new feature to allow users to export data as CSV."
**Action:**
1.  **ProductBacklog.md:** Add "ADM-4 Data Export (CSV)" to Epic 5.
2.  **ARCHITECTURE.md:** Update `docs/context-engineering/ARCHITECTURE.md` if the feature affects system architecture.
3.  **FEATURES.md:** Update `docs/context-engineering/FEATURES.md` to mark "ADM-4" as "Done" when complete.
4.  **README.md:** Add a section on how to use the export feature (if necessary).
5.  **Execute:** Update the files.

## Action
1.  Read the relevant documentation files (`ProductBacklog.md`, `ARCHITECTURE.md`, `FEATURES.md`, etc.).
2.  Identify the sections that need to be updated.
3.  Draft the changes.

