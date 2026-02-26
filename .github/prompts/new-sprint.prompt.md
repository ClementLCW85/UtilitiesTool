# New Sprint Prompt

**Action:** Initialize a new sprint cycle by updating the sprint log, selecting features from the backlog, and setting up the feature tracking document according to project standards.

## Context Files
- `docs/SprintLog.md`: The central log for project sprints, velocity, and history.
- `docs/ProductBacklog.md`: The source for upcoming user stories and requirements.
- `docs/context-engineering/FEATURES.md`: The detailed tracking sheet for the active sprint's work.

## Instructions

### 1. Preparation
1.  **Analyze Backlog:** Scan `docs/ProductBacklog.md` to identify all items where the Status is **NOT** "Done" (e.g., "Pending" or empty).
2.  **Propose & Confirm:**
    -   Present the full list of "Not Done" items to the user.
    -   Suggest a specific set of items to include in the new sprint, ensuring they fit within standard sprint capacity (reference "Velocity Tracking" in `docs/SprintLog.md`).
    -   **Ask the user** to confirm or modify this selection before proceeding.
3.  **Set Goal:** Define a concise "Sprint Goal" based on the finalized list.

### 2. Archive Previous Sprint
1.  **Record History:** If there was an active sprint:
    -   Move the details from "Current Active Sprint" in `docs/SprintLog.md` to the bottom of the "Sprint History" section.
    -   Record the final status, completion date, and retrospective notes.
2.  **Archive Features:**
    -   Read the current content of `docs/context-engineering/FEATURES.md`.
    -   Create a new archive file in `docs/history/` named `features-[PREVIOUS_SPRINT_ID].md` (e.g., `features-spr01.md`).
    -   Write the content of `FEATURES.md` to this archive file.
    -   In `docs/SprintLog.md`, add a link to this new file under the archived sprint entry.

### 3. Initialize New Sprint
1.  **Update Sprint Log (`docs/SprintLog.md`):**
    -   Update the **Current Active Sprint** section:
        -   **Sprint ID:** Increment from the previous (e.g., SPR-02).
        -   **Status:** Change to "🏃 In Progress".
        -   **Duration:** Set start and end dates.
        -   **Goal:** Enter the defined goal.
        -   **Committed Items:** List the selected stories by ID and Title.
2.  **Update Feature Tracker (`docs/context-engineering/FEATURES.md`):**
    -   **Header:** Update the Sprint Name/ID and Goal.
    -   **Feature List:** Clear old table entries and populate with the new features selected from `ProductBacklog.md`.
    -   **Details:** Generate the preliminary "Technical Scope" and "Acceptance Criteria" sections for each new feature (based on the Backlog description).

### 4. Verification
-   Ensure `docs/ProductBacklog.md` items selected are reflected in the plan.
-   Confirm that `docs/SprintLog.md` accurately reflects the new active state.
-   Confirm `docs/context-engineering/FEATURES.md` contains only the new work items.