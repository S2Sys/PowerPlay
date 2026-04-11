# PowerPlay Extension v2.0.0 — Troubleshooting Guide

## ✅ Extension Status Check

Your PowerPlay extension is **installed and registered** in VS Code. Here's how to verify it's working:

---

## Step 1: Complete VS Code Restart (CRITICAL)

The extension uses `onStartupFinished` activation, which only fires when VS Code starts. If you haven't fully restarted VS Code since installation, the commands won't be available.

### **DO THIS FIRST:**

1. **Close ALL VS Code windows completely**
   - File → Close All Folders
   - File → Exit (or Ctrl+Q)
   - Wait 3 seconds
   
2. **Reopen VS Code**
   - Click the VS Code icon or run `code`
   - Wait 5 seconds for startup to complete
   - You should see the PowerPlay splash or startup message in the console

---

## Step 2: Check Extension is Loaded

### **Method A: Extensions Panel**

1. Open Extensions panel (Ctrl+Shift+X)
2. Search for "PowerPlay"
3. You should see:
   ```
   PowerPlay AI for Continue.dev
   Status: Installed
   Publisher: SmartWorkz
   ```

### **Method B: Command Palette**

1. Open Command Palette (Ctrl+Shift+P)
2. Type: `PowerPlay`
3. You should see these commands:
   - PowerPlay: Show Monitoring Status
   - PowerPlay: Open Settings
   - PowerPlay: Quick Pick Command
   - PowerPlay: Open Dashboard
   - PowerPlay: Reload Config
   - PowerPlay: Copy Command

If you don't see these commands, **skip to "Fix: Extension Not Loading"** below.

---

## Step 3: Test Each Feature

### **Feature 1: Status Bar**

- Look at the bottom-right corner of VS Code (status bar)
- You should see: **⚡ PowerPlay v3.9.0** (yellow/amber color)
- Click it → Should show "PowerPlay v3.9.0 — Active and ready"

**If missing:** Extension didn't activate. See "Fix" section below.

### **Feature 2: Sidebar Panel**

- Look at the **Activity Bar** (left sidebar, vertical icons)
- You should see a **lightning bolt ⚡** icon
- Click it → A "PowerPlay / Prompts" sidebar should appear on the left
- The sidebar should show:
  - Search box at top
  - List of prompt categories (Code Review, Angular, Database, etc.)
  - Reload Config button at bottom

**If sidebar doesn't appear:** The WebviewViewProvider didn't register. See "Fix" section.

### **Feature 3: Quick Pick Command Palette**

- Press **Alt+P** (Windows/Linux) or **Cmd+Shift+P** (Mac)
- A QuickPick menu should appear with all 134 PowerPlay commands
- Try searching: type "review" → Should filter to `/review` commands
- Click any command → Should insert `/command` into your editor or copy to clipboard

**If QuickPick doesn't appear:** Command registration failed. See "Fix" section.

### **Feature 4: Settings Panel**

- Press **Ctrl+Shift+P** (Command Palette)
- Type: `PowerPlay: Open Settings`
- A settings panel should open with:
  - Model selection (Opus/Sonnet/Haiku options)
  - API key input
  - Agent configuration sliders
  - Advanced settings (temperature, tokens, etc.)
  - Test Connection button

**If panel doesn't open:** Settings panel initialization failed. See "Fix" section.

---

## 🔧 Fixes

### **Fix 1: Extension Not Showing in Extensions List**

1. Close VS Code completely
2. Run:
   ```bash
   code --uninstall-extension smartworkz.powerplay-ai
   ```
3. Wait 5 seconds
4. Manually reinstall:
   ```bash
   # Navigate to the PowerPlay repo
   cd s:\Code101\PowerPlay\vscode-extension
   
   # Compile (if needed)
   npm install
   npm run compile
   npm run package
   
   # Install the VSIX
   code --install-extension powerplay-ai-2.0.0.vsix
   ```
5. Close ALL VS Code windows and reopen
6. Wait 10 seconds for activation
7. Check Extensions panel

### **Fix 2: Status Bar Not Showing**

1. **Check if disabled:**
   - Open Settings (Ctrl+,)
   - Search: `powerplay.statusBarEnabled`
   - Make sure it's checked (true)

2. **Check if config.yaml is found:**
   - Run command: `PowerPlay: Reload Config`
   - Status bar should update

3. **Manually verify config path:**
   - Open PowerPlay: Open Settings
   - Check "Config File Path" field
   - Should be: `s:/Code101/PowerPlay/config.yaml`
   - Click "📂 Open File" to verify file exists

### **Fix 3: Sidebar Not Appearing**

The sidebar panel requires the extension to be fully activated first.

1. Verify Status Bar shows (see Fix 2)
2. Check Activity Bar icons:
   - Should see ⚡ lightning bolt icon on the left
   - If not visible, extension didn't activate

3. **Restart VS Code again:**
   - File → Exit
   - Wait 5 seconds
   - Reopen VS Code
   - Wait 10 seconds

### **Fix 4: Quick Pick Not Working (Alt+P doesn't do anything)**

1. Check if keyboard shortcut is registered:
   - Open Command Palette (Ctrl+Shift+P)
   - Type: `Preferences: Open Keyboard Shortcuts`
   - Search: `alt+p`
   - You should see: `powerplay.pickCommand`

2. If missing, the extension didn't fully load:
   - Check Dev Tools console for errors:
     - Help → Toggle Developer Tools
     - Click "Console" tab
     - Look for red error messages
     - Copy any errors to troubleshoot

3. **Clear VS Code cache and reinstall:**
   ```bash
   # Windows
   rmdir /s %APPDATA%\Code\Cache
   
   # Then reinstall extension as in Fix 1
   ```

### **Fix 5: Settings Panel Opens but Is Blank**

1. Check browser console in Developer Tools:
   - Help → Toggle Developer Tools
   - Click "Console" tab
   - Look for red error messages

2. Common causes:
   - API Key input field not rendering → Check settingsPanel.js was compiled
   - Model buttons missing → CSS didn't load → Check media/sidebar.css exists

3. **Force recompile:**
   ```bash
   cd s:\Code101\PowerPlay\vscode-extension
   rm -rf out/
   npm run compile
   npm run package
   code --install-extension powerplay-ai-2.0.0.vsix
   ```

---

## 📋 Diagnostic Checklist

Print this and check each item:

- [ ] VS Code restarted completely (not just reloaded)
- [ ] ⚡ icon visible in Activity Bar (left side)
- [ ] Status bar shows "⚡ PowerPlay v3.9.0" (bottom-right)
- [ ] Extensions panel shows PowerPlay as "Installed"
- [ ] Ctrl+Shift+P shows PowerPlay commands in autocomplete
- [ ] Alt+P opens QuickPick with prompts
- [ ] Sidebar panel opens when clicking ⚡ icon
- [ ] Settings panel opens via "PowerPlay: Open Settings" command
- [ ] config.yaml path shows in settings as `s:/Code101/PowerPlay/config.yaml`
- [ ] "Test Connection" button works in settings

---

## 🐛 Debugging: Check Extension Logs

If nothing works, check the VS Code debug logs:

1. **Open Developer Tools:**
   - Help → Toggle Developer Tools
   - Go to "Console" tab

2. **Look for activation messages:**
   - Should see: `PowerPlay extension activated`
   - Should see config path being loaded
   - Should see prompt count

3. **Capture errors:**
   - Take a screenshot of any red error messages
   - Note exact error text
   - This helps diagnose the issue

4. **Check output channel:**
   - View → Output
   - Select "PowerPlay" from dropdown
   - Should show initialization logs

---

## 🚀 If Everything Works!

Once verified, you can now:

1. **Use `/play` command in Continue.dev:**
   - Open Continue.dev sidebar (Ctrl+L)
   - Type: `/play I need to review this code`
   - Continue will route to PowerPlay orchestrator

2. **Use Quick Command:**
   - Press Alt+P
   - Type: "review"
   - Click `/review` command
   - It inserts into your editor or copies to clipboard

3. **Configure Settings:**
   - Ctrl+Shift+P → "PowerPlay: Open Settings"
   - Set default models, API key, agent behavior
   - Click "💾 Save All Settings"

4. **View All Prompts:**
   - Click ⚡ icon in Activity Bar
   - Browse 134 PowerPlay prompts
   - Search by category or keyword
   - Click to insert/copy command

---

## ❓ Still Stuck?

If you've tried all fixes and nothing works:

1. **Uninstall completely:**
   ```bash
   code --uninstall-extension smartworkz.powerplay-ai
   ```

2. **Remove the directory:**
   ```bash
   rm -rf ~/.vscode/extensions/smartworkz.powerplay-ai-*
   ```

3. **Verify no conflicting extensions:**
   - Open Extensions panel
   - Disable any other "Continue" or "AI" extensions
   - Restart VS Code

4. **Rebuild from scratch:**
   ```bash
   cd s:\Code101\PowerPlay\vscode-extension
   rm -rf node_modules/ out/ *.vsix
   npm install
   npm run compile
   npm run package
   code --install-extension powerplay-ai-2.0.0.vsix
   ```

5. **Capture logs for debugging:**
   - Run: Help → Toggle Developer Tools
   - Go to Console tab
   - Right-click → "Save as..." → Save all console messages to file
   - Share this with troubleshooting

---

**⚡ If you've completed the checklist above and all items are checked, your PowerPlay extension is ready to use!**
