# AI Task Trigger

**Action:** Use the most advanced available planning and reasoning LLM model to execute the next active task defined in `docs/context-engineering/FEATURES.md`.

## Context Files
- `docs/SprintLog.md`: Tracks sprint progress and active sprint goal.
- `docs/context-engineering/FEATURES.md`: Contains the list of active features and their status.
- `docs/ProductBacklog.md`: Contains detailed requirements for the task.
- `DESIGN.md`: Architecture and current feature state.
- `INSTRUCTION.md`: Operational rules for development.

## Instructions
1. Read `docs/SprintLog.md` to confirm the active sprint context.
2. Read `docs/context-engineering/FEATURES.md` to identify the **Active Task** and its acceptance criteria.
3. Read `docs/ProductBacklog.md` for any additional user story context.
4. Ensure implementation details align with `DESIGN.md`.
5. Follow the workflow rules in `INSTRUCTION.md` (e.g., updating feature logs).
6. Generate a plan and proceed with implementation using the best available planning and reasoning LLM model.
7. Upon completion:
   - Mark the task as `Done` in `docs/context-engineering/FEATURES.md`.
   - Update `docs/SprintLog.md` with progress (e.g. updated velocity or completed story count).
   - Commit the changes (including `docs/context-engineering/FEATURES.md` and `docs/SprintLog.md`).

