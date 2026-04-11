# PowerPlay AI for VS Code — v2.0.0

**Complete VS Code extension with settings panel, sidebar, and quick command access.**

✅ **Status:** Installed & Ready  
📦 **Version:** 2.0.0  
🔧 **Compiled:** Yes (10 JS modules)  
📍 **Location:** `~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/`  

---

## What You Get

### ⚡ **Sidebar Panel**
- View all **134 PowerPlay prompts** in the Activity Bar
- Organized into **18 categories** (Code Review, Angular, Database, Security, etc.)
- **Live search** to find commands instantly
- **Click to insert** any command into your editor

### ⚙️ **Settings Panel**
- **Select default models:** Claude Opus, Sonnet, or Haiku
- **Configure API key** with test connection button
- **Tune agent behavior:** iterations, timeout, parallel execution
- **Advanced options:** temperature, max tokens, debug mode
- **All settings persist** to VS Code global config

### 🎨 **Quick Command Palette**
- Press **Alt+P** to open command palette
- **Fuzzy search** across all 134 prompts
- **Type to filter** (e.g., "review" → `/review` commands)
- **Press Enter** to insert or copy command

### 📊 **Status Bar**
- Shows **⚡ PowerPlay v3.9.0** in status bar (bottom-right)
- **Clickable** for status information
- **Color changes** based on config status

### 🎯 **Config Parser**
- **Automatically detects** all 134 prompts from `config.yaml`
- **Zero external dependencies** (pure regex parsing)
- **Correct detection** of invokable prompts
- **Works offline** (no cloud calls)

---

## Getting Started (30 seconds)

### Step 1: Restart VS Code
```
1. Close ALL VS Code windows (File → Exit)
2. Wait 3 seconds
3. Reopen VS Code
4. Wait 10 seconds for extension to activate
```

### Step 2: Verify Installation
Look for these signs that extension loaded:

- ✅ **⚡ icon** visible in Activity Bar (left sidebar)
- ✅ **⚡ PowerPlay v3.9.0** showing in status bar (bottom-right, amber color)
- ✅ Ctrl+Shift+P shows "PowerPlay" commands
- ✅ Alt+P opens command palette

### Step 3: Configure Settings
```
1. Press Ctrl+Shift+P
2. Type: "PowerPlay: Open Settings"
3. Select model: Claude Opus
4. Paste API key: sk-ant-...
5. Click "Test Connection"
6. Click "Save All Settings"
```

### Step 4: Start Using
```
Option A: Click ⚡ icon in Activity Bar
→ Browse all 134 prompts in sidebar
→ Click any prompt to insert command

Option B: Press Alt+P
→ Type "review" to find /review
→ Press Enter to insert

Option C: In Continue.dev (Ctrl+L)
→ Type: /play [your request]
→ PowerPlay routes to appropriate command
```

---

## Features at a Glance

| Feature | How to Access | Keyboard Shortcut |
|---------|---------------|-------------------|
| **Browse Prompts** | Click ⚡ in Activity Bar | — |
| **Settings Panel** | Ctrl+Shift+P → "Open Settings" | — |
| **Quick Command** | Alt+P | Alt+P |
| **Show Status** | Ctrl+Shift+P → "Show Monitoring Status" | — |
| **Reload Config** | Ctrl+Shift+P → "Reload Config" | — |
| **Copy Command** | Ctrl+Shift+P → "Copy Command" | — |

---

## Understanding the 134 Prompts

All prompts are organized by **18 categories**:

```
Code Review & Quality (14)
├─ /review — Full code review (bugs, patterns, security)
├─ /inline-review — Quick inline code review
├─ /audit-all — Audit entire codebase
├─ /validate-requirements — Validate against requirements
└─ /code-audit — Security audit

Angular Development (8)
├─ /ng-component — Generate Angular component
├─ /ng-service — Generate Angular service
├─ /ng-module — Generate Angular module
└─ ...

Database & Queries (15)
├─ /optimize-schema — Schema optimization
├─ /query-review — SQL query review
├─ /normalize-data — Data normalization
└─ ...

Security & Compliance (8)
├─ /security-scan — Security vulnerability scan
├─ /penetration-test — Penetration testing
└─ ...

... and 14 more categories!
```

---

## Configuration Options

### **Models** (Choose which Claude to use)
- **Claude Opus** — Most capable, best for complex analysis
- **Claude Sonnet** — Balanced (recommended)
- **Claude Haiku** — Fast and efficient

### **API Provider** (Where to call)
- **Anthropic** — Direct Claude API (recommended)
- **OpenRouter** — Multi-model access with fallbacks
- **Local** — Ollama on-device models

### **Agent Behavior** (How to execute)
- **Max Iterations:** How many steps before stopping (default: 5)
- **Timeout:** Max execution time in seconds (default: 300)
- **Parallel Execution:** Run independent tasks concurrently (ON)
- **Caching:** Reuse results from identical requests (ON)

### **Advanced** (Fine-tune output)
- **Temperature:** 0 = deterministic, 2 = creative (default: 0.7)
- **Max Tokens:** Response length in tokens (default: 4096)
- **Debug Mode:** Show detailed logs (OFF)

---

## Troubleshooting

### "I don't see the ⚡ icon"
→ Extension didn't activate. See [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md) **Fix 3**

### "No commands appear in Ctrl+Shift+P"
→ Extension not fully loaded. See [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md) **Fix 1**

### "Alt+P doesn't work"
→ Keybinding not registered. See [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md) **Fix 4**

### "Settings panel is blank"
→ WebView didn't load. See [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md) **Fix 5**

### "Still stuck?"
→ Follow the diagnostic checklist in [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md)

---

## Documentation

📖 **Quick Start** → [QUICK-START-SETTINGS.md](QUICK-START-SETTINGS.md) (30 seconds)  
📚 **Full Guide** → [SETTINGS-PANEL-GUIDE.md](SETTINGS-PANEL-GUIDE.md) (complete reference)  
🔧 **Troubleshooting** → [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md) (fixes & diagnostics)  
🎨 **Visual Guide** → [EXTENSION-VISUAL-GUIDE.md](EXTENSION-VISUAL-GUIDE.md) (UI mockups)  
⚡ **Quick Commands** → [EXTENSION-QUICK-COMMANDS.md](EXTENSION-QUICK-COMMANDS.md) (copy-paste reference)  
📊 **Status Report** → [EXTENSION-STATUS-REPORT.md](EXTENSION-STATUS-REPORT.md) (installation details)  

---

## Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Quick Command Palette | Alt+P | Cmd+Shift+P |
| Open Settings | Ctrl+Shift+P | Cmd+Shift+P |
| Command Palette | Ctrl+Shift+P | Cmd+Shift+P |

---

## What's Inside

**Source Code** (TypeScript, compiled to JavaScript):
- `extension.ts` — Main activation logic
- `settingsPanel.ts` — 855-line settings UI
- `sidebarProvider.ts` — WebView sidebar provider
- `commandPicker.ts` — QuickPick command palette
- `configParser.ts` — YAML parser

**Media Assets**:
- `icon.svg` — Lightning bolt ⚡ icon
- `sidebar.html` — Sidebar UI template
- `sidebar.css` — Theme-aware styles (dark/light)
- `sidebar.js` — Client-side logic

**Documentation**:
- `package.json` — Extension manifest
- `powerplay.code-snippets` — 8 code templates
- Multiple guides (see Documentation section)

---

## System Requirements

- **VS Code:** v1.85 or later
- **Node.js:** v16+ (for building only, not required for using)
- **Config File:** `s:/Code101/PowerPlay/config.yaml` (must exist)
- **API Key:** Anthropic API key (starts with `sk-ant-`)

---

## Security

✅ **Your API key is:**
- Stored locally in VS Code
- Never sent to external servers
- Encrypted by VS Code secure storage (coming in v2.1)
- Scoped to your machine only

**Best practices:**
- Use a read-only API key if possible
- Rotate keys regularly
- Don't commit settings files with keys

---

## Settings Persistence

All settings are automatically saved to:
```
~/.config/Code/User/settings.json
```

You can also edit settings manually:
```json
{
  "powerplay.defaultModel": "claude-opus-4-6",
  "powerplay.fastModel": "claude-haiku-4-5",
  "powerplay.apiKey": "sk-ant-...",
  "powerplay.configPath": "s:/Code101/PowerPlay/config.yaml",
  "powerplay.temperature": 0.7,
  "powerplay.maxTokens": 4096,
  "powerplay.maxIterations": 5,
  "powerplay.timeout": 300,
  "powerplay.parallelExecution": true,
  "powerplay.caching": true,
  "powerplay.debugMode": false
}
```

---

## Integration with Continue.dev

PowerPlay extension works seamlessly with Continue.dev:

```
Continue.dev (Ctrl+L)
│
├─ Type: /play [your request]
│
└─ PowerPlay routes to appropriate command:
   ├─ /security-scan (for security issues)
   ├─ /review (for code review)
   ├─ /optimize-schema (for database)
   └─ ... (other commands)
```

All configuration from the Settings Panel applies to Continue.dev integration.

---

## Version History

| Version | Release | Features |
|---------|---------|----------|
| 2.0.0 | Apr 10, 2026 | Settings panel, sidebar, quick pick, config parser (134 prompts) |
| 1.0.0 | Earlier | Status bar, 8 code snippets |

---

## Support

- 📖 **Quick Start:** [QUICK-START-SETTINGS.md](QUICK-START-SETTINGS.md)
- 📚 **Full Guide:** [SETTINGS-PANEL-GUIDE.md](SETTINGS-PANEL-GUIDE.md)
- 🔧 **Troubleshooting:** [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md)
- 🎨 **Visual Guide:** [EXTENSION-VISUAL-GUIDE.md](EXTENSION-VISUAL-GUIDE.md)

---

## What's Next?

1. **Verify Installation** — Check ⚡ icon appears after restart
2. **Configure Settings** — Set your API key and default model
3. **Explore Prompts** — Browse 134 commands via sidebar
4. **Use Quick Command** — Try Alt+P for fast access
5. **Integrate with Continue.dev** — Use `/play` in Continue

---

**⚡ PowerPlay extension is ready to use. Restart VS Code and start building!**
