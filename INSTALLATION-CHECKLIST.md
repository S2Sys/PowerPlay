# PowerPlay v2.0.0 Installation Checklist

**Extension Status:** ✅ Freshly built and installed  
**Version:** 2.0.0  
**Size:** 56.18 KB  
**Date:** April 11, 2026

---

## Pre-Restart (What We Just Did)

- [x] Uninstalled old extension
- [x] Cleaned build: `npm install && npm run compile && npm run package`
- [x] Installed to `~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/`
- [x] Verified all 30 files (24 JS + 6 media)
- [x] Updated BUILD.md with fresh install instructions
- [x] Created FRESH-INSTALL-READY.md guide
- [x] Committed to git

---

## Installation Steps (Do These Now)

### Step 1: Close VS Code Completely
- [ ] Close all VS Code windows (File → Exit)
- [ ] Wait 3 seconds for complete cleanup
- [ ] Verify no VS Code processes running

### Step 2: Reopen VS Code
- [ ] Run: `code .`
- [ ] Wait 15 seconds (full startup required for `onStartupFinished` event)
- [ ] Do NOT use "Developer: Reload Window" — must be full restart

### Step 3: Verify Extension Loaded

#### Sign 1: Activity Bar Icon
- [ ] Look at left sidebar (Activity Bar)
- [ ] See **⚡ lightning bolt icon** (it's the first icon, or click to reveal)
- [ ] **Icon should be colored** (not gray)

#### Sign 2: Status Bar
- [ ] Look at bottom-right corner (status bar)
- [ ] See: **⚡ PowerPlay v3.9.0**
- [ ] Status bar item should have **amber/orange background**
- [ ] If not visible: Status bar may be hidden (View → Status Bar)

#### Sign 3: Command Palette
- [ ] Press: `Ctrl+Shift+P`
- [ ] Type: `PowerPlay`
- [ ] Should see commands:
  - [ ] PowerPlay: Open Chat Panel
  - [ ] PowerPlay: Quick Pick Command
  - [ ] PowerPlay: Reload Config
  - [ ] PowerPlay: Open Settings
  - [ ] PowerPlay: Copy Command
  - [ ] PowerPlay: Open Dashboard
  - [ ] PowerPlay: Show Monitoring Status

#### Sign 4: Quick Pick
- [ ] Press: `Alt+P`
- [ ] Quick pick should open with list of 134 prompts
- [ ] Can type to filter
- [ ] Shows categories like "Code Review", "Angular", "Database", etc.

#### Sign 5: Chat Panel
- [ ] Press: `Ctrl+Shift+Space`
- [ ] Chat panel should open on the **right side of editor**
- [ ] Header shows: **⚡ PowerPlay** with badge showing prompt count
- [ ] Input area at bottom with send button (↑)
- [ ] Clear button (↺) in top-right

#### Sign 6: Sidebar
- [ ] Click: **⚡ icon** in Activity Bar
- [ ] Sidebar panel should open showing **134 PowerPlay prompts**
- [ ] Organized by categories: Code Review, Angular, Database, Security, etc.
- [ ] Search box at top to filter
- [ ] Reload button at bottom

---

## Feature Testing

### Test Chat Panel
- [ ] Press: `Ctrl+Shift+Space`
- [ ] Type in input: `/rev`
- [ ] Autocomplete appears showing `/review`, `/inline-review`, etc.
- [ ] Press: `↑` (arrow up key)
- [ ] Highlighted item changes
- [ ] Press: `Enter`
- [ ] Input filled with `/review`
- [ ] Press: `Enter` again
- [ ] Message sent, assistant responds with description

### Test Sidebar
- [ ] Click: **⚡ icon** in Activity Bar
- [ ] Search box appears at top
- [ ] Type: `test`
- [ ] Results filter to show test-related commands
- [ ] Click any command
- [ ] Command inserts at cursor OR copied to clipboard (notification appears)

### Test Settings
- [ ] Press: `Ctrl+Shift+P`
- [ ] Type: `PowerPlay: Open Settings`
- [ ] Settings panel opens
- [ ] Shows form fields: Default Model, API Key, Temperature, Max Tokens, etc.
- [ ] Can scroll through options
- [ ] "🔗 Test Connection" button clickable
- [ ] "💾 Save All Settings" button clickable

### Test Quick Pick
- [ ] Press: `Alt+P`
- [ ] Quick pick opens with all 134 prompts
- [ ] Type: `review`
- [ ] Results filter to show review commands
- [ ] Press: `↑ ↓` arrows to navigate
- [ ] Press: `Enter` to select
- [ ] Command inserted at cursor

---

## Troubleshooting

### If no ⚡ icon appears
- [ ] Verify: Full restart was done (File → Exit, not just reload)
- [ ] Verify: Waited 15 seconds after reopening
- [ ] Check: `~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/out/extension.js` exists
- [ ] Try: Developer → Toggle Developer Tools → Console (look for errors)
- [ ] See: [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md)

### If Alt+P doesn't work
- [ ] Try: `Ctrl+Shift+P` → "PowerPlay: Quick Pick Command"
- [ ] Alt+P may conflict with system shortcuts on your machine
- [ ] Go to: Preferences → Keyboard Shortcuts
- [ ] Search: `powerplay.pickCommand`
- [ ] Can customize keybinding here

### If Chat Panel doesn't open
- [ ] Try: `Ctrl+Shift+P` → "PowerPlay: Open Chat Panel"
- [ ] Ctrl+Shift+Space may conflict with system shortcuts
- [ ] Check: Preferences → Keyboard Shortcuts → search `powerplay.openChat`
- [ ] Can customize keybinding

### If Settings panel is blank
- [ ] Try: Developer → Toggle Developer Tools → Console (look for errors)
- [ ] Try: Close and reopen settings panel
- [ ] Try: Full VS Code restart

### If Sidebar doesn't show prompts
- [ ] Check: Config path is set correctly
- [ ] Ctrl+Shift+P → "PowerPlay: Open Settings"
- [ ] Verify: Config Path points to `s:/Code101/PowerPlay/config.yaml`
- [ ] Try: Reload Config button in sidebar footer

---

## Success Criteria

All of these should be true:

- [ ] ⚡ icon visible in Activity Bar
- [ ] ⚡ PowerPlay v3.9.0 visible in status bar (bottom-right)
- [ ] `Ctrl+Shift+P` shows PowerPlay commands
- [ ] `Alt+P` opens quick pick with prompts
- [ ] `Ctrl+Shift+Space` opens chat panel
- [ ] Chat panel autocomplete works (type `/` and see suggestions)
- [ ] Sidebar shows 134 prompts when clicked
- [ ] Settings panel opens with form fields
- [ ] Can type in chat and send messages
- [ ] Can search in sidebar

**If all checked:** ✅ **Installation successful!**

---

## Documentation Reference

| Document | Purpose | When to Use |
|----------|---------|-----------|
| [FRESH-INSTALL-READY.md](FRESH-INSTALL-READY.md) | Complete 3-step guide | First time setup |
| [START-HERE-EXTENSION.md](START-HERE-EXTENSION.md) | 60-second quick start | Need quick reference |
| [README-EXTENSION-v2.0.0.md](README-EXTENSION-v2.0.0.md) | Full feature overview | Understanding features |
| [vscode-extension/BUILD.md](vscode-extension/BUILD.md) | Build & troubleshooting | Building from source |
| [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md) | Diagnostic guide | Extension not appearing |
| [EXTENSION-VISUAL-GUIDE.md](EXTENSION-VISUAL-GUIDE.md) | UI mockups | Visual reference |
| [EXTENSION-QUICK-COMMANDS.md](EXTENSION-QUICK-COMMANDS.md) | Shell commands | Copy-paste commands |

---

## Quick Reference

### Keyboard Shortcuts
| Action | Shortcut | Fallback |
|--------|----------|----------|
| Chat Panel | `Ctrl+Shift+Space` | Ctrl+Shift+P → "Open Chat Panel" |
| Quick Pick | `Alt+P` | Ctrl+Shift+P → "Quick Pick Command" |
| Settings | `Ctrl+Shift+P` → "Open Settings" | — |
| Command Palette | `Ctrl+Shift+P` | — |

### Extension Files
```
~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/
├── out/                    (24 JS modules)
│   ├── extension.js        ← Main entry point
│   ├── chatPanel.js        ← Chat panel logic
│   ├── settingsPanel.js    ← Settings UI
│   ├── sidebarProvider.js  ← Sidebar provider
│   ├── configParser.js     ← Config parser
│   └── commandPicker.js    ← Quick pick
├── media/                  (6 media files)
│   ├── chat.css            ← Chat styles
│   ├── chat.js             ← Chat logic
│   ├── sidebar.css         ← Sidebar styles
│   ├── sidebar.js          ← Sidebar logic
│   ├── sidebar.html        ← Sidebar template
│   └── icon.svg            ← ⚡ icon
├── package.json            ← Manifest
└── powerplay.code-snippets ← Code snippets
```

---

## Notes

- Extension uses `onStartupFinished` activation event
- This means it only loads on full VS Code startup, not reload
- Always do: File → Exit, then reopen, then wait 15 seconds
- Never use: Developer → Reload Window (doesn't trigger `onStartupFinished`)

---

**Last Checked:** April 11, 2026  
**Status:** ✅ Fresh Install Complete

Use this checklist to verify installation is working correctly.
