# Context Engineering Templates

**Version:** 4.1.0  
**Purpose:** Copy-paste ready templates for creating context files  
**For:** All team members implementing Context Engineering

---

## Overview

This folder contains all the template files you need to set up Context Engineering in your project. Each template is copy-paste ready with placeholder text that you should customize for your specific project.

**Important:** These are templates, not examples. For detailed explanations of when and why to use each file, see [Core Concepts](../Core/03_Core_Concepts.md).

---

## Quick Start

### First-Time Setup (30 minutes)

**Step 1:** Copy `copilot-instructions.template.md` to `.github/copilot-instructions.md`

**Step 2:** Copy `TECH_STACK.template.md` to [TECH STACK](docs/context-engineering/TECH_STACK.md)

**Step 3:** Copy `ARCHITECTURE.template.md` to [ARCHITECTURE](docs/context-engineering/ARCHITECTURE.md)

**Step 4:** Customize each file with your project details

**Step 5:** Test with: `@workspace Explain our architecture`

### As Needed

- `FEATURES.template.md` → Sprint planning day (every sprint)
- `ANTI_PATTERNS.template.md` → After identifying common mistakes
- `DESIGN_DECISIONS.template.md` → When making architectural decisions
- `api-instructions.template.md` → When you need path-specific rules

---

## Template Index

### Core Templates (Required)

| Template | Destination | When to Create | Owner |
|----------|-------------|----------------|-------|
| `copilot-instructions.template.md` | `.github/copilot-instructions.md` | Setup (Week 1) | Architect |
| `TECH_STACK.template.md` | [TECH STACK](docs/context-engineering/TECH_STACK.md) | Setup (Week 1) | Architect/Tech Lead |
| `ARCHITECTURE.template.md` | [ARCHITECTURE](docs/context-engineering/ARCHITECTURE.md) | Setup (Week 1) | Architect |

### Workflow Templates (As Needed)

| Template | Destination | When to Create | Owner |
|----------|-------------|----------------|-------|
| `FEATURES.template.md` | [FEATURES](docs/context-engineering/FEATURES.md) | Sprint planning | Tech Lead |
| `ANTI_PATTERNS.template.md` | [ANTI PATTERNS](docs/context-engineering/ANTI_PATTERNS.md) | After pattern violations emerge | Architect |
| `DESIGN_DECISIONS.template.md` | [DESIGN DECISIONS](docs/context-engineering/DESIGN_DECISIONS.md) | When making ADRs | Architect |

### Advanced Templates (Optional)

| Template | Destination | When to Create | Owner |
|----------|-------------|----------------|-------|
| `api-instructions.template.md` | `.github/instructions/api.instructions.md` | When path-specific rules needed | Tech Lead |

---

## Template Descriptions

### copilot-instructions.template.md

**Purpose:** The "autopilot" file that GitHub Copilot reads automatically for all code generation.

**What it contains:**

- Project overview (2-3 sentences)
- Tech stack summary
- Core architectural rules (top 5-10)
- References to detailed documentation

**Key features:**

- Auto-loaded by VS 2026 Copilot
- High-level rules only
- Points to detailed docs for more info

**Learn more:** [Core Concepts](../Core/03_Core_Concepts.md) § "AI-Native Files"

---

### TECH_STACK.template.md

**Purpose:** Detailed inventory of all technologies, frameworks, and libraries used in the project.

**What it contains:**

- Backend technologies
- Frontend frameworks
- Database systems
- Testing tools
- Deployment platforms
- Package dependencies

**Why it exists:** Prevents AI from suggesting wrong libraries or outdated patterns.

**Learn more:** [Core Concepts](../Core/03_Core_Concepts.md) § "Human-Readable Documentation"

---

### ARCHITECTURE.template.md

**Purpose:** Deep dive into your architecture patterns, layer responsibilities, and design principles.

**What it contains:**

- Architecture pattern (e.g., Clean Architecture, CQRS)
- Layer definitions and responsibilities
- Data flow diagrams
- Integration patterns
- Security architecture

**Why it exists:** Guides AI and developers on where code belongs and how components interact.

**Learn more:** [Core Concepts](../Core/03_Core_Concepts.md) § "Human-Readable Documentation"

---

### FEATURES.template.md

**Purpose:** Current sprint backlog with feature assignments and acceptance criteria.

**What it contains:**

- Feature IDs and descriptions
- Assigned owners
- Complexity estimates
- Dependencies
- Acceptance criteria

**Why it exists:** Gives AI context about what the team is currently building.

**Learn more:** [Getting Started](../Core/02_Getting_Started.md) § "Your First Context-Engineered Sprint"

---

### ANTI_PATTERNS.template.md

**Purpose:** "Do not do this" list documenting common mistakes and why they're problematic.

**What it contains:**

- Anti-patterns discovered in your codebase
- Why each is problematic
- Correct alternative approaches
- Examples of violations

**Why it exists:** Helps AI and juniors avoid repeating past mistakes.

**Learn more:** [Core Concepts](../Core/03_Core_Concepts.md) § "Human-Readable Documentation"

---

### DESIGN_DECISIONS.template.md

**Purpose:** Architecture Decision Records (ADRs) documenting significant technical decisions.

**What it contains:**

- Decision context and problem
- Options considered
- Chosen solution and rationale
- Consequences and tradeoffs

**Why it exists:** Preserves architectural knowledge and reasoning over time.

**Learn more:** [Architect Playbook](../Playbooks/Architect_Playbook.md) § "Architecture Decision Records"

---

### api-instructions.template.md

**Purpose:** Path-specific rules that apply only to certain files (e.g., API controllers).

**What it contains:**

- File pattern matcher (e.g., `**/Controllers/*.cs`)
- Specific rules for that file type
- Code examples
- Anti-patterns for that context

**Why it exists:** Allows fine-grained control over AI behavior in specific parts of the codebase.

**Learn more:** [Core Concepts](../Core/03_Core_Concepts.md) § "AI-Native Files"

---

## Usage Workflow

### 1. Copy Template

```bash
# Example: Creating your copilot instructions
cp Templates/copilot-instructions.template.md .github/copilot-instructions.md
```

### 2. Open and Customize

Replace all placeholder text:
- `[Project Name]` → Your actual project name
- `[Tech stack items]` → Your actual technologies
- `[Architecture pattern]` → Your actual pattern
- Remove any sections that don't apply

### 3. Validate

Test the file with AI:
```
@workspace Based on our copilot instructions, explain our architecture.
```

If AI gives vague answers → add more detail.  
If AI gives accurate answers → you're done!

### 4. Maintain

Update context files when:
- Tech stack changes (new packages, frameworks)
- Architecture evolves (new patterns, layers)
- Sprints change (update FEATURES.md)
- Decisions are made (add to DESIGN_DECISIONS.md)

---

## Tips for Effective Templates

### ✅ DO THIS

**Be Specific:**

- ❌ "Use dependency injection"
- ✅ "Always use constructor injection with IServiceProvider"

**Give Examples:**

- ❌ "Follow our patterns"
- ✅ "MIMIC examples/controller_pattern.cs"

**Link to Docs:**

- ❌ "See architecture document"
- ✅ "See docs/context-engineering/ARCHITECTURE.md § Layer Responsibilities"

**Keep Current:**

- Review quarterly
- Update when tech stack changes
- Add new patterns as they emerge

### ❌ DON'T DO THIS

**Don't Over-Document:**

- Keep copilot-instructions.md under 100 lines
- Save details for ARCHITECTURE.md and TECH_STACK.md

**Don't Copy-Paste Without Customization:**

- Templates have `[placeholders]` for a reason
- AI will generate nonsense if you don't customize

**Don't Create Files You Won't Maintain:**

- Start with the 3 core templates
- Add others as needed
- Dead documentation is worse than no documentation

**Don't Duplicate Information:**

- copilot-instructions.md = high-level summary
- Detailed docs = TECH_STACK.md, ARCHITECTURE.md
- Don't repeat the same content in multiple files

---

## Troubleshooting

### Problem: AI still generates wrong code

**Solution 1:** Check if copilot-instructions.md is in the right location (`.github/` folder)  
**Solution 2:** Verify VS 2026 has "Enable custom instructions" turned on  
**Solution 3:** Add more specific rules to the relevant template  
**Solution 4:** Use path-specific instructions (api-instructions.template.md)

### Problem: Templates feel overwhelming

**Solution:** Start with just 3 files:
1. copilot-instructions.template.md
2. TECH_STACK.template.md
3. ARCHITECTURE.template.md

Add others as you encounter the need.

### Problem: Context files are outdated

**Solution:** Assign a "Context Champion" who owns quarterly updates.

### Problem: Team doesn't use the context files

**Solution:** Make them part of the workflow:
- Feature briefs reference FEATURES.md
- PR reviews check ANTI_PATTERNS.md
- Onboarding requires reading ARCHITECTURE.md

---

## Customization Examples

### Example 1: .NET Microservices Project

**copilot-instructions.md:**
```markdown
# Project: Order Management System

## Overview
Microservices architecture for e-commerce order processing.

## Stack
- Backend: .NET 10, ASP.NET Core, RabbitMQ
- Frontend: React 18, TypeScript
- Database: PostgreSQL 15, Redis

## Architecture
- Pattern: Domain-Driven Design (DDD) + CQRS
- Layers: API → Application → Domain → Infrastructure
- Communication: Event-driven via RabbitMQ

## Core Rules
1. Commands go through MediatR
2. All events published to RabbitMQ
3. Repositories use UnitOfWork pattern
4. API returns Result<T> (no exceptions)
```

### Example 2: Monolithic Legacy App

**copilot-instructions.md:**
```markdown
# Project: Legacy CRM System

## Overview
Monolithic ASP.NET application being modernized incrementally.

## Stack
- Backend: .NET Framework 4.8, Web Forms
- Database: SQL Server 2019
- Testing: MSTest, Moq

## Architecture
- Pattern: Layered monolith (transitioning to Clean)
- Current: UI → Business Logic → Data Access
- Target: Presentation → Application → Domain → Infrastructure

## Core Rules
1. New code: Use .NET Core patterns
2. Old code: Refactor when touched
3. No new Web Forms pages (use Blazor)
4. Tests required for all new code
```

---

## Governance & Methodology Alignment

**For Architects:** If your organization uses the HTC Development Framework alongside Context Engineering, consult [HTC Conflicts Discussion Document](../Governance/HTC_Conflicts_Discussion_Document.md) for guidance on:
- Harmonizing HTC's formal governance with Context Engineering's agile approach
- Deciding when to use HTC workflows vs. Context Engineering workflows
- Resolving conflicts between methodologies

Context Engineering V4.1.1 incorporates complementary HTC workflows (Customization, Code Review, Sprint Planning, Retrofitting Tests) that enhance, rather than replace, core Context Engineering practices. Teams can adopt either methodology independently or use both together with clear boundaries.

---

## Version History

### Version 4.1.1 (January 2026)
- Added HTC governance reference for methodology alignment
- Cross-referenced new V4.1.1 workflows (Customization, Code Review, Sprint Planning, Brownfield Testing)

### Version 4.1.0
- Initial template collection
- 7 templates covering all common scenarios
- Aligned with Core/ documentation

---

## Read Next

- **Setup Guide:** [Getting Started](../Core/02_Getting_Started.md) § "GitLab Repository Structure"
- **Concept Explanations:** [Core Concepts](../Core/03_Core_Concepts.md)
- **First Sprint:** [Getting Started](../Core/02_Getting_Started.md) § "Your First Context-Engineered Sprint"
- **Maintenance:** [Success Metrics](../Reference/Success_Metrics.md) (to be created in Session 6)

---

**Version:** 4.1.1  
**Last Updated:** January 15, 2026  
**Maintained By:** Context Engineering Team
