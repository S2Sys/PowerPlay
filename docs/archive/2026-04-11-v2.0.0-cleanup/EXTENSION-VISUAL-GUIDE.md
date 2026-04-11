# PowerPlay Extension v2.0.0 — Visual Guide

Quick visual reference of what you should see when the extension loads.

---

## 1️⃣ Activity Bar Icon (Left Side)

**After restart, you should see this:**

```
VS Code Left Sidebar (Activity Bar)
┌─────────┐
│  📁     │  Explorer
│  🔍     │  Search
│  ⚡ ← NEW! PowerPlay (cyan lightning bolt)
│  ▶️     │  Run & Debug
│  📦     │  Extensions
│  ...    │
└─────────┘
```

**Click the ⚡ icon → Sidebar panel opens on the left**

---

## 2️⃣ Sidebar Panel Content

**What appears when you click ⚡:**

```
ACTIVITY BAR          SIDEBAR PANEL
    ⚡  ← Click this      ┌──────────────────────────┐
                          │ ⚡ PowerPlay             │
                          │ ═════════════════════════│
                          │                          │
                          │ 🔍 Search prompts...     │
                          │ ═════════════════════════│
                          │                          │
                          │ 📂 Code Review (5)       │
                          │   ├─ 📄 /review         │
                          │   ├─ 📄 /inline-review  │
                          │   ├─ 📄 /audit-all      │
                          │   ├─ 📄 /validate-reqs  │
                          │   └─ 📄 /code-audit     │
                          │ 📂 Inline Review (3)    │
                          │   ├─ 📄 /inline-fix     │
                          │   └─ ...                │
                          │ 📂 Quality Assurance(6) │
                          │ 📂 Angular (8)          │
                          │ 📂 Design (12)          │
                          │ 📂 Database (15)        │
                          │ 📂 Security (8)         │
                          │ ...                     │
                          │ ═════════════════════════│
                          │ [↺ Reload Config]       │
                          └──────────────────────────┘
```

**Features:**
- Click category → Expands/collapses prompts
- Type in search → Live filters all 134 prompts
- Click any prompt → Inserts `/command` into editor

---

## 3️⃣ Status Bar Item (Bottom-Right)

**What appears in the status bar (bottom-right corner):**

```
VS Code Status Bar (bottom)
┌─────────────────────────────────────────────────────────────┐
│  ⚙ Ln 5, Col 10   ⚡ PowerPlay v3.9.0 ← Shows here (amber) │
│  UTF-8  LF        Click for status message                 │
└─────────────────────────────────────────────────────────────┘
```

**Amber/yellow color indicates:**
- ✅ Config loaded successfully
- ✅ 134 prompts available

**Click it → Shows notification:**
```
"PowerPlay v3.9.0 — Active and ready"
```

---

## 4️⃣ Command Palette (Ctrl+Shift+P)

**When you press Ctrl+Shift+P and search "PowerPlay":**

```
Command Palette
┌────────────────────────────────────────────┐
│ > PowerPlay                                │
├────────────────────────────────────────────┤
│ PowerPlay: Show Monitoring Status          │
│ PowerPlay: Quick Pick Command      ← Try!  │
│ PowerPlay: Open Settings           ← Try!  │
│ PowerPlay: Reload Config                   │
│ PowerPlay: Open Dashboard                  │
│ PowerPlay: Copy Command                    │
└────────────────────────────────────────────┘
```

**Key commands to try:**
- `PowerPlay: Open Settings` — Opens the settings panel
- `PowerPlay: Quick Pick Command` — Shows QuickPick with all prompts

---

## 5️⃣ Quick Pick (Alt+P)

**When you press Alt+P:**

```
QuickPick: PowerPlay Prompts
┌──────────────────────────────────────────┐
│ > (search box - type to filter)          │
├──────────────────────────────────────────┤
│ $(folder) Code Review                    │
│  /review          Full code review...    │
│  /inline-review   Quick inline review    │
│  /audit-all       Audit entire codebase  │
│  /validate-reqs   Validate requirements  │
│  /code-audit      Security audit         │
│ $(folder) Database                       │
│  /optimize-schema Schema optimization    │
│  /query-review    SQL query review       │
│  /normalize-data  Data normalization     │
│ ...                                      │
└──────────────────────────────────────────┘
```

**How to use:**
1. Type "review" → Filters to `/review` commands
2. Type "helm" → Shows `/generate-helm-charts`
3. Press ↑↓ arrows to navigate
4. Press Enter to select → Inserts command into editor

---

## 6️⃣ Settings Panel (Ctrl+Shift+P → "Open Settings")

**What the settings panel looks like:**

```
PowerPlay Settings Panel
┌────────────────────────────────────────────────────┐
│ ⚙️ PowerPlay Configuration                        │
├────────────────────────────────────────────────────┤
│                                                    │
│ 🤖 Default Models                                 │
│ Reasoning Model:   [Opus ✓] [Sonnet] [Haiku]     │
│ Fast Model:        [Opus] [Sonnet ✓] [Haiku]     │
│                                                    │
│ 🔑 API Configuration                              │
│ API Provider:      [Anthropic ▼]                 │
│ API Key:           [sk-ant-••••••••••••] 🔗 Test │
│ Base URL:          [Default]                     │
│                                                    │
│ 📋 PowerPlay Configuration                        │
│ Config File Path:  s:/Code101/PowerPlay/config... │
│ Status:            🟢 Connected (134 prompts)    │
│ Buttons: [📂 Open File] [🔄 Reload]             │
│                                                    │
│ 🎯 Agent Configuration                            │
│ Max Iterations:    [━━━●━━━] 5 (min: 1, max: 20)│
│ Timeout (sec):     [━━━●━━━] 300 (30-3600)      │
│ Parallel Execution: [☑ Enabled]                   │
│ Caching:           [☑ Enabled]                    │
│                                                    │
│ ⚙️ Advanced Settings                              │
│ Temperature:       [━━●━━━━] 0.7 (0-2)          │
│ Max Tokens:        [━━━━●━━] 4096 (256-8192)    │
│ Debug Mode:        [☐ Disabled]                   │
│                                                    │
├────────────────────────────────────────────────────┤
│ [💾 Save All Settings]  [↺ Reset to Defaults]    │
└────────────────────────────────────────────────────┘
```

**What each section does:**

| Section | Purpose |
|---------|---------|
| 🤖 Default Models | Choose which Claude model to use for complex tasks vs. quick decisions |
| 🔑 API Configuration | Set your Anthropic API key and test the connection |
| 📋 PowerPlay Config | Verify config.yaml location and reload prompts |
| 🎯 Agent Config | Tune orchestrator behavior (iterations, timeout) |
| ⚙️ Advanced | Fine-tune response quality (temperature, length) |

---

## 7️⃣ Text Editor After Inserting Command

**After clicking `/review` in sidebar or quick pick:**

```
Your File (editor.ts)
┌──────────────────────────────────────────┐
│ 1   import * as vscode from 'vscode';    │
│ 2                                        │
│ 3   // Your code here                    │
│ 4   /review ← Inserted here!             │
│                                          │
│ [5 lines, 0 B] UTF-8 LF                  │
└──────────────────────────────────────────┘
```

Or copied to clipboard (toast notification):
```
✓ Copied /review to clipboard
```

---

## 8️⃣ Search & Filter in Sidebar

**When you type "angular" in the search box:**

```
PowerPlay Sidebar
┌──────────────────────────┐
│ ⚡ PowerPlay             │
│ ═════════════════════════│
│ 🔍 angular               │
│ ═════════════════════════│
│                          │
│ 📂 Angular (8)    ← Only this appears!
│   ├─ /ng-component      │
│   ├─ /ng-service        │
│   ├─ /ng-module         │
│   ├─ /ng-route          │
│   └─ ...                │
│                          │
│ (Other 13 categories hidden until you clear search)
│ ═════════════════════════│
│ [↺ Reload Config]        │
└──────────────────────────┘
```

---

## 9️⃣ Sidebar When Searching All Keywords

**When you type "test" (matches multiple categories):**

```
PowerPlay Sidebar
┌──────────────────────────────────┐
│ ⚡ PowerPlay                      │
│ ════════════════════════════════  │
│ 🔍 test                           │
│ ════════════════════════════════  │
│                                   │
│ 📂 Testing & Validation (5)       │
│   ├─ /unit-test                   │
│   ├─ /integration-test            │
│   └─ /e2e-test                    │
│ 📂 API & Integration (3)          │
│   ├─ /test-api-contract           │
│   └─ ...                           │
│ 📂 Quality Assurance (2)          │
│   ├─ /test-coverage               │
│   └─ ...                           │
│                                   │
│ ════════════════════════════════  │
│ [↺ Reload Config]                 │
└──────────────────────────────────┘
```

---

## 🔟 Settings After "Test Connection"

**If API key is valid:**

```
PowerPlay Settings Panel
┌────────────────────────────────────────────────────┐
│ ⚙️ PowerPlay Configuration                        │
│                                                    │
│ 🔑 API Configuration                              │
│ API Key:  [sk-ant-••••••••••••] 🔗 Test          │
│           ✅ Connected (latency: 245ms)           │
│           Supports: Claude Opus, Sonnet, Haiku   │
│                                                    │
│ [💾 Save All Settings]                            │
└────────────────────────────────────────────────────┘
```

**If API key is invalid:**

```
API Key:  [sk-ant-••••••••••••] 🔗 Test
          ❌ Connection failed
          Invalid API key. Check your sk-ant- token
```

---

## 1️⃣1️⃣ Continue.dev Integration

**When `/play` routes to PowerPlay in Continue.dev:**

```
Continue.dev Chat (Ctrl+L)
┌──────────────────────────────────────────┐
│ /play                                    │
│                                          │
│ I need to review this authentication code
│ for security issues                      │
│                                          │
│ [Send] →                                 │
│                                          │
│ Continue routes to:                      │
│ ▶ /security-scan (via /play orchestrator)│
│                                          │
│ Analyzing code for:                      │
│ • SQL injection risks                    │
│ • XSS vulnerabilities                    │
│ • Authentication bypass                  │
│ • Token handling issues                  │
│ • CORS misconfigurations                 │
│                                          │
│ [Analysis results appear below...]       │
└──────────────────────────────────────────┘
```

---

## ✅ Verification Checklist

Use this to verify the extension is fully loaded:

```
Appearance Checklist:

□ ⚡ icon visible in Activity Bar (left side)
□ "⚡ PowerPlay v3.9.0" showing in status bar (bottom-right, amber color)
□ Ctrl+Shift+P shows "PowerPlay: Open Settings" command
□ Alt+P opens a QuickPick menu with prompts
□ Click ⚡ icon → Sidebar panel opens with 134 prompts
□ Settings panel has colored input fields and buttons (not blank)
□ Status bar shows "🟢 Connected (134 prompts)" in settings
□ Search works in sidebar (type "review" filters results)
```

If ALL checkboxes are true, **your extension is working perfectly!** ✅

---

## 🎨 Visual Theme

The extension uses VS Code's built-in theme colors:

**Dark Theme (default):**
- Background: Dark gray (`--vscode-sideBar-background`)
- Text: White (`--vscode-foreground`)
- Accents: Cyan/blue for selected items
- Hover: Slightly lighter background

**Light Theme (when selected in VS Code):**
- Background: Light gray
- Text: Dark gray
- Accents: Blue for selected items
- Hover: Slightly darker background

**High Contrast Theme:**
- Borders: More prominent
- Text: Maximum contrast
- Colors: Simplified palette

The extension **automatically** adapts to your VS Code theme — no configuration needed!

---

**⚡ If you see all of these elements, your PowerPlay extension is fully functional!**
