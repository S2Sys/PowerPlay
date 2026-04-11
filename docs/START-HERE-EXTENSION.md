# 🚀 START HERE: PowerPlay Extension v2.0.0

**Your PowerPlay VS Code extension is installed and ready!**

---

## ⚡ In 60 Seconds

### 1️⃣ Restart VS Code (10 seconds)
```
• File → Exit (close all windows)
• Wait 3 seconds
• Reopen VS Code
• Wait 10 seconds
```

### 2️⃣ Check It's Working (10 seconds)
Look at your VS Code window:
- Do you see **⚡ lightning icon** in the left sidebar (Activity Bar)?
- Do you see **⚡ PowerPlay v3.9.0** in the bottom-right corner (status bar)?

**If YES:** Continue to Step 3  
**If NO:** Go to [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md)

### 3️⃣ Configure Settings (30 seconds)
```
• Press Ctrl+Shift+P
• Type: PowerPlay: Open Settings
• Enter your API key (starts with sk-ant-)
• Click "🔗 Test Connection"
• Click "💾 Save All Settings"
```

### 4️⃣ Start Using (10 seconds)
Choose your method:

**Method A: Sidebar Panel**
- Click ⚡ icon in Activity Bar
- See 134 PowerPlay commands
- Click any command to insert

**Method B: Quick Pick (Alt+P)**
- Press Alt+P
- Type "review" (or any keyword)
- Press Enter to insert

**Method C: Continue.dev Integration**
- Open Continue.dev (Ctrl+L)
- Type: `/play I need to review this code`
- Continue routes to PowerPlay

---

## 📚 Full Documentation

Start with the guide most relevant to you:

### **Just Want to Get Started?**
→ [README-EXTENSION-v2.0.0.md](README-EXTENSION-v2.0.0.md) ⭐ **START HERE**

### **Want Step-by-Step Setup?**
→ [QUICK-START-SETTINGS.md](QUICK-START-SETTINGS.md) (30 seconds)

### **Want Full Reference Guide?**
→ [SETTINGS-PANEL-GUIDE.md](SETTINGS-PANEL-GUIDE.md) (complete documentation)

### **Something Not Working?**
→ [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md) (diagnostic guide)

### **Want to See What It Looks Like?**
→ [EXTENSION-VISUAL-GUIDE.md](EXTENSION-VISUAL-GUIDE.md) (UI screenshots)

### **Need Copy-Paste Commands?**
→ [EXTENSION-QUICK-COMMANDS.md](EXTENSION-QUICK-COMMANDS.md) (command reference)

### **Want Detailed Installation Info?**
→ [EXTENSION-STATUS-REPORT.md](EXTENSION-STATUS-REPORT.md) (technical details)

---

## ✅ Verification Checklist

Use this to confirm the extension is working:

- [ ] VS Code restarted completely (not just reloaded)
- [ ] **⚡ icon** visible in Activity Bar (left side)
- [ ] **⚡ PowerPlay v3.9.0** showing in status bar (bottom-right)
- [ ] Ctrl+Shift+P shows PowerPlay commands
- [ ] Alt+P opens quick pick with 134 prompts
- [ ] Settings panel opens and shows form fields
- [ ] Can search/filter prompts in sidebar
- [ ] Can click a prompt and insert command

**All checked?** ✅ Your extension is working! Skip to "Using the Extension" below.

**Some unchecked?** See [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md)

---

## 🎯 Using the Extension

### **Browse Prompts (Sidebar)**
```
1. Click ⚡ icon in Activity Bar (left side)
2. Sidebar shows "⚡ PowerPlay / Prompts"
3. See 134 commands in 18 categories:
   • Code Review
   • Angular
   • Database
   • Security
   • ... and 14 more
4. Search by typing in search box
5. Click any command → Inserts `/command` into editor
```

### **Quick Access (Alt+P)**
```
1. Press Alt+P anywhere
2. QuickPick menu appears
3. Type to search (e.g., "review")
4. Results filter in real-time
5. Press ↑↓ to navigate
6. Press Enter to insert
```

### **Configure Settings**
```
1. Ctrl+Shift+P → "PowerPlay: Open Settings"
2. Configure:
   • Default Model: Opus/Sonnet/Haiku
   • API Key: Your sk-ant- token
   • Config Path: s:/Code101/PowerPlay/config.yaml
   • Agent Behavior: iterations, timeout
   • Advanced: temperature, tokens
3. Click "🔗 Test Connection" to verify
4. Click "💾 Save All Settings" to save
```

### **In Continue.dev**
```
1. Open Continue.dev (Ctrl+L)
2. Type: /play [your request]
3. Examples:
   • /play review this code
   • /play optimize this database query
   • /play write tests for this function
4. Continue routes to PowerPlay orchestrator
5. PowerPlay selects best command
6. Prompt executes with your settings
```

---

## 🔧 What You Can Configure

| Setting | What It Does | Default |
|---------|--------------|---------|
| **Default Model** | Main Claude version (analysis) | Sonnet |
| **Fast Model** | Quick decisions | Sonnet |
| **API Key** | Your Anthropic authentication | — |
| **Config Path** | Where to find 134 prompts | Auto-detected |
| **Max Iterations** | Steps before agent stops | 5 |
| **Timeout** | Max execution time (sec) | 300 |
| **Parallel Execution** | Run tasks concurrently | ON |
| **Caching** | Reuse previous results | ON |
| **Temperature** | Creativity level (0-2) | 0.7 |
| **Max Tokens** | Max response length | 4096 |
| **Debug Mode** | Show detailed logs | OFF |

---

## 🚨 Common Issues & Quick Fixes

### Issue: No ⚡ icon in Activity Bar
**Fix:** Restart VS Code completely (File → Exit, then reopen)
**Details:** See [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md) Fix 3

### Issue: "No results found" when searching for PowerPlay
**Fix:** Wait 10 seconds after opening VS Code
**Details:** Extension uses onStartupFinished event (needs full start)

### Issue: Alt+P doesn't work
**Fix:** Check keybinding: Ctrl+Shift+P → "Preferences: Open Keyboard Shortcuts"
**Details:** See [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md) Fix 4

### Issue: Settings panel is blank
**Fix:** Toggle Developer Tools: Help → Toggle Developer Tools
**Details:** Check Console for errors (see [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md) Fix 5)

### Issue: "Cannot find config.yaml"
**Fix:** Open Settings, verify Config Path is: `s:/Code101/PowerPlay/config.yaml`
**Details:** Click "📂 Open File" to verify file exists

**Still stuck?** → [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md) has comprehensive fixes

---

## 📋 What Happened Behind the Scenes

The extension was:
1. ✅ **Built** — 10 TypeScript modules compiled to JavaScript
2. ✅ **Packaged** — VSIX archive created (46 KB)
3. ✅ **Installed** — Copied to `~/.vscode/extensions/`
4. ✅ **Registered** — Added to VS Code's extension list

**Includes:**
- ⚡ Sidebar panel (browse 134 prompts)
- ⚙️ Settings panel (configure models, API key, agent behavior)
- 🔍 Quick pick (Alt+P command palette)
- 💬 Config parser (detects 134 invokable prompts)
- 📊 Status bar (shows PowerPlay version)

**All features work offline** — no cloud calls needed for UI

---

## 🎓 Learning Path

**Start Here:**
1. Restart VS Code + verify extension loads
2. Open Settings panel (Ctrl+Shift+P → "Open Settings")
3. Configure your API key
4. Browse prompts via sidebar

**Next:**
1. Try Alt+P quick pick
2. Search for a prompt (e.g., "review")
3. Click to insert command

**Advanced:**
1. Open Continue.dev (Ctrl+L)
2. Type: `/play [your request]`
3. PowerPlay routes to best command

**Explore:**
1. Read [SETTINGS-PANEL-GUIDE.md](SETTINGS-PANEL-GUIDE.md) for full reference
2. Check [EXTENSION-VISUAL-GUIDE.md](EXTENSION-VISUAL-GUIDE.md) for UI tour
3. Use [EXTENSION-QUICK-COMMANDS.md](EXTENSION-QUICK-COMMANDS.md) for CLI tricks

---

## 💡 Pro Tips

**Tip 1: Search is powerful**
- Type partial words: "ang" finds Angular commands
- Type keywords: "test" finds testing commands
- Searches name, description, and category

**Tip 2: Alt+P is fastest**
- Faster than clicking sidebar
- Works from any editor
- Search filters real-time

**Tip 3: Use /play for smart routing**
- `/play write a unit test` → `/test-generation`
- `/play optimize this query` → `/optimize-schema`
- Let PowerPlay choose the best command

**Tip 4: Test your API key early**
- In Settings panel: click "🔗 Test Connection"
- Shows latency and supported models
- Catches key issues before trying to use

**Tip 5: Reload config when needed**
- If config.yaml changes: Click "🔄 Reload"
- Or: Ctrl+Shift+P → "PowerPlay: Reload Config"
- Detects new prompts without restart

---

## 🆘 Emergency Troubleshooting

**If absolutely nothing works:**

```bash
# 1. Uninstall extension
code --uninstall-extension smartworkz.powerplay-ai

# 2. Remove extension directory
rm -rf ~/.vscode/extensions/smartworkz.powerplay-ai-*

# 3. Close VS Code completely
pkill -9 code
sleep 5

# 4. Rebuild extension (in PowerPlay directory)
cd s:/Code101/PowerPlay/vscode-extension
npm install && npm run compile && npm run package

# 5. Install fresh
code --install-extension powerplay-ai-2.0.0.vsix

# 6. Wait 15 seconds, check Extensions panel
```

More details: [EXTENSION-QUICK-COMMANDS.md](EXTENSION-QUICK-COMMANDS.md)

---

## 📞 Getting Help

| Problem | Document |
|---------|----------|
| Setup issues | [QUICK-START-SETTINGS.md](QUICK-START-SETTINGS.md) |
| General questions | [README-EXTENSION-v2.0.0.md](README-EXTENSION-v2.0.0.md) |
| How to use | [SETTINGS-PANEL-GUIDE.md](SETTINGS-PANEL-GUIDE.md) |
| Something broken | [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md) |
| Visual tour | [EXTENSION-VISUAL-GUIDE.md](EXTENSION-VISUAL-GUIDE.md) |
| Copy-paste commands | [EXTENSION-QUICK-COMMANDS.md](EXTENSION-QUICK-COMMANDS.md) |
| Technical details | [EXTENSION-STATUS-REPORT.md](EXTENSION-STATUS-REPORT.md) |

---

## ✨ You're Ready!

Your PowerPlay extension is installed, compiled, and ready to use.

**Next action:**
1. ✅ Restart VS Code
2. ✅ Verify ⚡ icon appears
3. ✅ Configure API key in Settings
4. ✅ Start using `/play` commands

**Questions?** Check the [README-EXTENSION-v2.0.0.md](README-EXTENSION-v2.0.0.md) or any guide above.

---

**⚡ Happy prompting! Build awesome things with PowerPlay.**
