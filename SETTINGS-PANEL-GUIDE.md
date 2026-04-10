# PowerPlay Settings Panel — User Guide

**Version**: v2.0.0+  
**Status**: ✅ Production Ready

---

## Overview

The **PowerPlay Settings Panel** is a modern, intuitive configuration interface integrated into VS Code. It lets you:

- 🤖 **Select default AI models** (Claude Opus, Sonnet, Haiku)
- 🔑 **Configure API keys** and providers
- 📋 **Set config paths** and reload settings
- 🎯 **Tune agent behavior** (iterations, timeouts, caching)
- ⚙️ **Advanced options** (temperature, tokens, debug mode)

---

## Opening the Settings Panel

### Method 1: Command Palette

1. **Open Command Palette** (Ctrl+Shift+P)
2. **Type**: `PowerPlay: Open Settings`
3. **Press Enter**

### Method 2: Status Bar

1. **Click** the ⚡ **PowerPlay icon** in the status bar (right side)
2. **Look for** "Open Settings" option (coming in v2.1)

### Method 3: Activity Bar

1. **Click** the ⚡ **icon in Activity Bar** (left sidebar)
2. **In sidebar**, click ⚙️ **gear icon** for settings (coming in v2.1)

---

## Settings Explained

### 🤖 Default Models

**Reasoning Model**: Used for complex tasks
- **Claude Opus** — Most capable, best for deep analysis (security, architecture)
- **Claude Sonnet** — Balanced (recommended)
- **Claude Haiku** — Fast and efficient, good for quick tasks

**Fast Model**: Used for quick tasks
- **Claude Sonnet** — Default
- **Claude Haiku** — Fastest option

**When to use each:**
- **Opus**: `/review`, `/architecture`, `/security-agent` (complex analysis)
- **Sonnet**: `/refactor`, `/optimize-sql`, `/test-generation` (balanced)
- **Haiku**: `/quick-fix`, `/inline-review` (fast decisions)

---

### 🔑 API Configuration

**API Provider**:
- **Anthropic** — Direct Claude API (recommended)
- **OpenRouter** — Multi-model access with fallbacks
- **Local** — Ollama for on-device models

**API Key**:
- Your Anthropic API key (starts with `sk-ant-`)
- Securely stored in VS Code's local configuration
- Never sent to external servers

**Base URL**:
- For Anthropic: Leave empty (uses `https://api.anthropic.com`)
- For OpenRouter: `https://api.openrouter.ai/api/v1`
- For Local Ollama: `http://localhost:11434/v1`

**Test Connection**:
- Click 🔗 to verify your API key works
- Shows latency and model availability

---

### 📋 PowerPlay Configuration

**Config File Path**:
- Path to your `config.yaml` file
- Example: `s:/Code101/PowerPlay/config.yaml`
- Contains all 134 invokable prompts and rules

**Status**:
- 🟢 Connected — Config loaded successfully
- 🔴 Disconnected — Config file not found
- Shows number of available prompts

**Actions**:
- 📂 **Open File** — Edit config.yaml
- 🔄 **Reload** — Refresh prompts without restart

---

### 🎯 Agent Configuration

**Max Iterations**:
- How many steps an agent can take before stopping
- Recommended: 5 (prevents infinite loops)
- Range: 1–20

**Timeout (seconds)**:
- Maximum execution time per agent
- Recommended: 300 (5 minutes)
- Range: 30–3600 seconds

**Enable Parallel Execution**:
- Run independent agents concurrently (v3.9.0+)
- Faster for multi-step tasks
- Automatic load balancing

**Enable Caching**:
- Reuse results from previous identical requests
- Faster and cheaper responses
- Recommended: ON

---

### ⚙️ Advanced Settings

**Temperature** (0–2):
- 0 = Deterministic (same answer every time)
- 0.7 = Balanced (recommended)
- 2 = Creative (more variation)

**Max Tokens** (256–8192):
- Maximum length of each response
- 4096 = Standard (recommended)
- Higher = longer, more detailed responses

**Debug Mode**:
- Show detailed logs and intermediate steps
- Useful for troubleshooting
- Only enable when debugging

---

## Common Workflows

### Workflow 1: Code Review Setup

1. **Open Settings** (Ctrl+Shift+P → PowerPlay: Open Settings)
2. **Set Reasoning Model** → Claude Opus
3. **Set Fast Model** → Claude Haiku
4. **Enable Caching** ✓
5. **Click Save**

Now when you run `/review`, it uses **Opus** (best analysis) with **Haiku** for quick decisions.

### Workflow 2: Local Development (Ollama)

1. **Open Settings**
2. **API Provider** → Local
3. **Base URL** → `http://localhost:11434/v1`
4. **Reasoning Model** → Your local model
5. **Click Test Connection**
6. **Click Save**

### Workflow 3: Fast Iteration

1. **Open Settings**
2. **Reasoning Model** → Claude Haiku
3. **Fast Model** → Claude Haiku
4. **Temperature** → 0 (deterministic)
5. **Max Tokens** → 2048 (shorter responses)
6. **Click Save**

Great for quick prototyping and rapid feedback loops.

### Workflow 4: Debugging Agent Issues

1. **Open Settings**
2. **Enable Debug Mode** ✓
3. **Max Iterations** → 3 (limit loops)
4. **Timeout** → 60 (shorter timeout)
5. **Click Save**
6. **Run your command**
7. **Check Output panel** (View → Output) for logs

---

## Settings Persistence

All settings are saved to **VS Code's global configuration**:
- **Windows**: `%APPDATA%\Code\User\settings.json`
- **macOS**: `~/Library/Application Support/Code/User/settings.json`
- **Linux**: `~/.config/Code/User/settings.json`

You can also manually edit these files:

```json
{
  "powerplay.defaultModel": "claude-opus-4-6",
  "powerplay.fastModel": "claude-haiku-4-5",
  "powerplay.apiKey": "sk-ant-...",
  "powerplay.apiProvider": "anthropic",
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

## Exporting & Importing Settings

### Export Settings

1. **Open Settings**
2. **Click ⬇️ Export Settings**
3. **Saves to** `powerplay-settings.json`

Share with your team or backup your configuration.

### Import Settings

1. **Get** `powerplay-settings.json` file
2. **Open Settings**
3. **Click ⬇️ Import Settings** (coming in v2.1)
4. **Select** the JSON file

---

## Troubleshooting

### Problem: Settings panel won't open

**Solution**:
```bash
# Close VS Code
code --uninstall-extension SmartWorkz.powerplay-ai

# Reinstall
code --install-extension powerplay-ai-2.0.0.vsix

# Restart VS Code
```

### Problem: Changes not saved

**Solution**:
1. Make sure you clicked **Save** button
2. Check `settings.json` to verify changes
3. Restart VS Code
4. Reopen Settings panel

### Problem: Config file not found

**Solution**:
1. **Open Settings**
2. **Check Config Path** — should be `s:/Code101/PowerPlay/config.yaml`
3. **Click 📂 Open File** — verify file exists
4. **Click 🔄 Reload**
5. **Status should show** 🟢 Connected

### Problem: API key not working

**Solution**:
1. **Open Settings**
2. **Paste API key** (no "sk-" prefix needed)
3. **Click 🔗 Test Connection**
4. **Check Output** (View → Output) for error messages
5. **Verify** your API key has permissions

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Settings | Ctrl+Shift+P → PowerPlay: Open Settings |
| Save Settings | Ctrl+S (if editing) |
| Test API | Click button in panel |
| Reload Config | Click button in panel |

---

## API Key Security

Your API key is:
- ✅ **Stored locally** in VS Code settings
- ✅ **Never uploaded** to external servers
- ✅ **Encrypted** by VS Code's secure storage (coming in v2.1)
- ✅ **Scoped** to your machine only

**Best practices**:
- Use a read-only API key if possible
- Rotate keys regularly
- Don't share your config file if it contains keys

---

## Settings Validation

The Settings panel validates your input:

| Setting | Validation |
|---------|-----------|
| Temperature | 0–2 (decimal) |
| Max Tokens | 256–8192 (integer) |
| Max Iterations | 1–20 (integer) |
| Timeout | 30–3600 (integer) |
| Config Path | Must be valid file path |
| API Key | Checked on Test Connection |

Invalid values are rejected with helpful error messages.

---

## Defaults

If you want to reset to defaults:

1. **Open Settings**
2. **Click ↺ Reset to Defaults**
3. **Confirm** when prompted
4. Settings revert to:
   - Model: Claude Sonnet
   - Temperature: 0.7
   - Max Tokens: 4096
   - Caching: Enabled
   - Parallel: Enabled

---

## Version History

| Version | Features |
|---------|----------|
| 2.0.0 | ✅ Initial settings panel, model selection, API config, agent tuning |
| 2.1.0 | 🔄 Coming: Encrypted key storage, import/export, sidebar gear icon |
| 3.0.0 | 🔄 Coming: WebView dashboard, real-time metrics, profile management |

---

## Support

- 📖 **Docs**: See RELEASE-NOTES-v2.0.md
- 🐛 **Issues**: GitHub Issues (SmartWorkz/PowerPlay)
- 💬 **Questions**: Check /workspace-learn in Continue.dev

---

**⚡ That's it! Configure PowerPlay your way and start building!**
