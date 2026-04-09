# SmartWorkz PowerPlay

> Cursor-level AI code editor power. Windsurf agent autonomy. **Zero cost.** For [Continue.dev](https://continue.dev)

[![Version: 3.2.0](https://img.shields.io/badge/version-3.2.0-blue)](./CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)]()
[![Stack: .NET + Angular + Mobile](https://img.shields.io/badge/stack-.NET%20%2B%20Angular%20%2B%20Mobile-blueviolet)]()
[![Rules: 60](https://img.shields.io/badge/rules-60-brightgreen)]()
[![Prompts: 75](https://img.shields.io/badge/prompts-75-brightgreen)]()
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
4. Type "/" → See 75+ prompts ✅
5. Try: /pp or /quick or /sec or /test or /db for smart routing
```

**See also**: [Setup Guide](./reference/setup/SETUP-ENVIRONMENT.md) for detailed setup guide

### 4. Restart Continue
- VS Code: Ctrl+Shift+P → "Reload Window"
- JetBrains: Restart IDE
- Continue will load .env automatically

### 5. Verify Setup
- Open Continue chat (Ctrl+M)
- Type: `What models do I have?`
- Should respond using **Qwen 3.5 9B** (local) or **GPT-OSS** (cloud) ✅

---

## 📊 What's Included

### Models (14 Total)

**Local (5 models)**
| Model | Role | Speed |
|-------|------|-------|
| **Qwen 3.5 9B** | Chat | ⚡⚡⚡ |
| **DeepSeek R1 8B** | Reasoning | ⚡ |
| **Phi4 Mini** | Fast chat | ⚡⚡⚡⚡ |
| **Qwen Coder** | Code apply/edit | ⚡⚡ |
| **DeepSeek Coder 6.7B** | Code edit | ⚡⚡ |

**Cloud (9 models via OpenRouter)**
| Model | Role | Speed | Type |
|-------|------|-------|------|
| **Llama 3.1 70B** | Reasoning | ⚡ | v1.2.0 |
| **Mistral Large** | Analysis | ⚡ | v1.2.0 |
| **Claude 3.5 Haiku** | Fast agent | ⚡⚡⚡ | v2.0.0 |
| **DeepSeek V3** | Code generation | ⚡⚡ | v2.0.0 |
| **Qwen3 235B** | Deep analysis | ⚡ | v2.1.0 |
| **GPT-OSS 120B** | Reasoning | ⚡ | v1.0.0 |
| **MiniMax M2.5** | Creative | ⚡ | v1.0.0 |
| **Qwen3 Coder** | Code | ⚡ | v1.0.0 |
| **Gemma 4 26B** | Reasoning | ⚡ | v1.0.0 |

### Rules (54 Categories)

**Core Rules (6)**
- **smartworkz-core**: C# 12, async/await, ILogger<T>
- **dotnet-rules**: Controllers, Services, Repositories, FluentValidation
- **angular-rules**: Standalone components, inject(), OnPush, Signals
- **sql-rules**: Parameterized queries, NOLOCK, SARGable WHERE
- **security-always**: No hardcoded secrets, input sanitization, XSS protection
- **testing-pyramid**: AAA pattern, 70/20/10 coverage ratios, Moq patterns

**v2.0.0 Agent-Era Rules (5)**
- **agent-behavior**: Autonomous agents, plan-before-execute, verification, audit trails
- **pr-standards**: PR size limits (< 400 lines), description format, review checklist
- **code-review-standards**: Severity levels, approval criteria, disagreement handling
- **ci-cd-standards**: Pipeline stages, hard blocks, environment promotion, rollback
- **workspace-conventions**: Naming, folder structure, patterns, error handling, testing

**v2.1.0 Data & Observability Rules (5)**
- **database-design**: Normalization (1NF/2NF/3NF), indexes, constraints, soft delete, migrations
- **observability-standards**: Structured logging, correlation IDs, metrics, health checks
- **api-versioning**: URL versioning, deprecation (6-month notice), breaking changes
- **input-validation**: Validation at boundaries, parameterized queries, sanitization
- **git-workflow**: Branch naming, Conventional Commits, squash strategy, conflict resolution

**v2.2.0 UX Design Agent Rules (4)**
- **ux-design**: Component design, accessibility (WCAG 2.1), responsive patterns, design systems
- **component-library**: Reusable component patterns, API design, documentation standards
- **user-experience**: User flows, interaction patterns, usability heuristics
- **design-accessibility**: Accessibility standards, color contrast, keyboard navigation, screen readers

**v2.3.0 Advanced UI Patterns Rules (5)**
- **advanced-css**: CSS Grid, Flexbox, custom properties, responsive strategies
- **animations**: CSS animations, transitions, performance optimization, accessibility
- **state-management**: State patterns, immutability, reactive flows, debugging
- **form-patterns**: Form validation, async validation, multi-step flows, accessibility
- **performance-optimization**: Bundle analysis, lazy loading, caching, rendering optimization

**v2.4.0 Cloud & DevOps Rules (5)**
- **cloud-architecture**: Cloud design patterns, auto-scaling, load balancing, disaster recovery
- **cicd-standards**: Pipeline design, deployment strategies, rollback procedures, monitoring
- **containerization**: Docker best practices, multi-stage builds, security scanning
- **kubernetes**: K8s manifests, helm charts, resource management, networking
- **infrastructure-as-code**: IaC patterns, terraform, parameterization, version control

**v2.5.0 Security & Compliance Rules (5)**
- **zero-trust-security**: Zero-trust architecture, identity-based access, continuous verification
- **compliance-standards**: SOC 2, ISO 27001, HIPAA, PCI-DSS compliance checklists
- **incident-response**: Incident response playbooks, post-mortem templates, communication
- **threat-modeling**: STRIDE methodology, attack trees, risk assessment
- **security-posture**: Security assessment framework, vulnerability management, gap analysis

**v2.6.0 Integration & APIs Rules (5)**
- **event-driven-architecture**: CQRS, event sourcing, sagas, eventual consistency
- **api-composition**: API gateway patterns, aggregation, caching, resilience patterns
- **message-queues**: RabbitMQ/Kafka patterns, ordering, dead-letter queues
- **webhook-standards**: Webhook implementation, retries, idempotency, signatures
- **integration-testing**: Contract testing, E2E testing, test data management

**v2.7.0 Mobile & Cross-Platform Rules (5)**
- **mobile-development**: iOS Swift, Android Kotlin, React Native, Flutter standards
- **cross-platform-design**: Platform abstraction, UI adaptation, design tokens
- **offline-first**: Local data stores, event logs, sync strategies, conflict resolution
- **mobile-security**: Credential storage, OAuth 2.0, certificate pinning, jailbreak detection
- **app-distribution**: App store submission, versioning, beta testing, signing, monitoring

### Prompts (75 Commands)

**Core Commands (10)**
```
/review              Full code review (bugs, security, patterns)
/optimize-sql        Optimize SQL procedures + indexes
/add-tests           Generate xUnit tests with Moq
/add-docs            Add XML documentation comments
/ng-component        Generate Angular 17 standalone component
/api-endpoint        Generate complete .NET 8 API endpoint
/security-scan       OWASP Top 10 audit
/explain-deep        Deep explanation with ASCII diagrams
/performance-check   Identify N+1, allocations, blocking awaits
/memory-audit        Detect memory leaks and disposal issues
```

**v1.1.0-v1.2.0 Utility Commands (13)**
```
/inline-review       Inline code review with severity levels
/quick-fix           Auto-fix selected code
/explain-inline      Add inline comments explaining code
/refactor-inline     Single transformation (extract, simplify, modernize)
/add-types           Add TypeScript/C# explicit types
/database-design     Review or generate database schema
/architecture-design System architecture advice
/refactor-large      Plan large refactoring with ordered steps
/generate-tests-complete  Generate complete test suite (unit + integration + edge cases)
/doc-complete        Generate full API documentation
/refactor-module     Analyse module + refactoring plan
/migrate-version     Framework/version upgrade migration plan
/audit-all           Full audit (security + performance + quality + coverage + docs)
```

**v2.0.0 Agent Commands (5)**
```
/pr-review           Autonomous PR review (quality, security, performance, testing, docs)
/coverage-gaps       Find test coverage gaps, generate test cases
/security-agent      OWASP Top 10 security audit with remediation
/perf-optimize       Profile, identify bottlenecks, suggest optimizations
/workspace-learn     Analyse project conventions, generate onboarding summary
```

**v2.1.0 Data & Observability Commands (5)**
```
/data-model          Design or review database schema (normalization, indexes, constraints)
/observability-audit Audit logging, tracing, metrics (find gaps, suggest fixes)
/api-contract        Generate OpenAPI 3.0 spec for API endpoints
/git-workflow        Git branch naming, commit rewrite, squash plan
/dep-update          Audit dependencies (outdated, CVE, safe update path)
```

**v2.2.0 UX Design Agent Commands (5)**
```
/ux-audit            Audit UX/UI for accessibility, usability, design consistency
/component-design    Design reusable component library
/user-flow           Design user flows and wireframes
/accessibility-scan  WCAG 2.1 accessibility audit
/design-system       Create design system documentation
```

**v2.3.0 Advanced UI Patterns Commands (5)**
```
/advanced-layout     Complex layout system design (CSS Grid, Flexbox, responsive)
/animation-design    Design animations and micro-interactions
/state-management    Design application state management strategy
/form-design         Advanced form patterns (validation, multi-step, conditional)
/performance-ui      Optimize UI performance (rendering, animations, bundles)
```

**v2.4.0 Cloud & DevOps Commands (5)**
```
/cloud-architecture  Design cloud infrastructure (Azure/AWS)
/cicd-pipeline       Design CI/CD pipeline with stages and gates
/docker-setup        Containerize application with Docker best practices
/kubernetes-design   Design Kubernetes deployment strategy
/monitoring-setup    Design observability stack (logging, metrics, tracing)
```

**v2.5.0 Security & Compliance Commands (5)**
```
/zero-trust-design   Design zero-trust security architecture
/compliance-audit    Audit compliance against SOC 2, ISO 27001, HIPAA, PCI-DSS
/pentest-plan        Plan penetration test (scope, methodology, reporting)
/incident-response   Create incident response playbook & post-mortem template
/security-posture    Assess overall security posture & gaps
```

**v2.6.0 Integration & APIs Commands (5)**
```
/event-driven-design Design event-driven system (CQRS, sagas, event sourcing)
/api-composition     Design API composition gateway (aggregation, caching, resilience)
/message-queue-setup Design message queue architecture (RabbitMQ/Kafka)
/webhook-implementation Implement webhook system with retries & signatures
/integration-test-design Design integration test strategy (contract tests, E2E)
```

**v2.7.0 Mobile & Cross-Platform Commands (5)**
```
/mobile-architecture Design mobile app architecture (iOS, Android, React Native, Flutter)
/cross-platform-setup Setup cross-platform codebase with abstraction layers
/offline-sync        Design offline-first data sync (local DB, event queue)
/mobile-security-audit Audit mobile app security (credentials, network, data)
/app-distribution-plan Plan app distribution (versioning, store submission, monitoring)
```

**v2.8.0 AI Behavior & Session Context (Session Rules)**
- **honesty-and-uncertainty**: Signal confidence, never fabricate paths/functions
- **adaptive-reasoning**: Chain-of-thought for non-trivial answers
- **session-context**: Reference prior decisions, flag contradictions, no re-asking

**v2.9.0 Orchestrator Commands (5)**
```
/pp              Master orchestrator — describe task in plain English → auto-routes + executes
/quick           Fast-path router — quick fixes/reviews/tests, immediate execution
/sec             Security fast-path — routes to scan/audit/design/compliance
/test            Testing fast-path — routes to unit/full suite/coverage gaps
/db              Database fast-path — routes to SQL optimization/schema review/design
```

**v3.0.0 Requirements Phase Commands (4)**
```
/requirements-to-specs    Convert business requirement → technical spec (REQ-F/NF + open questions)
/acceptance-criteria      Convert spec → Gherkin criteria (Given/When/Then + test cases)
/risk-assessment          Assess feasibility → Risk register + Go/No-Go decision
/requirements-review      Quality audit → Completeness/Clarity/Testability/Traceability verdict
```

**v3.0.0 Requirements Phase Rules (2)**
- **requirements-elicitation**: User story format, INVEST principles, Gherkin acceptance criteria
- **feasibility-assessment**: 3-dimension analysis (Technical/Resource/Timeline), risk tiers, spike decisions

**v3.1.0 Shared Memory Orchestrator (1)**
```
/pp-requirements  Execute full 4-phase requirements chain end-to-end
```

**v3.2.0 Orchestrator Hardening**
- Tiebreaker rule for `/pp` (explicit precedence when 2+ keywords match)
- Fallback clause for non-engineering requests
- Auto-cascade NEXT PHASE suggestions in requirements agents
- `/pentest-plan` and `/incident-response` now routable via `/pp`

### Built-in Context Providers (Available by Default)
All of these are built-in to Continue.dev — no installation needed:
- **@git**: Read/write git logs, diffs, blame, branches
- **@filesystem**: Read/write/create files autonomously
- **@docs**: Search documentation (Continue.dev docs, codebase, etc.)
- **@terminal**: Execute shell commands
- **@codebase**: Search/analyze codebase
- **@file**: Work with specific files

**Use in chat**: `@git show recent commits` or `@filesystem read src/main.ts`

### Context Providers (11 Available)
`@code`, `@codebase`, `@docs`, `@diff`, `@terminal`, `@problems`, `@folder`, `@file`, `@currentFile`, `@repo-map`, `@open`

### Tab Autocomplete
- **Model**: Qwen Coder (fast)
- **Debounce**: 400ms (prevents mid-block interruption)
- **Context**: Cross-file, 1500 tokens, 75% prefix focus

---

## 📚 Documentation

| Guide | Purpose |
|-------|---------|
| [**Setup Guide**](./reference/setup/SETUP-ENVIRONMENT.md) | Installation & configuration |
| [**Troubleshooting**](./reference/setup/TROUBLESHOOTING.md) | Common issues & solutions |
| [**CHANGELOG**](./reference/release/CHANGELOG.md) | Version history & releases |
| [**Release Notes**](./reference/release/RELEASES_v2.5.0_v2.6.0.md) | Latest release details |
| [**SDLC Coverage**](./reference/SDLC-COVERAGE-MATRIX.md) | Rules mapped to phases & stacks |
| [**Architecture Guide**](./guides/release/DOCUMENTATION_ARCHITECTURE.md) | Documentation structure |

### By Version
- [v3.2.0 — Orchestrator Gap Fixes](./reference/release/CHANGELOG.md#320--2026-04-09-orchestrator-gap-fixes)
- [v3.1.0 — Shared Memory Orchestrator](./reference/release/CHANGELOG.md#310--2026-04-09-shared-memory-orchestrator)
- [v3.0.0 — Requirements Phase](./reference/release/CHANGELOG.md#300--2026-04-09-requirements-phase)
- [v2.9.0 — Orchestrator System](./reference/release/CHANGELOG.md#290--2026-04-09-orchestrator-system)
- [v2.8.0 — AI Behavior Rules](./reference/release/CHANGELOG.md#280--2026-04-09-ai-behavior-rules)
- [v2.7.0 — Mobile & Cross-Platform](./releases/v2.7.0/IMPLEMENTATION_SUMMARY.md)
- [v2.6.0 — Integration & APIs](./releases/v2.6.0/IMPLEMENTATION_SUMMARY.md)
- [v2.5.0 — Security & Compliance](./releases/v2.5.0/IMPLEMENTATION_SUMMARY.md)
- [v2.4.0 — Cloud & DevOps](./releases/v2.4.0/IMPLEMENTATION_SUMMARY.md)
- [v2.3.0 — Advanced UI Patterns](./releases/v2.3.0/IMPLEMENTATION_SUMMARY.md)
- [v2.2.0 — UX Design Agent](./releases/v2.2.0/IMPLEMENTATION_SUMMARY.md)
- [v2.1.0 — Data & Observability](./releases/v2.1.0/IMPLEMENTATION_SUMMARY.md)
- [v2.0.0 — Agent-Era Standards](./releases/v2.0.0/IMPLEMENTATION_SUMMARY.md)

---

## 🔄 Versioning & Releases

**Semantic Versioning**: MAJOR.MINOR.PATCH

### Version Files
- `config.yaml` — **Always use current version** (environment variables)
- `config-v1.0.0.yaml` — Archived v1.0.0 (reference only)
- `config-v1.1.0.yaml` — Archived v1.1.0 (when released)

### Release Policy
- **Minor bumps** = New models, rules, prompts, MCP servers
- **Patch bumps** = Bug fixes, parameter tuning, security updates
- **Major bumps** = Breaking schema/rule changes

See [CHANGELOG](./CHANGELOG.md) for all releases and migration guides.

**Latest Version**: [v3.2.0](https://github.com/SmartWorkz-Dev/PowerPlay/releases/tag/v3.2.0) (Orchestrator Gap Fixes)

---

## 🏗️ Architecture

```
SmartWorkz PowerPlay v3.2.0
├── config.yaml (9 free models + 60 rules + 75 prompts)
│   ├── Local Models (4): Qwen 3.5 9B, DeepSeek R1 8B, Qwen Coder, DeepSeek Coder
│   ├── Cloud Fallbacks (5): GPT-OSS 120B, Qwen3 Coder, MiniMax M2.5, Gemma 4, Llama 3.1
│   └── Embeddings: NVIDIA Nemotron (free)
│
├── Rules Engine (60 rules by domain)
│   ├── Core (6): smartworkz-core, dotnet, angular, sql, security, testing
│   ├── v2.0-v2.7 Domain Rules (49): agents, PRs, observability, UX, cloud, security, mobile
│   ├── v2.8.0 AI Behavior (3): honesty, adaptive-reasoning, session-context
│   ├── v3.0.0 Requirements (2): requirements-elicitation, feasibility-assessment
│   └── v2.9.0 Routing Intelligence (1): routing-intelligence (for /pp decision tree)
│
├── Orchestrators (v2.9.0+)
│   ├── /pp — Master orchestrator (natural language → command routing)
│   ├── /quick, /sec, /test, /db — Fast-path routers (scope-aware)
│   ├── /pp-requirements — 4-phase requirements mega-agent
│   └── Routing Table (30+ categories, tiebreaker rule, fallback handling)
│
├── Requirements Phase Agents (v3.0.0+)
│   ├── Phase 1: /requirements-to-specs (requirement → tech spec)
│   ├── Phase 2: /acceptance-criteria (spec → Gherkin criteria)
│   ├── Phase 3: /risk-assessment (feasibility → risk register)
│   └── Phase 4: /requirements-review (quality audit → verdict)
│   └── HANDOFF BLOCKS carry context between phases
│
├── Domain Commands (63 specialized)
│   ├── Code Review (8): /review, /inline-review, /pr-review, /audit-all, etc.
│   ├── Testing (5): /add-tests, /generate-tests-complete, /coverage-gaps, etc.
│   ├── Database (5): /optimize-sql, /database-design, /data-model, etc.
│   ├── Security (5): /security-scan, /security-agent, /zero-trust-design, etc.
│   ├── Cloud & DevOps (5): /aws-design, /azure-setup, /docker-containerize, etc.
│   ├── And 35 more specialized commands...
│   └── All discoverable via /pp natural language routing
│
├── MCP Servers (Agent tools)
│   ├── Git (read/write logs, diffs, branches)
│   ├── FileSystem (autonomous read/write/create)
│   ├── SQLite (database queries)
│   ├── Playwright (browser automation)
│   └── Continue Docs (semantic search)
│
└── Context Providers (@ mentions)
    ├── @git, @filesystem, @codebase, @file, @terminal
    ├── @docs, @diff, @problems, @folder, @currentFile, @repo-map, @open
    └── 11 total providers for codebase awareness
```

---

## ⚙️ Configuration

### For Beginners
Just use `config.yaml` as-is. Everything pre-tuned for .NET + Angular.

### For Advanced Users
Modify these without breaking anything:
- **Model temperatures**: Increase for creativity (0.7), decrease for precision (0.1)
- **Token limits**: Increase if truncated output, decrease for speed
- **Debounce delay**: Increase if autocomplete jittery, decrease for responsiveness
- **Add new rules**: Follow existing patterns in rules section
- **Add new prompts**: Copy a prompt block, customize

### Never Change (Breaking)
- `schema: v1` (unless upgrading to v2)
- Model provider/apiBase (unless migrating services)

---

## 🔒 Security

✅ **No hardcoded secrets** — All API keys use environment variables

### Setup Security
1. **Create .env file** from `.env.example`
2. **Get OpenRouter key**: https://openrouter.ai/account/api-keys
3. **Fill in .env** with your actual keys
4. **.gitignore blocks .env** — won't be committed

### If Key Was Exposed
1. Go to https://openrouter.ai/account/api-keys
2. Click menu → **Revoke** (invalidates old key immediately)
3. Click **Create Key** (generate new one)
4. Update .env with new key
5. Done! (old key can never be used again)

### Best Practices
- Never hardcode API keys in config files
- Use environment variables for all secrets
- Rotate keys if exposed
- Use `.env.example` as template (commit this, not .env)

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Model not found" | Check Dhoni GPU is running at `http://rohit:4000/v1` |
| "Truncated output" | Models tab autocomplete disabled? Check `maxTokens` ≥ 16384 |
| "Slow responses" | Using cloud models? Add Dhoni GPU, or increase debounce delay |
| "Wrong model used" | Restart Continue, check model role in config (`chat`, `apply`, `edit`) |
| Rules not applying | Check `globs` match your file, or set `alwaysApply: true` |

See [Troubleshooting Guide](./reference/setup/TROUBLESHOOTING.md) for more.

---

## 🤝 Contributing

Want to add a rule, model, or prompt?

1. See [Architecture Guide](./guides/release/DOCUMENTATION_ARCHITECTURE.md) for structure
2. Edit `config.yaml`
3. Update `CHANGELOG.md` (new feature section)
4. Bump `version:` (minor)
5. Submit PR

---

## 📖 Examples

### Generate a Complete .NET API Endpoint
```
Chat: "I need a user registration endpoint with validation"
Type: /api-endpoint
Get: Complete Controller + DTO + Validator + Service + Repository + DI setup
```

### Review Code for Security Issues
```
Chat: [Paste code or @file]
Type: /security-scan
Get: OWASP Top 10 audit with line-by-line fixes
```

### Generate Angular Component
```
Chat: "Create a data grid for user management"
Type: /ng-component
Get: Standalone component + service + SCSS + DevExtreme template
```

---

## 📊 Capability Comparison

| Feature | Cursor | Windsurf | PowerStack |
|---------|--------|----------|-----------|
| Chat | Claude 3.5 | Claude 3.5 | Qwen 3.5 |
| Code Apply | Claude | Claude | Qwen Coder |
| Agents | Limited | Advanced | Advanced (via MCP) |
| Cost | Paid | Paid | **Free** |
| Local Option | No | No | **Yes** |
| Custom Rules | Limited | Limited | **Full** |

---

## 📝 License

MIT — Use freely, modify freely, no restrictions.

---

## 🔗 Links

- [Continue.dev](https://continue.dev) — Base platform
- [OpenRouter](https://openrouter.ai) — Cloud model provider (free tier)
- [GitHub Releases](./releases) — All versions

---

## 💬 Feedback

Issues? Feature requests? Open an issue or discussion:
- [GitHub Issues](https://github.com/SmartWorkz-Dev/PowerPlay/issues)
- [Discussions](https://github.com/SmartWorkz-Dev/PowerPlay/discussions)

---

**Built with ❤️ by SmartWorkz Dev**

*Current: [v2.7.0](https://github.com/SmartWorkz-Dev/PowerPlay/releases/tag/v2.7.0) | Updated: 2026-04-09*

**[View All Releases →](https://github.com/SmartWorkz-Dev/PowerPlay/releases)**

