# ⚡ PowerPlay v2.0.0

**AI-Powered VS Code Extension with Chat Panel, Settings Integration, and 134 Slash Commands**

## Quick Links

📖 **Documentation:** See [`docs/`](docs/) directory  
🚀 **Quick Start:** [docs/START-HERE.md](docs/START-HERE.md)  
🔧 **Installation:** [docs/FRESH-INSTALL-READY.md](docs/FRESH-INSTALL-READY.md)  
⚙️ **Settings Guide:** [docs/QUICK-START-SETTINGS.md](docs/QUICK-START-SETTINGS.md)  
📋 **Quick Reference:** [docs/QUICK-REFERENCE-v2.0.0.md](docs/QUICK-REFERENCE-v2.0.0.md)

---

## What is PowerPlay?

**PowerPlay** is a VS Code extension that brings AI-powered development tools directly into your editor:

- **⚡ Chat Panel** — Open with `Ctrl+Shift+Space`
- **134 Slash Commands** — Type `/` to see all available commands
- **⚙️ Built-in Settings** — Configure everything inside the chat panel
- **Glassmorphism UI** — Dark void design with cyan accents
- **Auto-reload** — Prompts update automatically on config changes

---

## Features

### 🎯 Chat Panel
- Real-time slash command autocomplete
- Message history with markdown rendering
- Auto-resizing textarea
- Clear history button
- Settings accessible via ⚙️ button

### 💾 Settings Management
- Config path input
- Model selection (Opus 4.6, Sonnet 4.6, Haiku 4.5)
- API key configuration
- Temperature slider (0-2)
- Test connection button
- All settings persist to VS Code config

### 🎨 Design
- Glassmorphism dark void aesthetic
- Cyan plasma accents (#00d4ff)
- Frosted glass surfaces
- Smooth animations
- Custom scrollbars

### 🔄 Auto-Features
- Auto-reload prompts on panel open
- Auto-reload on config changes
- Auto-reload on settings save
- Subscribes to VS Code configuration changes

---

## Installation

### From GitHub Releases (Recommended)

1. Download latest release: https://github.com/S2Sys/PowerPlay/releases/tag/v2.0.0
2. Open VS Code Extensions: `Ctrl+Shift+X`
3. Click `...` → Install from VSIX
4. Restart VS Code

### From Local Build

```bash
cd vscode-extension
npm install
npm run compile
npm run package
# Creates: powerplay-ai-2.0.0.vsix

# Then install
code --install-extension powerplay-ai-2.0.0.vsix
```

### Setup

1. Press `Ctrl+Shift+Space` to open chat panel
2. Click ⚙️ button in chat header
3. Configure:
   - **Config Path:** Path to your config.yaml
   - **API Key:** Your Anthropic API key (sk-ant-...)
   - **Model:** Choose Claude version
4. Click 💾 Save Settings

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Chat Panel | `Ctrl+Shift+Space` |
| Open Settings | ⚙️ button in chat |
| Open Quick Pick | `Alt+P` |
| Trigger Autocomplete | Type `/` |
| Navigate Commands | `↑` `↓` |
| Select Command | `Enter` |
| New Line in Chat | `Shift+Enter` |
| Clear History | ↺ button |

---

## Project Structure

```
PowerPlay/
├── README.md                          (this file)
├── docs/                              (all documentation)
│   ├── START-HERE.md
│   ├── FRESH-INSTALL-READY.md
│   ├── QUICK-REFERENCE-v2.0.0.md
│   ├── UNINSTALL-REINSTALL-GUIDE.md
│   └── ...
├── vscode-extension/
│   ├── src/
│   │   ├── chatPanel.ts              (chat panel logic)
│   │   ├── extension.ts              (main entry)
│   │   ├── configParser.ts           (parse config)
│   │   ├── sidebarProvider.ts
│   │   ├── settingsPanel.ts
│   │   └── commandPicker.ts
│   ├── media/
│   │   ├── chat.css                  (styles)
│   │   ├── chat.js                   (autocomplete)
│   │   └── ...
│   ├── package.json
│   └── BUILD.md
├── config.yaml                        (prompts configuration)
└── docs/archive/                      (old archived docs)
```

---

## Documentation

All documentation has been moved to the [`docs/`](docs/) directory:

### User Guides
- [START-HERE.md](docs/START-HERE.md) — Main entry point
- [START-HERE-EXTENSION.md](docs/START-HERE-EXTENSION.md) — Extension-specific guide
- [FRESH-INSTALL-READY.md](docs/FRESH-INSTALL-READY.md) — Step-by-step installation
- [QUICK-REFERENCE-v2.0.0.md](docs/QUICK-REFERENCE-v2.0.0.md) — Shortcuts & tips
- [QUICK-START-SETTINGS.md](docs/QUICK-START-SETTINGS.md) — Settings tutorial

### Installation & Migration
- [UNINSTALL-REINSTALL-GUIDE.md](docs/UNINSTALL-REINSTALL-GUIDE.md) — Upgrade from v1.0.0
- [INSTALLATION-CHECKLIST.md](docs/INSTALLATION-CHECKLIST.md) — Verification steps

### Technical Reference
- [README-EXTENSION-v2.0.0.md](docs/README-EXTENSION-v2.0.0.md) — Full extension docs
- [SESSION-DELIVERY-v2.0.0-CHAT-PANEL.md](docs/SESSION-DELIVERY-v2.0.0-CHAT-PANEL.md) — Technical summary

### Configuration
- [docs/BUILD.md](docs/BUILD.md) — Build instructions
- [docs/ENVIRONMENT-VARIABLES.md](docs/ENVIRONMENT-VARIABLES.md) — Configuration reference
- [docs/README.md](docs/README.md) — Documentation index

### Archive
- [docs/archive/README.md](docs/archive/README.md) — Archived docs index
- [docs/archive/2026-04-11-v2.0.0-cleanup/](docs/archive/2026-04-11-v2.0.0-cleanup/) — Old files

---

## Getting Started (5 Minutes)

### 1. Install
```bash
# Download from releases or build locally
code --install-extension powerplay-ai-2.0.0.vsix
```

### 2. Restart VS Code
Close and reopen VS Code, wait 15 seconds for activation.

### 3. Open Chat
Press `Ctrl+Shift+Space` to open the chat panel.

### 4. Configure
Click ⚙️ button → Enter settings → Save.

### 5. Use
Type `/` to see all 134 commands!

---

## Configuration

Create `config.yaml` in your project root:

```yaml
prompts:
  - command: /review
    description: Conduct a comprehensive code review
    prompt: "Review this code for quality, performance, security..."
  
  - command: /explain
    description: Explain what this code does
    prompt: "Explain this code clearly..."

  # Add more commands here
```

PowerPlay comes with 134 pre-configured prompts in `config.yaml`.

---

## Requirements

- **Node.js** 16+
- **npm** 7+
- **VS Code** 1.50+
- **TypeScript** 4.x
- **API Key** from Anthropic (sk-ant-...)

---

## Build Instructions

```bash
cd vscode-extension

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Create extension package
npm run package
# Creates: powerplay-ai-2.0.0.vsix
```

---

## Troubleshooting

**Chat shows "0 commands"**
- Click ⚙️ → Set config path → Save settings
- Path should point to your config.yaml

**Settings not saving**
- Verify API key format (sk-ant-...)
- Click "Test Connection" to verify key
- Check VS Code has write permissions

**Extension not showing**
- Close VS Code completely
- Wait 3 seconds
- Reopen and wait 15 seconds

See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for more help.

---

## Contributing

PowerPlay welcomes contributions! Areas to improve:

- Real AI integration (Claude API responses)
- Code execution in chat
- Prompt marketplace
- Community prompt sharing
- Advanced settings

---

## Version History

- **v2.0.0** — Chat panel with integrated settings (current)
- **v2.1.0+** — Real AI integration planned

See full history: [docs/archive/](docs/archive/)

---

## License

MIT License — See LICENSE file for details.

---

## Support & Links

| Resource | Link |
|----------|------|
| GitHub | https://github.com/S2Sys/PowerPlay |
| Releases | https://github.com/S2Sys/PowerPlay/releases |
| Issues | https://github.com/S2Sys/PowerPlay/issues |
| Documentation | [docs/](docs/) directory |

---

## Quick Stats

| Metric | Value |
|--------|-------|
| Version | 2.0.0 |
| Commands | 134 |
| Chat Panel | ✅ Yes |
| Settings | ✅ Built-in |
| Auto-reload | ✅ Yes |
| Lines of Code | ~1,700 (new in v2.0.0) |
| Status | Production Ready |

---

**Ready to use?** Start with [docs/START-HERE.md](docs/START-HERE.md) 🚀

**Questions?** Check [docs/QUICK-REFERENCE-v2.0.0.md](docs/QUICK-REFERENCE-v2.0.0.md) for shortcuts and tips.

**Need help?** See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).
