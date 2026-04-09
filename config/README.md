# config/ — Configuration Management

This directory manages configuration versions and archives.

## 📁 Structure

```
config/
├── README.md           (This file)
└── versions/
    ├── config-v1.0.0.yaml      (Archive — v1.0.0 release)
    └── config-upgraded.yaml    (Hardened template with comments)
```

## 📝 Current Config

**Use this**: `../config.yaml` (in project root)

The root-level `config.yaml` is:
- ✅ **Current version** (v1.0.1)
- ✅ **Uses environment variables** (${DHONI_API_KEY}, etc.)
- ✅ **Safe to commit** (no hardcoded secrets)
- ✅ **Always the source of truth**

## 🗂️ Versioned Configs

### config-v1.0.0.yaml
- **Release**: 1.0.0 (2026-04-09)
- **Status**: Archive
- **Contains**: Original hardcoded config
- **Use case**: Reference, rollback, understanding v1.0.0 features
- **Notes**: Has hardcoded API keys (for reference only, never use)

### config-upgraded.yaml
- **Type**: Template
- **Purpose**: Shows how to properly format config with inline comments
- **Use case**: Learning, creating new versions, understanding best practices
- **Features**: 
  - Extensive inline comments explaining every section
  - Shows recommended values and WHY
  - Demonstrates proper structure
  - Good as a reference when creating v1.1.0+

## 📊 Version Timeline

| Version | Date | File | Status | Notes |
|---------|------|------|--------|-------|
| 1.0.0 | 2026-04-09 | config-v1.0.0.yaml | Archive | Initial release, hardcoded keys |
| 1.0.1 | 2026-04-09 | config.yaml (root) | Current | Security patch, env variables |
| 1.1.0 | TBD | config-v1.1.0.yaml (future) | Planned | Claude API, new prompts |
| 1.2.0 | TBD | config-v1.2.0.yaml (future) | Planned | Custom context providers |
| 2.0.0 | TBD | config-v2.0.0.yaml (future) | Planned | Schema v2 (breaking) |

## 🔄 Release Workflow

When creating a new version:

```bash
# 1. Update root config.yaml with new features
# 2. Test in Continue.dev
# 3. Update version number
# 4. Archive current version
cp config.yaml config/versions/config-v1.1.0.yaml

# 5. Commit new version
git add config.yaml config/versions/config-v1.1.0.yaml

# 6. Update CHANGELOG.md
# 7. Release on GitHub
git tag -a v1.1.0 -m "Release v1.1.0"
```

## 📋 File Size Comparison

| File | Size | Hardcoded Keys? | Comments? | Use? |
|------|------|-----------------|-----------|------|
| **config.yaml** (root) | ~17KB | ❌ Uses ${ENV} | Minimal | ✅ Always |
| **config-v1.0.0.yaml** | ~18KB | ✅ Hardcoded | Minimal | 📖 Reference |
| **config-upgraded.yaml** | ~25KB | ❌ Uses ${ENV} | Extensive | 📖 Template |

## 🎯 When to Reference Each File

### config.yaml (Root)
- Deploying to production
- Updating environment variables
- Adding new models/rules
- Checking what's active right now

### config-v1.0.0.yaml (Archive)
- Understanding what was in v1.0.0
- Comparing changes between versions
- Rolling back if needed
- Auditing feature history

### config-upgraded.yaml (Template)
- Learning best practices
- Creating a new version with comments
- Understanding why each value matters
- Onboarding new team members

## 🔐 API Key Security

### Never Done
❌ Hardcoded keys in config files that are committed
❌ Using config-v1.0.0.yaml in production (has exposed keys)

### Always Done
✅ Keys only in `.env` file (not in git)
✅ config.yaml uses `${ENV}` placeholders
✅ Archive versions kept for reference only

## 📖 Related Files

**Setup**:
- `../.env.example` — Template for API keys

**Configuration**:
- `../config.yaml` — Current active config

**Documentation**:
- `../docs/CHANGELOG.md` — Version history
- `../docs/guides/VERSIONING_STRATEGY.md` — Release process
- `../docs/audit/CONFIGARCHITECT_AUDIT.md` — Quality audit

## 🚀 Using Versioned Configs

### To Compare v1.0.0 vs Current
```bash
diff config/versions/config-v1.0.0.yaml ../config.yaml
```

### To See What Changed
```bash
git log --oneline config/  # Commit history
git show v1.0.1:config.yaml  # See config at specific tag
```

### To Rollback (Emergency)
```bash
# If something breaks in current version:
cp config/versions/config-v1.0.0.yaml ../config.yaml
# Update .env with v1.0.0-compatible keys
# Restart Continue
# Create v1.0.2 patch fix
```

---

**Status**: Active | **Latest**: v1.0.1 | **Updated**: 2026-04-09

