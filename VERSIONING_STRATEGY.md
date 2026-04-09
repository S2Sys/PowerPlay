# SmartWorkz PowerStack — Release & Versioning Strategy

## Version Bumping Rules

Each enhancement **increments the MINOR version** (semver):
- **Major (X.0.0)**: Breaking changes to rules, schema, or MCP compatibility
- **Minor (X.Y.0)**: New features, models, prompts, MCP servers, rules additions
- **Patch (X.Y.Z)**: Bug fixes, temperature tweaks, typo corrections, parameter tuning

**Format**: Update `version:` in `config.yaml` before release.

---

## Release Process

### 1. **Update config.yaml**
```yaml
name: SmartWorkz PowerStack — Maximum Config
version: 1.1.0  # Bumped Minor
schema: v1
```

### 2. **Generate CHANGELOG Entry**
Add to top of `CHANGELOG.md`:
```markdown
## [1.1.0] — 2026-04-09

### Added
- Qwen 3.5 9B chat model with tool_use capabilities
- /security-scan prompt for OWASP Top 10 audit
- Azure DevOps MCP server (optional, commented)

### Changed
- Increased tabAutocompleteOptions.maxPromptTokens from 1200 → 1500
- DeepSeek R1 temperature tuned to 0.1 for reasoning

### Fixed
- Phi4 Mini temperature lowered to 0.4 (was hallucinating)

### Docs
- Added security-scan prompt explanation in Wiki
- Updated Rules section with SQL Server NOLOCK guidance
```

### 3. **Create GitHub Release**
```bash
git tag -a v1.1.0 -m "Add security-scan prompt + Azure DevOps MCP"
git push origin v1.1.0
```

Visit: `https://github.com/SmartWorkz-Dev/PowerPlay/releases/new`

---

## Wiki Structure

### `/wiki/` — Knowledge Base

```
wiki/
├── 01-Getting-Started.md
│   └── Installation, first model setup, test chat
├── 02-Config-Reference.md
│   └── Every section explained: models, rules, MCP servers
├── 03-Rules-Guide.md
│   ├── smartworkz-core
│   ├── dotnet-rules
│   ├── angular-rules
│   ├── sql-rules
│   └── security-always
├── 04-Models-Explained.md
│   ├── Local models (Qwen, DeepSeek)
│   ├── Cloud fallbacks (OpenRouter)
│   └── When to use each
├── 05-MCP-Servers-Guide.md
│   ├── Git, FileSystem, SQLite, Playwright
│   └── Custom MCP setup
├── 06-Prompts-Reference.md
│   └── Every /command explained with examples
├── 07-Troubleshooting.md
│   └── Common issues + fixes
└── 08-Contributing.md
    └── How to add rules, models, prompts
```

---

## README Structure

```markdown
# SmartWorkz PowerStack

> Cursor-level AI. Windsurf-level agents. Zero cost. For Continue.dev

**Latest**: v1.1.0 | [Changelog](./CHANGELOG.md) | [Wiki](./wiki/)

## Quick Start
- Install Continue.dev
- Copy config.yaml to Continue config folder
- Restart + chat

## Features
- **5 Local Models** (Qwen, DeepSeek, Phi4)
- **4 Cloud Fallbacks** (OpenRouter free)
- **10+ Smart Prompts** (/review, /add-tests, /security-scan, etc.)
- **5 MCP Servers** (Git, Files, SQLite, Playwright, Docs)
- **Rules** for .NET, Angular, SQL, Security

## Highlights
[Capability Map] [Models] [Rules] [MCP Servers] [Prompts]

## Docs
- [Getting Started](./wiki/01-Getting-Started.md)
- [Config Reference](./wiki/02-Config-Reference.md)
- [Rules Guide](./wiki/03-Rules-Guide.md)
- [Troubleshooting](./wiki/07-Troubleshooting.md)

## Releases
See [Changelog](./CHANGELOG.md) for all versions.

## License
MIT
```

---

## config.yaml Enhancements

Add metadata section:

```yaml
# At top of file, after version:

metadata:
  releaseDate: "2026-04-09"
  releaseUrl: "https://github.com/SmartWorkz-Dev/PowerPlay/releases/tag/v1.1.0"
  wikiUrl: "https://github.com/SmartWorkz-Dev/PowerPlay/wiki"
  supportedContinueVersions: ">=0.8.0"
  lastUpdated: "2026-04-09"
```

---

## Automation Ideas

### Pre-release Checklist
```bash
# 1. Validate YAML syntax
yamllint config.yaml

# 2. Test all models
curl -X POST http://rohit:4000/v1/chat/completions \
  -H "Authorization: Bearer V4B50HJ-EN143DP-G5S71ZN-G5WM267" \
  -d '{"model":"dhoni-qwen","messages":[{"role":"user","content":"test"}]}'

# 3. Update CHANGELOG
# 4. Git tag + push
# 5. Create GitHub release
# 6. Post to community (Discord, Reddit, etc.)
```

---

## Suggested Enhancements for Next Versions

### v1.1.0 (Next Minor)
- [ ] Add Claude API support (if public API available)
- [ ] Add Anthropic SDK models alongside OpenAI-compatible
- [ ] New prompt: `/architecture-design`
- [ ] New prompt: `/database-schema`

### v1.2.0
- [ ] Custom context providers (e.g., @project-todo)
- [ ] Variable interpolation in rules ({projectName}, {stack})
- [ ] Model fallback chains (try local, fallback to cloud)

### v2.0.0 (Breaking)
- [ ] Schema v2 (flatter structure, better validation)
- [ ] Built-in telemetry opt-in
- [ ] Environment variable substitution for secrets

