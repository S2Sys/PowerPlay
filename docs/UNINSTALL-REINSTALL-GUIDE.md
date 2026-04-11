# PowerPlay v2.0.0 — Uninstall Old & Install New

## Quick Summary

**Old Version:** v1.0.0 (status bar + 8 snippets)  
**New Version:** v2.0.0 (chat panel + sidebar + settings + quick pick)  
**Time:** 5 minutes

---

## Step 1: Uninstall Old Version

### Option A: Via VS Code UI (Recommended)

1. **Open Extensions Panel**
   - Click Extensions icon in left sidebar
   - OR press: `Ctrl+Shift+X`

2. **Find PowerPlay**
   - Search: "PowerPlay"
   - Look for: "PowerPlay AI for Continue.dev"
   - Click the extension

3. **Uninstall**
   - Click: **Uninstall** button
   - Confirm uninstall

4. **Close VS Code**
   - File → Exit
   - Wait 3 seconds

---

### Option B: Via Command Line

```bash
# Method 1: Using code CLI
code --uninstall-extension smartworkz.powerplay-ai

# Method 2: Manual directory removal
rm -rf ~/.vscode/extensions/smartworkz.powerplay-ai-*

# Method 3: On Windows
rmdir /s "%USERPROFILE%\.vscode\extensions\smartworkz.powerplay-ai-*"
```

---

## Step 2: Clean Up (Optional but Recommended)

### Remove Extension Cache

```bash
# Linux/macOS
rm -rf ~/.config/Code/User/globalStorage/smartworkz*

# Windows (replace %USERPROFILE% with C:\Users\YourName)
rmdir /s "%USERPROFILE%\AppData\Roaming\Code\User\globalStorage\smartworkz*"
```

### Verify Uninstall

```bash
# Check if extension directory is gone
ls ~/.vscode/extensions/ | grep powerplay
# Should return nothing

# Or on Windows
dir %USERPROFILE%\.vscode\extensions\ | find "powerplay"
# Should return nothing
```

---

## Step 3: Install New Version v2.0.0

### Option A: From GitHub Release (Fastest)

1. **Download Latest Release**
   - Go to: https://github.com/S2Sys/PowerPlay/releases
   - Find: Latest release (v2.0.0)
   - Download: `powerplay-ai-2.0.0.vsix`

2. **Install in VS Code**
   - Open VS Code
   - Extensions → `...` (three dots) → Install from VSIX
   - Select the downloaded `powerplay-ai-2.0.0.vsix`
   - Wait for installation

3. **Verify**
   - You should see: "Extension installed successfully"
   - Extension appears in Extensions panel

---

### Option B: Build from Source

1. **Clone Repository**
   ```bash
   cd ~
   git clone https://github.com/S2Sys/PowerPlay.git
   cd PowerPlay
   ```

2. **Build Extension**
   ```bash
   cd vscode-extension
   npm install
   npm run compile
   npm run package
   # Creates: powerplay-ai-2.0.0.vsix
   ```

3. **Install**
   ```bash
   code --install-extension powerplay-ai-2.0.0.vsix
   ```

---

### Option C: Direct Installation (Manual)

1. **Create Extension Directory**
   ```bash
   mkdir -p ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/{out,media}
   ```

2. **Download or Copy Files**
   ```bash
   # Copy from your local build
   cp -r s:/Code101/PowerPlay/vscode-extension/out/* \
     ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/out/
   cp -r s:/Code101/PowerPlay/vscode-extension/media/* \
     ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/media/
   cp s:/Code101/PowerPlay/vscode-extension/package.json \
     ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/
   cp s:/Code101/PowerPlay/vscode-extension/powerplay.code-snippets \
     ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/
   ```

3. **Verify Installation**
   ```bash
   ls ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/
   # Should show: out/, media/, package.json, powerplay.code-snippets
   ```

---

## Step 4: Activate New Extension

1. **Close VS Code Completely**
   - File → Exit (close all windows)
   - Wait 3 seconds

2. **Reopen VS Code**
   - Run: `code .`
   - Wait 15 seconds (full activation)

3. **Verify Installation**
   - Check for **⚡ icon** in left sidebar (Activity Bar)
   - Check for **⚡ PowerPlay v3.9.0** in status bar (bottom-right)
   - Both should appear with colored styling (not gray)

---

## Step 5: Configure Settings

1. **Open Settings**
   - Press: `Ctrl+Shift+P`
   - Type: `PowerPlay: Open Settings`
   - Press: Enter

2. **Configure (Option A: Settings Panel)**
   - **Config Path:** `s:/Code101/PowerPlay/config.yaml`
   - **Default Model:** Claude Sonnet 4.6
   - **API Key:** `sk-ant-...` (your Anthropic key)
   - Click: **🔗 Test Connection**
   - Click: **💾 Save All Settings**

3. **Configure (Option B: Chat Panel Settings)**
   - Press: `Ctrl+Shift+Space` → Chat panel opens
   - Click: **⚙** (settings icon in header)
   - Fill in same settings as above
   - Click: **💾 Save Settings**

---

## What's New in v2.0.0

### ✨ Chat Panel (Cursor AI-style)
- **Open:** `Ctrl+Shift+Space`
- **Features:**
  - Glassmorphism dark void aesthetic
  - Slash command autocomplete (`/rev` → matches)
  - Message history with conversation bubbles
  - Built-in settings (⚙ button in header)

### ✨ Sidebar
- **Open:** Click **⚡** in Activity Bar
- **Shows:** All 134 PowerPlay prompts
- **Organized by:** 18 categories
- **Search:** Live filter

### ✨ Settings (NEW: Inside Chat Panel)
- **Access:** ⚙ button in chat header
- **Configure:**
  - Config path
  - Default model
  - API key
  - Temperature
  - Test connection
  - Save settings

### ✨ Quick Pick
- **Open:** `Alt+P`
- **Features:** Fuzzy search, arrow navigation

---

## Verification Checklist

After installation, verify these work:

- [ ] ⚡ icon visible in Activity Bar
- [ ] ⚡ PowerPlay v3.9.0 in status bar
- [ ] `Ctrl+Shift+Space` opens chat panel
- [ ] ⚙ button in chat panel header works
- [ ] Settings load and save correctly
- [ ] Chat shows 134 commands (not 0)
- [ ] Type `/rev` → Shows autocomplete
- [ ] `Alt+P` opens quick pick
- [ ] Sidebar shows prompts when clicked

**All checked?** ✅ **Installation successful!**

---

## Troubleshooting

### Extension still not showing

1. **Check installation**
   ```bash
   ls ~/.vscode/extensions/ | grep powerplay
   # Should show: smartworkz.powerplay-ai-2.0.0
   ```

2. **Verify files**
   ```bash
   ls ~/.vscode/extensions/smartworkz.powerplay-ai-2.0.0/out/extension.js
   # Should exist (6.7+ KB)
   ```

3. **Full restart**
   ```bash
   # Close VS Code completely
   # Wait 3 seconds
   # Reopen: code .
   # Wait 15 seconds
   ```

### Chat panel shows 0 commands

1. **Check config path**
   - ⚙ (settings button in chat)
   - Verify: `s:/Code101/PowerPlay/config.yaml`
   - Click: **Save Settings**

2. **Manual reload**
   - `Ctrl+Shift+P` → "PowerPlay: Reload Config"
   - Or close and reopen chat: `Ctrl+Shift+Space`

### Settings not saving

1. **Check API key format**
   - Must start with: `sk-ant-`
   - Should have: 40+ characters

2. **Test connection**
   - Click: **🔗 Test Connection** in chat settings
   - Should show latency (not error)

---

## Comparison: Old vs New

| Feature | v1.0.0 | v2.0.0 |
|---------|--------|--------|
| Status Bar | ✅ | ✅ |
| Code Snippets (8) | ✅ | ✅ |
| **Chat Panel** | ❌ | ✅ **NEW** |
| **Settings in Chat** | ❌ | ✅ **NEW** |
| **Sidebar (134 prompts)** | ❌ | ✅ **NEW** |
| **Quick Pick (Alt+P)** | ❌ | ✅ **NEW** |
| **Autocomplete** | ❌ | ✅ **NEW** |
| **Message History** | ❌ | ✅ **NEW** |

---

## Support

If you have issues:

1. **Quick Start:** [FRESH-INSTALL-READY.md](FRESH-INSTALL-READY.md)
2. **Troubleshooting:** [EXTENSION-TROUBLESHOOTING.md](EXTENSION-TROUBLESHOOTING.md)
3. **Full Guide:** [README-EXTENSION-v2.0.0.md](README-EXTENSION-v2.0.0.md)
4. **Build Guide:** [vscode-extension/BUILD.md](vscode-extension/BUILD.md)

---

## Summary

```
Old v1.0.0 → Uninstall → New v2.0.0 → Configure → Done! ⚡

Time: 5 minutes
Effort: Easy (UI-based or 2 commands)
Result: Full-featured chat panel + sidebar + settings
```

**Enjoy PowerPlay v2.0.0!** 🚀
