# Changelog

All notable changes to SmartWorkz PowerPlay are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/)
Versioning: [Semantic Versioning](https://semver.org/)

## [Unreleased]

### Planned
- [ ] v2.8.0 — Additional domains (Machine Learning, BI/Analytics, or expansions)
- [ ] Config validation tool
- [ ] Claude API model support

---

## [2.7.0] — 2026-04-09 (Mobile & Cross-Platform)

**Mobile & Cross-Platform release — iOS, Android, React Native, Flutter, offline-first sync, app distribution**

### Added

#### Agent Prompts (5 new)
- `/mobile-architecture` — Design mobile app architecture (native vs. cross-platform)
- `/cross-platform-setup` — Setup cross-platform codebase with platform abstraction layer
- `/offline-sync` — Design offline-first data sync (local DB, event queue, conflict resolution)
- `/mobile-security-audit` — Audit mobile app security (credentials, network, data, jailbreak detection)
- `/app-distribution-plan` — Plan app distribution (versioning, store submission, beta testing, monitoring)

#### Rules (5 new)
- `mobile-development.md` — iOS (Swift, SwiftUI), Android (Kotlin, Jetpack), React Native, Flutter standards
- `cross-platform-design.md` — Platform abstraction layer, UI adaptation per platform, design tokens
- `offline-first.md` — Local-first data store, event logs, sync strategies, conflict resolution
- `mobile-security.md` — Credentials storage, OAuth 2.0 + PKCE, HTTPS, certificate pinning, jailbreak detection
- `app-distribution.md` — App store submission, versioning, signing, beta testing, monitoring

### Changed
- Version bumped to 2.7.0
- Models: 14 (unchanged)
- Rules: 49 → 54 total (+5 mobile rules)
- Prompts: 58 → 63 total (+5 mobile prompts)
- Updated capability map: Rules (54), Prompts (63)

### Files Modified
- `config.yaml` — version 2.7.0, 5 new rules, 5 new prompts
- `.continue/rules/mobile-development.md` — NEW (800+ lines)
- `.continue/rules/cross-platform-design.md` — NEW (600+ lines)
- `.continue/rules/offline-first.md` — NEW (700+ lines)
- `.continue/rules/mobile-security.md` — NEW (650+ lines)
- `.continue/rules/app-distribution.md` — NEW (650+ lines)
- `docs/v2.7.0/V2_7_0_IMPLEMENTATION_SUMMARY.md` — NEW
- `config/versions/config-v2.7.0.yaml` — Archived

### Documentation
- Complete implementation summary: platforms (iOS/Android/RN/Flutter), architecture patterns, sync strategies
- 5 new rule files with code examples, best practices, checklists
- Updated README: version 2.7.0, 63 prompts, mobile stack

---

## [2.6.0] — 2026-04-09 (Integration & APIs)

**Integration & APIs release — Event-driven architecture, API gateways, message queues, webhooks, integration testing**

### Added

#### Agent Prompts (5 new)
- `/event-driven-design` — Design event-driven system with CQRS & event sourcing
- `/api-composition` — Design API composition gateway (multi-service aggregation)
- `/message-queue-setup` — Design message queue architecture (RabbitMQ/Kafka)
- `/webhook-implementation` — Implement webhook system with retries & signatures
- `/integration-test-design` — Design contract tests, E2E tests, test data strategy

#### Rules (5 new)
- `event-driven-architecture.md` — Event sourcing, CQRS, saga pattern, eventual consistency
- `api-gateway-patterns.md` — Request routing, composition, rate limiting, versioning, caching
- `message-queue-patterns.md` — RabbitMQ/Kafka, queues vs. topics, DLQ, idempotency
- `webhook-standards.md` — HTTPS, HMAC signatures, retries, delivery guarantees
- `integration-testing.md` — Contract testing, E2E testing, test data, CI/CD integration

### Changed
- Version bumped to 2.6.0
- Models: 14 (unchanged)
- Rules: 44 → 49 total (+5 integration rules)
- Prompts: 53 → 58 total (+5 integration prompts)
- Updated capability map in config.yaml header

### Files Modified
- `config.yaml` — version 2.6.0, 5 new rules, 5 new prompts
- `.continue/rules/event-driven-architecture.md` — NEW (600+ lines)
- `.continue/rules/api-gateway-patterns.md` — NEW (550+ lines)
- `.continue/rules/message-queue-patterns.md` — NEW (500+ lines)
- `.continue/rules/webhook-standards.md` — NEW (400+ lines)
- `.continue/rules/integration-testing.md` — NEW (450+ lines)

### Summary
v2.6.0 adds comprehensive integration and API patterns to PowerPlay. Covers event-driven architecture (event sourcing, CQRS, sagas), API gateways (routing, composition, rate limiting), message queues (RabbitMQ/Kafka patterns), webhooks (reliable delivery, signature verification), and integration testing (contract tests, E2E, test data management). Enables building scalable, decoupled microservices with real-time integrations.

---

## [2.5.0] — 2026-04-09 (Security & Compliance Standards)

**Enterprise Security release — Zero-trust architecture, secrets management, compliance frameworks, penetration testing, incident response**

### Added

#### Agent Prompts (5 new)
- `/zero-trust-design` — Design zero-trust security architecture (identity, auth, network, encryption, monitoring)
- `/compliance-audit` — Audit compliance against SOC 2, ISO 27001, HIPAA, PCI-DSS
- `/pentest-plan` — Create penetration test plan (scope, ROE, methodology, CVSS scoring, reporting)
- `/incident-response` — Create incident response playbook and blameless post-mortem template
- `/security-posture` — Assess overall security posture (threats, gaps, improvement roadmap)

#### Rules (5 new)
- `zero-trust-security.md` — Identity verification (MFA), least privilege, network segmentation, encryption (TLS/AES-256), audit trails
- `secrets-rotation.md` — Secrets storage (vault), automated rotation (30-90 days), credential lifecycle, compromise response
- `compliance-standards.md` — SOC 2 Type II, ISO 27001, HIPAA (Privacy/Security Rules, breach notification), PCI-DSS (tokenization, CDE, scanning)
- `penetration-testing.md` — Pentest planning (scope, ROE), NIST methodology, OWASP Top 10, CVSS scoring, remediation tracking
- `incident-response.md` — IR playbook (severity levels, detection, triage), war room, blameless post-mortems, action items

### Changed
- Version bumped to 2.5.0
- Models: 14 (unchanged)
- Rules: 39 → 44 total (+5 security & compliance rules)
- Prompts: 48 → 53 total (+5 security & compliance prompts)
- Updated capability map in config.yaml header
- Updated CHANGELOG.md planned versions

### Files Modified
- `config.yaml` — version 2.5.0, 5 new rules, 5 new prompts, updated capability map
- `.continue/rules/zero-trust-security.md` — NEW (500+ lines)
- `.continue/rules/secrets-rotation.md` — NEW (450+ lines)
- `.continue/rules/compliance-standards.md` — NEW (600+ lines)
- `.continue/rules/penetration-testing.md` — NEW (500+ lines)
- `.continue/rules/incident-response.md` — NEW (550+ lines)

### Summary
v2.5.0 adds enterprise-grade security and compliance standards to PowerPlay. Covers zero-trust architecture (identity verification, least privilege, encryption), automated secrets management with rotation, compliance frameworks (SOC 2, ISO 27001, HIPAA, PCI-DSS), systematic penetration testing methodology, and incident response playbooks with blameless post-mortems. Enables organizations to meet regulatory requirements and build defense-in-depth security posture.

---

## [2.4.0] — 2026-04-10 (Cloud & DevOps Standards)

**Cloud & DevOps release — AWS, Azure, Docker/Kubernetes, Infrastructure as Code, CI/CD automation**

### Added

#### Agent Prompts (5 new)
- `/aws-design` — Design AWS architecture (Lambda, S3, RDS, DynamoDB, API Gateway, CloudFront)
- `/azure-setup` — Generate Azure deployment configuration (App Service, Functions, SQL, monitoring)
- `/docker-containerize` — Generate Dockerfile and Docker Compose for containerization
- `/kubernetes-deploy` — Generate Kubernetes manifests (deployments, services, ingress, HPA)
- `/iac-generate` — Generate Infrastructure as Code (Terraform or Bicep)

#### Rules (5 new)
- `aws-patterns.md` — Lambda, RDS, DynamoDB, API Gateway, CloudFront, IAM best practices
- `azure-deployment.md` — App Service, Azure Functions, SQL Database, Cosmos DB, Key Vault, monitoring
- `docker-kubernetes.md` — Dockerfile optimization, Docker Compose, Kubernetes manifests, Helm charts
- `infrastructure-iac.md` — Terraform state management, CloudFormation templates, Bicep, GitOps
- `ci-cd-automation.md` — GitHub Actions, Azure Pipelines, blue-green deployments, secrets management

### Changed
- Version bumped to 2.4.0
- Models: 14 (unchanged)
- Rules: 34 → 39 total (+5 cloud & DevOps rules)
- Prompts: 43 → 48 total (+5 cloud & DevOps prompts)
- Updated capability map in config.yaml header

### Files Modified
- `config.yaml` — version 2.4.0, 5 new rules, 5 new prompts
- `.continue/rules/aws-patterns.md` — NEW (500+ lines)
- `.continue/rules/azure-deployment.md` — NEW (450+ lines)
- `.continue/rules/docker-kubernetes.md` — NEW (500+ lines)
- `.continue/rules/infrastructure-iac.md` — NEW (450+ lines)
- `.continue/rules/ci-cd-automation.md` — NEW (400+ lines)

### Summary
v2.4.0 completes the comprehensive PowerPlay stack with cloud and DevOps standards. Now includes AWS architecture patterns (serverless, databases, CDN), Azure managed services, containerization with Docker/Kubernetes, Infrastructure as Code (Terraform/Bicep), and CI/CD automation (GitHub Actions, Azure Pipelines). Complete end-to-end coverage from code to production deployment.

---

## [2.3.0] — 2026-04-10 (Advanced UI Patterns & Performance)

**Advanced UI release — Component libraries, data visualization, tables, Storybook, performance monitoring**

### Added

#### Agent Prompts (5 new)
- `/component-library` — Generate Material Design, Chakra UI, or Tailwind CSS component patterns
- `/chart-design` — Design data visualizations with Recharts, D3, or Chart.js
- `/table-design` — Build sortable, filterable, paginated data tables with virtualization
- `/storybook-setup` — Generate Storybook stories and configure Chromatic visual testing
- `/performance-audit` — Audit Core Web Vitals, bundle size, performance budgets, and optimize

#### Rules (5 new)
- `component-patterns.md` — Material Design 3, Chakra UI, Tailwind CSS patterns, component API design, theming
- `data-visualization.md` — Chart selection (bar/line/pie/scatter), Recharts/D3 patterns, dashboards, accessibility
- `table-patterns.md` — Semantic HTML tables, sorting, filtering, pagination, virtualization for large datasets
- `storybook-standards.md` — Story structure, ArgsTable, accessibility testing (a11y), Chromatic integration, interaction tests
- `performance-monitoring.md` — Core Web Vitals (LCP/INP/CLS), performance budgets, Lighthouse, bundle analysis, RUM setup

### Changed
- Version bumped to 2.3.0
- Models: 14 (unchanged)
- Rules: 29 → 34 total (+5 advanced UI rules)
- Prompts: 38 → 43 total (+5 advanced UI prompts)
- Updated capability map in config.yaml header

### Files Modified
- `config.yaml` — version 2.3.0, 5 new rules, 5 new prompts
- `.continue/rules/component-patterns.md` — NEW (500+ lines)
- `.continue/rules/data-visualization.md` — NEW (450+ lines)
- `.continue/rules/table-patterns.md` — NEW (400+ lines)
- `.continue/rules/storybook-standards.md` — NEW (350+ lines)
- `.continue/rules/performance-monitoring.md` — NEW (400+ lines)

### Summary
v2.3.0 completes the advanced UI layer with component library patterns (Material/Chakra/Tailwind), data visualization (charts, dashboards), complex tables (sorting/filtering/pagination/virtualization), Storybook component documentation with Chromatic, and web performance monitoring (Core Web Vitals, Lighthouse, performance budgets). Frontend teams now have end-to-end coverage from design systems to deployment.

---

## [2.2.0] — 2026-04-10 (UX Design Agent Suite)

**UX Design release — Complete design system, accessibility audits, responsive design, animations, design tokens**

### Added

#### Agent Prompts (5 new)
- `/design-component` — Generate accessible UI component with UXPro design system standards
- `/design-audit` — WCAG 2.1 AA accessibility audit with exact fixes
- `/design-system` — Generate design tokens and design system guidelines
- `/responsive-design` — Test responsive design across all breakpoints
- `/motion-design` — Audit animations for GPU acceleration and accessibility

#### Rules (5 new)
- `ux-design-system.md` — Design system: colors (60-30-10), typography (1.25 ratio), spacing (8pt grid), responsive, components
- `accessibility-wcag.md` — WCAG 2.1 AA: contrast (4.5:1), focus indicators, keyboard nav, ARIA, touch targets (44×44px)
- `responsive-mobile-first.md` — Mobile-first: base styles (320px), breakpoints, fluid typography (clamp), responsive images
- `animation-motion.md` — GPU acceleration (transform/opacity only), durations (50-500ms), easing, prefers-reduced-motion
- `design-tokens.md` — CSS variables: semantic naming, dark mode tokens, token structure, Figma sync

### Changed
- Version bumped to 2.2.0
- Models: 14 (unchanged)
- Rules: 24 → 29 total (+5 UX rules)
- Prompts: 33 → 38 total (+5 UX prompts)
- Updated capability map in config.yaml header
- Updated releaseUrl to v2.2.0

### Files Modified
- `config.yaml` — version 2.2.0, 5 new rules, 5 new prompts
- `.continue/rules/ux-design-system.md` — NEW (350+ lines)
- `.continue/rules/accessibility-wcag.md` — NEW (400+ lines)
- `.continue/rules/responsive-mobile-first.md` — NEW (350+ lines)
- `.continue/rules/animation-motion.md` — NEW (350+ lines)
- `.continue/rules/design-tokens.md` — NEW (300+ lines)

### Summary
v2.2.0 completes the design capability gap with comprehensive UX design agent rules covering design systems, accessibility (WCAG AA), responsive design, animations, and design tokens. Frontend developers now have complete AI-powered design support.

---

## [2.1.0] — 2026-04-09 (Data, Observability & API Standards)

**Data & Observability release — Database design standards, structured logging, API versioning, input validation, git workflow**

### Added

#### Agent Prompts (5 new)
- `/data-model` — Design or review database schema: normalization, indexes, constraints, naming, soft delete
- `/observability-audit` — Audit logging, tracing, metrics: find gaps, suggest structured log statements
- `/api-contract` — Generate OpenAPI 3.0 spec for API endpoints (complete, ready to use)
- `/git-workflow` — Branch naming, commit message rewrite to Conventional Commits, squash plan
- `/dep-update` — Audit dependencies: outdated, CVE-affected, breaking changes, safe update path

#### Rules (5 new)
- `database-design.md` — Schema standards: normalization (1NF/2NF/3NF), indexes, constraints, naming, soft delete, migrations
- `observability-standards.md` — Structured logging (ILogger<T>, key=value), correlation IDs, metrics, health checks, no secrets
- `api-versioning.md` — URL versioning, deprecation process (6-month notice), breaking vs non-breaking changes, migration guides
- `input-validation.md` — Validation at boundaries (controllers), parameterized queries, sanitization, file upload safety
- `git-workflow.md` — Branch naming (feature/id-description), Conventional Commits, granular commits, merge strategy, conflict resolution

#### Models (1 new)
- `Qwen3 235B [Deep Analysis]` via OpenRouter — large context complex tasks, temp 0.2, maxTokens 16384

### Changed
- Version bumped to 2.1.0
- Models: 13 → 14 total (added Qwen3 235B)
- Rules: 19 → 24 total (added 5 data/observability rules)
- Prompts: 28 → 33 total (added 5 data/observability prompts)
- Updated capability map in config.yaml header
- Updated releaseUrl to v2.1.0

### Files Modified
- `config.yaml` — version 2.1.0, 1 new model, 5 new rules, 5 new prompts
- `.continue/rules/database-design.md` — NEW (350+ lines)
- `.continue/rules/observability-standards.md` — NEW (400+ lines)
- `.continue/rules/api-versioning.md` — NEW (350+ lines)
- `.continue/rules/input-validation.md` — NEW (400+ lines)
- `.continue/rules/git-workflow.md` — NEW (350+ lines)

### Summary
v2.1.0 fills remaining coverage gaps: database design standards (schema, indexes, migrations), observability (logging, tracing, metrics), API versioning with deprecation strategy, input validation & security, and git workflow standards. All fully configurable within config.yaml using Continue.dev slash commands and rules.

---

## [2.0.0] — 2026-04-09 (Agent-Era Standards)

**Agent-era release — Autonomous agents, code review standards, CI/CD automation, project learning**

### Added

#### Agent Prompts (5 new)
- `/pr-review` — Autonomous PR review: quality + security + performance + testing + docs
- `/coverage-gaps` — Find untested code paths, generate targeted test cases to fill gaps
- `/security-agent` — Full OWASP Top 10 scan with exact remediation code for each issue
- `/perf-optimize` — Profile → identify bottlenecks → suggest optimizations with before/after comparisons
- `/workspace-learn` — Analyse codebase conventions and generate onboarding summary

#### Rules (5 new)
- `agent-behavior.md` — AI agent execution patterns: multi-step planning, verification, error handling, audit trails
- `pr-standards.md` — Pull request standards: size limits (< 400 lines), description format, review checklist
- `code-review-standards.md` — Code reviewer guidelines: mindset, severity levels, approval criteria, handling disagreements
- `ci-cd-standards.md` — CI/CD pipeline standards: stages, gates, environment promotion, secret management, rollback
- `workspace-conventions.md` — Project conventions template: naming, architecture, patterns, error handling, testing

#### Models (2 new)
- `Claude 3.5 Haiku [Fast Agent]` via OpenRouter — optimized for fast agentic tasks, temperature 0.1
- `DeepSeek V3 [Coder]` via OpenRouter — code generation + refactoring, temperature 0.2

### Changed
- Version bumped to 2.0.0
- Models: 11 → 13 total (added Claude Haiku, DeepSeek V3)
- Rules: 14 → 19 total (added 5 agent-era rules)
- Prompts: 23 → 28 total (added 5 agent commands)
- Updated capability map in config.yaml header
- Updated releaseUrl to v2.0.0

### Files Modified
- `config.yaml` — version 2.0.0, 2 new models, 5 new rules, 5 new prompts
- `.continue/rules/agent-behavior.md` — NEW (400+ lines)
- `.continue/rules/pr-standards.md` — NEW (350+ lines)
- `.continue/rules/code-review-standards.md` — NEW (350+ lines)
- `.continue/rules/ci-cd-standards.md` — NEW (350+ lines)
- `.continue/rules/workspace-conventions.md` — NEW (350+ lines)

### Summary
v2.0.0 enters the agent era: autonomous PR review, test coverage analysis, security auditing, performance optimization, and project learning. All fully configurable within config.yaml using Continue.dev slash commands and rules.

---

## [1.2.0] — 2026-04-09 (Intelligent Context & Automation)

**v1.2.0 release — Complete automation rules, 5 new prompts, 2 new models**

### Added

#### Utility Prompts (5 new)
- `/generate-tests-complete` — Generate complete test suite (unit + integration + edge cases) as ready-to-use test class
- `/doc-complete` — Generate full API documentation (XML docs, usage examples, README section)
- `/refactor-module` — Module-level refactoring with dependency analysis and ordered steps
- `/migrate-version` — Framework/version upgrade plan with breaking changes and code examples
- `/audit-all` — Combined security + performance + code quality + coverage audit in one command

#### Rules (5 new)
- `testing-pyramid.md` — Testing ratio standards (70% unit, 20% integration, 10% e2e), mocking strategy, AAA pattern
- `documentation-standards.md` — XML docs (C#), JSDoc (TypeScript), README requirements, no undocumented public API
- `deployment-safety.md` — Environment config, secret management, health checks, Dockerfile hardening, CI gates
- `accessibility.md` — WCAG 2.1 AA compliance, ARIA labels, keyboard navigation, color contrast 4.5:1
- `performance-budget.md` — Response time targets (< 200ms P95), bundle limits (< 250KB), DB query budgets

#### Cloud Models (2 new, conditional)
- `Llama 3.1 70B [Reasoning]` via OpenRouter (temp 0.2 for strict reasoning tasks)
- `Mistral Large [Analysis]` via OpenRouter (temp 0.3 for analysis and synthesis)
  - Both use existing `${OPENROUTER_API_KEY}` environment variable
  - Available only if OpenRouter key is set in .env

### Changed
- Version bumped to 1.2.0
- Total models: 9 local + 2 cloud conditional = 11 total available
- Total rules: 9 existing + 5 new = 14 rules
- Total prompts: 18 existing + 5 new = 23 prompts
- Updated capability map in config header
- Updated releaseUrl to point to v1.2.0

### Total New Features
- 5 new utility prompts (test generation, documentation, refactoring, migration, audit)
- 5 new comprehensive rules (testing, documentation, deployment, accessibility, performance)
- 2 new cloud models (Llama 3.1 70B reasoning, Mistral Large analysis)

### Files Modified
- `config.yaml` — v1.2.0, 5 prompts, 5 rules, 2 models added
- `.continue/rules/testing-pyramid.md` — NEW (400+ lines)
- `.continue/rules/documentation-standards.md` — NEW (500+ lines)
- `.continue/rules/deployment-safety.md` — NEW (450+ lines)
- `.continue/rules/accessibility.md` — NEW (500+ lines)
- `.continue/rules/performance-budget.md` — NEW (400+ lines)
- `docs/CHANGELOG.md` — v1.2.0 section added

---

## [1.1.0] — 2026-04-09 (Inline Powers)

**First v1.1.0 release — Inline code actions and utility prompts**

### Added

#### Inline Action Prompts (5 new)
- `/inline-review` — Quick inline code review with Severity | Line | Issue | Fix table
- `/quick-fix` — Auto-fix selected code (drop-in replacement, no explanation)
- `/explain-inline` — Explain selected code with `//` comments per line
- `/refactor-inline` — Refactor selection in single transformation (extract, simplify, or modernize)
- `/add-types` — Add TypeScript `any` → types or C# `var` → explicit types

#### Utility Prompts (5 new)
- `/performance-check` — Identify N+1, allocations, blocking awaits
- `/memory-audit` — Detect memory leaks and disposal issues
- `/database-design` — Review or generate database schema
- `/architecture-design` — System architecture advice for features
- `/refactor-large` — Plan large refactoring with analysis and ordered steps

#### Rules (4 new)
- `performance-audit.md` — SQL, C#, TypeScript performance standards
- `memory-management.md` — Disposal patterns, event cleanup, GC awareness
- `async-best-practices.md` — Async/await, ConfigureAwait, CancellationToken
- `error-handling-advanced.md` — Exception hierarchy, ProblemDetails, structured logging, Polly

### Fixed
- Fixed hardcoded API key in `tabAutocompleteModel` (line 237) → now `${DHONI_API_KEY}`
- Fixed hardcoded API key in `embeddingsProvider` (line 254) → now `${OPENROUTER_API_KEY}`

### Changed
- Version bumped to 1.1.0
- Updated capability map in config header
- Updated releaseUrl to point to v1.1.0

### Total New Features
- 10 new prompts (5 inline actions, 5 utility)
- 4 new rules
- 2 remaining hardcoded secrets fixed

---

## [1.0.1] — 2026-04-09 (Security Patch)

**CRITICAL SECURITY FIX**

### Security
- 🔒 **CRITICAL**: Remove hardcoded API keys from config.yaml
  - OpenRouter key now uses `${OPENROUTER_API_KEY}` environment variable
  - Local Dhoni/Kapil keys now use `${DHONI_API_KEY}` / `${KAPIL_API_KEY}`
  - Users must set .env file (not committed to git)
  - Added .env.example with setup instructions

### Changed
- config.yaml now uses environment variable substitution (safer)
- config-v1.0.0.yaml created for version history
- Updated .gitignore to exclude .env files
- Added .env.example template (copy to .env, fill in your keys)

### Fixed
- Removed exposed OpenRouter API key from repository
- Prevented accidental key commits going forward

### Docs
- Added .env.example with clear setup instructions
- Updated README with security best practices
- Added API key rotation guide

### Migration
If upgrading from v1.0.0:
1. Copy .env.example to .env
2. Get your OpenRouter key: https://openrouter.ai/account/api-keys
3. Fill in .env with your actual keys
4. Restart Continue.dev

### If Key Was Exposed
1. Go to https://openrouter.ai/account/api-keys
2. Revoke the old key (click menu → Revoke)
3. Generate a new key
4. Update .env with new key
5. Done! (old key can no longer be used)

---

## [1.0.0] — 2026-04-09

**Initial Release**

### Added
- ✅ **5 Local Models** (Qwen 3.5 9B, DeepSeek R1 8B, Phi4 Mini, Qwen Coder, DeepSeek Coder)
- ✅ **4 Cloud Fallbacks** (GPT-OSS, MiniMax, Qwen3, Gemma 4) via OpenRouter free tier
- ✅ **5 MCP Servers** (Git, FileSystem, Playwright, SQLite, Continue Docs)
- ✅ **5 Rules** (core, .NET, Angular, SQL, security)
- ✅ **10 Prompts** (/review, /optimize-sql, /add-tests, /add-docs, /ng-component, /api-endpoint, /security-scan, /explain-deep)
- ✅ **8 Context Providers** (@code, @codebase, @docs, @diff, @terminal, @problems, @folder, @file, @currentFile, @repo-map, @open)
- ✅ **Tab Autocomplete** (debounce 400ms, cross-file context)
- ✅ **Embeddings** (NVIDIA Nemotron via OpenRouter)
- ✅ **Docs Indexing** (Continue, ASP.NET Core, Angular, DevExtreme, Dapper, FluentValidation)

### Features
- **Model Capability Mapping**: Chat, Fast Apply, Reasoning, Autocomplete
- **Stack-Specific Rules**: .NET 8, Angular 17+, SQL Server 2022, Azure, AWS
- **Tool Use**: All local chat models support MCP tool invocation
- **Security First**: Parameterized queries, no hardcoded secrets, input sanitization

### Configuration
- Default completion: 4096 tokens, temperature 0.3
- Apply models: 16384 tokens, temperature 0.05 (prevents hallucination)
- Embeddings: NVIDIA Nemotron 1B
- Tab complete: 1500 token context, 75% prefix focus

### Docs
- Inline comments for critical fixes (e.g., maxTokens=16384 truncation)
- Capability map ASCII art
- Docs indexing for 6 major libraries

---

## Version History

| Version | Release | Highlights |
|---------|---------|-----------|
| 1.0.1 | 2026-04-09 | SECURITY: API keys → env variables, .env.example, versioned configs |
| 1.0.0 | 2026-04-09 | Initial: 5 local + 4 cloud models, 10 prompts, 5 MCP, rules |

---

## How to Use This Changelog

**For Users**: Check "Added", "Changed", "Fixed", "Removed" to see what's new.

**For Developers**: See "Security", "Performance", "Docs" sections for details.

**Breaking Changes**: Look for **[BREAKING]** markers and migrate accordingly.

