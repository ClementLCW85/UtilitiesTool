# Anti-Patterns: What NOT to Do

**Purpose:** Document common mistakes and why they're problematic  
**When to Create:** After identifying recurring code smells  
**Owner:** Architect  
**Location in Project:** [ANTI PATTERNS](docs/context-engineering/ANTI_PATTERNS.md)  
**Learn More:** [Core Concepts](../Core/03_Core_Concepts.md) § "Human-Readable Documentation"

---

## Overview

This document catalogs patterns we've learned to avoid. Each anti-pattern includes:
- **What it is** (description)
- **Why it's bad** (consequences)
- **What to do instead** (correct approach)
- **Example** (code reference)

**Remember:** These are lessons learned, not accusations. We document them to prevent future mistakes.

---

## Anti-Pattern Template

### AP-[Number]: [Anti-Pattern Name]

**Category:** [Architecture/Code Quality/Performance/Security]

**What it is:**
[Clear description of the anti-pattern]

**Why it's bad:**

- [Consequence 1]
- [Consequence 2]
- [Consequence 3]

**What to do instead:**
[Correct approach]

**Example Violation:**
```[language]
// ❌ BAD: [Explanation]
[code example showing the anti-pattern]
```

**Correct Approach:**
```[language]
// ✅ GOOD: [Explanation]
[code example showing the correct pattern]
```

**How to Detect:**
[Signs this anti-pattern exists in code]

**Refactoring Effort:** [Low/Medium/High]

---

## Architecture Anti-Patterns

### AP-001: Business Logic in Controllers

**Category:** Architecture

**What it is:**
Putting business rules, calculations, or domain logic directly in API controllers or UI layers.

**Why it's bad:**

- Cannot reuse logic across different entry points (API, CLI, background jobs)
- Hard to unit test (requires mocking HTTP context)
- Violates Single Responsibility Principle
- Couples business rules to framework

**What to do instead:**
Move logic to Application or Domain layer. Controllers should only orchestrate.

**Example Violation:**
```csharp
// ❌ BAD: Business logic in controller
[HttpPost]
public IActionResult CreateOrder(OrderDto dto)
{
    // Calculating price in controller
    var total = dto.Items.Sum(i => i.Price * i.Quantity);
    if (dto.CouponCode == "SAVE20")
        total *= 0.8m;
    
    var order = new Order { Total = total };
    _db.Orders.Add(order);
    _db.SaveChanges();
    
    return Ok(order);
}
```

**Correct Approach:**
```csharp
// ✅ GOOD: Business logic in service/domain layer
[HttpPost]
public async Task<IActionResult> CreateOrder(CreateOrderCommand command)
{
    var result = await _mediator.Send(command);
    return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
}

// In Application layer:
public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, Result<Order>>
{
    public async Task<Result<Order>> Handle(CreateOrderCommand request)
    {
        var order = Order.Create(request.Items, request.CouponCode);
        await _repository.AddAsync(order);
        return Result.Success(order);
    }
}
```

**How to Detect:**

- Controllers with >20 lines of code per action
- `if` statements in controllers
- Math calculations in controllers
- Direct `_db` calls in controllers

**Refactoring Effort:** Medium

---

### AP-002: [Your Anti-Pattern]

[Repeat structure for each anti-pattern]

---

## Code Quality Anti-Patterns

### AP-010: Magic Strings and Numbers

**Category:** Code Quality

**What it is:**
Using hardcoded strings or numbers without explanation or constants.

**Why it's bad:**

- No IntelliSense support
- Typos cause runtime bugs
- Hard to find all usages
- Unclear intent

**What to do instead:**
Use constants, enums, or configuration.

**Example Violation:**
```csharp
// ❌ BAD
if (user.Role == "admin")
{
    SendEmail(user.Email, "Welcome!", "account-created");
}
```

**Correct Approach:**
```csharp
// ✅ GOOD
public static class Roles
{
    public const string Admin = "admin";
    public const string User = "user";
}

public static class EmailTemplates
{
    public const string AccountCreated = "account-created";
}

if (user.Role == Roles.Admin)
{
    SendEmail(user.Email, "Welcome!", EmailTemplates.AccountCreated);
}
```

**How to Detect:**

- String literals in business logic
- Unexplained numbers (other than 0, 1, -1)

**Refactoring Effort:** Low

---

### AP-011: [Your Anti-Pattern]

[Continue pattern...]

---

## Performance Anti-Patterns

### AP-020: N+1 Query Problem

**Category:** Performance

**What it is:**
Loading a list of entities, then querying related data in a loop.

**Why it's bad:**

- 1 query for parent + N queries for children = Massive overhead
- Database connection spam
- Slow response times

**What to do instead:**
Use `.Include()` (EF Core) or JOIN queries to load related data in one trip.

**Example Violation:**
```csharp
// ❌ BAD: 1 + N queries
var orders = await _db.Orders.ToListAsync();
foreach (var order in orders)
{
    // Separate query for EACH order!
    var customer = await _db.Customers.FindAsync(order.CustomerId);
    order.CustomerName = customer.Name;
}
```

**Correct Approach:**
```csharp
// ✅ GOOD: 1 query total
var orders = await _db.Orders
    .Include(o => o.Customer)
    .ToListAsync();
```

**How to Detect:**

- Slow API responses
- Database query logs showing repeated queries
- Loop with `await` or `.Result` inside

**Refactoring Effort:** Low

---

### AP-021: [Your Anti-Pattern]

[Continue pattern...]

---

## Security Anti-Patterns

### AP-030: Trusting User Input

**Category:** Security

**What it is:**
Using user input directly in queries, file paths, or system commands without validation/sanitization.

**Why it's bad:**

- SQL injection risk
- Path traversal attacks
- Command injection
- Data breaches

**What to do instead:**
Always validate, sanitize, and parameterize user input.

**Example Violation:**
```csharp
// ❌ BAD: SQL injection risk
var userId = Request.Query["id"];
var query = $"SELECT * FROM Users WHERE Id = {userId}";
var user = _db.ExecuteQuery(query);
```

**Correct Approach:**
```csharp
// ✅ GOOD: Parameterized query
var userId = int.Parse(Request.Query["id"]);
var user = await _db.Users.FindAsync(userId);
```

**How to Detect:**

- String concatenation with user input
- `$"SQL {variable}"` patterns
- File paths using Request data

**Refactoring Effort:** Medium (requires security review)

---

### AP-031: [Your Anti-Pattern]

[Continue pattern...]

---

## Testing Anti-Patterns

### AP-040: Testing Implementation Instead of Behavior

**Category:** Testing

**What it is:**
Tests that verify internal details rather than public outcomes.

**Why it's bad:**

- Brittle tests that break with refactoring
- False sense of security
- Slows down development

**What to do instead:**
Test public interfaces and outcomes, not private methods.

**Example Violation:**
```csharp
// ❌ BAD: Testing internal method
[Fact]
public void ValidateEmail_WithInvalidEmail_ReturnsFalse()
{
    var service = new UserService();
    var result = service.ValidateEmail("invalid");  // Private method exposed for testing
    Assert.False(result);
}
```

**Correct Approach:**
```csharp
// ✅ GOOD: Testing public behavior
[Fact]
public async Task CreateUser_WithInvalidEmail_ReturnsValidationError()
{
    var service = new UserService();
    var result = await service.CreateUserAsync("invalid", "password");
    Assert.False(result.IsSuccess);
    Assert.Contains("email", result.Error.ToLower());
}
```

**How to Detect:**

- Tests calling private methods
- Tests verifying mock calls excessively
- Tests breaking when refactoring

**Refactoring Effort:** Medium

---

### AP-041: [Your Anti-Pattern]

[Continue pattern...]

## Project-Specific Anti-Patterns

[Add anti-patterns specific to your project/domain]

---

## Deprecated Patterns

[List patterns you used to use but have now replaced]

### DEPRECATED: [Old Pattern Name]

**Was used for:** [Purpose]  
**Deprecated on:** [Date]  
**Replaced with:** [New pattern]  
**Migration deadline:** [Date]

---

## How to Use This Document

### During Development
Before writing code, review relevant categories:

- Starting new feature? Check Architecture
- Writing queries? Check Performance
- Handling user input? Check Security

### During Code Review
Use this as a checklist:
```
@workspace Review this PR against docs/context-engineering/ANTI_PATTERNS.md.
Flag any violations.
```

### During Refactoring
Prioritize fixing high-impact anti-patterns first.

---

## Anti-Pattern Summary

| ID | Name | Category | Impact | Refactoring Effort |
|----|------|----------|--------|---------------------|
| AP-001 | Business Logic in Controllers | Architecture | High | Medium |
| AP-010 | Magic Strings | Code Quality | Medium | Low |
| AP-020 | N+1 Queries | Performance | High | Low |
| AP-030 | Trusting User Input | Security | Critical | Medium |
| AP-040 | Testing Implementation | Testing | Medium | Medium |

---

**Version:** 4.1.0  
**Last Updated:** [Date]  
**Next Review:** [Date + 3 months]  
**Violations This Sprint:** [Count]
