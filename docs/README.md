# SmartWorkz PowerPlay

> Cursor-level AI code editor power. Windsurf agent autonomy. **Zero cost.** For [Continue.dev](https://continue.dev)

[![Version: 2.6.0](https://img.shields.io/badge/version-2.6.0-blue)](./CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)]()
[![Stack: .NET + Angular](https://img.shields.io/badge/stack-.NET%20%2B%20Angular-blueviolet)]()
[![Rules: 49](https://img.shields.io/badge/rules-49-brightgreen)]()
[![Prompts: 58](https://img.shields.io/badge/prompts-58-brightgreen)]()
[![Latest Release](https://img.shields.io/github/v/release/SmartWorkz-Dev/PowerPlay)](https://github.com/SmartWorkz-Dev/PowerPlay/releases)

---

## 🚀 Quick Start (5 minutes)

### 1. Install Continue.dev
```bash
# VS Code
Ctrl+Shift+X → Search "Continue" → Install

# JetBrains
Plugins → Marketplace → Continue → Install
```

### 2. Set Up API Keys
```bash
# Copy the example file
cp .env.example .env

# Edit .env and fill in your keys:
# 1. DHONI_API_KEY=<local-gpu-key>
# 2. KAPIL_API_KEY=<local-gpu-key>
# 3. OPENROUTER_API_KEY=<your-new-key-from-https://openrouter.ai>

# Save .env (it's in .gitignore, won't be committed)
```

**Getting OpenRouter Key** (free tier):
1. Go to https://openrouter.ai/account/api-keys
2. Click **"Create Key"**
3. Copy the key (starts with `sk-or-v1-...`)
4. Paste into `.env` next to `OPENROUTER_API_KEY=`

### 3. Copy Config to Continue
```bash
# Windows
cp config.yaml "%APPDATA%\Continue\config.yaml"

# macOS/Linux
cp config.yaml ~/.continue/config.yaml
```

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

### Rules (24 Categories)

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

### Prompts (33 Commands)

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

### MCP Servers (5 Tools)
- **Git**: Read logs, diffs, blame, branch info
- **FileSystem**: Read/write/create files autonomously
- **Continue Docs**: Search Continue documentation
- **SQLite**: Query local development databases
- **Playwright**: Browser automation (scrape, test, fill forms)

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
| [**Wiki**](./wiki/) | Complete knowledge base |
| [**CHANGELOG**](./CHANGELOG.md) | Version history & releases |
| [**VERSIONING_STRATEGY**](./VERSIONING_STRATEGY.md) | Release process & roadmap |
| [**config.yaml**](./config.yaml) | Full configuration (annotated) |

### Wiki Structure
- [01-Getting-Started](./wiki/01-Getting-Started.md) — Installation, first chat
- [02-Config-Reference](./wiki/02-Config-Reference.md) — Every section explained
- [03-Rules-Guide](./wiki/03-Rules-Guide.md) — Rule-by-rule breakdown
- [04-Models-Explained](./wiki/04-Models-Explained.md) — When to use which model
- [05-MCP-Servers-Guide](./wiki/05-MCP-Servers-Guide.md) — Tool setup & usage
- [06-Prompts-Reference](./wiki/06-Prompts-Reference.md) — All commands + examples
- [07-Troubleshooting](./wiki/07-Troubleshooting.md) — Common issues + fixes
- [08-Contributing](./wiki/08-Contributing.md) — Add rules, models, prompts

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

**Latest Version**: [v1.0.1](https://github.com/SmartWorkz-Dev/PowerPlay/releases/tag/v1.0.1) (Security patch)

---

## 🏗️ Architecture

```
SmartWorkz PowerStack
├── config.yaml (9 models + 5 rules + 10 prompts)
│   ├── Local Models (Dhoni GPU: 5)
│   ├── Cloud Fallbacks (OpenRouter: 4)
│   └── Embeddings (NVIDIA Nemotron)
├── Rules Engine
│   ├── Apply on: smartworkz-core (always)
│   ├── Apply on: .NET files (**/*.cs)
│   ├── Apply on: Angular files (**/*.ts, **/*.html)
│   ├── Apply on: SQL files (**/*.sql)
│   └── Apply always: security-always
├── MCP Servers (Agent tools)
│   ├── Git (read operations)
│   ├── FileSystem (autonomous read/write)
│   ├── SQLite (dev database queries)
│   ├── Playwright (browser automation)
│   └── Continue Docs (semantic search)
└── Context Providers (@ mentions)
    └── 11 providers for codebase awareness
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

See [Troubleshooting Wiki](./wiki/07-Troubleshooting.md) for more.

---

## 🤝 Contributing

Want to add a rule, model, or prompt?

1. Read [Contributing Guide](./wiki/08-Contributing.md)
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

*Current: [v1.0.1](https://github.com/SmartWorkz-Dev/PowerPlay/releases/tag/v1.0.1) | Updated: 2026-04-09*

**[View All Releases →](https://github.com/SmartWorkz-Dev/PowerPlay/releases)**

