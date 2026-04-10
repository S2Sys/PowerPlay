# PowerPlay VS Code Extension — Installation & Setup

## Quick Start (No Build Required)

### Option 1: Use Snippets Only (30 seconds)

Snippets work immediately without building the extension:

1. **Copy snippets to workspace:**
   ```bash
   cp vscode-extension/powerplay.code-snippets .vscode/
   ```

2. **Open a Markdown or TypeScript file** in VS Code

3. **Type a snippet prefix and press Tab:**
   - `pp` → Generic PowerPlay invocation
   - `pp-validate` → Requirements validation
   - `pp-schema` → Database schema optimization
   - `pp-helm` → Helm chart generation
   - `ng-component` → Angular component (TypeScript files)
   - `cs-endpoint` → C# controller endpoint

Done! No npm install needed for snippets.

---

## Full Installation (Build Extension)

### Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org/)
- **npm 9+** — Installed with Node.js
- **VS Code 1.85.0+** — [Download](https://code.visualstudio.com/)

### Step 1: Build the Extension

```bash
cd vscode-extension

# Install dependencies
npm install

# Compile TypeScript → JavaScript
npm run compile

# (Optional) Watch mode for development
npm run watch
```

### Step 2: Package as .vsix

```bash
npm run package
```

Creates: `powerplay-ai-1.0.0.vsix`

### Step 3: Install in VS Code

**Method A: Command Line**
```bash
code --install-extension powerplay-ai-1.0.0.vsix
```

**Method B: VS Code UI**
1. Open VS Code
2. Press `Ctrl+Shift+P` → type "Install from VSIX"
3. Select the `.vsix` file

**Method C: Drag & Drop**
1. Open VS Code Extensions panel (`Ctrl+Shift+X`)
2. Drag the `.vsix` file onto the panel

---

## Verification

1. **Check status bar:**
   - Look for `$(zap) PowerPlay v3.9.0` in the bottom-right status bar
   - If you see it, the extension is active

2. **Test status command:**
   - Press `Ctrl+Shift+P`
   - Type "PowerPlay: Show Monitoring Status"
   - You should see a message: "PowerPlay v3.9.0 — Active and ready"

3. **Test snippets:**
   - Create a `.md` file
   - Type `pp` and press `Tab`
   - You should see the snippet expand

---

## Configuration

After installation, customize in `.vscode/settings.json`:

```json
{
  "powerplay.statusBarEnabled": true,
  "powerplay.configPath": "/path/to/custom/config.yaml"
}
```

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `powerplay.statusBarEnabled` | boolean | `true` | Show status bar item |
| `powerplay.configPath` | string | workspace root | Path to config.yaml |

---

## What the Extension Does

### Status Bar Integration

- **Icon:** `$(zap)` lightning bolt
- **Shows:** "PowerPlay v3.9.0"
- **Click:** Shows status message
- **Auto-detects:** config.yaml in workspace

### Code Snippets (8 Total)

Available in: Markdown, Plaintext, TypeScript, C#

1. **pp** — Generic `/pp` invocation
2. **pp-validate** — `/validate-requirements`
3. **pp-schema** — `/optimize-database-schema`
4. **pp-helm** — `/generate-helm-charts`
5. **pp-batch** — Batch orchestration
6. **pp-ng** — Angular component request
7. **ng-component** — Angular 17+ component class
8. **cs-endpoint** — ASP.NET Core 8 endpoint

### Commands

| Command | Keybinding | Action |
|---------|-----------|--------|
| `powerplay.showStatus` | None | Show extension status |
| `powerplay.openDashboard` | None | Open dashboard (v1.1+) |

Access via `Ctrl+Shift+P` → type "PowerPlay"

---

## Troubleshooting

### Status Bar Not Showing

1. Check `powerplay.statusBarEnabled` is `true`
2. Verify `config.yaml` exists in workspace root
3. Reload VS Code (`Ctrl+R`)
4. Check Output panel (`Ctrl+Shift+U`) for errors

### Snippets Not Expanding

1. Verify file is `.md` (Markdown) or `.ts` (TypeScript)
2. Check snippet file exists: `.vscode/powerplay.code-snippets`
3. Reload VS Code
4. Try snippet in new file

### "PowerPlay not found" Error

1. Ensure `.vsix` was correctly installed
2. Check **Extensions panel** (`Ctrl+Shift+X`) shows "PowerPlay AI"
3. Reinstall: `code --uninstall-extension SmartWorkz.powerplay-ai`
4. Then: `code --install-extension powerplay-ai-1.0.0.vsix`

### Build Errors

**Error: `tsc: not found`**
```bash
npm install  # Install TypeScript dependency
npm run compile
```

**Error: `ENOENT: no such file or directory`**
```bash
# Ensure you're in the vscode-extension directory
cd vscode-extension
npm run compile
```

**Error: `vsce: not found`**
```bash
npm install -g @vscode/vsce
# Or use: npx @vscode/vsce package
```

---

## Development Setup

### Watch Mode (Auto-recompile)

```bash
cd vscode-extension
npm install
npm run watch
```

In another terminal:
```bash
# Launch debug VS Code instance
code --extensionDevelopmentPath="$(pwd)" .
```

Press `F5` inside the debug instance to reload.

### Edit Source Code

Source files are in `src/`:
- `src/extension.ts` — Main extension logic

Changes auto-compile via `npm run watch`.

---

## Uninstall

```bash
code --uninstall-extension SmartWorkz.powerplay-ai
```

Or via VS Code UI:
1. Open Extensions panel (`Ctrl+Shift+X`)
2. Search "PowerPlay"
3. Click uninstall icon

---

## Next Steps

1. ✅ Install the extension
2. ✅ Verify status bar shows "PowerPlay v3.9.0"
3. ✅ Test a snippet (`pp` → Tab)
4. ✅ Open Continue.dev and run `/validate-requirements` on sample requirements
5. 📋 Future: v1.1 will add real-time metrics dashboard

---

## Support

- **Installation issues?** Check VS Code version (1.85.0+)
- **Snippets not working?** Verify file extensions (.md, .ts, .cs)
- **Bug reports?** Create issue with: VS Code version, extension version, error message

---

## Version Info

- **Extension Version:** 1.0.0
- **PowerPlay Version:** 3.9.0
- **Required VS Code:** 1.85.0+
- **Node.js:** 18.0.0+

---

**Ready to use! 🚀**
