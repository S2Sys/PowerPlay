# PowerPlay Project Structure

## Overview

Organized directory structure for PowerPlay v2.0.0 development, documentation, and deployment.

---

## Root Level (`/`)

Clean root directory with only essential files:

```
PowerPlay/
├── README.md ........................ Main entry point
├── config.yaml ..................... PowerPlay prompts (134 commands)
│
├── docs/ ........................... Documentation
├── src/ ............................ Python source code
├── tests/ .......................... Python tests
├── tools/ .......................... Development tools
├── vscode-extension/ ............... VS Code extension source
├── config-backups/ ................. Configuration backups
├── scripts/ ........................ Setup & utility scripts
├── web/ ............................ Web resources
├── config/ ......................... Configuration directory
├── memory/ ......................... Claude Code memory
├── notes/ .......................... Development notes
├── resources/ ...................... Project resources
├── wiki/ ........................... Project wiki
└── PROJECT-STRUCTURE.md ............ This file
```

---

## Directory Guide

### 📖 `docs/` — Documentation

All user and technical documentation.

```
docs/
├── README.md ......................... Documentation index
├── START-HERE.md .................... Quick start guide
├── START-HERE-EXTENSION.md .......... Extension getting started
├── FRESH-INSTALL-READY.md ........... Installation steps
├── UNINSTALL-REINSTALL-GUIDE.md .... Upgrade from v1.0.0
├── INSTALLATION-CHECKLIST.md ........ Verification steps
├── QUICK-REFERENCE-v2.0.0.md ....... Keyboard shortcuts
├── QUICK-START-SETTINGS.md ......... Settings tutorial
├── README-EXTENSION-v2.0.0.md ...... Full extension guide
├── SESSION-DELIVERY-v2.0.0-CHAT-PANEL.md .. Technical summary
├── BUILD.md ......................... Build instructions
├── ENVIRONMENT-VARIABLES.md ........ Configuration reference
├── SETUP-ENVIRONMENT.md ............ Environment setup
├── TROUBLESHOOTING.md .............. Troubleshooting
├── INTEGRATION-GUIDE-MONITORING.md . Monitoring guide
├── WHATS-NEXT.md ................... Future roadmap
├── INDEX.md ........................ Legacy index
│
└── archive/
    ├── README.md .................... Archive policy
    ├── 2026-04-11-v2.0.0-cleanup/ .. Archived old docs (34 files)
    └── 2026-04-11-v2.0.0-cleanup.tar.gz .. Compressed archive
```

**Purpose:** User guides, installation instructions, technical reference, troubleshooting.

---

### 💻 `vscode-extension/` — VS Code Extension

Complete VS Code extension source code.

```
vscode-extension/
├── src/
│   ├── extension.ts .............. Main entry point
│   ├── chatPanel.ts ............. Chat panel logic (257 lines)
│   ├── sidebarProvider.ts ........ Sidebar provider
│   ├── settingsPanel.ts ......... Settings panel
│   ├── commandPicker.ts ......... Command picker
│   ├── configParser.ts .......... Config file parser
│   └── *.d.ts ................... TypeScript definitions
│
├── media/
│   ├── chat.css ................. Chat styling (534 lines)
│   ├── chat.js .................. Chat logic (379 lines)
│   ├── sidebar.css .............. Sidebar styling
│   ├── sidebar.js ............... Sidebar logic
│   ├── sidebar.html ............. Sidebar template
│   └── icon.svg ................. Extension icon
│
├── out/ .......................... Compiled JavaScript
├── package.json .................. Extension manifest
├── tsconfig.json ................. TypeScript config
├── powerplay.code-snippets ....... Code snippets
├── BUILD.md ...................... Build instructions
├── package-lock.json ............ Dependencies lock
└── powerplay-ai-2.0.0.vsix ...... Compiled extension
```

**Purpose:** Full VS Code extension with chat panel, settings, and sidebar.

---

### 🐍 `src/` — Python Source Code

Python implementation files (if applicable).

```
src/
└── (Python source files)
```

**Purpose:** Python backend or utilities.

---

### ✅ `tests/` — Test Suite

Testing files and configurations.

```
tests/
└── (Test files)
```

**Purpose:** Unit tests, integration tests, test utilities.

---

### 🛠️ `tools/` — Development Tools

Development utilities and helper scripts.

```
tools/
└── (Development tools)
```

**Purpose:** Build helpers, analysis tools, automation scripts.

---

### ⚙️ `scripts/` — Setup & Utility Scripts

Installation and setup scripts.

```
scripts/
├── setup-powerplay.bat ........... Windows batch setup
└── setup-powerplay.ps1 .......... PowerShell setup
```

**Purpose:** Automated setup and installation scripts.

---

### 📁 `config/` — Configuration Directory

Application configuration files.

```
config/
└── (Configuration files)
```

**Purpose:** Application-level configuration.

---

### 🔐 `config-backups/` — Configuration Backups

Backup copies of configuration files.

```
config-backups/
├── config-backup-3.4.0.yaml ..... Backup from v3.4.0
└── config.yaml.fixed ............ Fixed configuration
```

**Purpose:** Preserve old configurations for reference or recovery.

---

### 🌐 `web/` — Web Resources

HTML and web-related files.

```
web/
├── index.html .................... Main HTML page
├── preview.html .................. Preview page
└── style.css ..................... Web styling
```

**Purpose:** Web resources for web-based UI or documentation.

---

### 💾 `memory/` — Claude Code Memory

Claude Code session memory and notes.

```
memory/
├── MEMORY.md ..................... Memory index
└── (Memory files)
```

**Purpose:** Persistent session memory for Claude Code assistance.

---

### 📝 `notes/` — Development Notes

Development notes and planning documents.

```
notes/
└── (Development notes)
```

**Purpose:** Development planning, research, and notes.

---

### 📚 `resources/` — Project Resources

Additional project resources.

```
resources/
└── (Resource files)
```

**Purpose:** Images, diagrams, reference materials.

---

### 📖 `wiki/` — Project Wiki

Project documentation wiki.

```
wiki/
└── (Wiki pages)
```

**Purpose:** Project knowledge base and documentation.

---

### 🎯 Root Level Files

| File | Purpose |
|------|---------|
| `README.md` | Main entry point & project overview |
| `config.yaml` | PowerPlay configuration (134 commands) |
| `PROJECT-STRUCTURE.md` | This file - directory guide |

---

## Directory Statistics

```
Root Level Items: 15
├── Files: 2 (README.md, config.yaml)
├── Directories: 13
└── Organization: Clean & Professional

Structure:
├── Documentation: docs/ (16 guides + archive)
├── Extension: vscode-extension/ (complete source)
├── Scripts: scripts/ (setup utilities)
├── Configuration: config-backups/ (2 backups)
├── Web: web/ (3 resource files)
├── Development: src/, tests/, tools/, notes/
└── Support: memory/, resources/, wiki/, config/
```

---

## Quick Navigation

### For Users
- **Start Here:** [README.md](README.md)
- **Installation:** [docs/FRESH-INSTALL-READY.md](docs/FRESH-INSTALL-READY.md)
- **Quick Reference:** [docs/QUICK-REFERENCE-v2.0.0.md](docs/QUICK-REFERENCE-v2.0.0.md)
- **Troubleshooting:** [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

### For Developers
- **Extension Code:** [vscode-extension/](vscode-extension/)
- **Build Instructions:** [vscode-extension/BUILD.md](vscode-extension/BUILD.md)
- **Configuration:** [config.yaml](config.yaml)
- **Tests:** [tests/](tests/)

### For Maintainers
- **Documentation Index:** [docs/README.md](docs/README.md)
- **Archived Files:** [docs/archive/](docs/archive/)
- **Configuration Backups:** [config-backups/](config-backups/)
- **Project Structure:** [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md)

---

## Adding New Files

When adding new files, follow this guide:

### Documentation
→ Place in `docs/` directory  
→ Link from [docs/README.md](docs/README.md)

### Code
→ Python code → `src/`  
→ Tests → `tests/`  
→ Tools → `tools/`

### Configuration
→ Application config → `config/`  
→ Backups → `config-backups/`

### Scripts
→ Setup/utility scripts → `scripts/`

### Web Resources
→ HTML/CSS → `web/`

### Notes & Resources
→ Development notes → `notes/`  
→ Resources → `resources/`

---

## Archive Policy

Old files are archived in `docs/archive/`:

```
docs/archive/
├── README.md ........................ Archive index & policy
├── 2026-04-11-v2.0.0-cleanup/
│   ├── ARCHIVE-MANIFEST.md ........ What was archived
│   ├── 34 archived .md files ...... Old documentation
│   └── ...
└── 2026-04-11-v2.0.0-cleanup.tar.gz . Compressed archive
```

**Files archived in this cleanup:**
- Local model setup files (9)
- Old extension v1.0.0 docs (5)
- Historical release notes (11)
- Legacy planning docs (5)
- Local development tools (3+)

---

## Git Structure

```
.git/
├── Objects, refs, hooks
└── Full version history

.gitignore
├── node_modules/
├── *.vsix
├── *.log
└── (other generated files)
```

---

## Total Project Statistics

| Category | Count |
|----------|-------|
| Root Directories | 13 |
| Root Files | 2 |
| Documentation Files | 16 |
| Archived Files | 34 |
| Extension Source Files | 6 |
| Media Files | 5 |
| Configuration Files | 2 |
| **Total Files** | **~100+** |

---

## Project Status

✅ **Organized Structure** — Clean, professional layout  
✅ **Centralized Docs** — All guides in docs/  
✅ **Extension Ready** — Complete v2.0.0 source  
✅ **Archive System** — Old files preserved  
✅ **Scalable Layout** — Room for future expansion  

---

## Next Steps

1. **Add new files** — Follow directory guidelines
2. **Update archive** — When releasing v2.1.0
3. **Expand wiki** — Add knowledge base articles
4. **Maintain docs** — Keep guides updated

---

**Last Updated:** 2026-04-11  
**Version:** PowerPlay v2.0.0  
**Maintainer:** SmartWorkz Dev
