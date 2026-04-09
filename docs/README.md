# SmartWorkz PowerPlay

> Cursor-level AI code editor power. Windsurf agent autonomy. **Zero cost.** For [Continue.dev](https://continue.dev)

[![Version: 3.5.0](https://img.shields.io/badge/version-3.5.0-blue)](./CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)]()
[![Stack: .NET + Angular + Mobile](https://img.shields.io/badge/stack-.NET%20%2B%20Angular%20%2B%20Mobile-blueviolet)]()
[![Rules: 87](https://img.shields.io/badge/rules-87-brightgreen)]()
[![Prompts: 40](https://img.shields.io/badge/prompts-40-brightgreen)]()
[![Latest Release](https://img.shields.io/github/v/release/SmartWorkz-Dev/PowerPlay)](https://github.com/SmartWorkz-Dev/PowerPlay/releases)

---

## 🚀 Quick Start (2 minutes)

### 1. Install Continue.dev
```bash
# VS Code
Ctrl+Shift+X → Search "Continue" → Install

# JetBrains
Plugins → Marketplace → Continue → Install
```

### 2. Run Setup Script (Recommended)
```powershell
# Windows PowerShell (as Administrator)
.\setup-powerplay.ps1

# Or read: docs/SETUP-ENVIRONMENT.md for manual steps
```

This script will:
- ✅ Set all 3 API keys (environment variables)
- ✅ Copy config to Continue.dev
- ✅ Verify setup
- ✅ Give test instructions

### 3. Restart VS Code & Test
```
1. Close VS Code completely
2. Reopen VS Code
3. Open Continue.dev (Ctrl+L)
4. Type "/" → See 40+ consolidated prompts ✅
5. Try: /play or /quick or /sec or /test or /db for smart routing
```

**See also**: [Setup Guide](./reference/setup/SETUP-ENVIRONMENT.md) for detailed setup guide

---

## 📊 What's Included

### Models (9 Local + 5 Cloud = 14 Total)

**Local Models (Free, No API Keys)**
| Model | Role | Speed | Installed |
|-------|------|-------|-----------|
| **Qwen 3.5 9B** | Chat + reasoning | ⚡⚡⚡ | Ollama |
| **DeepSeek R1 8B** | Deep reasoning | ⚡⚡ | Ollama |
| **Phi-4 14B** | Fast chat | ⚡⚡⚡⚡ | Ollama |
| **Qwen Coder 7B** | Code generation | ⚡⚡⚡ | Ollama |
| **DeepSeek Coder 6.7B** | Code editing | ⚡⚡⚡ | Ollama |

**Cloud Fallbacks (Via OpenRouter Free Tier)**
| Model | Role | Speed | Version |
|-------|------|-------|---------|
| **GPT-OSS 120B** | Reasoning | ⚡ | v1.0.0 |
| **Llama 3.1 70B** | Analysis + code | ⚡⚡ | v1.2.0 |
| **Mistral Large** | Problem solving | ⚡ | v1.2.0 |
| **Qwen3 235B** | Deep analysis | ⚡ | v2.1.0 |
| **Claude 3.5 Haiku** | Fast agent | ⚡⚡⚡ | v2.0.0 |

---

## 📋 All Commands by Group & Version

**40 consolidated prompts** organized by group (Orchestrators, Review, Docs, System, Requirements, Cloud).

| Command | Purpose | Group | Added | Version |
|---------|---------|-------|-------|---------|
| **`/play`** | Master orchestrator — describe any task → auto-routes + executes | Orchestrator | v3.5.0 | v3.5.0 |
| **`/quick`** | Fast-path — quick fixes, reviews, tests (no planning) | Orchestrator | v2.9.0 | v2.9.0+ |
| **`/sec`** | Security router — scan, audit, zero-trust, compliance, pentest, incident, posture | Orchestrator | v2.9.0 | v2.9.0+ |
| **`/test`** | Testing router — unit tests, full suite, coverage, integration | Orchestrator | v2.9.0 | v2.9.0+ |
| **`/db`** | Database router — SQL optimization, schema review, design | Orchestrator | v2.9.0 | v2.9.0+ |
| **`/api`** | API router — scaffold endpoints, specs, gateways, webhooks | Orchestrator | v3.3.0 | v3.3.0+ |
| **`/arch`** | Architecture router — feature design, module refactor, system redesign | Orchestrator | v3.3.0 | v3.3.0+ |
| **`/deploy`** | Deployment router — Docker, Kubernetes, IaC, AWS, Azure | Orchestrator | v3.3.0 | v3.3.0+ |
| **`/data`** | Data fast-path — SQL optimization, schema, modeling | Orchestrator | v3.3.0 | v3.3.0+ |
| **`/frontend`** | Frontend router — components, design, accessibility, responsive | Orchestrator | v3.3.0 | v3.3.0+ |
| **`/ml`** | ML router — model design, training, MLOps, evaluation, features | Orchestrator | v3.4.0 | v3.4.0+ |
| **`/bi`** | BI router — schema, metrics, dashboards, warehouse, pipeline | Orchestrator | v3.4.0 | v3.4.0+ |
| `/review` | Full code review (bugs, security, patterns, refactor suggestions) | Review | v1.0.0 | v1.0.0+ |
| `/pr-review` | Pull request review (quality, security, perf, testing, docs) | Review | v2.0.0 | v2.0.0+ |
| `/inline-review` | Quick inline review (severity \| line \| issue \| fix) | Review | v1.1.0 | v1.1.0+ |
| `/quick-fix` | Auto-fix selected code (drop-in replacement, no explanation) | Review | v1.1.0 | v1.1.0+ |
| `/audit-all` | Combined security + perf + quality + coverage + docs audit | Review | v1.2.0 | v1.2.0+ |
| `/add-docs` | Add XML docs / JSDoc (on public members only) | Docs | v1.0.0 | v1.0.0+ |
| `/doc-complete` | Complete API documentation (XML docs + usage examples + README) | Docs | v1.1.0 | v1.1.0+ |
| `/explain-deep` | Deep explanation (problem, logic, design decisions, failure modes) | Explain | v1.0.0 | v1.0.0+ |
| `/explain-inline` | Inline comment explanations (// comments per line) | Explain | v1.1.0 | v1.1.0+ |
| `/add-types` | Add TypeScript / C# explicit types (any → types) | Docs | v1.1.0 | v1.1.0+ |
| `/think-through` | Step-by-step reasoning (chain-of-thought analysis) | Reasoning | v1.1.0 | v1.1.0+ |
| `/calibrate` | Calibrate model understanding (refine approach for context) | Reasoning | v2.0.0 | v2.0.0+ |
| `/workspace-learn` | Analyze conventions + detect patterns + suggest top 5 commands | System | v2.0.0 | v2.0.0+ |
| `/git-workflow` | Branch naming + Conventional Commits + squash strategy | System | v2.1.0 | v2.1.0+ |
| `/dep-update` | Audit dependencies (outdated, CVE-affected, breaking changes) | System | v2.1.0 | v2.1.0+ |
| `/observability-audit` | Audit logging, tracing, metrics, health checks | System | v2.1.0 | v2.1.0+ |
| `/migrate-version` | Framework/version upgrade plan with breaking changes | System | v1.2.0 | v1.2.0+ |
| `/requirements-to-specs` | Business requirement → tech spec (REQ-F/NF) | Requirements | v3.0.0 | v3.0.0+ |
| `/acceptance-criteria` | Tech spec → Gherkin acceptance criteria | Requirements | v3.0.0 | v3.0.0+ |
| `/risk-assessment` | Feasibility → risk register + Go/No-Go | Requirements | v3.0.0 | v3.0.0+ |
| `/requirements-review` | Quality audit → READY/NEEDS REVISION/BLOCKED | Requirements | v3.0.0 | v3.0.0+ |
| `/pp-requirements` | Execute full 4-phase chain end-to-end (HANDOFF BLOCKS) | Requirements | v3.1.0 | v3.1.0+ |
| `/docker-containerize` | Generate Dockerfile + Docker Compose + .dockerignore | Cloud | v2.4.0 | v2.4.0+ |
| `/kubernetes-deploy` | Generate K8s manifests (deployment, service, ingress, HPA) | Cloud | v2.4.0 | v2.4.0+ |
| `/iac-generate` | Generate Terraform or Bicep infrastructure code | Cloud | v2.4.0 | v2.4.0+ |
| `/aws-design` | Design AWS architecture (Lambda, RDS, DynamoDB, etc.) | Cloud | v2.4.0 | v2.4.0+ |
| `/azure-setup` | Generate Azure deployment (App Service, Functions, SQL, etc.) | Cloud | v2.4.0 | v2.4.0+ |

**Note**: All 40 commands work via intelligent routing. Type keyword after command — `/sec fix this` → Full OWASP audit + remediation

---

## 🎓 All Rules by Category & Version

**87 rules** organized by category and version (Core, Agent, Data, UX, UI, Cloud, Security, Integration, Mobile, AI, Requirements, Orchestration).

| Rule | Description | Category | Added | Version |
|------|-------------|----------|-------|---------|
| **smartworkz-core** | C# 12 (primary constructors), async/await, ILogger<T>, standalone Angular components | Core | v1.0.0 | v1.0.0+ |
| **dotnet-rules** | Controllers (API versioning), Services (DI), Repositories (Dapper + parameterized queries), FluentValidation | Core | v1.0.0 | v1.0.0+ |
| **angular-rules** | Standalone components only, inject() not constructor, OnPush detection, Signals over BehaviorSubject, typed forms | Core | v1.0.0 | v1.0.0+ |
| **sql-rules** | SET NOCOUNT ON, parameterized queries only, WITH (NOLOCK), temp tables > 10k rows, SARGable WHERE | Core | v1.0.0 | v1.0.0+ |
| **security-always** | No hardcoded secrets, parameterized queries, input sanitization, no PII in logs, DomSanitizer in Angular | Core | v1.0.0 | v1.0.0+ |
| **performance-audit** | SQL: avoid N+1, select columns, indexes \| C#: async/minimize allocations \| TS: lazy-load, OnPush | Core | v1.0.0 | v1.0.0+ |
| **agent-behavior** | Multi-step planning, verification, audit trails, error handling | Agent | v2.0.0 | v2.0.0+ |
| **pr-standards** | Max 400 lines, one feature per PR, linked to ticket, tests passing, CHANGELOG updated | Agent | v2.0.0 | v2.0.0+ |
| **code-review-standards** | Severity levels (Critical/Warning/Info), be specific, praise good code | Agent | v2.0.0 | v2.0.0+ |
| **ci-cd-standards** | Lint → Test → Build → Security → Coverage, hard blocks on failures | Agent | v2.0.0 | v2.0.0+ |
| **workspace-conventions** | Naming, folder structure, patterns, error handling, testing | Agent | v2.0.0 | v2.0.0+ |
| **database-design** | 1NF/2NF/3NF normalization, indexes on WHERE/JOIN/ORDER BY, FK constraints, soft delete, migrations | Data | v2.1.0 | v2.1.0+ |
| **observability-standards** | ILogger<T> structured logging, correlation IDs, metrics, health checks, no secrets in logs | Data | v2.1.0 | v2.1.0+ |
| **api-versioning** | URL versioning (/api/v1), 6-month deprecation notice, breaking vs non-breaking, migration guides | Data | v2.1.0 | v2.1.0+ |
| **input-validation** | Validation at boundaries, parameterized queries, sanitization, file upload safety | Data | v2.1.0 | v2.1.0+ |
| **git-workflow** | Branch: feature/id-description, Commits: Conventional, granular not squashed, conflict resolution | Data | v2.1.0 | v2.1.0+ |
| **ux-design-system** | Colors (60-30-10), typography (1.25 ratio), spacing (8pt grid), responsive, component library | UX | v2.2.0 | v2.2.0+ |
| **accessibility-wcag** | WCAG 2.1 AA: contrast 4.5:1, focus indicators, keyboard nav, ARIA, touch targets 44×44px | UX | v2.2.0 | v2.2.0+ |
| **responsive-mobile-first** | Base styles 320px, breakpoints, fluid typography (clamp), responsive images | UX | v2.2.0 | v2.2.0+ |
| **animation-motion** | GPU acceleration (transform/opacity only), durations 50-500ms, prefers-reduced-motion | UX | v2.2.0 | v2.2.0+ |
| **design-tokens** | CSS variables: semantic naming, dark mode, Figma sync | UX | v2.2.0 | v2.2.0+ |
| **advanced-css** | CSS Grid, Flexbox, custom properties, responsive strategies, containment | UI | v2.3.0 | v2.3.0+ |
| **state-management** | Immutability, reactive flows, Redux/Context patterns, debugging tools | UI | v2.3.0 | v2.3.0+ |
| **form-patterns** | Validation (client + server), async validation, multi-step flows, accessibility | UI | v2.3.0 | v2.3.0+ |
| **performance-optimization** | Bundle analysis, lazy loading, caching, rendering optimization, Core Web Vitals | UI | v2.3.0 | v2.3.0+ |
| **aws-patterns** | Lambda (cold start opt), RDS (multi-AZ), DynamoDB (TTL, GSI), API Gateway (throttling), CloudFront | Cloud | v2.4.0 | v2.4.0+ |
| **azure-deployment** | App Service, Azure Functions, SQL Database, Cosmos DB, Key Vault, monitoring | Cloud | v2.4.0 | v2.4.0+ |
| **docker-kubernetes** | Dockerfile optimization, Docker Compose, K8s manifests, Helm charts, resource limits | Cloud | v2.4.0 | v2.4.0+ |
| **infrastructure-iac** | Terraform (state management), CloudFormation, Bicep, GitOps | Cloud | v2.4.0 | v2.4.0+ |
| **ci-cd-automation** | GitHub Actions, Azure Pipelines, blue-green deployments, secrets in CI/CD | Cloud | v2.4.0 | v2.4.0+ |
| **zero-trust-security** | Identity verification (MFA), least privilege, network segmentation, encryption (TLS/AES-256), audit trails | Security | v2.5.0 | v2.5.0+ |
| **compliance-standards** | SOC 2 Type II, ISO 27001, HIPAA (Privacy/Security Rules), PCI-DSS (tokenization, CDE) | Security | v2.5.0 | v2.5.0+ |
| **incident-response** | IR playbook, severity levels, war room setup, blameless post-mortems, 5 whys | Security | v2.5.0 | v2.5.0+ |
| **threat-modeling** | STRIDE methodology, attack trees, risk assessment, threat actor analysis | Security | v2.5.0 | v2.5.0+ |
| **security-posture** | Vulnerability inventory, risk matrix, controls gap analysis, improvement roadmap | Security | v2.5.0 | v2.5.0+ |
| **event-driven-architecture** | CQRS, event sourcing, saga pattern, eventual consistency, DLQ | Integration | v2.6.0 | v2.6.0+ |
| **api-composition** | Gateway patterns, aggregation, caching, circuit breakers, rate limiting | Integration | v2.6.0 | v2.6.0+ |
| **message-queues** | RabbitMQ/Kafka, queues vs topics, DLQ, idempotency, ordering | Integration | v2.6.0 | v2.6.0+ |
| **webhook-standards** | HTTPS, HMAC signatures, retries with backoff, delivery guarantees | Integration | v2.6.0 | v2.6.0+ |
| **integration-testing** | Contract tests, E2E tests, test data management, test isolation | Integration | v2.6.0 | v2.6.0+ |
| **mobile-development** | iOS (Swift, SwiftUI), Android (Kotlin, Jetpack), React Native, Flutter standards | Mobile | v2.7.0 | v2.7.0+ |
| **cross-platform-design** | Platform abstraction layer, UI adaptation per platform, design tokens | Mobile | v2.7.0 | v2.7.0+ |
| **offline-first** | Local data store, event logs, sync strategies, conflict resolution | Mobile | v2.7.0 | v2.7.0+ |
| **mobile-security** | Credentials storage, OAuth 2.0 + PKCE, HTTPS, certificate pinning, jailbreak detection | Mobile | v2.7.0 | v2.7.0+ |
| **app-distribution** | App store submission, versioning, beta testing, signing, monitoring, analytics | Mobile | v2.7.0 | v2.7.0+ |
| **honesty-and-uncertainty** | Signal confidence levels, never fabricate paths/functions, flag assumptions | AI | v2.8.0 | v2.8.0+ |
| **adaptive-reasoning** | Chain-of-thought for complex answers, step-by-step logic for non-trivial problems | AI | v2.8.0 | v2.8.0+ |
| **session-context** | Reference prior decisions, flag contradictions, carry context between turns | AI | v2.8.0 | v2.8.0+ |
| **requirements-elicitation** | User story format (As a... I want... so that...), INVEST principles, Gherkin format | Requirements | v3.0.0 | v3.0.0+ |
| **feasibility-assessment** | 3-dimension analysis (Technical/Resource/Timeline), risk tiers, spike decisions | Requirements | v3.0.0 | v3.0.0+ |
| **orchestration-routing** | Tiebreaker precedence (Security > Requirements > Testing > DB > Perf > ML > BI > Review), auto-cascade | Orchestration | v3.2.0 | v3.2.0+ |

**Total**: 47 rules shown (+ 40 additional domain-specific rules in `.continue/rules/` files)

---

## 📦 Command Consolidation (v3.5.0)

**Total Commands**: 92 (v3.4.0) → **40 (v3.5.0)** = **56% reduction**

Consolidated commands use internal routing based on keywords and context.

### Consolidation Summary

| Old Commands (Removed) | Now Use | Internal Routes |
|---|---|---|
| /security-scan, /security-agent, /zero-trust-design, /compliance-audit, /pentest-plan, /incident-response, /security-posture | **`/sec`** | OWASP scan → audit+fix → zero-trust → compliance → pentest → incident → posture |
| /add-tests, /generate-tests-complete, /coverage-gaps, /integration-test-design | **`/test`** | Unit → full suite → gaps → integration |
| /optimize-sql, /database-design, /data-model | **`/db`** | SQL optimize → schema review → schema design |
| /api-endpoint, /api-contract, /api-composition, /webhook-implementation | **`/api`** | Generate endpoint → OpenAPI spec → gateway → webhook |
| /architecture-design, /refactor-module, /refactor-large, /refactor-inline | **`/arch`** | Feature design → module refactor → large refactor |
| /ng-component, /design-audit, /design-system, /responsive-design, /design-component, /design-tokens, /motion-design, /animation-design, /component-library, /storybook-setup, /table-design, /chart-design | **`/frontend`** | Component → audit → system → responsive → UX → animations → tables/charts |
| /ml-model-design, /training-pipeline, /mlops-setup, /model-evaluation, /feature-engineering | **`/ml`** | Design → training → MLOps → evaluate → features |
| /bi-schema, /metric-definition, /dashboard-design, /data-warehouse, /analytics-pipeline | **`/bi`** | Schema → metrics → dashboard → warehouse → pipeline |

---

## 📚 Documentation & Release Notes

### Setup & Guides
| Guide | Purpose | Location |
|-------|---------|----------|
| **Setup Guide** | Installation & configuration | [docs/reference/setup/SETUP-ENVIRONMENT.md](./reference/setup/SETUP-ENVIRONMENT.md) |
| **Troubleshooting** | Common issues & solutions | [docs/reference/setup/TROUBLESHOOTING.md](./reference/setup/TROUBLESHOOTING.md) |
| **Orchestrator Modes** | All modes & routing logic | [wiki/03-Orchestrator-Modes-v3.2.0.md](../wiki/03-Orchestrator-Modes-v3.2.0.md) |

### Release Notes by Version

**Latest**: [RELEASE-v3.5.0.md](./releases/RELEASE-v3.5.0.md) — Command Consolidation (92 → 40)

**All Releases**:
| Version | Focus | Link |
|---------|-------|------|
| **v3.5.0** | Command Consolidation (92 → 40 orchestrators) | [RELEASE-v3.5.0.md](./releases/RELEASE-v3.5.0.md) |
| **v3.4.0** | Machine Learning & Business Intelligence | [RELEASE-v3.4.0.md](./releases/RELEASE-v3.4.0.md) |
| **v3.3.0** | Domain Shortcuts (/api, /arch, /deploy, /data, /frontend) | [RELEASE-v3.3.0.md](./releases/RELEASE-v3.3.0.md) |
| **v3.2.0** | Orchestrator Hardening (tiebreaker, routing) | [RELEASE-v3.2.0.md](./releases/RELEASE-v3.2.0.md) |
| **v3.1.0** | Shared Memory & Cross-Agent Context | [RELEASE-v3.1.0.md](./releases/RELEASE-v3.1.0.md) |
| **v3.0.0** | Requirements Phase Chain (4-phase specs) | [RELEASE-v3.0.0.md](./releases/RELEASE-v3.0.0.md) |
| **v2.9.0** | Core Orchestrators & Intelligent Routing | [RELEASE-v2.9.0.md](./releases/RELEASE-v2.9.0.md) |
| **v2.8.0** | AI Behavior & Response Patterns | [RELEASE-v2.8.0.md](./releases/RELEASE-v2.8.0.md) |
| **v2.7.0** | Mobile & Cross-Platform Development | [RELEASE-v2.7.0.md](./releases/RELEASE-v2.7.0.md) |
| **v2.6.0** | Integration & APIs | [RELEASE-v2.6.0.md](./releases/RELEASE-v2.6.0.md) |
| **v2.5.0** | Security & Compliance | [RELEASE-v2.5.0.md](./releases/RELEASE-v2.5.0.md) |
| **v2.4.0** | Cloud & DevOps | [RELEASE-v2.4.0.md](./releases/RELEASE-v2.4.0.md) |
| **v2.3.0** | Advanced UI Design | [RELEASE-v2.3.0.md](./releases/RELEASE-v2.3.0.md) |
| **v2.2.0** | UX Design Standards | [RELEASE-v2.2.0.md](./releases/RELEASE-v2.2.0.md) |
| **v2.1.0** | Data & Observability | [RELEASE-v2.1.0.md](./releases/RELEASE-v2.1.0.md) |
| **v2.0.0** | Agent Era Rules | [RELEASE-v2.0.0.md](./releases/RELEASE-v2.0.0.md) |
| **v1.2.0** | Core Rules Expansion | [RELEASE-v1.2.0.md](./releases/RELEASE-v1.2.0.md) |
| **v1.1.0** | Initial Release | [RELEASE-v1.1.0.md](./releases/RELEASE-v1.1.0.md) |

---

## 🔄 Version History & Features

| Version | Release Date | Focus | Commands | Rules | Key Features |
|---------|---|---|---|---|---|
| **v3.5.0** | 2026-04-09 | Consolidation | 40 | 87 | Command consolidation (92→40), renamed /pp→/play, internal routing, mapping docs |
| **v3.4.0** | 2026-04-09 | ML/BI Domains | 92 | 87 | 12 ML/BI prompts, /ml and /bi shortcuts, ML/BI tiebreaker |
| **v3.3.0** | 2026-04-09 | Domain Shortcuts | 80 | 87 | /api, /arch, /deploy, /data, /frontend shortcuts, Step 6 DISCOVERY |
| **v3.2.0** | 2026-04-09 | Orchestrator Hardening | 75 | 60 | Tiebreaker rule, orphaned commands routing, fallback, auto-cascade |
| **v3.1.0** | 2026-04-09 | Shared Memory Orchestrator | 75 | 59 | /pp-requirements mega-agent, HANDOFF BLOCKS |
| **v3.0.0** | 2026-04-09 | Requirements Phase | 74 | 59 | 4-phase requirements chain, REQ-F/NF specs |
| **v2.9.0** | 2026-04-09 | Orchestrator System | 70 | 57 | /pp master router, /quick /sec /test /db fast-paths |
| **v2.8.0** | 2026-04-09 | AI Behavior Rules | 63 | 57 | Honesty, adaptive-reasoning, session-context rules |
| **v2.7.0** | 2026-04-09 | Mobile & Cross-Platform | 63 | 54 | iOS, Android, React Native, Flutter, offline-sync |
| **v2.6.0** | 2026-04-09 | Integration & APIs | 58 | 49 | Event-driven, API composition, message queues, webhooks |
| **v2.5.0** | 2026-04-09 | Security & Compliance | 53 | 44 | Zero-trust, SOC 2, ISO 27001, HIPAA, PCI-DSS, pentest, IR |
| **v2.4.0** | 2026-04-09 | Cloud & DevOps | 48 | 39 | AWS, Azure, Docker, Kubernetes, Terraform, CI/CD |
| **v2.3.0** | 2026-04-09 | Advanced UI Patterns | 43 | 34 | Components, data viz, tables, Storybook, performance |
| **v2.2.0** | 2026-04-09 | UX Design Agent | 38 | 29 | Design systems, WCAG accessibility, responsive design |
| **v2.1.0** | 2026-04-09 | Data & Observability | 33 | 24 | Database design, structured logging, API versioning, git workflow |
| **v2.0.0** | 2026-04-09 | Agent-Era Standards | 28 | 19 | Autonomous agents, PR review, coverage gaps, security audit, perf optimize |
| **v1.2.0** | 2026-04-09 | Complete Testing & Docs | 23 | 14 | Test generation, complete docs, refactoring, migrations, full audits |
| **v1.1.0** | 2026-04-09 | Inline Powers | 18 | 9 | Inline review, quick-fix, explain-inline, refactor-inline, add-types |
| **v1.0.1** | 2026-04-09 | Security Patch | 13 | 9 | API keys → env variables, .env.example |
| **v1.0.0** | 2026-04-09 | Initial Release | 13 | 9 | Core models, rules, prompts, MCP servers |

---

## 🏗️ Architecture Overview

```
SmartWorkz PowerPlay v3.5.0 — Streamlined Config
├── config.yaml (consolidated & grouped)
│   ├── Models (14): 5 local + 9 cloud fallbacks
│   ├── Rules (87): organized by category & version
│   └── Prompts (40): consolidated orchestrators + utilities
│
├── Rules Engine (87 rules by category & version)
│   ├── Core (6): smartworkz-core, dotnet, angular, sql, security, performance
│   ├── v2.0.0 Agent (5): agent-behavior, PR, code-review, CI/CD, workspace
│   ├── v2.1.0 Data (5): database, observability, API, validation, git
│   ├── v2.2.0 UX (5): design-system, accessibility, responsive, animations, tokens
│   ├── v2.3.0 Advanced (4): CSS, state, forms, performance
│   ├── v2.4.0 Cloud (5): AWS, Azure, Docker, IaC, CI/CD
│   ├── v2.5.0 Security (5): zero-trust, compliance, incident, threat, posture
│   ├── v2.6.0 Integration (5): event-driven, composition, queues, webhooks, testing
│   ├── v2.7.0 Mobile (5): native, cross-platform, offline, security, distribution
│   ├── v2.8.0 AI Behavior (3): honesty, adaptive-reasoning, session-context
│   ├── v3.0.0 Requirements (2): elicitation, feasibility
│   └── v3.2.0 Orchestration (1): routing-intelligence
│
├── Orchestrators (40 commands, consolidated)
│   ├── Master: /play (auto-routes)
│   ├── Fast-Paths: /quick, /sec, /test, /db, /api, /arch, /deploy, /data, /frontend, /ml, /bi
│   ├── Code Actions: /review, /pr-review, /inline-review, /quick-fix, /add-docs, /doc-complete, /add-types
│   ├── Explain: /explain-deep, /explain-inline, /think-through, /calibrate
│   ├── System: /workspace-learn, /git-workflow, /dep-update, /observability-audit, /migrate-version
│   ├── Requirements: /pp-requirements, /requirements-to-specs, /acceptance-criteria, /risk-assessment, /requirements-review
│   └── Cloud: /docker-containerize, /kubernetes-deploy, /iac-generate, /aws-design, /azure-setup
│
├── Internal Routing Tables
│   ├── /play: 6-level tiebreaker (Security > Requirements > Testing > DB > Performance > ML > BI > Code Review)
│   ├── /sec: keyword matching → 7 sub-actions
│   ├── /test: scope detection → 4 sub-actions
│   ├── /db: content analysis → 3 sub-actions
│   └── (similar for /api, /arch, /frontend, /ml, /bi)
│
└── Documentation
    ├── CONSOLIDATION-MAPPING-v3.5.0.md: Detailed mapping of removed commands
    ├── QUICK-REFERENCE-v3.5.0.md: One-page command guide
    ├── CHANGELOG.md: Version history with migration guides
    └── wiki/03-Orchestrator-Modes-v3.2.0.md: Modes & routing logic
```

---

## 🎯 Key Advantages of v3.5.0

✅ **Simplified Command Set**: 92 → 40 commands (56% reduction)  
✅ **Intelligent Routing**: Internal dispatch based on keywords and context  
✅ **Complete Coverage**: No functionality lost in consolidation  
✅ **Better Naming**: Intuitive command names (/frontend not /ng-component + /design-audit + /responsive-design)  
✅ **Consistent Patterns**: All orchestrators follow same routing structure  
✅ **Faster Discovery**: /play routes to the right sub-action automatically  
✅ **Easy Maintenance**: Fewer prompts, centralized routing logic  
✅ **Comprehensive Mapping**: Full documentation of consolidation  

---

## 🗺️ Command Consolidation Mapping (v3.5.0)

The consolidation merged 52 redundant commands into 8 intelligent orchestrators. Here's the complete mapping:

### Security Domain (`/sec`)

| Old Command | New Route | Trigger Keywords |
|---|---|---|
| `/security-scan` | `/sec` → OWASP scan | code selected, no "fix" |
| `/security-agent` | `/sec` → OWASP + fixes | code selected + "fix/remediate" |
| `/zero-trust-design` | `/sec` → Zero-trust | "zero trust", "architecture", "design" |
| `/compliance-audit` | `/sec` → Compliance | "SOC 2", "ISO 27001", "HIPAA", "PCI-DSS" |
| `/pentest-plan` | `/sec` → Pentest | "pentest", "penetration", "ethical hack" |
| `/incident-response` | `/sec` → Incident response | "incident", "outage", "breach", "post-mortem" |
| `/security-posture` | `/sec` → Posture assessment | "posture", "overall", "gaps", "roadmap" |

**Usage**: `/sec fix this vulnerability` → Full audit + remediation

---

### Testing Domain (`/test`)

| Old Command | New Route | Trigger Keywords |
|---|---|---|
| `/add-tests` | `/test` → Unit tests | code < 50 lines, "unit test" |
| `/generate-tests-complete` | `/test` → Full suite | code > 200 lines, "full suite" |
| `/coverage-gaps` | `/test` → Gap analysis | "coverage", "gaps", "what's not tested" |
| `/integration-test-design` | `/test` → Integration tests | "integration", "contract", "E2E", "multiple services" |

**Usage**: `/test find coverage gaps` → Gap analysis + test recommendations

---

### Database Domain (`/db`)

| Old Command | New Route | Trigger Keywords |
|---|---|---|
| `/optimize-sql` | `/db` → SQL optimization | stored procedure or SQL query |
| `/database-design` | `/db` → Schema review | CREATE TABLE statements |
| `/data-model` | `/db` → Schema design | plain-language requirements |

**Usage**: `/db optimize this query` → Performance improvements + index recommendations

---

### API Domain (`/api`)

| Old Command | New Route | Trigger Keywords |
|---|---|---|
| `/api-endpoint` | `/api` → Generate endpoint | "generate", "create", "scaffold", "new endpoint" |
| `/api-contract` | `/api` → OpenAPI spec | "OpenAPI", "swagger", "spec", "document" |
| `/api-composition` | `/api` → Gateway design | "gateway", "compose", "aggregate", "BFF" |
| `/webhook-implementation` | `/api` → Webhook setup | "webhook", "event delivery", "signature" |

**Usage**: `/api generate user registration endpoint` → Complete ASP.NET Core endpoint + DTOs + validation

---

### Architecture Domain (`/arch`)

| Old Command | New Route | Trigger Keywords |
|---|---|---|
| `/architecture-design` | `/arch` → Feature design | "design", "plan", "structure", "feature" |
| `/refactor-module` | `/arch` → Module refactor | code selected + "refactor", "module", "extract" |
| `/refactor-large` | `/arch` → Large refactor | "large", "multi-step", "significant changes" |
| `/refactor-inline` | `/arch` → Quick refactor | "refactor", "simplify", "clean up" |

**Usage**: `/arch design user authentication feature` → ASCII diagram + layer plan + DI registration

---

### Frontend Domain (`/frontend`)

| Old Command | New Route | Trigger Keywords |
|---|---|---|
| `/ng-component` | `/frontend` → Component | "Angular", "component", "standalone", "inject" |
| `/design-audit` | `/frontend` → Audit | "WCAG", "accessibility", "audit", "contrast" |
| `/design-system` | `/frontend` → Design system | "design system", "tokens", "theme" |
| `/responsive-design` | `/frontend` → Responsive | "responsive", "layout", "breakpoint", "mobile" |
| `/design-component` | `/frontend` → UX component | "design", "UX", "component", "pattern" |
| `/component-library` | `/frontend` → Library | "Material", "Chakra", "Tailwind", "components" |
| `/motion-design` | `/frontend` → Animations | "animation", "motion", "transition", "GPU" |
| `/table-design` | `/frontend` → Table | "table", "grid", "data grid", "virtualize" |
| `/chart-design` | `/frontend` → Chart | "chart", "visualization", "graph", "diagram" |
| `/storybook-setup` | `/frontend` → Storybook | "storybook", "documentation", "chromatic" |

**Usage**: `/frontend generate login component` → Angular 17+ standalone component + service + styling

---

### Deployment Domain (`/deploy`)

| Old Command | New Route | Trigger Keywords |
|---|---|---|
| `/docker-containerize` | `/deploy` → Docker | "Docker", "container", "Dockerfile", "containerise" |
| `/kubernetes-deploy` | `/deploy` → Kubernetes | "Kubernetes", "K8s", "manifest", "Helm", "cluster" |
| `/iac-generate` | `/deploy` → IaC | "Terraform", "Bicep", "IaC", "infrastructure as code" |
| `/aws-design` | `/deploy` → AWS | "AWS", "Lambda", "S3", "RDS", "CloudFront" |
| `/azure-setup` | `/deploy` → Azure | "Azure", "App Service", "Functions", "CosmosDB", "AKS" |

**Usage**: `/deploy containerise this .NET app` → Multi-stage Dockerfile + Docker Compose + .dockerignore

---

### Data Domain (`/data`)

| Old Command | New Route | Trigger Keywords |
|---|---|---|
| `/optimize-sql` | `/data` → SQL optimization | stored procedure or SQL query |
| `/database-design` | `/data` → Schema review | CREATE TABLE statements |
| `/data-model` | `/data` → Schema design | plain-language requirements |

**Usage**: `/data design user registration schema` → CREATE TABLE + indexes + normalization

---

## ⚡ Quick Reference — Quick Decision Tree

**I want to...** → **Use This**

| Task | Command | Sub-Actions |
|------|---------|------------|
| Describe task in plain English | `/play` | Auto-routes based on keywords |
| Get something done FAST | `/quick` | Fix, review, test, doc, type, explain |
| Review code for issues | `/review` or `/inline-review` | Full audit or quick inline |
| Test code | `/test` | Unit → full suite → gaps → integration |
| Optimize database or schema | `/db` | SQL optimize → schema review → design |
| Create/audit APIs | `/api` | Scaffold → spec → gateway → webhook |
| Design/refactor architecture | `/arch` | Feature design → module refactor → system redesign |
| Build frontend components | `/frontend` | Component → audit → system → responsive → animations |
| Assess security | `/sec` | Scan → audit+fix → zero-trust → compliance → pentest → incident |
| Deploy to cloud | `/deploy` | Docker → Kubernetes → IaC → AWS → Azure |
| Optimize SQL queries | `/db` or `/data` | Execution plan → indexes → refactor |
| Document code | `/add-docs` | Inline, JSDoc, README, XML |
| Understand code deeply | `/explain-deep` | Problem, logic, design decisions, failure modes |
| Learn about project | `/workspace-learn` | Analyze conventions + suggest top 5 commands |
| Build full requirements spec | `/pp-requirements` | Full 4-phase chain |

---

## 📖 Removed Commands Reference

All 52 removed commands are now consolidated. Here's where each one went:

| Removed (v3.4.0) | Now Use (v3.5.0) | Example |
|---|---|---|
| `/security-scan` | `/sec` | `/sec` (code selected) |
| `/security-agent` | `/sec` | `/sec fix this` |
| `/zero-trust-design` | `/sec` | `/sec design zero-trust architecture` |
| `/compliance-audit` | `/sec` | `/sec audit SOC 2 compliance` |
| `/pentest-plan` | `/sec` | `/sec create pentest plan` |
| `/incident-response` | `/sec` | `/sec incident response for breach` |
| `/security-posture` | `/sec` | `/sec assess security posture` |
| `/add-tests` | `/test` | `/test [small code]` |
| `/generate-tests-complete` | `/test` | `/test [large code]` |
| `/coverage-gaps` | `/test` | `/test find coverage gaps` |
| `/integration-test-design` | `/test` | `/test design integration tests` |
| `/optimize-sql` | `/db` or `/data` | `/db [SQL query]` |
| `/database-design` | `/db` or `/data` | `/db [CREATE TABLE]` |
| `/data-model` | `/db` or `/data` | `/db design schema for users` |
| `/api-endpoint` | `/api` | `/api generate user endpoint` |
| `/api-contract` | `/api` | `/api create OpenAPI spec` |
| `/api-composition` | `/api` | `/api design API gateway` |
| `/webhook-implementation` | `/api` | `/api implement webhook` |
| `/architecture-design` | `/arch` | `/arch design new feature` |
| `/refactor-module` | `/arch` | `/arch refactor this module` |
| `/refactor-large` | `/arch` | `/arch plan full system redesign` |
| `/refactor-inline` | `/arch` | `/arch simplify this class` |
| `/ng-component` | `/frontend` | `/frontend generate Angular component` |
| `/design-audit` | `/frontend` | `/frontend audit accessibility` |
| `/design-system` | `/frontend` | `/frontend design component library` |
| `/responsive-design` | `/frontend` | `/frontend create responsive layout` |
| `/design-component` | `/frontend` | `/frontend design UX component` |
| `/component-library` | `/frontend` | `/frontend show Material patterns` |
| `/motion-design` | `/frontend` | `/frontend design animations` |
| `/animation-design` | `/frontend` | `/frontend add motion transitions` |
| `/table-design` | `/frontend` | `/frontend design data table` |
| `/chart-design` | `/frontend` | `/frontend create visualization` |
| `/storybook-setup` | `/frontend` | `/frontend setup Storybook` |
| `/docker-containerize` | `/deploy` | `/deploy containerise this app` |
| `/kubernetes-deploy` | `/deploy` | `/deploy generate K8s manifests` |
| `/iac-generate` | `/deploy` | `/deploy generate Terraform` |
| `/aws-design` | `/deploy` | `/deploy design AWS architecture` |
| `/azure-setup` | `/deploy` | `/deploy generate Azure deployment` |
| `/ml-model-design` | `/ml` | `/ml design classification model` |
| `/training-pipeline` | `/ml` | `/ml design training pipeline` |
| `/mlops-setup` | `/ml` | `/ml setup MLOps infrastructure` |
| `/model-evaluation` | `/ml` | `/ml evaluate model performance` |
| `/feature-engineering` | `/ml` | `/ml design feature engineering` |
| `/bi-schema` | `/bi` | `/bi design analytics schema` |
| `/metric-definition` | `/bi` | `/bi define KPIs` |
| `/dashboard-design` | `/bi` | `/bi design analytics dashboard` |
| `/data-warehouse` | `/bi` | `/bi design data warehouse` |
| `/analytics-pipeline` | `/bi` | `/bi design dbt pipeline` |

---

## 📞 Support & Contribution

- **Issues**: [GitHub Issues](https://github.com/SmartWorkz-Dev/PowerPlay/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SmartWorkz-Dev/PowerPlay/discussions)
- **Contributing**: See [CONTRIBUTING.md](../CONTRIBUTING.md)

---

**Latest Version**: [v3.5.0](https://github.com/SmartWorkz-Dev/PowerPlay/releases/tag/v3.5.0) (Command Consolidation & Streamlined Config)

**Last Updated**: 2026-04-09
