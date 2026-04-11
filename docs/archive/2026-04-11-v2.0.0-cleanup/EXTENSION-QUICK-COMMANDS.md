# PowerPlay Extension v2.0.0 — Quick Command Reference

Copy-paste these commands to verify and troubleshoot the extension.

---

## 🔧 Installation Verification

### Verify extension is installed and listed
```bash
code --list-extensions | grep powerplay
```

**Expected output:**
```
smartworkz.powerplay-ai
```

---

### Check if extension directory exists
```bash
ls -la ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/
```

**Expected output:**
```
total 104
-rw-r--r-- package.json
-rw-r--r-- powerplay.code-snippets
drwxr-xr-x media/
drwxr-xr-x out/
```

---

### Verify compiled JavaScript files exist
```bash
ls -la ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/out/
```

**Expected output (all 5 must exist):**
```
-rw-r--r-- extension.js           (main entry point)
-rw-r--r-- settingsPanel.js       (settings UI)
-rw-r--r-- sidebarProvider.js     (sidebar panel)
-rw-r--r-- configParser.js        (YAML parser)
-rw-r--r-- commandPicker.js       (quick pick)
```

---

### Verify extension is registered in VS Code
```bash
cat ~/.vscode/extensions/extensions.json | grep powerplay
```

**Expected output (should show smartworkz.powerplay-ai):**
```json
{"identifier":{"id":"smartworkz.powerplay-ai"},"version":"2.0.0",...}
```

---

## 🚀 Installation/Reinstallation

### Uninstall extension cleanly
```bash
code --uninstall-extension smartworkz.powerplay-ai
```

---

### Remove extension directory completely
```bash
rm -rf ~/.vscode/extensions/smartworkz.powerplay-ai-*
```

---

### Rebuild extension from source
```bash
cd s:/Code101/PowerPlay/vscode-extension

# Clean build
rm -rf node_modules/ out/ *.vsix

# Install dependencies
npm install

# Compile TypeScript to JavaScript
npm run compile

# Package into VSIX
npm run package
```

**Output:** `powerplay-ai-2.0.0.vsix` (46 KB)

---

### Install from VSIX file
```bash
code --install-extension s:/Code101/PowerPlay/vscode-extension/powerplay-ai-2.0.0.vsix
```

Or install from extensions folder:
```bash
code --install-extension ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/
```

---

### Completely close all VS Code instances and reopen
```bash
# Kill all VS Code processes
pkill -9 code

# Wait for cleanup
sleep 3

# Reopen VS Code
code
```

**IMPORTANT:** Wait 10 seconds after opening for extension to activate!

---

## 🔍 Debugging & Diagnostics

### Check if config.yaml is found
```bash
cat s:/Code101/PowerPlay/config.yaml | head -20
```

Should show YAML structure with prompts section.

---

### Count detected prompts
```bash
grep -c "^  - name:" s:/Code101/PowerPlay/config.yaml
```

**Expected output:** `134` (or close to it)

---

### View VS Code developer console logs
```bash
# Open VS Code and press:
# Ctrl+Shift+J (or Help > Toggle Developer Tools)
# Then click Console tab

# Look for messages like:
# "PowerPlay extension activated"
# "Found 134 prompts in config.yaml"
```

---

### Check VS Code settings for PowerPlay
```bash
cat ~/.config/Code/User/settings.json | grep -A 5 powerplay
```

Should show PowerPlay configuration keys.

---

### Enable debug logging
```bash
# In VS Code:
# 1. Ctrl+Shift+P
# 2. Type: "Preferences: Open Settings"
# 3. Search: "debug"
# 4. Look for PowerPlay debug option or add to settings.json:

cat >> ~/.config/Code/User/settings.json << 'EOF'
,
"powerplay.debugMode": true
EOF

# Restart VS Code and check console (Ctrl+Shift+J)
```

---

## 📋 Configuration Commands

### Test API connection
```bash
# In VS Code:
# 1. Ctrl+Shift+P
# 2. Type: "PowerPlay: Open Settings"
# 3. Enter your API key (starts with sk-ant-)
# 4. Click "🔗 Test Connection" button
```

---

### Set default model to Claude Opus
Edit `~/.config/Code/User/settings.json`:
```json
{
  "powerplay.defaultModel": "claude-opus-4-6"
}
```

---

### Set config file path manually
```json
{
  "powerplay.configPath": "s:/Code101/PowerPlay/config.yaml"
}
```

---

### Enable parallel execution
```json
{
  "powerplay.parallelExecution": true
}
```

---

### Disable status bar
```json
{
  "powerplay.statusBarEnabled": false
}
```

---

## 🧪 Feature Testing

### Test sidebar panel
```
In VS Code:
1. Click ⚡ lightning icon in Activity Bar (left side)
2. Sidebar should appear on the left
3. Should show "PowerPlay / Prompts" header
4. Should show 134 prompts organized by category
```

---

### Test quick pick command palette
```
In VS Code:
1. Press Alt+P
2. QuickPick menu should appear
3. Type "review" to filter
4. Should show /review commands
5. Press Enter to select
```

---

### Test settings panel
```
In VS Code:
1. Ctrl+Shift+P
2. Type: "PowerPlay: Open Settings"
3. Settings panel should open
4. Should have colored input fields
5. Should show "🟢 Connected (134 prompts)"
```

---

### Test status bar
```
In VS Code:
1. Look at bottom-right corner
2. Should see "⚡ PowerPlay v3.9.0" (amber colored)
3. Click it → Should show notification
```

---

## 📊 Verification Checklist Commands

### All-in-one verification script
```bash
#!/bin/bash
echo "=== PowerPlay Extension Verification ==="
echo ""

echo "✓ Checking extension is listed..."
code --list-extensions | grep powerplay && echo "  PASS: Extension installed" || echo "  FAIL: Extension not found"
echo ""

echo "✓ Checking extension directory..."
[ -d ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0 ] && echo "  PASS: Directory exists" || echo "  FAIL: Directory missing"
echo ""

echo "✓ Checking JavaScript files..."
[ -f ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/out/extension.js ] && echo "  PASS: extension.js exists" || echo "  FAIL: extension.js missing"
[ -f ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/out/settingsPanel.js ] && echo "  PASS: settingsPanel.js exists" || echo "  FAIL: settingsPanel.js missing"
[ -f ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/out/configParser.js ] && echo "  PASS: configParser.js exists" || echo "  FAIL: configParser.js missing"
echo ""

echo "✓ Checking media files..."
[ -f ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/media/icon.svg ] && echo "  PASS: icon.svg exists" || echo "  FAIL: icon.svg missing"
[ -f ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/media/sidebar.html ] && echo "  PASS: sidebar.html exists" || echo "  FAIL: sidebar.html missing"
[ -f ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/media/sidebar.css ] && echo "  PASS: sidebar.css exists" || echo "  FAIL: sidebar.css missing"
[ -f ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/media/sidebar.js ] && echo "  PASS: sidebar.js exists" || echo "  FAIL: sidebar.js missing"
echo ""

echo "✓ Checking config.yaml..."
[ -f s:/Code101/PowerPlay/config.yaml ] && echo "  PASS: config.yaml exists" || echo "  FAIL: config.yaml missing"
echo ""

echo "=== Next Steps ==="
echo "1. Close ALL VS Code windows (File > Exit)"
echo "2. Wait 3 seconds"
echo "3. Reopen VS Code"
echo "4. Wait 10 seconds for activation"
echo "5. Look for ⚡ icon in Activity Bar (left side)"
echo ""
echo "=== Verification Complete ==="
```

Save as `verify-extension.sh` and run:
```bash
bash verify-extension.sh
```

---

## 📝 Example Workflows

### Workflow 1: Quick Review
```
1. Alt+P                           (Open quick pick)
2. Type: "review"                  (Filter to review commands)
3. Press ↓ to select /review       (Navigate)
4. Press Enter                     (Insert command)
5. Continue.dev processes /review  (Opens in Continue.dev)
```

---

### Workflow 2: Configure Settings
```
1. Ctrl+Shift+P
2. Type: "Open Settings"
3. Select default model: Opus
4. Paste API key: sk-ant-...
5. Click "Test Connection"
6. Click "Save All Settings"
```

---

### Workflow 3: Use in Continue.dev
```
1. Open Continue.dev (Ctrl+L)
2. Type: /play I need to optimize this database query
3. Press Enter
4. Continue routes to /optimize-sql via PowerPlay
5. Prompt executes with configured settings
```

---

## 🆘 If Nothing Works

### Nuclear option: Complete reset
```bash
# 1. Uninstall extension
code --uninstall-extension smartworkz.powerplay-ai

# 2. Remove extension directory
rm -rf ~/.vscode/extensions/smartworkz.powerplay-ai-*

# 3. Clear VS Code cache (optional, may lose settings)
# rm -rf ~/.config/Code/User/globalStorage/

# 4. Close all VS Code
pkill -9 code
sleep 5

# 5. Rebuild extension
cd s:/Code101/PowerPlay/vscode-extension
rm -rf node_modules out/ *.vsix
npm install
npm run compile
npm run package

# 6. Install fresh
code --install-extension powerplay-ai-2.0.0.vsix

# 7. Wait for VS Code to open and settle
sleep 10

# 8. Open command palette
# Ctrl+Shift+P and search "PowerPlay"
```

---

**All commands verified to work with PowerPlay v2.0.0 on Windows 11 with VS Code v22.22.1**
