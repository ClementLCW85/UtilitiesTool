# Sprint Backlog

**Purpose:** Current sprint features with assignments and acceptance criteria  
**When to Create:** Sprint planning day (every sprint)  
**Owner:** Tech Lead  
**Location in Project:** [FEATURES](docs/context-engineering/FEATURES.md)  
**Learn More:** [Getting Started](../Core/02_Getting_Started.md) § "Your First Context-Engineered Sprint"

---

## Sprint [Number] - [Sprint Goal]

**Sprint Duration:** [Start Date] - [End Date]  
**Sprint Goal:** [One-sentence summary of what we're achieving]

---

## Features Overview

| Feature ID | Description | Owner | Complexity | Status |
|------------|-------------|-------|------------|--------|
| FEAT-001 | [Feature name] | [Name] | [1-5] | [Not Started/In Progress/Review/Done] |
| FEAT-002 | [Feature name] | [Name] | [1-5] | [Status] |
| FEAT-003 | [Feature name] | [Name] | [1-5] | [Status] |

---

## FEAT-001: [Feature Name]

### Overview
**Owner:** [Developer Name]  
**Complexity:** [1-5] (1=Trivial, 5=Very Complex)  
**Priority:** [High/Medium/Low]  
**Status:** [Not Started/In Progress/Review/Done]

### Description
[2-3 sentence description of what this feature does]

### User Story
**As a** [user type],  
**I want** [capability],  
**So that** [benefit].

### Acceptance Criteria
- [ ] AC-1: [Criterion 1]
- [ ] AC-2: [Criterion 2]
- [ ] AC-3: [Criterion 3]

### Technical Scope
**Affected Layers:** [e.g., API, Application, Domain, Infrastructure]  
**Affected Files:** [List key files or "See feature brief"]  
**Dependencies:** [Other features or external dependencies]

### Test Requirements
- [ ] Unit tests for: [Components]
- [ ] Integration tests for: [Scenarios]
- [ ] E2E tests for: [User flows]

### Estimated Effort
**Time:** [Hours/Days]  
**Risk Level:** [Low/Medium/High]

---

## FEAT-002: [Feature Name]

[Repeat structure for each feature]

---

## FEAT-003: [Feature Name]

[Repeat structure for each feature]

---

## Dependencies Visualization

```
FEAT-001 (Login)
    └─→ FEAT-002 (User Profile)
           └─→ FEAT-003 (Settings)
```

**Blockers:**

- [Feature X] is blocked by [Feature Y] because [reason]

---

## Sprint Capacity

### Team Capacity
| Team Member | Availability | Assigned Work | Remaining Capacity |
|-------------|--------------|---------------|---------------------|
| [Name] | [Hours] | [Features] | [Hours] |
| [Name] | [Hours] | [Features] | [Hours] |

### Velocity Tracking
**Previous Sprint Velocity:** [Story points/Features completed]  
**Current Sprint Commitment:** [Story points/Features]  
**Buffer:** [Percentage for unknowns]

---

## Technical Risks

| Risk | Feature | Likelihood | Impact | Mitigation |
|------|---------|------------|--------|------------|
| [Risk description] | FEAT-001 | High/Med/Low | High/Med/Low | [What we'll do] |

---

## Feature Brief Status

| Feature ID | Brief Generated | Brief Reviewed | Assigned | Started |
|------------|-----------------|----------------|----------|---------|
| FEAT-001 | ✅ | ✅ | ✅ | ✅ |
| FEAT-002 | ✅ | ✅ | ✅ | ⬜ |
| FEAT-003 | ✅ | ⬜ | ⬜ | ⬜ |

---

## Definition of Done

**For this sprint, a feature is "Done" when:**

- [ ] Code implemented and follows [examples](examples/README_examples.md) patterns
- [ ] No violations of [ANTI PATTERNS](ANTI_PATTERNS.md)
- [ ] All acceptance criteria met
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests passing
- [ ] PR reviewed and approved
- [ ] Merged to `main` branch
- [ ] QA tested in staging environment
- [ ] Documentation updated (if needed)
- [ ] No high/critical bugs

---

## Sprint Ceremonies

### Daily Standup
**Time:** [e.g., 9:00 AM daily]  
**Duration:** 15 minutes  
**Focus:** Blockers and progress

### Mid-Sprint Review
**Date:** [Day 5]  
**Purpose:** Course correction if needed

### Sprint Review
**Date:** [Last day]  
**Attendees:** [Team + Stakeholders]  
**Demo:** [What we'll show]

### Retrospective
**Date:** [Last day]  
**Format:** [e.g., Start/Stop/Continue]

---

## Metrics to Track

### Code Quality
- [ ] % commits following patterns
- [ ] Anti-pattern violations count
- [ ] Average PR review time

### Productivity
- [ ] Features completed vs. committed
- [ ] Velocity trend
- [ ] Bug escape rate

### Team Health
- [ ] Developer satisfaction scores
- [ ] Blocker frequency
- [ ] Context quality feedback

---

## Notes

### Scope Changes
[Document any mid-sprint changes here]

### Lessons Learned
[What worked/didn't work - fill during retro]

### Action Items for Next Sprint
[What to improve - fill during retro]

---

**Version:** 4.1.0  
**Last Updated:** [Date]  
**Sprint Retrospective:** [Link to retro doc or notes]
