# Changelog

All notable changes to the PowerPlay extension will be documented in this file.

## [2.0.0] — 2026-04-10

### Added (Part A: Sidebar Panel)

- **⚡ Sidebar Panel** — Dedicated Activity Bar icon with full prompt browser
  - Organized by 18+ categories (Core, Security, Database, Testing, Angular, etc.)
  - Collapsible category headers (click to expand/collapse)
  - 252 PowerPlay prompts from config.yaml
  - One-click insert at editor cursor or copy to clipboard
  
- **Live Search Filter**
  - Real-time filtering across command, description, category
  - Instant results as you type
  - Empty state message for no results

- **Reload Config Button**
  - Refresh prompt list from config.yaml
  - No VS Code restart required
  - Toast notification on reload

### Added (Part B: Command Palette)

- **Alt+P QuickPick** — Fast access to all 252 prompts
  - Keyboard-only navigation (arrow keys + Enter)
  - Fuzzy search with description matching
  - Category grouping with visual separators
  - Title shows total prompt count

### Added (New Modules)

- **configParser.ts** — Regex-based YAML parser
  - Extracts 252 prompts from config.yaml
  - Auto-detects categories from section headers
  - Zero external dependencies
  - Exports: PowerPlayPrompt interface, parsePrompts()

- **sidebarProvider.ts** — WebviewViewProvider
  - VS Code Webview integration
  - Message passing between extension and webview
  - Auto-reload on config.yaml change
  - Insert vs Copy behavior based on active editor

- **commandPicker.ts** — QuickPick implementation
  - Category grouping with separators
  - Fuzzy search support
  - File type detection (markdown/plaintext/etc.)
  - Keyboard-only access

- **sidebar.html/css/js** — Sidebar UI
  - Vanilla HTML/CSS/JS (no React/Vue/webpack)
  - Dynamic DOM construction (XSS-safe)
  - Keyboard navigation (arrow keys, Enter)
  - Theme-aware styling with VS Code CSS variables

### Added (Configuration)

- 3 new commands:
  - `powerplay.pickCommand` — Alt+P to open QuickPick
  - `powerplay.reloadConfig` — Reload prompts from config
  - `powerplay.copyCommand` — Manual command copy

- Activity Bar icon and sidebar view in package.json
- Alt+P keybinding for quick access
- onView activation event (auto-generated)

### Changed

- Extension version: 1.0.0 → 2.0.0
- VSIX package size: ~500KB → 26.28 KB (optimized)
- Architecture: Single-purpose → Multi-module
- Sidebar now primary interface, status bar secondary

### Kept from v1.0

- 8 code snippets (unchanged)
- Status bar icon and commands
- Config watcher for auto-detection
- Settings: statusBarEnabled, configPath
- Theme-aware UI throughout

### Technical Improvements

- Full TypeScript with strict types
- Zero external dependencies maintained
- Compiled modules: configParser.js, sidebarProvider.js, commandPicker.js, extension.js
- CSS uses only `--vscode-*` theme variables
- Vanilla client-side JavaScript (no frameworks)
- Accessibility: keyboard navigation, ARIA labels, high contrast support
- XSS-safe: DOM created with appendChild(), not innerHTML

### Removed (from v1 roadmap)

- ~~Dashboard placeholder~~ (v2.1 now)
- ~~Streaming metrics~~ (v2.1 now)

### Planned for v2.1+

- [ ] Favorite prompts (persistent in VS Code settings)
- [ ] Recently used prompts
- [ ] Copy-with-context buttons
- [ ] Settings UI for insert vs copy behavior
- [ ] Prompt detail panel (description + full body)

---

## [1.0.0] — 2026-04-10

### Added

- **8 Code Snippets** for PowerPlay patterns
  - Generic: `pp`, `pp-validate`, `pp-schema`, `pp-helm`, `pp-batch`
  - Language-specific: `pp-ng`, `ng-component` (TypeScript), `cs-endpoint` (C#)
  
- **Status Bar Integration**
  - Real-time config.yaml detection
  - PowerPlay version display
  - Click to show status command
  
- **Commands**
  - `powerplay.showStatus` — Show monitoring status
  - `powerplay.openDashboard` — Open dashboard (placeholder for v1.1)
  
- **Settings**
  - `powerplay.statusBarEnabled` — Toggle status bar visibility (default: true)
  - `powerplay.configPath` — Custom path to config.yaml (default: workspace root)

- **File Watcher**
  - Auto-detect config.yaml changes
  - Dynamic status bar updates

### Planned for v1.1+

- [ ] Real-time metrics file watcher
- [ ] Live throughput indicator
- [ ] WebView dashboard integration
- [ ] Command palette integration for patterns
- [ ] Keybindings for snippet shortcuts

## Future Releases

### v1.1 (Q2 2026)
- Metrics file watcher for real-time throughput
- Live status bar updates
- Dashboard quick-open

### v2.0 (Q3 2026)
- Full WebView dashboard
- Streaming metrics display
- Alert notifications
- Pattern execution history
