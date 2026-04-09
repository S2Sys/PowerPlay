# SmartWorkz PowerStack

> Cursor-level AI code editor power. Windsurf agent autonomy. **Zero cost.** For [Continue.dev](https://continue.dev)

[![Version: 1.0.0](https://img.shields.io/badge/version-1.0.0-blue)](./CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)]()
[![Stack: .NET + Angular](https://img.shields.io/badge/stack-.NET%20%2B%20Angular-blueviolet)]()

---

## 🚀 Quick Start (2 minutes)

### 1. Install Continue.dev
```bash
# VS Code
Ctrl+Shift+X → Search "Continue" → Install

# JetBrains
Plugins → Marketplace → Continue → Install
```

### 2. Copy Config
```bash
# Windows
cp config.yaml "%APPDATA%\Continue\config.yaml"

# macOS/Linux
cp config.yaml ~/.continue/config.yaml
```

### 3. Verify GPU (Optional)
If using local models, ensure Dhoni/Kapil GPU services are running:
```bash
http://rohit:4000/v1/models
```
Should return list of deployed models.

### 4. Chat
- Open Continue chat (Ctrl+M)
- Type: `What's the latest version?`
- Should respond using **Qwen 3.5 9B** ✅

---

## 📊 What's Included

### Models (9 Total)
| Model | Role | Speed | Cost |
|-------|------|-------|------|
| **Qwen 3.5 9B** | Chat | ⚡⚡⚡ | Free (local) |
| **DeepSeek R1 8B** | Reasoning | ⚡ | Free (local) |
| **Phi4 Mini** | Fast chat | ⚡⚡⚡⚡ | Free (local) |
| **Qwen Coder** | Code apply/edit | ⚡⚡ | Free (local) |
| **DeepSeek Coder 6.7B** | Code edit | ⚡⚡ | Free (local) |
| **GPT-OSS 120B** | Reasoning (cloud) | ⚡ | Free (OpenRouter) |
| **MiniMax M2.5** | Creative (cloud) | ⚡ | Free (OpenRouter) |
| **Qwen3 Coder** | Code (cloud) | ⚡ | Free (OpenRouter) |
| **Gemma 4 26B** | Reasoning (cloud) | ⚡ | Free (OpenRouter) |

### Rules (5 Categories)
- **smartworkz-core**: C# 12, async/await, ILogger<T>
- **dotnet-rules**: Controllers, Services, Repositories, FluentValidation
- **angular-rules**: Standalone components, inject(), OnPush, Signals
- **sql-rules**: Parameterized queries, NOLOCK, SARGable WHERE
- **security-always**: No hardcoded secrets, input sanitization, XSS protection

### Prompts (10 Commands)
```
/review              Full code review (bugs, security, patterns)
/optimize-sql        Optimize SQL procedures + indexes
/add-tests           Generate xUnit tests with Moq
/add-docs            Add XML documentation comments
/ng-component        Generate Angular 17 standalone component
/api-endpoint        Generate complete .NET 8 API endpoint
/security-scan       OWASP Top 10 audit
/explain-deep        Deep explanation with ASCII diagrams
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

- **Minor bumps** = New models, rules, prompts, MCP servers
- **Patch bumps** = Bug fixes, parameter tuning
- **Major bumps** = Breaking schema/rule changes

See [CHANGELOG](./CHANGELOG.md) for all releases.

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

✅ **No hardcoded secrets in this config** — uses local GPU + free OpenRouter tier

If adding your own APIs:
1. Use environment variables (not config.yaml)
2. Use GitHub Secrets for CI/CD
3. Never commit API keys

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

*Last updated: 2026-04-09 | v1.0.0*

