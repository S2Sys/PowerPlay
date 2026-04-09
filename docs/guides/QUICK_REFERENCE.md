# SmartWorkz PowerStack — Quick Reference Card

**Print this. Keep it handy.**

---

## File Locations

| What | Where |
|------|-------|
| **Main config** | `config.yaml` |
| **Changelog** | `CHANGELOG.md` |
| **Release guide** | `VERSIONING_STRATEGY.md` |
| **Release checklist** | `RELEASE_CHECKLIST.md` |
| **Wiki (guides)** | `wiki/01-*` through `wiki/08-*` |
| **This card** | `QUICK_REFERENCE.md` |

---

## Version Bumping

| Bump Type | When | Example |
|---|---|---|
| **Minor** (Y) | New feature | v1.0.0 → v1.1.0 |
| **Patch** (Z) | Bug fix | v1.0.0 → v1.0.1 |
| **Major** (X) | Breaking change | v1.0.0 → v2.0.0 |

**Rule**: Every minor bump = 1 CHANGELOG section + 1 GitHub release.

---

## Release Workflow (5 steps)

```
1. Update config.yaml version: "1.1.0"
   ↓
2. Update CHANGELOG.md with new features
   ↓
3. git commit -am "Release v1.1.0"
   ↓
4. git tag -a v1.1.0 -m "Description"
   ↓
5. git push origin main && git push origin v1.1.0
   ↓
6. Create GitHub release (paste CHANGELOG section)
```

Time: **5 minutes**

---

## Key Models

### Speed Ranking (Fast → Slow)
1. **Phi4 Mini** ⚡⚡⚡⚡ (2 sec)
2. **Qwen Coder** ⚡⚡ (5 sec)
3. **Qwen 3.5 9B** ⚡⚡⚡ (3 sec)
4. **DeepSeek R1** ⚡ (10 sec)
5. **GPT-OSS 120B** ⚡ (15 sec)

### Use Case Ranking
- **Q&A**: Phi4 Mini
- **Chat/Code**: Qwen 3.5 or Qwen Coder
- **Reasoning**: DeepSeek R1
- **Fallback**: GPT-OSS 120B (cloud)

---

## Slash Commands (Prompts)

| Command | Use Case |
|---------|----------|
| **/review** | Full code review (bugs, security, perf) |
| **/optimize-sql** | Optimize SQL procedures |
| **/add-tests** | Generate xUnit tests |
| **/add-docs** | Add XML documentation |
| **/ng-component** | Generate Angular component |
| **/api-endpoint** | Generate .NET API endpoint |
| **/security-scan** | OWASP Top 10 audit |
| **/explain-deep** | Deep code explanation |

**Usage**: Type `/command` in Continue chat.

---

## Context Providers

| Provider | Command |
|----------|---------|
| Current file | `@currentFile` |
| Specific file | `@file src/app.ts` |
| Folder | `@folder src/services` |
| All code | `@codebase` |
| Git changes | `@diff` |
| Docs | `@docs Angular` |
| Errors | `@problems` |
| Open tabs | `@open` |

**Usage**: Type `@provider` in Continue chat.

---

## Adding to PowerStack

### New Rule
```yaml
rules:
  - name: my-rule
    globs: ["**/*.ext"]
    rule: |
      Instructions here
```
**Then**: Bump MINOR version + update CHANGELOG

### New Prompt
```yaml
prompts:
  - name: my-command
    description: "What it does"
    invokable: true
    prompt: |
      Instructions here
```
**Then**: Bump MINOR version + update CHANGELOG

### New Model
```yaml
models:
  - name: My Model
    provider: openai
    model: model-id
    apiBase: https://...
    apiKey: key
    roles: [chat, apply]
```
**Then**: Bump MINOR version + update CHANGELOG + update README

---

## Troubleshooting 30 Seconds

| Problem | Fix |
|---------|-----|
| Model not found | Check `http://rohit:4000` running |
| Slow responses | Use faster model (Phi4) or increase debounce |
| Autocomplete off | Restart Continue + check model is "apply" role |
| Wrong model | Clear cache: Settings → Advanced → Clear cache |
| Rule not applying | Check glob pattern matches file, or set `alwaysApply: true` |
| Config won't load | Validate YAML: `yamllint config.yaml` |

---

## CHANGELOG Template

```markdown
## [1.1.0] — 2026-04-15

### Added
- Feature 1
- Feature 2

### Changed
- Change 1

### Fixed
- Bug 1

### Docs
- Doc update 1
```

---

## Git Commands for Releases

```bash
# Create commit
git commit -am "Release v1.1.0"

# Create tag
git tag -a v1.1.0 -m "Description"

# Push
git push origin main
git push origin v1.1.0

# View all tags
git tag -l

# View tag details
git show v1.1.0
```

---

## CI/CD Automation Ideas

### Pre-release validation
```bash
yamllint config.yaml
curl http://rohit:4000/v1/models  # Check GPU alive
```

### Auto-draft GitHub release
```bash
gh release create v1.1.0 \
  --title "v1.1.0 Release" \
  --notes "$(cat CHANGELOG.md | head -20)"
```

### Post-release notification
```bash
# Post to Discord webhook
# Slack message
# Email team
```

---

## Memory Checks

**Before every release:**
- ✅ Is `version:` bumped?
- ✅ Is `metadata.releaseDate:` updated?
- ✅ Is CHANGELOG.md filled in?
- ✅ Are docs accurate?
- ✅ Did all tests pass?
- ✅ Is config.yaml valid YAML?

---

## Useful Links

| Resource | URL |
|----------|-----|
| Continue Docs | https://docs.continue.dev |
| Config Validator | `yamllint` |
| GitHub Releases | https://github.com/SmartWorkz-Dev/PowerPlay/releases |
| CHANGELOG | See CHANGELOG.md in repo |
| Wiki | See wiki/ folder |

---

## One-Liner Commands

```bash
# Validate config
yamllint config.yaml && echo "✅ Valid"

# Bump patch version in config
sed -i 's/version: 1.0.0/version: 1.0.1/' config.yaml

# View git log since last tag
git log $(git describe --tags --abbrev=0)..HEAD --oneline

# Count models in config
grep "^  - name:" config.yaml | wc -l

# Extract version from config
grep "^version:" config.yaml | cut -d' ' -f2
```

---

## 30-Minute Setup

1. **Install Continue** (5 min)
2. **Copy config.yaml** (1 min)
3. **Verify a model works** (5 min)
4. **Try 3 /prompts** (10 min)
5. **Read Getting Started wiki** (5 min)
6. **Read Rules Guide** (5 min)

→ **Ready to use!**

---

## Pro Tips

✅ Use `Phi4 Mini` for quick answers (fastest)
✅ Use `Qwen 3.5 9B` for chat (balanced)
✅ Use `DeepSeek R1` for complex logic (smartest)
✅ Use `@codebase` when you need full context
✅ Use `/review` before committing code
✅ Use `/security-scan` for sensitive code
✅ Keep config.yaml in version control (no secrets!)
✅ Update CHANGELOG after every feature

---

**Version**: 1.0.0 | **Updated**: 2026-04-09 | **Maintained by**: SmartWorkz Dev

