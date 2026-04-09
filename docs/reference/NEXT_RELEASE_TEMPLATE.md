# Next Release Template (v1.1.0)

**Copy this, fill in your changes, and use as template for next minor version.**

---

## Step 1: Update config.yaml

```yaml
# Line 2 — Update version
version: 1.1.0  # Was 1.0.0

# Line 8-14 — Update metadata
metadata:
  releaseDate: "2026-05-15"        # Today's date
  lastUpdated: "2026-05-15"
  releaseUrl: "https://github.com/SmartWorkz-Dev/PowerPlay/releases/tag/v1.1.0"
  wikiUrl: "https://github.com/SmartWorkz-Dev/PowerPlay/wiki"
  changelogUrl: "..."
  supportedContinueVersions: ">=0.8.0"
  author: "SmartWorkz Dev"
  license: "MIT"
```

### Add New Model (Example)

```yaml
# Around line 180, add:

  - name: Claude 3.5 Sonnet API
    provider: openai
    model: claude-3-5-sonnet-20241022
    apiBase: https://api.anthropic.com/v1
    apiKey: sk-ant-your-key-here
    roles: [chat, apply]
    capabilities: [tool_use]
    defaultCompletionOptions:
      maxTokens: 8192
      temperature: 0.3
```

### Add New Prompt (Example)

```yaml
# Around line 428, add:

  - name: architecture-design
    description: "Design system architecture and component structure"
    invokable: true
    prompt: |
      Design an architecture for this system:
      1. Identify main components and responsibilities
      2. Show data flow with ASCII diagram
      3. Suggest design patterns (MVC, CQRS, Event-driven)
      4. List potential bottlenecks
      5. Recommend scaling strategy
      Output: ASCII diagrams + markdown breakdown
```

---

## Step 2: Update CHANGELOG.md

**Move [Unreleased] section to [1.1.0] with today's date:**

```markdown
## [1.1.0] — 2026-05-15

### Added
- Claude 3.5 Sonnet API model (OpenRouter integration)
- New prompt: /architecture-design for system design
- New prompt: /database-schema for ER diagram generation
- Wiki guide: 03-Rules-Guide.md (rule-by-rule breakdown)
- Wiki guide: 04-Models-Explained.md (when to use each model)
- Wiki guide: 05-MCP-Servers-Guide.md (MCP tool setup)
- Wiki guide: 06-Prompts-Reference.md (all /commands + examples)

### Changed
- Tab autocomplete debounce: 400ms → 350ms (faster suggestions)
- Qwen 3.5 9B temperature: 0.3 → 0.25 (more precise responses)
- Increased tabAutocompleteOptions.maxPromptTokens: 1500 → 1800

### Fixed
- DeepSeek R1 hallucinating on SQL (temperature lowered to 0.1)
- Playwright timeouts on slow networks (increased to 30s)
- Context provider @codebase sometimes returning wrong files

### Deprecated
- GPT-OSS 120B (will remove in v1.2.0, use Claude API instead)

### Docs
- Created wiki/03-Rules-Guide.md (detailed rule breakdowns)
- Created wiki/04-Models-Explained.md (model comparison matrix)
- Created wiki/05-MCP-Servers-Guide.md (Git, FileSystem, SQLite, Playwright)
- Created wiki/06-Prompts-Reference.md (all 12 commands with examples)
- Updated README.md with new models/prompts
- Updated QUICK_REFERENCE.md with new commands

### Security
- No hardcoded secrets (same as before)

### Performance
- Tab autocomplete now uses 1800 token context (better code suggestions)
- Qwen Coder maxTokens: 16384 (prevents truncation on large files)

---

## [1.0.0] — 2026-04-09

[Previous section stays...]
```

**Then add new [Unreleased] section at top for future work:**

```markdown
## [Unreleased]

### Planned for v1.2.0
- [ ] MiniMax model tuning (currently 0.7 temperature, too creative)
- [ ] Custom context providers (@project-todo, @current-sprint)
- [ ] Variable interpolation in rules ({projectName}, {stack})
- [ ] Model fallback chains (local → cloud if unavailable)

### Planned for v2.0.0 (Breaking)
- [ ] Schema v2 (flatter, more extensible)
- [ ] Built-in telemetry (opt-in)
- [ ] Environment variable substitution for secrets
```

---

## Step 3: Update README.md

**Update version badge and feature table:**

```markdown
# SmartWorkz PowerStack

[![Version: 1.1.0](https://img.shields.io/badge/version-1.1.0-blue)](./CHANGELOG.md)

...

| Model | Role | Speed | Cost |
|-------|------|-------|------|
| **Qwen 3.5 9B** | Chat | ⚡⚡⚡ | Free (local) |
| **DeepSeek R1 8B** | Reasoning | ⚡ | Free (local) |
| **Claude 3.5 Sonnet** | Chat/Code | ⚡⚡ | Paid (optional) |  ← NEW
```

---

## Step 4: Update QUICK_REFERENCE.md

**Add new commands to slash commands table:**

```markdown
| Command | Use Case |
|---------|----------|
| **/review** | Full code review (bugs, security, perf) |
| **/optimize-sql** | Optimize SQL procedures |
| **/architecture-design** | System architecture design | ← NEW
| **/database-schema** | ER diagram generation | ← NEW
| **/add-tests** | Generate xUnit tests |
| **/add-docs** | Add XML documentation |
| **/ng-component** | Generate Angular component |
| **/api-endpoint** | Generate .NET API endpoint |
| **/security-scan** | OWASP Top 10 audit |
| **/explain-deep** | Deep code explanation |
```

---

## Step 5: Create New Wiki Pages (Optional but Recommended)

### wiki/03-Rules-Guide.md
- Copy section from config.yaml for each rule
- Add examples
- Show when to use each
- Show how to override

### wiki/04-Models-Explained.md
- Speed comparison table
- Use case matrix
- When to pick each
- How to switch models in Continue

### wiki/06-Prompts-Reference.md
- All 10-12 prompts
- Input example for each
- Expected output format
- Common patterns

---

## Step 6: Test Everything

```bash
# Validate YAML syntax
yamllint config.yaml

# Check models are accessible
curl http://rohit:4000/v1/models

# Verify all /prompts work
# (manually test in Continue)

# Check all wiki links work
# (manually verify wiki/01, wiki/02, wiki/03, etc.)
```

---

## Step 7: Git Commit & Release

```bash
# Commit
git add config.yaml CHANGELOG.md README.md QUICK_REFERENCE.md wiki/
git commit -m "Release v1.1.0 — Add Claude API, 4 wiki guides, 2 new prompts"

# Tag
git tag -a v1.1.0 -m "Minor: Add Claude 3.5 Sonnet, architecture-design prompt, 4 wiki guides"

# Push
git push origin main
git push origin v1.1.0

# Create GitHub release
gh release create v1.1.0 \
  --title "SmartWorkz PowerStack v1.1.0" \
  --notes "$(cat CHANGELOG.md | sed -n '/## \[1.1.0\]/,/## \[1.0.0\]/p')"
```

---

## Step 8: Verify Release

- [ ] GitHub releases page shows v1.1.0
- [ ] README shows "version-1.1.0" badge
- [ ] CHANGELOG top section is [1.1.0]
- [ ] config.yaml has `version: 1.1.0`
- [ ] Wiki pages are readable

---

## Total Time Required

| Task | Time |
|------|------|
| Update config.yaml | 5-10 min |
| Update CHANGELOG | 10-15 min |
| Update README | 5 min |
| Create 2-4 wiki pages | 30-60 min |
| Test all features | 15-20 min |
| Git commit/tag/release | 5 min |
| **Total** | **70-120 min** |

---

## Actual Example (v1.1.0 Draft)

If you decide to release v1.1.0 with:
- ✅ Claude API model
- ✅ 2 new prompts (/architecture-design, /database-schema)
- ✅ 4 wiki guides

**Then follow this exact template above**, replacing:
- Dates with actual date
- Model names with your choices
- Wiki topics with what you create
- Test steps with your setup

---

## Pro Tips

✅ **Before releasing**: Run RELEASE_CHECKLIST.md
✅ **Commit message**: Keep it short, reference version
✅ **CHANGELOG**: Write as you build (don't save for end)
✅ **Wiki**: Write one page per feature
✅ **Test**: Try 3-5 /prompts before tagging

---

**Use this template for every minor/patch version.**

Happy releasing! 🚀

