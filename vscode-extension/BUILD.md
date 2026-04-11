# Build & Release Guide

## Quick Start: Fresh Install

### 1. Uninstall Old Extension
```bash
# Close VS Code completely
pkill -9 code
sleep 3

# Remove old extension directory
rm -rf ~/.vscode/extensions/smartworkz.powerplay-ai-*

# Remove VS Code cache
rm -rf ~/.config/Code/User/globalStorage/smartworkz*
```

### 2. Clean Build
```bash
cd s:/Code101/PowerPlay/vscode-extension
npm install
npm run compile
npm run package
```

Output: `powerplay-ai-2.0.0.vsix` (50+ KB, includes chat panel + sidebar)

### 3. Fresh Install
```bash
# Copy compiled files to extension directory
mkdir -p ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/out
mkdir -p ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/media

cp -r out/* ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/out/
cp -r media/* ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/media/
cp package.json ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/
cp powerplay.code-snippets ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/
```

### 4. Restart VS Code
```bash
# Wait 2 seconds for extension cleanup
sleep 2

# Reopen VS Code (full restart, not just reload)
code .
```

Wait 10 seconds for extension activation.

### 5. Verify Installation
Look for:
- ✅ **⚡ icon** in Activity Bar (left sidebar)
- ✅ **⚡ PowerPlay v3.9.0** in status bar (bottom-right)
- ✅ `Ctrl+Shift+P` → search "PowerPlay" shows commands
- ✅ `Alt+P` opens quick pick with 134 prompts
- ✅ `Ctrl+Shift+Space` opens chat panel on right side

If none appear: See [Troubleshooting](#troubleshooting) below

---

## Build Process (Detailed)

### 1. Install Dependencies
```bash
cd vscode-extension
npm install
```

### 2. Compile TypeScript
```bash
npm run compile
```

Output: `out/extension.js`, `out/chatPanel.js`, `out/settingsPanel.js`, and type definitions

### 3. Package as .vsix
```bash
npm run package
```

Output: `powerplay-ai-2.0.0.vsix` (installable VS Code extension)

---

## File Structure

```
vscode-extension/
├── src/
│   └── extension.ts              # Main extension source code
├── out/                          # Compiled JavaScript (generated)
│   └── extension.js              # Main compiled extension
├── package.json                  # Extension manifest & metadata
├── tsconfig.json                 # TypeScript compiler config
├── powerplay.code-snippets       # 8 code snippets (Markdown, TS, C#)
├── .vscodeignore                 # Files to exclude from .vsix
├── .gitignore                    # Git ignore patterns
├── README.md                     # Usage guide
├── INSTALL.md                    # Installation instructions
├── CHANGELOG.md                  # Version history
├── LICENSE                       # MIT license
└── BUILD.md                      # This file
```

---

## Extension Lifecycle

### Development
```bash
npm run watch    # Auto-compile on file changes
code --extensionDevelopmentPath="$(pwd)" .   # Launch debug instance
```

In debug instance, press F5 to reload changes.

### Testing
```bash
npm test         # Run tests (if configured)
npm run compile  # Full compile
```

### Packaging
```bash
npm run package  # Creates powerplay-ai-1.0.0.vsix
```

### Publishing (Future)
```bash
npm run publish  # Publish to VS Code Marketplace
```

---

## Extension Configuration

### package.json Fields

| Field | Purpose |
|-------|---------|
| `name` | Unique identifier (lowercase, no spaces) |
| `displayName` | User-visible name in Extensions panel |
| `version` | Semantic versioning (1.0.0) |
| `publisher` | Publisher ID on VS Code Marketplace |
| `main` | Entry point (compiled JavaScript) |
| `activationEvents` | When extension loads (onStartupFinished) |
| `contributes` | Snippets, commands, settings, etc. |
| `engines.vscode` | Minimum VS Code version required |

### Snippets Configuration

```json
"snippets": [
  {
    "language": "markdown",
    "path": "./powerplay.code-snippets"
  }
]
```

Each language scope gets the same snippets file.

### Commands Configuration

```json
"commands": [
  {
    "command": "powerplay.showStatus",
    "title": "PowerPlay: Show Monitoring Status",
    "category": "PowerPlay"
  }
]
```

Commands appear in Command Palette under "PowerPlay" category.

---

## Source Code

### extension.ts

Main extension logic:

1. **activate()** — Called when extension loads
   - Creates status bar item
   - Registers commands
   - Sets up file watchers
   - Returns disposables for cleanup

2. **updateStatusBar()** — Updates status bar appearance
   - Checks if config.yaml exists
   - Updates icon and tooltip
   - Respects `powerplay.statusBarEnabled` setting

3. **getConfigPath()** — Finds config.yaml location
   - Checks custom path setting first
   - Falls back to workspace root
   - Returns undefined if not found

4. **deactivate()** — Called when extension unloads
   - Cleanup (handled automatically by disposables)

---

## Build Troubleshooting

### Error: `npm: command not found`
- Install Node.js from https://nodejs.org/
- Verify: `node --version` and `npm --version`

### Error: `tsc: not found`
- Run: `npm install` in vscode-extension directory
- Should install TypeScript

### Error: `vsce: not found` when packaging
```bash
npm install -g @vscode/vsce
# Or use: npx @vscode/vsce package --allow-star-engines
```

### Error: `Cannot find module 'vscode'`
```bash
npm install
npm run compile
```

### Build succeeds but extension won't load
1. Check `out/extension.js` exists and is not empty
2. Verify `package.json` "main" points to `./out/extension.js`
3. Check VS Code version is 1.85.0+ (run: `code --version`)
4. Look at Output panel for error messages

---

## Development Tips

### Watch Mode + Debug
```bash
# Terminal 1: Watch TypeScript changes
npm run watch

# Terminal 2: Launch debug VS Code
code --extensionDevelopmentPath="$(pwd)" .

# In debug instance: Press F5 to reload extension
```

### Add New Snippet
1. Edit `powerplay.code-snippets` (JSON format)
2. Add new snippet entry with: prefix, scope, description, body
3. Reload debug instance (F5)
4. Test by typing prefix + Tab

### Add New Command
1. Edit `src/extension.ts`
2. Register command in `activate()`: `vscode.commands.registerCommand(...)`
3. Update `package.json` contributes.commands
4. Recompile: `npm run compile`
5. Reload debug instance (F5)

### Add New Setting
1. Update `package.json` contributes.configuration.properties
2. Access in code: `vscode.workspace.getConfiguration('powerplay').get('settingName')`
3. Recompile and reload

---

## Release Checklist

Before packaging a new version:

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md` with changes
- [ ] Run `npm run compile` (no errors)
- [ ] Test all snippets locally
- [ ] Test both commands (Ctrl+Shift+P)
- [ ] Test status bar appears when config.yaml exists
- [ ] Run `npm run package` to create .vsix
- [ ] Install .vsix in fresh VS Code instance
- [ ] Verify it works end-to-end
- [ ] Commit changes to git
- [ ] Tag: `git tag vscode-1.0.0`

---

## Publishing to VS Code Marketplace

(When ready for public release)

1. **Create publisher account**
   - Go to https://marketplace.visualstudio.com
   - Sign in with Microsoft account
   - Create publisher (e.g., "SmartWorkz")

2. **Get Personal Access Token (PAT)**
   - Azure DevOps → User Settings → Personal access tokens
   - Create token with "Marketplace" scope

3. **Publish**
   ```bash
   vsce publish --token <YOUR_PAT>
   ```

4. **Verify**
   - Check https://marketplace.visualstudio.com/items?itemName=SmartWorkz.powerplay-ai
   - Should be searchable and installable

---

## Troubleshooting

### Extension not appearing after restart
**Problem:** No ⚡ icon in Activity Bar, commands not found in Ctrl+Shift+P

**Fix:**
```bash
# 1. Verify VS Code is completely closed
pkill -9 code
sleep 5

# 2. Check extension files exist
ls -la ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/out/extension.js

# 3. Check for VS Code cache issues
rm -rf ~/.config/Code/User/globalStorage

# 4. Reopen VS Code
code .

# 5. Wait 15 seconds (longer startup = extension loading)
```

### "No results found" when searching for PowerPlay
**Problem:** Commands exist but Ctrl+Shift+P doesn't find them

**Fix:** Extension uses `onStartupFinished` activation event
- This requires a FULL VS Code restart (not just reload)
- Do NOT use "Developer: Reload Window"
- Close all VS Code windows completely
- Wait 3 seconds
- Reopen VS Code
- Wait 10 seconds for extension to fully load

### Chat panel doesn't open with Ctrl+Shift+Space
**Problem:** Keybinding doesn't work

**Fix:**
1. Open VS Code settings: `Ctrl+Shift+P` → "Preferences: Open Keyboard Shortcuts"
2. Search for "powerplay.openChat"
3. If missing: Try restart again
4. If still missing: Check `~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/package.json` has keybinding entry
5. Alternative: Use `Ctrl+Shift+P` → "PowerPlay: Open Chat Panel"

### Alt+P doesn't show quick pick
**Problem:** Quick pick command doesn't work

**Fix:** Alt+P may conflict with system shortcuts on some machines
- Try: `Ctrl+Shift+P` → "PowerPlay: Quick Pick Command" instead
- Or customize keybinding: `Ctrl+Shift+P` → "Preferences: Open Keyboard Shortcuts" → search "pickCommand"

### Settings panel is blank
**Problem:** Settings panel opens but shows no content

**Fix:**
1. Toggle developer tools: `Help` → `Toggle Developer Tools`
2. Check Console for errors (look for red X)
3. If errors: Report them in GitHub issues
4. Quick workaround: Edit settings manually:
   ```bash
   cat ~/.config/Code/User/settings.json | grep powerplay
   ```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2026-04-11 | **Chat panel**: Cursor AI-style glassmorphism, slash autocomplete, message history. **Sidebar**: 134 prompts searchable. **Settings**: Dark UI with test connection. **Quick Pick**: Alt+P fuzzy search. **Fixes**: Memory leak in watcher, missing handlers, theme-aware CSS. |
| 1.0.0 | 2026-04-10 | Initial release: 8 snippets, status bar, basic commands |

---

**Build complete! 🚀**

After fresh install, test:
- Open chat panel: `Ctrl+Shift+Space`
- Type `/` in chat input
- See all 134 commands in autocomplete
- Click sidebar ⚡ icon to browse prompts
- Press `Alt+P` for quick pick
- Try Settings: `Ctrl+Shift+P` → "PowerPlay: Open Settings"
