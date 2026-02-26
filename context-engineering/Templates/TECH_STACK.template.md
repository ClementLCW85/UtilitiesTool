# Technology Stack

**Purpose:** Detailed inventory of all technologies, frameworks, and libraries  
**When to Create:** Week 1 of Context Engineering setup  
**Owner:** Architect / Tech Lead  
**Location in Project:** [TECH STACK](docs/context-engineering/TECH_STACK.md)  
**Learn More:** [Core Concepts](../Core/03_Core_Concepts.md) § "Human-Readable Documentation"

---

## Backend

### Framework
- **Primary:** [e.g., .NET 10, Node.js 20, Python 3.12]
- **Version:** [Specific version]
- **Key Libraries:**

  - [Library 1]: [Purpose]
  - [Library 2]: [Purpose]
  - [Library 3]: [Purpose]

### API Framework
- [e.g., ASP.NET Core 10, Express.js, FastAPI]
- REST vs GraphQL: [Your choice]
- API Versioning: [Strategy]

### ORM / Data Access
- **Primary:** [e.g., Entity Framework Core 9, Dapper, Prisma]
- **Migrations:** [Tool/Strategy]
- **Connection Pooling:** [Enabled/Disabled]

---

## Frontend

### Framework
- **Primary:** [e.g., Blazor Server, React 18, Angular 17, Vue 3]
- **Version:** [Specific version]
- **State Management:** [e.g., Redux, MobX, Vuex, Blazor state]

### UI Library
- [e.g., Material UI, Ant Design, Tailwind CSS, Bootstrap]
- **Custom Components:** [Location/Library]

### Build Tools
- [e.g., Vite, Webpack, Parcel]
- **Bundler:** [Tool]
- **Transpiler:** [Tool]

---

## Database

### Primary Database
- **Type:** [e.g., SQL Server 2022, PostgreSQL 15, MongoDB 7]
- **Version:** [Specific version]
- **Connection String Format:** [Example]

### Caching
- **Technology:** [e.g., Redis 7, Memcached, In-Memory]
- **Strategy:** [e.g., Cache-aside, Write-through]
- **TTL Policy:** [Time-to-live settings]

### Message Queue (if applicable)
- **Technology:** [e.g., RabbitMQ, Azure Service Bus, Kafka]
- **Use Cases:** [When you use it]

---

## Testing

### Unit Testing
- **Framework:** [e.g., xUnit, NUnit, Jest, Pytest]
- **Mocking Library:** [e.g., NSubstitute, Moq, Sinon]
- **Coverage Target:** [e.g., 80%, 90%]
- **Coverage Tool:** [e.g., Coverlet, Istanbul]

### Integration Testing
- **Framework:** [e.g., xUnit + WebApplicationFactory, Supertest]
- **Database:** [e.g., Test containers, In-memory, SQLite]
- **API Testing:** [e.g., Postman, RestSharp, Superagent]

### E2E Testing
- **Framework:** [e.g., Playwright, Cypress, Selenium]
- **Browser Coverage:** [e.g., Chrome, Firefox, Edge]

---

## DevOps & Deployment

### CI/CD
- **Platform:** [e.g., GitLab CI, GitHub Actions, Azure DevOps]
- **Pipeline Location:** [e.g., `.gitlab-ci.yml`, `.github/workflows/`]

### Hosting
- **Environment:** [e.g., Azure App Service, AWS EC2, On-Premise]
- **Container:** [e.g., Docker, None]
- **Orchestration:** [e.g., Kubernetes, Docker Compose, None]

### Monitoring
- **APM:** [e.g., Application Insights, New Relic, Datadog]
- **Logging:** [e.g., Serilog, Log4Net, Winston]
- **Error Tracking:** [e.g., Sentry, Raygun]

---

## Security

### Authentication
- **Method:** [e.g., JWT, OAuth 2.0, Cookie-based]
- **Provider:** [e.g., Azure AD, Auth0, Custom]
- **Token Lifetime:** [Duration]

### Authorization
- **Model:** [e.g., Role-based, Claims-based, Policy-based]
- **Permissions:** [How managed]

### Encryption
- **At Rest:** [e.g., AES-256, Database TDE]
- **In Transit:** [e.g., TLS 1.3]
- **Secrets Management:** [e.g., Azure Key Vault, AWS Secrets Manager]

---

## External Dependencies

### Third-Party APIs
| API | Purpose | Authentication | Rate Limit |
|-----|---------|----------------|------------|
| [API Name] | [What it does] | [Method] | [Limit] |

### NuGet/NPM Packages
| Package | Version | Purpose | Critical? |
|---------|---------|---------|-----------|
| [Package Name] | [Version] | [Purpose] | Yes/No |

---

## Development Tools

### IDE
- **Primary:** [e.g., Visual Studio 2026, VS Code, JetBrains Rider]
- **Extensions:** [List key extensions]

### Version Control
- **System:** [e.g., Git]
- **Repository:** [e.g., GitLab, GitHub, Bitbucket]
- **Branching Strategy:** [e.g., GitFlow, Trunk-based]

### Package Manager
- **Backend:** [e.g., NuGet, npm, pip]
- **Frontend:** [e.g., npm, yarn, pnpm]

---

## Performance Targets

| Metric | Target | Measurement Tool |
|--------|--------|------------------|
| API Response Time | [e.g., < 200ms] | [e.g., Application Insights] |
| Page Load Time | [e.g., < 2s] | [e.g., Lighthouse] |
| Database Query Time | [e.g., < 50ms] | [e.g., SQL Profiler] |
| Concurrent Users | [e.g., 1000] | [e.g., Load testing tool] |

---

## Browser Support

| Browser | Minimum Version | Priority |
|---------|-----------------|----------|
| Chrome | [Version] | High |
| Firefox | [Version] | Medium |
| Edge | [Version] | High |
| Safari | [Version] | Medium |
| IE 11 | [Version] | Low / Not Supported |

---

## Notes

### Tech Stack Evolution
- **Planned Upgrades:** [List upcoming changes]
- **Deprecated Technologies:** [List what's being phased out]
- **Migration Timeline:** [When changes will happen]

### Team Training Needs

- [Technology 1]: [Who needs training, by when]
- [Technology 2]: [Who needs training, by when]

---

**Version:** 4.1.0  
**Last Updated:** [Date]  
**Next Review:** [Date + 3 months]
