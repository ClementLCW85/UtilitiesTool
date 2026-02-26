# Architecture Documentation

**Purpose:** Deep dive into architecture patterns, layer responsibilities, and design principles  
**When to Create:** Week 1 of Context Engineering setup  
**Owner:** Architect  
**Location in Project:** [ARCHITECTURE](docs/context-engineering/ARCHITECTURE.md)  
**Learn More:** [Core Concepts](../Core/03_Core_Concepts.md) § "Human-Readable Documentation"

---

## Overview

**Architecture Pattern:** [e.g., Clean Architecture, Layered, Microservices, CQRS, Event-Driven]

**Core Principle:** [One-sentence summary]

**Example:**
> We use Clean Architecture with CQRS to separate read and write concerns, ensuring domain logic stays pure and testable while infrastructure remains replaceable.

---

## Directory Structure

```
[YourProject]/
├── src/
│   ├── [Layer1]/           # [Description]
│   ├── [Layer2]/           # [Description]
│   ├── [Layer3]/           # [Description]
│   └── [Layer4]/           # [Description]
├── tests/
│   ├── Unit/
│   └── Integration/
└── docs/
```

**Example (Clean Architecture):**
```
YourProject.sln
├── src/
│   ├── Domain/             # Entities, Value Objects, Domain Events
│   ├── Application/        # Use Cases, Commands, Queries, Interfaces
│   ├── Infrastructure/     # Database, External APIs, File System
│   └── API/               # Controllers, DTOs, Middleware
├── tests/
│   ├── Domain.Tests/
│   ├── Application.Tests/
│   └── API.IntegrationTests/
└── docs/
```

---

## Layer Responsibilities

### [Layer 1 Name]

**Purpose:** [What this layer does]

**Contains:**

- [Component type 1]
- [Component type 2]
- [Component type 3]

**Dependencies:**

- ✅ Can reference: [List layers]
- ❌ Cannot reference: [List layers]

**Rules:**

- [Rule 1]
- [Rule 2]
- [Rule 3]

**Example (Domain Layer - Clean Architecture):**

**Purpose:** Contains enterprise business rules and domain logic.

**Contains:**

- Entities (e.g., `User`, `Order`, `Product`)
- Value Objects (e.g., `Email`, `Money`, `Address`)
- Domain Events (e.g., `OrderPlacedEvent`)
- Domain Services (e.g., `PricingService`)

**Dependencies:**

- ✅ Can reference: No other layers
- ❌ Cannot reference: Application, Infrastructure, API

**Rules:**

- No dependency on frameworks
- No I/O operations
- Pure business logic only
- All classes are testable without mocking

---

### [Layer 2 Name]

[Repeat structure for each layer]

---

## Data Flow

### Request Flow

```
[Start] → [Layer 1] → [Layer 2] → [Layer 3] → [Layer 4] → [End]
```

**Example (CQRS):**

```
HTTP Request → Controller → Mediator → Command Handler → Repository → Database
                                                              ↓
                                                        Domain Events
                                                              ↓
                                                         Event Handlers
```

### Response Flow

```
[End] ← [Layer 4] ← [Layer 3] ← [Layer 2] ← [Layer 1] ← [Start]
```

---

## Design Patterns Used

| Pattern | Where Applied | Purpose | Example |
|---------|---------------|---------|---------|
| [Pattern 1] | [Layer/Component] | [Why we use it] | [File/Class] |
| [Pattern 2] | [Layer/Component] | [Why we use it] | [File/Class] |

**Example:**

| Pattern | Where Applied | Purpose | Example |
|---------|---------------|---------|---------|
| Repository | Infrastructure | Abstract data access | `UserRepository.cs` |
| CQRS | Application | Separate reads/writes | `CreateUserCommand.cs` vs `GetUserQuery.cs` |
| Result<T> | All layers | Error handling without exceptions | `Result<User>` |
| Mediator | Application | Decouple request/handler | `IMediator.Send()` |

---

## Dependency Rules

### Dependency Flow

```
UI → Application → Domain
      ↓
 Infrastructure
```

**Key Principle:** [e.g., Dependencies point inward. Domain has no external dependencies.]

### Dependency Injection

**Container:** [e.g., Microsoft.Extensions.DependencyInjection, Autofac]

**Registration Location:** [e.g., `Program.cs`, `Startup.cs`]

**Lifetime Management:**
- Singleton: [When to use]
- Scoped: [When to use]
- Transient: [When to use]

---

## Cross-Cutting Concerns

### Logging

**Framework:** [e.g., Serilog, NLog, Log4Net]

**Log Levels:**

- **Trace:** [When to use]
- **Debug:** [When to use]
- **Info:** [When to use]
- **Warning:** [When to use]
- **Error:** [When to use]
- **Fatal:** [When to use]

**Log Sinks:** [e.g., Console, File, Application Insights]

---

### Error Handling

**Strategy:** [e.g., Result\<T> pattern, Exception handling middleware]

**Error Types:**

- **Validation Errors:** [How handled]
- **Business Rule Violations:** [How handled]
- **Infrastructure Failures:** [How handled]
- **Unhandled Exceptions:** [How handled]

**Example:**
```csharp
public class Result<T>
{
    public bool IsSuccess { get; set; }
    public T Value { get; set; }
    public string Error { get; set; }
}
```

---

### Security

**Authentication:** [Mechanism]

**Authorization:** [Strategy]

**Data Protection:**

- At rest: [Method]
- In transit: [Method]
- PII handling: [Approach]

---

### Performance

**Caching Strategy:** [Approach]

**Async/Await:** [Policy]

**N+1 Query Prevention:** [How avoided]

**Pagination:** [Default page size, max page size]

---

## Integration Patterns

### Database

**Access Method:** [e.g., EF Core, Dapper, ADO.NET]

**Connection Management:** [e.g., Per request, connection pooling]

**Transaction Strategy:** [e.g., Unit of Work, DbContext scope]

**Migrations:** [e.g., Code-first, Database-first, Manual scripts]

---

### External APIs

**HTTP Client:** [e.g., HttpClient, RestSharp]

**Retry Policy:** [e.g., Polly with exponential backoff]

**Circuit Breaker:** [Enabled/Disabled, Configuration]

**Timeout:** [Default timeout value]

---

### Messaging

**Message Broker:** [e.g., RabbitMQ, Azure Service Bus]

**Publishing:** [When and how]

**Consuming:** [Processing strategy]

**Dead Letter Queue:** [How handled]

---

## Testing Strategy

### Unit Tests

**Target:** [e.g., Domain and Application layers]

**Coverage Goal:** [e.g., 80%]

**Mocking:** [What gets mocked]

---

### Integration Tests

**Scope:** [e.g., API endpoints, Database interactions]

**Test Database:** [e.g., In-memory, Test containers]

**Data Seeding:** [Strategy]

---

### E2E Tests

**Scope:** [e.g., Critical user journeys]

**Tools:** [e.g., Playwright, Selenium]

**Frequency:** [e.g., Pre-release only]

---

## Architecture Decision Records (ADRs)

**See:** [DESIGN DECISIONS](docs/context-engineering/DESIGN_DECISIONS.md)

**Recent Decisions:**

1. [ADR-001]: [Title] - [Status]
2. [ADR-002]: [Title] - [Status]
3. [ADR-003]: [Title] - [Status]

---

## Diagrams

### Component Diagram

[Insert diagram or link to diagram file]

### Sequence Diagram (Example Flow)

[Insert diagram showing a typical request/response flow]

### Deployment Diagram

[Insert diagram showing production architecture]

---

## Common Questions

### Where does [X] belong?

**Business Logic:** Domain layer  
**Database Queries:** Infrastructure layer  
**API Endpoints:** API layer  
**Use Cases:** Application layer  

### Can Layer A reference Layer B?

Refer to the Dependency Rules section above.

### How do we handle [scenario]?

[Provide guidance for common architectural questions]

---

## Anti-Patterns to Avoid

**See:** [ANTI PATTERNS](docs/context-engineering/ANTI_PATTERNS.md) for complete list

**Architecture-Specific:**
- ❌ Domain layer depending on Infrastructure
- ❌ Business logic in Controllers
- ❌ Direct database calls from UI
- ❌ [Add your specific anti-patterns]

---

## Migration Path (If Applicable)

**Current State:** [Description]

**Target State:** [Description]

**Phases:**

1. [Phase 1]: [Timeline]
2. [Phase 2]: [Timeline]
3. [Phase 3]: [Timeline]

**Rules During Migration:**

- New code: Follow target architecture
- Old code: Refactor when touched
- Deprecation timeline: [Date]

---

**Version:** 4.1.0  
**Last Updated:** [Date]  
**Next Review:** [Date + 3 months]  
**Architect:** [Name]
