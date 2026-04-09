# PowerStack Directory Structure

```
PowerPlay/
├── config.yaml                    # Main configuration (9 models, 5 rules, 10 prompts, 5 MCPs)
│   └── metadata section with version, releaseDate, links
│
├── README.md                      # User-facing introduction (feature matrix, quick start, examples)
│
├── CHANGELOG.md                   # Version history with Added/Changed/Fixed/Docs sections
│                                  # Format follows Keep a Changelog
│
├── VERSIONING_STRATEGY.md         # Release process, roadmap, automation ideas
│                                  # How to bump versions, tag releases, update docs
│
├── RELEASE_CHECKLIST.md           # Pre-release validation steps
│                                  # Testing, config validation, docs verification
│
├── QUICK_REFERENCE.md             # One-page cheat sheet for developers
│                                  # Version bumping, commands, models, troubleshooting
│
└── wiki/                          # Knowledge base (8 guides planned)
    ├── 01-Getting-Started.md      # Installation, first chat, troubleshooting
    │
    ├── 02-Config-Reference.md     # Breakdown of every config section
    │   ├── Metadata
    │   ├── Rules (5 detailed)
    │   ├── Models (9 detailed)
    │   ├── MCP Servers
    │   ├── Context Providers
    │   ├── Prompts
    │   └── How to add each
    │
    ├── 03-Rules-Guide.md          # [NOT YET] Rule-by-rule breakdown with examples
    ├── 04-Models-Explained.md     # [NOT YET] When/why to use each model
    ├── 05-MCP-Servers-Guide.md    # [NOT YET] Tool setup, use cases, examples
    ├── 06-Prompts-Reference.md    # [NOT YET] All 10 commands with examples
    ├── 07-Troubleshooting.md      # [NOT YET] Common issues + fixes
    └── 08-Contributing.md         # [NOT YET] How to submit changes (rules, models, prompts)
```

---

## What Each File Does

### Core Files

#### `config.yaml` (Single Source of Truth)
- **9 models**: Local (Dhoni GPU) + Cloud (OpenRouter)
- **5 rules**: smartworkz-core, dotnet, angular, sql, security
- **10 prompts**: /review, /add-tests, /api-endpoint, etc.
- **5 MCP servers**: Git, FileSystem, SQLite, Playwright, Continue Docs
- **Metadata**: Version, releaseDate, releaseUrl (bumped on each release)

**When to edit**: 
- Adding a new model/rule/prompt/MCP
- Tuning temperatures or token limits
- Changing capabilities or roles

**When to test after editing**:
- `yamllint config.yaml` (syntax valid?)
- Restart Continue + chat "what models do I have?" (loads?)
- Try 2-3 /prompts (/review, /add-tests)

---

### Documentation Files

#### `README.md` (User Guide)
- Feature matrix vs Cursor/Windsurf
- Quick start (2 minutes)
- Models table (9 models, speeds, costs)
- Links to wiki + changelog
- Examples (generate endpoint, security scan)

**When to update**:
- After major feature addition
- When version changes
- When wiki structure changes
- After minor bumps (reflect new features)

---

#### `CHANGELOG.md` (Release History)
- Semantic versioning (MAJOR.MINOR.PATCH)
- Each version has: Added / Changed / Fixed / Docs
- Follows [Keep a Changelog](https://keepachangelog.com/) format
- First release: v1.0.0 on 2026-04-09

**When to update**:
- **BEFORE every release**: Fill in [Unreleased] → [VERSION]
- Add bullet points for:
  - New models, prompts, rules, MCP servers → **Added**
  - Parameter tuning, temperature changes → **Changed**
  - Bug fixes, improvements → **Fixed**
  - Wiki updates → **Docs**

**Template**:
```markdown
## [1.1.0] — 2026-04-15

### Added
- Qwen3 Coder cloud model

### Changed
- Tab autocomplete debounce: 400ms → 350ms

### Fixed
- DeepSeek R1 hallucination on SQL

### Docs
- Added Azure DevOps MCP setup guide
```

---

#### `VERSIONING_STRATEGY.md` (Release Playbook)
- **Version bumping rules** (when to use major/minor/patch)
- **Release process** (5 steps: commit → tag → push → release → announce)
- **Wiki structure** (8 planned guides)
- **Automation ideas** (pre-release validation, CI/CD hooks)
- **Roadmap** (v1.1.0, v1.2.0, v2.0.0 planned features)

**When to use**: Every release → follow the checklist

---

#### `RELEASE_CHECKLIST.md` (Pre-Release Validation)
- **Pre-release checks** (config valid? models work? docs current?)
- **Release day steps** (bump version, git tag, push, create GitHub release)
- **Post-release cleanup** (close issues, plan next version)
- **Emergency rollback** (if release breaks things)

**When to use**: Day before → release day → day after

---

#### `QUICK_REFERENCE.md` (One-Page Cheat Sheet)
- Version bumping (5 lines)
- Models (speed ranking, use cases)
- Slash commands (/review, /add-tests, etc.)
- Context providers (@code, @codebase, etc.)
- How to add rules/prompts/models
- Troubleshooting (30 sec fixes)
- Git commands for releases

**When to use**: Quick lookup, print and tape to desk

---

### Wiki Files

#### `wiki/01-Getting-Started.md`
- Prerequisites (Continue installed, GPU running)
- Step-by-step: Install → Configure → Chat → Try prompt → Autocomplete
- Troubleshooting (model not found, no autocomplete, wrong model)
- Next steps (read other wiki guides)

**When to update**: 
- After major UI changes in Continue
- After changing default setup paths

---

#### `wiki/02-Config-Reference.md`
- **Metadata section**: What it is, when to update
- **Completion options**: maxTokens, temperature explained
- **Rules**: Structure, how to add, all 5 rules detailed
- **Models**: All 9 models with table + how to add
- **MCP Servers**: Purpose, how to add
- **Context Providers**: All 11 providers + examples
- **Docs Indexing**: How to add docs
- **Prompts**: Structure, how to add
- **Advanced**: Overriding defaults

**When to update**: 
- After adding new model/rule/prompt/MCP
- After changing config structure

---

#### `wiki/03-08` (Not Yet Created)
Plan to create:
- **03-Rules-Guide.md**: Each of 5 rules with examples
- **04-Models-Explained.md**: Speed comparisons, use cases, when to pick each
- **05-MCP-Servers-Guide.md**: Detailed setup + examples
- **06-Prompts-Reference.md**: All 10 commands + input/output examples
- **07-Troubleshooting.md**: FAQ + solutions
- **08-Contributing.md**: How to submit rules/models/prompts

---

## Release Workflow (5 Minutes)

```
Day 1: Prepare
├─ Update config.yaml version: 1.0.0 → 1.1.0
├─ Update metadata.releaseDate: today
├─ Add CHANGELOG [Unreleased] → [1.1.0]
└─ Test 3 /prompts + autocomplete

Day 2: Release
├─ git commit -am "Release v1.1.0"
├─ git tag -a v1.1.0 -m "Added Qwen3 Coder"
├─ git push origin main && git push origin v1.1.0
├─ Create GitHub release (paste CHANGELOG)
└─ Post to Discord/community (optional)

Day 3+: Cleanup
├─ Close resolved issues
├─ Move [1.1.0] → archive
├─ Add new [Unreleased] section
└─ Plan v1.2.0 (update VERSIONING_STRATEGY.md)
```

---

## Key Principles

### 1. One Config to Rule Them All
Everything lives in `config.yaml`. No scattered config files.
- Models: 9 (local + cloud)
- Rules: 5 (language + security)
- Prompts: 10 (slash commands)
- MCP: 5 (agent tools)

### 2. Version Every Release
Each version has:
- ✅ `config.yaml` metadata updated
- ✅ CHANGELOG entry (Added/Changed/Fixed/Docs)
- ✅ Git tag + GitHub release
- ✅ Wiki reflects current state

### 3. Semantic Versioning (Like Claude Code)
- **Minor bumps**: New feature (model, rule, prompt, MCP)
- **Patch bumps**: Bug fix or tuning
- **Major bumps**: Breaking changes (schema v2)

### 4. Documentation Always Current
- **README**: Feature matrix + quick start
- **Wiki**: In-depth guides
- **CHANGELOG**: Version history
- **QUICK_REFERENCE**: Cheat sheet

---

## How to Add Something New

### New Model
1. Add block to `config.yaml` models section
2. Test in Continue chat
3. Update README (add to models table)
4. Update CHANGELOG (Added section)
5. Bump version (minor): `1.0.0` → `1.1.0`
6. Update `metadata.releaseDate` in config
7. Commit: `Release v1.1.0`
8. Tag: `git tag -a v1.1.0 -m "Added [model]"`
9. Push + create GitHub release

### New Rule
1. Add block to `config.yaml` rules section
2. Test on sample files
3. Update `wiki/02-Config-Reference.md` (add rule to table)
4. Update CHANGELOG (Added section)
5. Bump version (minor)
6. Follow same commit/tag/release flow

### New Prompt
1. Add block to `config.yaml` prompts section
2. Test with `/command` in Continue chat
3. Update `wiki/06-Prompts-Reference.md` (add command)
4. Update README examples
5. Update CHANGELOG (Added section)
6. Bump version (minor)
7. Commit/tag/release

---

## Stats (v1.0.0)

| Category | Count |
|----------|-------|
| Models | 9 (5 local, 4 cloud) |
| Rules | 5 |
| Prompts | 10 |
| MCP Servers | 5 |
| Context Providers | 11 |
| Docs Indexed | 6 |
| Wiki Pages | 2 (8 planned) |
| Total Lines in config.yaml | 432 |

---

## Next Release Ideas (v1.1.0)

- [ ] Add Claude API model (when public)
- [ ] New prompt: `/architecture-design`
- [ ] New prompt: `/database-schema`
- [ ] Wiki: 03-Rules-Guide.md
- [ ] Wiki: 04-Models-Explained.md
- [ ] Wiki: 05-MCP-Servers-Guide.md
- [ ] Wiki: 06-Prompts-Reference.md
- [ ] Wiki: 07-Troubleshooting.md
- [ ] Wiki: 08-Contributing.md

---

**Built for Claude Code–style DevEx. Maintained incrementally.**

