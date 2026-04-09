# Project Structure

Welcome to the UXPro project! This document explains how the project is organized, what each directory contains, and where to find what you're looking for.

## Directory Layout

```
UXPro/
├── core/                           # Design system core files
│   ├── UIUX-SYSTEM-PROMPT.md       # Quick-reference system prompt (all rules, one file)
│   ├── UIUX-MASTER-PROMPT-SYSTEM.md # Complete detailed guidelines (29 sections)
│   ├── design-tokens.css           # CSS variables for colors, spacing, typography
│   └── VERSION.json                # Current version and release info
│
├── docs/                           # Documentation and guides
│   ├── guides/                     # Platform-specific installation guides
│   │   ├── README.md               # Guide index and quick links
│   │   ├── claude-code.md          # Anthropic Claude Code setup
│   │   ├── cursor.md               # Cursor editor setup
│   │   ├── windsurf.md             # Windsurf editor setup
│   │   ├── cline.md                # Cline IDE extension setup
│   │   ├── continue-dev.md         # Continue.dev setup
│   │   └── copilot.md              # GitHub Copilot setup
│   │
│   ├── superpowers/                # Development and planning docs
│   │   └── plans/                  # Release plans and roadmap
│   │       ├── 2026-04-08-uxpro-v2.3.0.md          # v2.3.0 release notes
│   │       └── 2026-04-09-uxpro-project-reorganization.md # Reorganization plan
│   │
│   ├── PROJECT_STRUCTURE.md        # This file - project navigation guide
│   ├── CHANGELOG.md                # Version history and updates
│   ├── UPDATE_GUIDE.md             # How to update to new versions
│   └── IMPLEMENTATION_SUMMARY.md   # Summary of all features implemented
│
├── examples/                       # Code examples and implementation patterns
│   ├── README.md                   # Examples overview and how to use them
│   ├── components/                 # Individual component examples
│   │   ├── README.md               # Component examples index
│   │   └── form-example.html       # Example HTML form with UXPro styling
│   │
│   ├── patterns/                   # Reusable design patterns
│   │   ├── README.md               # Pattern examples index
│   │   └── responsive-grid.html    # Example responsive grid layout
│   │
│   └── full-apps/                  # Complete application examples
│       ├── README.md               # Full app examples index
│       └── dashboard-layout.html   # Example dashboard with multiple sections
│
├── setup/                          # Installation and configuration helpers
│   ├── README.md                   # Setup instructions and troubleshooting
│   └── quick-start.sh              # Automated setup script for quick installation
│
├── templates/                      # Templates for different tools
│   ├── claude.md                   # Claude-specific prompting templates
│   └── cursorrules-windsurfrules.md # Cursor/Windsurf configuration files
│
├── README.md                       # Main project README (quick start, overview)
├── CONTRIBUTING.md                 # Contribution guidelines
├── VERSION.json                    # Version metadata
└── LICENSE                         # MIT License
```

## What Goes Where

### `/core` - The Design System Foundation
This is where the actual design system lives. Users install from here.
- **UIUX-SYSTEM-PROMPT.md** - Start here. Copy this into your AI tool's custom instructions. Contains all essential rules in a compact format.
- **UIUX-MASTER-PROMPT-SYSTEM.md** - The complete bible. 29 detailed sections covering every aspect of the design system.
- **design-tokens.css** - CSS variables for consistent colors, spacing, and typography across projects.
- **VERSION.json** - Tracks the current version (e.g., 2.3.0) and metadata.

**Who uses it:** End users, developers integrating UXPro into their projects

### `/docs` - Project Documentation
Guides, changelogs, and project information for users and contributors.

**`/docs/guides`** - Platform-specific setup (6 guides, one for each AI tool)
- Each guide has the same structure: Overview, Step-by-step installation, Verification, Troubleshooting
- Users choose their platform and follow the appropriate guide

**`/docs/superpowers/plans`** - Internal development plans and release notes
- Major version release plans
- Project reorganization plans and milestones
- Keep these for reference during implementation

**Top-level docs files:**
- `CHANGELOG.md` - What changed in each version
- `UPDATE_GUIDE.md` - How to apply updates from one version to the next
- `IMPLEMENTATION_SUMMARY.md` - Technical overview of all implemented features

### `/examples` - Working Code Examples
Real HTML/CSS examples showing how to implement the design system.

**`/examples/components`** - Individual component examples
- Form elements, buttons, cards, etc.
- Each shows proper semantic HTML + UXPro styling

**`/examples/patterns`** - Reusable layout and interaction patterns
- Responsive grids, navigation structures, etc.
- Starting points for common design problems

**`/examples/full-apps`** - Complete working applications
- Dashboard with multiple sections, form submissions, etc.
- Show how components work together

### `/setup` - Getting Started
Quick installation and automated setup.
- `quick-start.sh` - Runs setup for your platform
- `README.md` - Manual setup if you prefer to do it step-by-step

### `/templates` - Tool-Specific Templates
Reusable templates for different editor configurations.
- `claude.md` - CLAUDE.md template for context
- `cursorrules-windsurfrules.md` - Config templates for Cursor/Windsurf

### Root Files
- `README.md` - Main entry point. What is UXPro, quick start, key links
- `CONTRIBUTING.md` - How to contribute back to UXPro
- `VERSION.json` - Current version number and metadata
- `LICENSE` - MIT License terms

## How to Navigate

Use this quick reference to find what you need:

| I want to... | Go to... |
|---|---|
| **Get started in 5 minutes** | [docs/guides/README.md](./guides/README.md) → Choose your platform |
| **Install on Claude Code** | [docs/guides/claude-code.md](./guides/claude-code.md) |
| **Install on Cursor** | [docs/guides/cursor.md](./guides/cursor.md) |
| **Install on Windsurf** | [docs/guides/windsurf.md](./guides/windsurf.md) |
| **Copy the system prompt** | [core/UIUX-SYSTEM-PROMPT.md](../core/UIUX-SYSTEM-PROMPT.md) (copy entire file) |
| **Learn all design rules** | [core/UIUX-MASTER-PROMPT-SYSTEM.md](../core/UIUX-MASTER-PROMPT-SYSTEM.md) (29 detailed sections) |
| **See CSS design tokens** | [core/design-tokens.css](../core/design-tokens.css) (colors, spacing, fonts) |
| **See real code examples** | [examples/README.md](../examples/README.md) |
| **See a form example** | [examples/components/form-example.html](../examples/components/form-example.html) |
| **See a dashboard example** | [examples/full-apps/dashboard-layout.html](../examples/full-apps/dashboard-layout.html) |
| **See responsive grid pattern** | [examples/patterns/responsive-grid.html](../examples/patterns/responsive-grid.html) |
| **Check what's new** | [docs/CHANGELOG.md](./CHANGELOG.md) |
| **Update to new version** | [docs/UPDATE_GUIDE.md](./UPDATE_GUIDE.md) |
| **Understand the structure** | [docs/PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) (this file) |
| **Set up automated** | [setup/quick-start.sh](../setup/quick-start.sh) |
| **Set up manually** | [setup/README.md](../setup/README.md) |
| **Contribute changes** | [CONTRIBUTING.md](../CONTRIBUTING.md) |

## File Naming Conventions

The project follows consistent naming patterns:

### Guides (`docs/guides/`)
- Format: `{platform}.md` (lowercase platform name)
- Examples: `claude-code.md`, `windsurf.md`, `continue-dev.md`
- Each guide covers: What it is, Prerequisites, Step-by-step installation, Verification, Troubleshooting

### Plans (`docs/superpowers/plans/`)
- Format: `YYYY-MM-DD-{project}-v{version}.md`
- Examples: `2026-04-08-uxpro-v2.3.0.md`, `2026-04-09-uxpro-project-reorganization.md`
- Dated for version control and tracking

### Examples (`examples/*/`)
- Format: `{type}-example.html` or `{pattern}-{subject}.html`
- Examples: `form-example.html`, `responsive-grid.html`, `dashboard-layout.html`

### Core Files (`core/`)
- Naming is semantic and descriptive
- Examples: `UIUX-SYSTEM-PROMPT.md`, `design-tokens.css`, `VERSION.json`

### Documentation (`docs/`)
- Uppercase filenames for major docs: `README.md`, `CHANGELOG.md`, `UPDATE_GUIDE.md`
- Descriptive for purpose: `PROJECT_STRUCTURE.md`, `IMPLEMENTATION_SUMMARY.md`

## File Sizes Reference

| File | Size | Purpose |
|------|------|---------|
| core/UIUX-MASTER-PROMPT-SYSTEM.md | 184 KB | Complete design guidelines (29 sections) |
| core/design-tokens.css | 37 KB | CSS variables and design tokens |
| core/UIUX-SYSTEM-PROMPT.md | 30 KB | Quick-reference system prompt |
| docs/superpowers/plans/2026-04-09-uxpro-project-reorganization.md | 51 KB | Reorganization plan document |
| docs/superpowers/plans/2026-04-08-uxpro-v2.3.0.md | 32 KB | Release notes for v2.3.0 |
| templates/claude.md | 32 KB | Claude context template |
| examples/full-apps/dashboard-layout.html | 22 KB | Dashboard example |
| examples/patterns/responsive-grid.html | 23 KB | Responsive grid pattern |
| examples/components/form-example.html | 17 KB | Form component example |
| setup/quick-start.sh | 17 KB | Automated setup script |
| docs/CHANGELOG.md | 17 KB | Version history |
| docs/guides/copilot.md | 12 KB | GitHub Copilot setup guide |
| examples/full-apps/README.md | 12 KB | Full app examples index |
| docs/guides/cline.md | 11 KB | Cline setup guide |
| docs/guides/continue-dev.md | 11 KB | Continue.dev setup guide |
| docs/guides/windsurf.md | 11 KB | Windsurf setup guide |
| CONTRIBUTING.md | 11 KB | Contribution guidelines |
| README.old.md | 9.7 KB | Previous README (legacy) |
| examples/README.md | 9.5 KB | Examples overview |
| examples/patterns/README.md | 9.4 KB | Pattern examples index |
| setup/README.md | 7.9 KB | Setup instructions |
| docs/guides/cursor.md | 8.1 KB | Cursor setup guide |
| docs/IMPLEMENTATION_SUMMARY.md | 8.0 KB | Features summary |
| README.md | 5.9 KB | Main project README |
| templates/cursorrules-windsurfrules.md | 5.6 KB | Cursor/Windsurf rules |
| examples/components/README.md | 8.6 KB | Component examples index |
| VERSION.json | 4.0 KB | Version metadata |
| docs/guides/README.md | 2.5 KB | Guides index |

**Total project size:** ~600 KB (primarily documentation and examples)

## Git Structure

### Branches
- **main** - Stable release branch. Always works, ready for use.
- **feature/*** - Feature branches for new functionality (temporary)
- **docs/*** - Documentation updates (temporary)
- **release/*** - Release preparation branches (temporary)

### Tags
- Format: `v{major}.{minor}.{patch}` (e.g., `v2.3.0`)
- Created for each stable release
- Check the release tag for the exact version code

### Commits
- Commits follow conventional format: `{type}: {description}`
- Examples:
  - `docs: add project structure reference`
  - `feat: add new component pattern`
  - `fix: correct WCAG contrast ratio`
  - `refactor: reorganize design system sections`

### Version Control
- **VERSION.json** - Single source of truth for current version
- **CHANGELOG.md** - Detailed history of all changes
- Each major change gets a dated plan in `docs/superpowers/plans/`

## What Not to Modify

These files are core to UXPro and should be left as-is unless you're contributing a bugfix:

### Core System Prompts
- `core/UIUX-SYSTEM-PROMPT.md` - Contains the actual design rules used by AI tools
- `core/UIUX-MASTER-PROMPT-SYSTEM.md` - Master reference and authority

**Why:** If you modify these, you break the design system for all users who copy from them.

### Version Information
- `core/VERSION.json` - Source of truth for version tracking
- `VERSION.json` - Root copy of version info

**Why:** Changing versions manually breaks update tracking.

### Changelogs and Historical Records
- `docs/CHANGELOG.md` - Historical record of all changes
- `docs/superpowers/plans/` - Records of what was planned and released

**Why:** These are immutable records for tracking project history.

### License
- `LICENSE` - Legal terms of use

**Why:** Changing license terms without authorization is not permitted.

### Root README
- `README.md` - Main entry point for the project

**Why:** Changes here affect first-time user experience. Coordinate before modifying.

## Feel Free To

These items are meant to be modified, extended, and adapted for your needs:

### Examples
- **Everything in `/examples/`** - Modify to show your specific use cases
- Add new examples: `examples/patterns/your-pattern.html`
- Update example READMEs to add your implementations

**How:** Create your own examples, submit PRs if they're generally useful

### Design Tokens
- **Modify `core/design-tokens.css`** - Change colors, spacing, fonts for your brand
- Create variations for different themes
- Add custom tokens for your project

**How:** Keep the token structure, change values to match your brand

### Setup Scripts
- **`setup/quick-start.sh`** - Extend for your specific needs
- Add automatic installation for additional tools
- Add platform-specific configurations

**How:** Add functions, keep existing ones working

### Documentation
- **Guides in `/docs/guides/`** - Add more detailed steps for your workflow
- Add troubleshooting for your specific setup
- Translate guides to other languages

**How:** Coordinate with maintainers if making major changes

### Templates
- **Everything in `/templates/`** - Customize for your team
- Create new templates for your specific workflows
- Add tool-specific configurations

**How:** Create new files, update existing if improving

### Platform Rules Files
- **`.cursorrules` / `.windsurfrules`** - Generate from templates and customize
- Add your own project-specific rules
- Integrate with your development workflow

**How:** Use templates as starting point, modify freely

### Contributing
- **Report issues** via GitHub issues if something needs fixing
- **Submit PRs** with improvements to examples, guides, or documentation
- **Share your implementations** - Show how you used UXPro
- **Suggest enhancements** - Use GitHub discussions

**What maintainers review:**
- Core system prompt changes (bugfixes only)
- New examples (if generally useful)
- Guide improvements and corrections
- Documentation enhancements

## Summary

- **Core files** (`core/`) → Use as-is, don't modify
- **Guides** (`docs/guides/`) → Follow your platform's guide
- **Examples** (`examples/`) → Use as templates and customize
- **Docs** (`docs/`) → Reference and learn
- **Setup** (`setup/`) → Run to get started
- **Templates** (`templates/`) → Customize for your tools

For questions, check the [CONTRIBUTING.md](../CONTRIBUTING.md) and the [UPDATE_GUIDE.md](./UPDATE_GUIDE.md).

**Happy designing with UXPro!**
