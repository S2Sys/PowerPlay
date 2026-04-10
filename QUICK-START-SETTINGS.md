# PowerPlay Settings Panel — Quick Start (30 seconds)

## ⚡ 3-Step Setup

### Step 1: Open Settings (10 seconds)
```
1. Press Ctrl+Shift+P (Command Palette)
2. Type: PowerPlay: Open Settings
3. Press Enter
```

### Step 2: Configure Models (10 seconds)
In the settings panel:
1. **Select Reasoning Model**: Claude Opus (best) or Sonnet (balanced)
2. **Select Fast Model**: Claude Sonnet (default)
3. **Paste API Key**: Your Anthropic API key

### Step 3: Save (5 seconds)
1. **Click**: "💾 Save All Settings"
2. **Done!** Settings saved to VS Code

---

## ✅ Your Settings Are Now Active

All commands will use:
- ✓ Your selected default model
- ✓ Your API key for authentication  
- ✓ Your config.yaml for 134 invokable prompts
- ✓ Your agent configuration (iterations, timeout, caching)

---

## 🚀 Next Steps

### Test `/play` Command

1. **Open Continue.dev** (Ctrl+L)
2. **Type:**
   ```
   /play
   
   I need to review this authentication code for security issues
   ```
3. **Press Enter**
4. Continue analyzes and routes to `/security-scan`

### Test Other Commands

```
/play - Review code for bugs
/play - Design a database schema  
/play - Create unit tests
/play - Optimize performance
```

---

## 📋 What Each Setting Does

| Setting | What It Controls |
|---------|-----------------|
| Reasoning Model | Quality of complex analysis |
| Fast Model | Speed of quick decisions |
| API Key | Authentication (required) |
| Temperature | Creativity vs consistency |
| Max Tokens | Length of responses |
| Parallel Execution | Speed for multi-step tasks |
| Caching | Cost savings (reuse results) |

---

## 🔧 Advanced (Optional)

If you want to customize further:

**Enable Debug Mode** (for troubleshooting):
- Open Settings
- Toggle "Debug Mode" ON
- Run your command
- Check Output panel (View → Output) for logs

**Change Agent Behavior**:
- Max Iterations: Prevent infinite loops (default 5)
- Timeout: Set max execution time (default 300s)

**Local Ollama Setup**:
- API Provider: Select "Local"
- Base URL: `http://localhost:11434/v1`
- No API key needed

---

## ❓ Need Help?

**Settings won't open?**
```bash
code --uninstall-extension SmartWorkz.powerplay-ai
code --install-extension powerplay-ai-2.0.0.vsix
# Restart VS Code
```

**API key not working?**
1. Open Settings
2. Click "🔗 Test Connection"
3. Check error message in Output panel

**Config not loading?**
1. Open Settings
2. Click "📂 Open File" to verify config.yaml exists
3. Click "🔄 Reload"

---

## 📚 Full Documentation

See: **SETTINGS-PANEL-GUIDE.md** for complete reference

---

**⚡ That's it! You're ready to use PowerPlay!**
