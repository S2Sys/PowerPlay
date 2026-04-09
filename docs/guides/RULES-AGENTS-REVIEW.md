# PowerPlay v2.7.0 — Rules, Agents & Skills Review & Recommendations

**Date**: 2026-04-09  
**Status**: Comprehensive Review & Gap Analysis  
**Versions Reviewed**: v1.0.0 → v2.7.0

---

## Executive Summary

PowerPlay v2.7.0 has **54 rules** and **63 prompts/agents** across 9 incremental versions. This document:

1. **Assesses current coverage** across SDLC phases (6) × tech stacks (9+)
2. **Identifies coverage gaps** and weak areas
3. **Recommends new rules & agents** to complete the stack
4. **Maps rules to SDLC workflows** for each tech stack
5. **Suggests v2.8.0+ roadmap** for remaining capabilities

---

## Part 1: Current Coverage Analysis

### Rules Inventory (54 total)

#### Core & Foundational (6)
- `smartworkz-core` — Stack standards (.NET 8, Angular 17+, SQL Server 2022, Azure, AWS)
- `security-always` — Secret management, parameterised queries, input sanitisation
- `performance-audit` — SQL, C#, TypeScript optimization standards
- `memory-management` — IDisposable, event handler leaks, weak references
- `async-best-practices` — No .Result/.Wait(), CancellationToken, ConfigureAwait(false)
- `error-handling-advanced` — Custom exceptions, ProblemDetails RFC 7807, correlation IDs

#### Backend (.NET) (5)
- `dotnet-rules` — Controllers, services, repositories, validation, async
- `testing-pyramid` — 70/20/10 unit/integration/e2e ratio, AAA pattern
- `documentation-standards` — XML docs, JSDoc, README files
- `deployment-safety` — Config, health checks, Docker, CI gates, rollback
- `ci-cd-standards` — Build gates, automated testing, merge requirements

#### Frontend (Angular) (4)
- `angular-rules` — Standalone components, inject(), OnPush, signals, typed forms
- `accessibility` — WCAG 2.1 AA, ARIA labels, keyboard navigation, color contrast
- `performance-budget` — Bundle size limits, lazy loading, change detection optimization
- `accessibility-wcag` — Semantic HTML, focus management, screen reader testing

#### SQL & Data (2)
- `sql-rules` — SET NOCOUNT ON, parameterised queries, NOLOCK, set-based ops, SARGable clauses
- `database-design` — Normalization (1NF/2NF/3NF), indexes, constraints, soft delete patterns

#### Data & Observability (5)
- `observability-standards` — Structured logging (ILogger<T>), tracing, correlation IDs, metrics
- `api-versioning` — URL versioning (/api/v1/), breaking changes, deprecation, backward compat
- `input-validation` — Boundary validation, FluentValidation, Zod, sanitisation
- `git-workflow` — Conventional Commits, branch naming, merge strategy
- `data-model` (prompt) — Schema design, normalization, indexes

#### Cloud & DevOps (9)
- `aws-patterns` — EC2, RDS, S3, IAM, cost optimization
- `azure-deployment` — App Service, SQL Azure, Key Vault, managed identities
- `docker-kubernetes` — Multi-stage builds, security scanning, Helm, resource limits
- `infrastructure-iac` — Terraform/Bicep standards, modularity, testing
- `ci-cd-automation` — GitHub Actions, Azure Pipelines, automated gates
- `aws-design` (prompt) — Architecture patterns, scaling, resilience
- `azure-setup` (prompt) — Resource provisioning, configuration
- `docker-containerize` (prompt) — Dockerfile generation, optimization
- `kubernetes-deploy` (prompt) — Manifest generation, deployment strategies

#### UX & Design (9)
- `ux-design-system` — Design tokens, component library, brand consistency
- `responsive-mobile-first` — Breakpoints, fluid layouts, touch-friendly
- `animation-motion` — CSS transitions, performance, accessibility
- `design-tokens` — Color, typography, spacing, semantic variables
- `component-patterns` — Reusable components, prop drilling, composition
- `data-visualization` — Chart selection, accessibility, data accuracy
- `table-patterns` — Sorting, filtering, pagination, keyboard nav
- `storybook-standards` — Component documentation, interactive examples
- `component-library` (prompt) — Component design, reusability
- `chart-design` (prompt) — Chart selection & optimization
- `table-design` (prompt) — Table feature design
- `storybook-setup` (prompt) — Storybook configuration
- `design-component` (prompt) — Component visual design
- `design-audit` (prompt) — Design system health check
- `design-system` (prompt) — Design system architecture
- `responsive-design` (prompt) — Responsive layout strategy
- `motion-design` (prompt) — Animation specifications
- `performance-audit` (prompt) — Visual performance optimization

#### Security & Compliance (9)
- `zero-trust-security` — Authentication, authorization, service-to-service, micro-segmentation
- `secrets-rotation` — Key rotation policies, credential management, audit logging
- `compliance-standards` — GDPR, PCI-DSS, SOC 2, data retention, audit trails
- `penetration-testing` — Threat modeling, vulnerability assessment, exploit testing
- `incident-response` — Detection, containment, remediation, post-mortems
- `security-scan` (prompt) — Vulnerability scanning
- `security-agent` (prompt) — Security threat analysis
- `zero-trust-design` (prompt) — Zero-trust architecture design
- `compliance-audit` (prompt) — Compliance gap analysis
- `pentest-plan` (prompt) — Penetration testing plan
- `incident-response` (prompt) — Incident response playbook
- `mobile-security-audit` (prompt) — Mobile app security review

#### Integration & APIs (8)
- `api-gateway-patterns` — Rate limiting, authentication, request/response transformation
- `message-queue-patterns` — Event sourcing, saga pattern, idempotency, DLQ
- `webhook-standards` — Reliability, retry logic, signature verification, timeout handling
- `integration-testing` — Contract testing, mock services, test data management
- `event-driven-architecture` — Async messaging, event schema, producer/consumer
- `api-composition` (prompt) — API orchestration design
- `message-queue-setup` (prompt) — Message queue architecture
- `webhook-implementation` (prompt) — Webhook implementation guidance
- `integration-test-design` (prompt) — Integration test strategy
- `event-driven-design` (prompt) — Event-driven architecture design

#### Mobile (7)
- `mobile-development` — Native performance, platform conventions, lifecycle
- `cross-platform-design` — React Native, Flutter, code sharing, platform-specific UI
- `offline-first` — Local storage, sync strategies, conflict resolution
- `mobile-security` — Secure storage, certificate pinning, runtime protections
- `app-distribution` — App Store/Play Store submission, versioning, rollout
- `mobile-architecture` (prompt) — Mobile app architecture design
- `cross-platform-setup` (prompt) — Cross-platform project setup
- `offline-sync` (prompt) — Offline sync strategy
- `app-distribution-plan` (prompt) — App store distribution plan
- `security-posture` (prompt) — Security posture assessment (mobile)

---

### Agents/Prompts Inventory (63 total)

#### Core Agents (12)
- `/review` — Code review with best practices
- `/optimize-sql` — SQL performance analysis
- `/add-tests` — Test generation
- `/add-docs` — Documentation generation
- `/ng-component` — Angular component scaffolding
- `/api-endpoint` — API endpoint generation
- `/security-scan` — Security vulnerability scanning
- `/explain-deep` — Deep code explanation
- `/inline-review` — Inline code comments
- `/quick-fix` — Quick bug fixes
- `/explain-inline` — Inline code explanation
- `/refactor-inline` — Inline refactoring

#### Design & Architecture Agents (6)
- `/database-design` — Database schema design
- `/architecture-design` — System architecture
- `/refactor-large` — Large-scale refactoring
- `/generate-tests-complete` — Comprehensive test suite
- `/doc-complete` — Complete documentation
- `/refactor-module` — Module refactoring
- `/migrate-version` — Version migration
- `/audit-all` — Comprehensive audit
- `/pr-review` — Pull request review
- `/coverage-gaps` — Test coverage analysis

#### Advanced Analysis (4)
- `/explain-deep` — Deep code explanation
- `/security-agent` — Security threat modeling
- `/perf-optimize` — Performance optimization
- `/workspace-learn` — Workspace context learning

#### Data, Observability & API (5)
- `/data-model` — Database schema design & review
- `/observability-audit` — Logging, tracing, metrics audit
- `/api-contract` — OpenAPI spec generation
- `/git-workflow` — Git workflow assistance
- `/dep-update` — Dependency audit & update guidance

#### Cloud & Infrastructure (5)
- `/aws-design` — AWS architecture design
- `/azure-setup` — Azure resource setup
- `/docker-containerize` — Docker containerization
- `/kubernetes-deploy` — Kubernetes deployment
- `/iac-generate` — Infrastructure as Code generation

#### UX & Design (9)
- `/component-library` — Component library design
- `/chart-design` — Chart design & selection
- `/table-design` — Table design & features
- `/storybook-setup` — Storybook configuration
- `/design-component` — Component visual design
- `/design-audit` — Design system audit
- `/design-system` — Design system architecture
- `/responsive-design` — Responsive layout design
- `/motion-design` — Animation design
- `/performance-audit` (design) — Visual performance

#### Integration & Events (5)
- `/event-driven-design` — Event-driven architecture
- `/api-composition` — API composition/orchestration
- `/message-queue-setup` — Message queue setup
- `/webhook-implementation` — Webhook implementation
- `/integration-test-design` — Integration testing

#### Mobile (5)
- `/mobile-architecture` — Mobile app architecture
- `/cross-platform-setup` — Cross-platform setup
- `/offline-sync` — Offline sync strategy
- `/mobile-security-audit` — Mobile security audit
- `/app-distribution-plan` — App distribution plan

#### Security (6)
- `/security-scan` — Vulnerability scanning
- `/security-agent` — Security analysis
- `/zero-trust-design` — Zero-trust architecture
- `/compliance-audit` — Compliance gap analysis
- `/pentest-plan` — Penetration testing plan
- `/incident-response` — Incident response plan

---

## Part 2: Coverage Gap Analysis

### By SDLC Phase

#### Requirements (Gap: Medium)
**Covered**: 
- `/database-design`, `/architecture-design`, `/api-contract`, `/security-agent`

**Missing**:
- ❌ **Requirements elicitation agent** — Translate business requirements → technical specs
- ❌ **Acceptance criteria** — Generate test cases from requirements
- ❌ **Feasibility assessment** — Tech/resource/timeline risk analysis
- ❌ **Design review** — Review designs against requirements

#### Design (Gap: Low)
**Covered**: Strong coverage across `/design-*`, `/api-contract`, `/architecture-design`, `/event-driven-design`

**Missing**:
- ❌ **Design review against architecture** — Validate designs follow established patterns
- ❌ **Scalability assessment** — Design review for scale/performance
- ❌ **Cost estimation** — Infrastructure cost modeling

#### Development (Gap: Low)
**Covered**: Strong coverage with `/api-endpoint`, `/ng-component`, `/refactor-*`, code generation agents

**Missing**:
- ❌ **Code generation from specs** — Generate code from OpenAPI/design docs
- ❌ **Environment setup** — Local dev environment automation
- ❌ **Database schema migration** — Migration script generation & validation

#### Testing (Gap: Medium)
**Covered**: `/add-tests`, `/generate-tests-complete`, `/coverage-gaps`, `/integration-test-design`

**Missing**:
- ❌ **Test data generation** — Realistic test data/fixtures
- ❌ **Performance testing** — Load/stress test planning
- ❌ **Contract testing** — API contract test generation
- ❌ **Security testing** — OWASP/CWE-driven test generation
- ❌ **Mutation testing** — Test quality assessment

#### Deployment (Gap: Medium)
**Covered**: `/docker-containerize`, `/kubernetes-deploy`, `/iac-generate`, `/azure-setup`, `/aws-design`

**Missing**:
- ❌ **Blue-green deployment** — Blue-green/canary deployment planning
- ❌ **Rollback strategy** — Automated rollback planning
- ❌ **Smoke testing** — Post-deployment validation
- ❌ **Database migration** — Zero-downtime migration planning
- ❌ **Feature flags** — Feature flag strategy & implementation

#### Monitoring (Gap: High)
**Covered**: `/observability-audit`, `/performance-audit`

**Missing**:
- ❌ **SLO/SLI definition** — Service level objectives & indicators
- ❌ **Alert design** — Alert rules & threshold design
- ❌ **Dashboard design** — Monitoring dashboard design
- ❌ **Log analysis** — Log aggregation & analysis strategy
- ❌ **APM setup** — Application Performance Monitoring setup

---

### By Tech Stack

| Stack | Rules | Agents | Gap |
|-------|-------|--------|-----|
| **Backend (.NET)** | dotnet-rules, testing-pyramid, ci-cd, deployment | /api-endpoint, /generate-tests, /refactor-* | **Low** — API design needs agent |
| **Frontend (Angular)** | angular-rules, accessibility, perf-budget | /ng-component, /design-* | **Low** — Needs form builder agent |
| **Database (SQL)** | sql-rules, database-design | /database-design, /optimize-sql | **Medium** — Needs migration generation |
| **DevOps (AWS)** | aws-patterns | /aws-design | **Medium** — Needs IaC generation |
| **DevOps (Azure)** | azure-deployment | /azure-setup | **Medium** — Needs IaC generation |
| **Containers** | docker-kubernetes | /docker-containerize, /kubernetes-deploy | **Low** — Needs Helm chart agent |
| **Integration** | event-driven, api-gateway, message-queue, webhook | /event-driven-design, /message-queue-setup | **Medium** — Needs SagaPattern agent |
| **Mobile (iOS/Android)** | mobile-development, mobile-security | /mobile-architecture, /mobile-security-audit | **High** — Missing platform-specific agents |
| **Mobile (RN/Flutter)** | cross-platform-design, offline-first | /cross-platform-setup, /offline-sync | **High** — Needs platform-specific debugging |

---

## Part 3: Recommended New Rules & Agents

### Priority 1 (v2.8.0 — Q2 2026)

#### 1. **Testing & Quality Assurance**

**New Rules:**
- `performance-testing` — Load testing (k6, JMeter), stress testing, baseline metrics
- `mutation-testing` — Test quality via mutation testing (Stryker), kill ratios
- `contract-testing` — Pact, Spring Cloud Contract patterns
- `security-testing` — OWASP Top 10, CWE-driven test generation

**New Agents:**
- `/test-data-generation` — Realistic test fixtures & seed data
- `/load-test-plan` — k6 or JMeter script generation
- `/contract-test-setup` — Pact test generation from OpenAPI
- `/owasp-test-plan` — OWASP Top 10 test generation

**Why**: Testing is the only SDLC phase where coverage is still weak. 70/20/10 rule exists but no automated test generation for security/performance.

---

#### 2. **Deployment & Operations**

**New Rules:**
- `blue-green-deployment` — Blue-green patterns, canary rollouts, feature flags
- `database-migration-zero-downtime` — Backwards-compatible migrations, versioning, rollback
- `monitoring-observability` — SLOs, SLIs, alert design, dashboard standards

**New Agents:**
- `/deployment-strategy` — Blue-green/canary/rolling deployment planning
- `/migration-script-generation` — Safe SQL migration generation with rollback
- `/slo-definition` — SLO/SLI/error budget definition
- `/alert-design` — Alert rule generation from SLOs

**Why**: Deployment & monitoring are gaps. Zero-downtime migrations and SLO-driven monitoring are critical for production systems.

---

#### 3. **Requirements & Planning**

**New Rules:**
- `requirements-elicitation` — User story format, acceptance criteria, edge cases
- `feasibility-assessment` — Risk analysis, resource estimation, technical debt

**New Agents:**
- `/requirements-to-specs` — Translate business requirements → technical specifications
- `/acceptance-criteria-generator` — Generate test cases from acceptance criteria
- `/risk-assessment` — Technical/resource/timeline risk analysis

**Why**: Current stack starts at Design, but Requirements → Design → Dev is the complete flow. Missing requirements tooling.

---

### Priority 2 (v2.9.0 — Q3 2026)

#### 4. **Mobile Platform-Specific**

**New Rules:**
- `ios-specific` — Swift/SwiftUI standards, App Store guidelines
- `android-specific` — Kotlin/Jetpack Compose standards, Play Store guidelines

**New Agents:**
- `/ios-architecture` — iOS app architecture (MVVM, Reactive)
- `/android-architecture` — Android app architecture (MVI, Jetpack)
- `/app-store-submission` — iOS/Android submission checklist & process
- `/mobile-debugging` — Mobile-specific debugging (debugger, Xcode, Android Studio)

**Why**: Currently has `mobile-development` rule but no platform-specific guidance. iOS and Android have very different patterns.

---

#### 5. **Advanced Architecture**

**New Rules:**
- `microservices-patterns` — Service boundaries, API composition, circuit breakers
- `event-sourcing-cqrs` — Event sourcing, CQRS, eventual consistency
- `domain-driven-design` — DDD, bounded contexts, ubiquitous language

**New Agents:**
- `/service-boundary-design` — Microservices decomposition
- `/event-sourcing-design` — Event sourcing implementation
- `/domain-driven-design` — DDD domain modeling
- `/saga-pattern` — Distributed transaction patterns

**Why**: Missing modern architecture patterns for large-scale systems. Event sourcing and DDD are critical for complex domains.

---

#### 6. **ML/AI Integration**

**New Rules:**
- `ml-integration` — Model serving, inference optimization, A/B testing
- `prompt-engineering` — LLM prompt design, few-shot learning, RAG patterns

**New Agents:**
- `/ml-architecture-design` — ML pipeline architecture
- `/model-serving-strategy` — Model serving (TorchServe, TFServing, vLLM)
- `/prompt-optimization` — LLM prompt optimization & RAG setup
- `/ml-testing-strategy` — ML model testing (unit, integration, drift detection)

**Why**: AI/LLM is growing across all apps. No current guidance on integration or prompt design.

---

### Priority 3 (v3.0.0 — Q4 2026)

#### 7. **Analytics & BI**

**New Rules:**
- `analytics-implementation` — Data warehouse design, ETL/ELT, data quality
- `business-intelligence` — BI tool integration (Power BI, Tableau), dashboard design

**New Agents:**
- `/data-warehouse-design` — Fact/dimension table design, slowly changing dimensions
- `/etl-pipeline-design` — ETL/ELT patterns, data quality validation
- `/bi-dashboard-design` — KPI selection, dashboard design patterns

#### 8. **Advanced Security**

**New Rules:**
- `secrets-management` — HashiCorp Vault, Azure Key Vault, rotation, audit
- `identity-management` — OIDC/SAML, MFA, SSO integration, PAM

**New Agents:**
- `/vault-setup` — Vault configuration & secret rotation
- `/iam-architecture` — Identity management architecture design
- `/sso-integration` — OIDC/SAML provider integration

---

## Part 4: SDLC Phase x Tech Stack Coverage Matrix

### Current State (✅ = covered, ⚠️  = partial, ❌ = missing)

```
                    Requirements   Design   Dev   Testing   Deploy   Monitor
────────────────────────────────────────────────────────────────────────────
Backend .NET           ⚠️          ✅      ✅      ⚠️        ✅        ⚠️
Frontend Angular        ❌          ✅      ✅      ⚠️        ✅        ⚠️
Database SQL            ⚠️          ✅      ⚠️      ⚠️        ⚠️        ⚠️
DevOps (AWS/Azure)      ❌          ✅      ✅      ❌        ⚠️        ❌
Containers              ❌          ✅      ✅      ❌        ✅        ⚠️
Integration/Events      ⚠️          ✅      ✅      ❌        ✅        ⚠️
Mobile (iOS/Android)    ❌          ⚠️      ⚠️      ❌        ⚠️        ❌
Mobile (RN/Flutter)     ❌          ⚠️      ✅      ❌        ⚠️        ❌
Security                ⚠️          ✅      ✅      ❌        ✅        ✅
```

**Legend:**
- ✅ = 3+ rules + agents covering this phase
- ⚠️  = 1-2 rules or agents, or incomplete coverage
- ❌ = No rules or agents

---

## Part 5: Recommended Rule Organization for v2.8.0+

### v2.8.0 Structure (Proposed)

**New section header in config.yaml:**
```yaml
# ── v2.8.0 Testing, Deployment & Monitoring Rules
```

**New rules** (recommended order):
1. `performance-testing` — Load/stress testing standards
2. `mutation-testing` — Test quality assurance
3. `contract-testing` — Consumer-driven contract testing
4. `security-testing` — OWASP/CWE test generation
5. `blue-green-deployment` — Safe deployment strategies
6. `database-migration` — Zero-downtime migrations
7. `monitoring-observability` — SLO/SLI/alert design

**New agents** (recommended order):
1. `/test-data-generation` → Generate realistic test data
2. `/load-test-plan` → Generate k6 or JMeter scripts
3. `/contract-test-setup` → Generate Pact tests from OpenAPI
4. `/owasp-test-plan` → Generate security tests
5. `/deployment-strategy` → Plan blue-green/canary deployment
6. `/migration-script-generation` → Generate safe SQL migrations
7. `/slo-definition` → Define SLOs, SLIs, error budgets
8. `/alert-design` → Generate alert rules from SLOs

---

## Part 6: Recommended Agents by SDLC Workflow

### Backend .NET Developer Workflow

**Daily**:
1. `/review` — Code review
2. `/add-tests` — Generate unit tests
3. `/add-docs` — Generate XML docs

**Feature Development**:
1. `/architecture-design` — System design
2. `/database-design` — Schema design
3. `/api-endpoint` — Endpoint scaffolding
4. `/generate-tests-complete` — Full test suite
5. `/refactor-large` — Large refactoring

**Deployment**:
1. `/deployment-strategy` (NEW) — Plan deployment
2. `/migration-script-generation` (NEW) — Migrations
3. `/slo-definition` (NEW) — Define SLOs
4. `/observability-audit` — Review logging/tracing

**Quality Assurance**:
1. `/coverage-gaps` — Test coverage
2. `/test-data-generation` (NEW) — Test fixtures
3. `/load-test-plan` (NEW) — Performance testing
4. `/security-scan` — Vulnerability scan

---

### Frontend Angular Developer Workflow

**Daily**:
1. `/review` — Code review
2. `/add-tests` — Generate component tests
3. `/add-docs` — Generate JSDoc

**Feature Development**:
1. `/design-component` — Visual design
2. `/ng-component` — Component scaffolding
3. `/responsive-design` — Responsive layout
4. `/generate-tests-complete` — Full test suite
5. `/design-audit` — Design system audit

**Design System**:
1. `/design-system` — System architecture
2. `/storybook-setup` — Storybook config
3. `/chart-design` — Chart selection
4. `/table-design` — Table features
5. `/motion-design` — Animations

---

### DevOps/Platform Engineer Workflow

**Infrastructure**:
1. `/aws-design` or `/azure-setup` — Infrastructure design
2. `/iac-generate` — Terraform/Bicep generation
3. `/kubernetes-deploy` — K8s manifests
4. `/docker-containerize` — Dockerfile generation

**Operations**:
1. `/deployment-strategy` (NEW) — Deployment planning
2. `/slo-definition` (NEW) — SLO definition
3. `/alert-design` (NEW) — Alert rules
4. `/migration-script-generation` (NEW) — DB migrations

**Security**:
1. `/security-scan` — Vulnerability scanning
2. `/zero-trust-design` — Security architecture
3. `/compliance-audit` — Compliance gaps

---

### QA/Test Engineer Workflow

**Test Planning**:
1. `/acceptance-criteria-generator` (NEW) — From requirements
2. `/integration-test-design` — Integration test strategy
3. `/contract-test-setup` (NEW) — Contract tests
4. `/owasp-test-plan` (NEW) — Security tests
5. `/load-test-plan` (NEW) — Performance tests

**Test Execution**:
1. `/test-data-generation` (NEW) → Generate fixtures
2. `/coverage-gaps` — Identify gaps
3. `/migration-script-generation` (NEW) → Test migrations

---

### Security Engineer Workflow

**Security Design**:
1. `/security-agent` — Threat modeling
2. `/zero-trust-design` — Zero-trust architecture
3. `/compliance-audit` — Compliance gaps
4. `/pentest-plan` — Penetration testing

**Security Testing**:
1. `/security-scan` — Vulnerability scanning
2. `/owasp-test-plan` (NEW) → OWASP tests
3. `/mobile-security-audit` — Mobile security
4. `/incident-response` — Incident playbook

---

## Part 7: Implementation Roadmap

### v2.8.0 (Q2 2026) — Testing, Deployment & Monitoring
- **Timeline**: 2-3 weeks
- **Files**: 7 new rules + 8 new agents
- **Focus**: Close gaps in Testing & Deployment phases
- **Impact**: Complete SDLC coverage for all current tech stacks

### v2.9.0 (Q3 2026) — Mobile & Advanced Architecture
- **Timeline**: 2-3 weeks
- **Files**: 8 new rules + 8 new agents
- **Focus**: Platform-specific guidance + modern architecture patterns
- **Impact**: Complete mobile stack + event-sourcing/DDD patterns

### v3.0.0 (Q4 2026) — ML/AI & Advanced Features
- **Timeline**: 3-4 weeks
- **Files**: 6 new rules + 6 new agents
- **Focus**: LLM integration + Analytics/BI + advanced security
- **Impact**: Complete modern stack coverage

---

## Part 8: Decision Matrix

### Should we add a rule or an agent?

| Scenario | Rule | Agent |
|----------|------|-------|
| "How should we design X?" | ✅ Rule | Also agent |
| "Generate/scaffold X" | Agent only | ✅ Agent |
| "Always follow pattern X" | ✅ Rule | — |
| "Review code for X" | Rule (for context) | ✅ Agent |
| "Step-by-step guidance for X" | Rule (summary) | ✅ Agent |

**Pattern**: Most topics get both. Rules = guardrails. Agents = interactive tooling.

---

## Part 9: Summary & Recommendations

### What's Working Well ✅
1. **Core stack coverage** (.NET, Angular, SQL) is excellent
2. **Design agents** (UX, architecture, API) are comprehensive
3. **Cloud coverage** (AWS, Azure, Kubernetes) is strong
4. **Security rules** are well-defined

### What Needs Work ❌
1. **Requirements phase** — No elicitation or feasibility agents
2. **Testing phase** — Missing performance, security, contract testing
3. **Deployment phase** — No blue-green, canary, or zero-downtime guidance
4. **Monitoring phase** — Missing SLO/SLI, alert design, dashboard design
5. **Mobile (iOS/Android)** — Needs platform-specific rules and agents

### Top 3 Recommendations
1. **Immediate (v2.8.0)**: Add 4 testing agents (`/test-data`, `/load-test`, `/contract-test`, `/owasp-test`) + 3 deployment agents (`/deployment-strategy`, `/migration-script`, `/slo-definition`)
2. **Short-term (v2.9.0)**: Add platform-specific mobile rules (iOS, Android) and event-sourcing/DDD agents for microservices
3. **Medium-term (v3.0.0)**: Add ML/AI integration, analytics/BI, and advanced security (IAM, secrets management)

### Success Metrics
- [ ] All 6 SDLC phases covered for each tech stack
- [ ] 15+ testing/quality agents
- [ ] 20+ deployment/monitoring agents
- [ ] Platform-specific guidance for iOS, Android, React Native, Flutter
- [ ] ML/AI integration best practices

---

**Next Step**: Select 3-5 priority agents from v2.8.0 list above and create detailed specifications.

