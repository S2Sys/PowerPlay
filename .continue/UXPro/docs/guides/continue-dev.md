# Continue.dev Installation Guide

**Platform:** Open-Source AI Code Assistant  
**Version:** Latest  
**Difficulty Level:** Intermediate

## Overview

Continue.dev is an open-source AI code assistant that provides multi-model support and deep customization options. It's highly configurable and perfect for teams that want to use various LLMs (Claude, GPT-4, open-source models) or have specific deployment requirements.

## Prerequisites

- VS Code (1.80+) or JetBrains IDE (2023.1+)
- Node.js 16+ (for local development)
- Internet connection (for cloud models)
- Anthropic API key for Claude support
- Basic terminal familiarity

## Installation Steps (VS Code)

### Step 1: Install Continue Extension

1. Open VS Code
2. Open Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Continue"
4. Click "Install" on the official Continue extension
5. Icon appears in Activity Bar
6. Wait for installation to complete

### Step 2: Configure Providers

1. Click Continue icon in Activity Bar
2. Click Settings (gear icon)
3. Select "Add API Provider"
4. Choose "Anthropic" or "Claude API"
5. Enter your Anthropic API key
6. Click "Verify"

Or configure manually by editing settings:

**VS Code:** Press Ctrl+Shift+P / Cmd+Shift+P, type "Continue: Open Config"

### Step 3: Create Continue Configuration File

Create `.continue/config.json` in project root:

```json
{
  "models": [
    {
      "title": "Claude 3.5 Sonnet",
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20241022",
      "apiKey": "${ANTHROPIC_API_KEY}"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Claude 3.5 Sonnet",
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022"
  },
  "contextProviders": [
    {
      "name": "codebase",
      "params": {
        "retrievalSize": 50
      }
    },
    {
      "name": "diff",
      "params": {}
    },
    {
      "name": "terminal",
      "params": {}
    }
  ],
  "slashCommands": [
    {
      "name": "edit",
      "description": "Edit code in the editor"
    },
    {
      "name": "comment",
      "description": "Add comments to code"
    }
  ],
  "systemPrompt": "core/UIUX-SYSTEM-PROMPT.md"
}
```

### Step 4: Set System Prompt

1. Click Continue icon → Settings
2. Look for "System Prompt" configuration
3. Set path: `core/UIUX-SYSTEM-PROMPT.md`
4. Or paste the full content if preferred

Edit directly in `.continue/config.json`:

```json
{
  "systemPrompt": "core/UIUX-SYSTEM-PROMPT.md"
}
```

### Step 5: Configure Tab Autocomplete

To enable intelligent tab completion:

1. Open Continue settings
2. Under "Tab Autocomplete Model", select Claude 3.5 Sonnet
3. Enable "Tab Autocomplete"
4. Adjust keyboard shortcut if needed

### Step 6: Set Up Custom Commands

Create `.continue/commands.json`:

```json
{
  "commands": [
    {
      "name": "uxpro-review",
      "prompt": "Review this code against UXPro design patterns and suggest improvements",
      "description": "Review code for UXPro compliance"
    },
    {
      "name": "uxpro-component",
      "prompt": "Generate a component following UXPro specifications and include TypeScript types, JSDoc, and accessibility attributes",
      "description": "Generate UXPro component"
    },
    {
      "name": "uxpro-test",
      "prompt": "Generate comprehensive tests for this code that verify UXPro compliance",
      "description": "Generate UXPro tests"
    }
  ]
}
```

### Step 7: Verify Installation

1. Open any code file
2. Start typing a comment or code
3. Press Tab to trigger autocomplete
4. Should see Claude-powered suggestions
5. Click Continue icon to open chat
6. Type: "What is UXPro?"
7. Should reference system prompt content

## Installation Steps (JetBrains)

### Step 1: Install Continue Plugin

1. Open your JetBrains IDE
2. Settings/Preferences → Plugins
3. Click "Marketplace"
4. Search "Continue"
5. Click "Install" on official Continue plugin
6. Restart IDE when prompted

### Step 2: Configure API Provider

1. Settings/Preferences → Continue
2. Click "Add Provider"
3. Select "Anthropic"
4. Paste API key
5. Test connection

### Step 3: Create Project Configuration

Create `.continue/config.json`:

```json
{
  "models": [
    {
      "title": "Claude 3.5 Sonnet",
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20241022",
      "apiKey": "${ANTHROPIC_API_KEY}"
    }
  ],
  "contextProviders": [
    {
      "name": "codebase",
      "params": {
        "retrievalSize": 50
      }
    },
    {
      "name": "open-files",
      "params": {}
    }
  ],
  "systemPrompt": "core/UIUX-SYSTEM-PROMPT.md"
}
```

### Step 4: Configure System Prompt

1. Open Continue settings
2. Set System Prompt path: `core/UIUX-SYSTEM-PROMPT.md`
3. Save configuration
4. Restart IDE

### Step 5: Test Installation

1. Open Continue panel (View → Tool Windows → Continue)
2. Type test query
3. Verify Claude model is selected
4. Check system prompt is loaded

## Configuration Details

### System Prompt Location

```
core/UIUX-SYSTEM-PROMPT.md
```

### Configuration Directory

```
.continue/
├── config.json          # Main configuration
├── commands.json        # Custom slash commands
└── rules.txt           # Code style rules (optional)
```

### Supported Models

**Anthropic:**
- claude-3-5-sonnet-20241022 (recommended)
- claude-3-opus-20250219
- claude-3-haiku-20250307

**OpenAI:**
- gpt-4
- gpt-4-turbo
- gpt-3.5-turbo

**Open Source (local):**
- ollama models
- llama.cpp models
- vLLM models

## Verification Steps

1. **Check API Connection:**
   - Open Continue chat
   - Type: "Hello"
   - Should respond immediately

2. **Verify System Prompt:**
   - Ask: "What are the UXPro accessibility guidelines?"
   - Should cite content from system prompt

3. **Test Autocomplete:**
   - Start typing code
   - Press Tab
   - Should see Claude-powered suggestions

4. **Check Model:**
   - Open Continue settings
   - Verify Claude 3.5 Sonnet is selected

5. **Test Context Awareness:**
   - Open code file
   - Ask Continue: "What does this function do?"
   - Should analyze the actual file

## Common Workflows

### Get Code Suggestions

1. Start typing code
2. Press Tab (or configured shortcut)
3. Claude completes intelligently
4. Accept with Enter or reject with Escape

### Generate Code with /edit

1. Open Continue chat
2. Type: `/edit Generate a Button component with UXPro styling`
3. Continue creates component in editor
4. Review and accept changes

### Use Custom Commands

1. Open Continue chat
2. Type slash command: `/uxpro-component`
3. Follow the prompt to generate component
4. Or `/uxpro-review` to review code

### Understand Large Files

1. Open file in editor
2. Click Continue icon
3. Ask: "Summarize this component"
4. Continue analyzes and explains

### Refactor with Context

1. Select code block
2. Open Continue chat
3. Type: "Refactor this to follow UXPro patterns"
4. Continue suggests improvements
5. Use /edit to apply changes

### Generate Documentation

1. Select function or component
2. Type: `/comment Generate JSDoc for this`
3. Continue creates documentation
4. Review and accept

## Advanced Configuration

### Multi-Model Setup

Use different models for different tasks:

```json
{
  "models": [
    {
      "title": "Claude (Chat)",
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20241022"
    },
    {
      "title": "GPT-4 (Backup)",
      "provider": "openai",
      "model": "gpt-4-turbo"
    }
  ]
}
```

### Custom Context Providers

Add project-specific context:

```json
{
  "contextProviders": [
    {
      "name": "codebase",
      "params": {
        "retrievalSize": 50,
        "indexPath": ".continue/index"
      }
    },
    {
      "name": "git",
      "params": {
        "recentFiles": true
      }
    }
  ]
}
```

### Local Model Setup (Advanced)

For running models locally with Ollama:

```json
{
  "models": [
    {
      "title": "Llama 2 Local",
      "provider": "ollama",
      "model": "llama2",
      "apiBase": "http://localhost:11434"
    }
  ]
}
```

First, install Ollama:
1. Download from [ollama.ai](https://ollama.ai)
2. Run: `ollama pull llama2`
3. Ollama service runs locally on port 11434

### IDE-Specific Keyboard Shortcuts

**VS Code:**
1. Ctrl+K Ctrl+S (open keybindings)
2. Search "continue"
3. Customize shortcut for opening chat

**JetBrains:**
1. Settings → Keymap
2. Search "continue"
3. Right-click to assign new shortcut

### Team Configuration

Share configuration with git:

```bash
git add .continue/config.json .continue/commands.json
git commit -m "Add Continue.dev configuration for UXPro"
```

## Troubleshooting

### Issue: "API key not working"

**Solution:**
1. Verify key at [console.anthropic.com](https://console.anthropic.com/)
2. Check no extra spaces in key
3. Try using environment variable: `${ANTHROPIC_API_KEY}`
4. Restart IDE

### Issue: "System prompt not being used"

**Solution:**
1. Verify file path is correct: `core/UIUX-SYSTEM-PROMPT.md`
2. Check file exists and is readable
3. Restart IDE to reload config
4. Try using full file content instead of path

### Issue: "Slow responses"

**Solution:**
1. Reduce context size in config
2. Disable codebase context if not needed
3. Use a smaller model for tab completion
4. Check internet connection

### Issue: "Tab autocomplete not working"

**Solution:**
1. Verify tab autocomplete is enabled
2. Check keyboard shortcut is correct
3. Try manual trigger: Ctrl+Shift+P → "Continue: Autocomplete"
4. Restart IDE

### Issue: "Config not loading" (File not found)

**Solution:**
1. Create `.continue` directory: `mkdir .continue`
2. Create config.json in that directory
3. Use relative paths from project root
4. Restart IDE

### Issue: "Plugin conflicts"

**Solution:**
1. Disable conflicting extensions temporarily
2. Check Continue version compatibility
3. Update Continue to latest version
4. Restart IDE in safe mode

## Next Steps

1. **Install Extension:** Complete for your IDE
2. **Add API Key:** Configure Anthropic API
3. **Create Config:** Set up `.continue/config.json`
4. **Set System Prompt:** Add UXPro system prompt
5. **Try Autocomplete:** Test tab completion
6. **Create Commands:** Add custom UXPro commands
7. **Share Config:** Add to version control

## Additional Resources

- [Continue.dev Official Site](https://continue.dev/)
- [Continue Documentation](https://docs.continue.dev/)
- [GitHub Repository](https://github.com/continuedev/continue)
- [Configuration Guide](https://docs.continue.dev/customization/config)
- [UXPro System Prompt](../../core/UIUX-SYSTEM-PROMPT.md)
- [Project README](../../README.md)

## Support

For issues related to:
- **Continue.dev:** Check [GitHub Issues](https://github.com/continuedev/continue/issues)
- **Configuration:** See [Continue Docs](https://docs.continue.dev/)
- **IDE Integration:** Check IDE-specific documentation
- **API Keys:** Visit [console.anthropic.com](https://console.anthropic.com/)
- **Open-Source Models:** Check [Ollama](https://ollama.ai/) or [LM Studio](https://lmstudio.ai/)
