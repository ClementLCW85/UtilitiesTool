# API Controller Standards

**Purpose:** Path-specific rules that apply ONLY to API controllers  
**When to Create:** When you need different rules for specific file types  
**Owner:** Tech Lead  
**Location in Project:** `.github/instructions/api.instructions.md`  
**Learn More:** [Core Concepts](../Core/03_Core_Concepts.md) § "AI-Native Files (.github/ folder)"

---
description: "API Controller Standards"
applyTo: "**/Controllers/*.cs"
---

## Structure Template

```csharp
[ApiController]
[Route("api/[controller]")]
public class [Entity]Controller : BaseController
{
    private readonly IMediator _mediator;
    
    public [Entity]Controller(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> Get[Entity](int id)
    {
        var result = await _mediator.Send(new Get[Entity]Query { Id = id });
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }
}
```

---

## Requirements

1. **Inheritance:** Must inherit from `[BaseController class name]`
2. **Return Types:** Always use `IActionResult` or `ActionResult<T>`
3. **Routing:** [e.g., Attribute routing only, Convention-based]
4. **Validation:** [e.g., Let FluentValidation handle it, Manual validation required]
5. **Error Handling:** [e.g., Use Result\<T> pattern, map to HTTP status codes]

---

## Patterns to Follow

- **MIMIC:** examples/controller_pattern.cs
- **Reference:** docs/context-engineering/ARCHITECTURE.md section "[Layer Name]"

---

## Common Anti-Patterns

- ❌ Business logic in controllers
- ❌ Direct database access
- ❌ Try-catch blocks (use Result\<T>)
- ❌ Synchronous I/O
- ❌ [Add your project-specific anti-patterns]

---

## HTTP Status Code Mapping

| Scenario | Status Code | Example |
|----------|-------------|---------|
| Success | 200 OK | Resource retrieved |
| Created | 201 Created | New resource created |
| No Content | 204 No Content | Successful delete |
| Bad Request | 400 Bad Request | Validation failed |
| Unauthorized | 401 Unauthorized | Authentication required |
| Forbidden | 403 Forbidden | Insufficient permissions |
| Not Found | 404 Not Found | Resource doesn't exist |
| Conflict | 409 Conflict | Duplicate resource |
| Server Error | 500 Internal Server Error | Unhandled exception |

---

## Authentication & Authorization

[Specify your auth requirements]

**Example:**
```csharp
[Authorize(Roles = "Admin")]
[HttpDelete("{id}")]
public async Task<IActionResult> Delete[Entity](int id)
{
    // Implementation
}
```

---

## Response Format

[Specify your API response format]

**Example:**
```json
{
  "data": { ... },
  "success": true,
  "errors": [],
  "timestamp": "2026-01-14T10:30:00Z"
}
```

---

**Note:** These rules apply ONLY to files matching the `applyTo` pattern above.
