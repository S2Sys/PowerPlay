# Changelog

All notable changes to SmartWorkz PowerStack are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/)
Versioning: [Semantic Versioning](https://semver.org/)

## [Unreleased]

### Planned
- [ ] Claude API model support
- [ ] More context providers (LSP, workspace state)
- [ ] Config validation tool

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
| 1.0.0 | 2026-04-09 | Initial: 5 local + 4 cloud models, 10 prompts, 5 MCP, rules |

---

## How to Use This Changelog

**For Users**: Check "Added", "Changed", "Fixed", "Removed" to see what's new.

**For Developers**: See "Security", "Performance", "Docs" sections for details.

**Breaking Changes**: Look for **[BREAKING]** markers and migrate accordingly.

