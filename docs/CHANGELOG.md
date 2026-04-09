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

