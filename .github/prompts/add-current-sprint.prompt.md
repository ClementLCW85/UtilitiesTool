# Add to Current Sprint Prompt

**Action:** Review pending backlog items and assist the user in adding them to the currently active sprint.

## Context Files
- `docs/ProductBacklog.md`: The source for upcoming user stories.
- `docs/context-engineering/FEATURES.md`: The active sprint's feature list.
- `docs/SprintLog.md`: The project sprint log.

## Instructions

### 1. Analyze Status
1.  **Scan Backlog:** Read `docs/ProductBacklog.md` and identify all items where `Status` is **NOT** "Done".
2.  **Check Active Sprint:** Read `docs/context-engineering/FEATURES.md` to check which items are already included in the active sprint.
3.  **Identify Candidates:** Filter for items that are **Not Done** and **Not currently in the active sprint**.

### 2. User Interaction (Proposal)
1.  **List Candidates:** Display the list of all "Not Done" backlog items that are not yet in the sprint.
2.  **Suggestion:** Recommend specific items to add based on Priority (High first) and Dependencies.
3.  **Prompt:** Ask the user: "Which of these items would you like to add to the current sprint?"

### 3. Execution (On Confirmation)
1.  **Update `docs/context-engineering/FEATURES.md`:**
    -   Add the selected items to the "Features Overview" table.
    -   Append detailed sections (allocating Owner, Complexity, Description, User Story, Acceptance Criteria, Tech Scope) for each new item.
2.  **Update `docs/SprintLog.md`:**
    -   Append the added items to the "Committed Items" list of the Current Active Sprint to track scope changes.
