# Cline Installation Guide

**Platform:** Claude IDE Extension  
**Version:** Latest  
**Difficulty Level:** Beginner

## Overview

Cline is a powerful IDE extension that brings Claude AI directly into JetBrains IDEs (IntelliJ, WebStorm, PhpStorm, etc.) and VS Code. It provides seamless integration with your development environment for code analysis, generation, and refactoring while maintaining your current workflow.

## Prerequisites

- VS Code (1.85+) OR JetBrains IDE (2023.3+)
  - JetBrains: IntelliJ IDEA, WebStorm, PyCharm, PhpStorm, GoLand, RubyMine, CLion
- Internet connection
- Anthropic API key ([get one here](https://console.anthropic.com/))
- Basic IDE familiarity

## Installation Steps (VS Code)

### Step 1: Install Cline Extension

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Cline"
4. Click "Install" on the official Cline extension
5. Wait for installation to complete
6. Extension icon appears in the Activity Bar

### Step 2: Configure API Access

1. Click the Cline icon in the Activity Bar (left sidebar)
2. Click "Settings" or open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Type "Cline: Configure API"
4. Select your API provider:
   - **Anthropic** (recommended)
   - OpenAI
   - Other providers

### Step 3: Add Your API Key

1. In Cline settings, paste your Anthropic API key
2. Click "Verify" to test the connection
3. You should see a success message
4. API key is stored securely in VS Code

Alternative - use environment variable:

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY = "your-api-key"
```

**macOS/Linux:**
```bash
export ANTHROPIC_API_KEY="your-api-key"
```

### Step 4: Create Cline Configuration

Create `.cline-config.json` in project root:

```json
{
  "ide": "VS Code",
  "version": "1.0.0",
  "apiProvider": "anthropic",
  "apiModel": "claude-3-5-sonnet-20241022",
  "systemPrompt": "./core/UIUX-SYSTEM-PROMPT.md",
  "projectContext": {
    "includePaths": [
      "core/",
      "src/",
      "components/",
      "docs/"
    ],
    "excludePaths": [
      "node_modules/",
      ".git/",
      "dist/",
      "build/"
    ]
  },
  "features": {
    "codeCompletion": true,
    "codeGeneration": true,
    "refactoring": true,
    "documentation": true,
    "testing": true
  }
}
```

### Step 5: Set System Prompt

1. Click Cline icon in Activity Bar
2. Click the settings gear icon
3. Look for "System Prompt" or "Custom Instructions"
4. Enter the path or paste content from: `core/UIUX-SYSTEM-PROMPT.md`

Or via Command Palette:
1. Press Ctrl+Shift+P / Cmd+Shift+P
2. Type "Cline: Set System Prompt"
3. Paste content from `core/UIUX-SYSTEM-PROMPT.md`

### Step 6: Verify Installation

1. Open any code file in VS Code
2. Click Cline icon in Activity Bar
3. Start a conversation: "What design patterns are in UXPro?"
4. Cline should respond with context from the system prompt

## Installation Steps (JetBrains IDEs)

### Step 1: Install Cline Plugin

1. Open your JetBrains IDE (IntelliJ, WebStorm, etc.)
2. Go to Settings/Preferences (Ctrl+Alt+S / Cmd+,)
3. Navigate to Plugins
4. Click "Marketplace"
5. Search for "Cline"
6. Click "Install" on the official Cline plugin
7. Click "Restart IDE" when prompted

### Step 2: Configure API Settings

1. Go to Settings/Preferences
2. Search for "Cline"
3. Select your API provider: **Anthropic**
4. Paste your Anthropic API key
5. Click "Test Connection"
6. Apply and OK

### Step 3: Create Project Configuration

Create `.cline-config.json` in project root:

```json
{
  "ide": "JetBrains",
  "version": "1.0.0",
  "apiProvider": "anthropic",
  "apiModel": "claude-3-5-sonnet-20241022",
  "systemPrompt": "./core/UIUX-SYSTEM-PROMPT.md",
  "projectContext": {
    "includePaths": [
      "core/",
      "src/",
      "components/",
      "docs/"
    ],
    "excludePaths": [
      "node_modules/",
      ".git/",
      "dist/",
      "build/"
    ]
  },
  "ideSettings": {
    "language": "Auto-detect",
    "contextAnalysis": true,
    "fileNavigation": true
  }
}
```

### Step 4: Configure System Prompt

1. Open Cline panel (View → Tool Windows → Cline)
2. Click Settings icon
3. Under "System Prompt", set path: `core/UIUX-SYSTEM-PROMPT.md`
4. Save settings

### Step 5: Test Configuration

1. Right-click any file in project
2. Select "Cline: Ask about this file"
3. Type: "Explain how this fits into UXPro"
4. Cline responds with context

## Configuration Details

### System Prompt Location

```
core/UIUX-SYSTEM-PROMPT.md
```

### Configuration Files

**Project-level:**
```
.cline-config.json
```

**Settings Storage:**

**VS Code:**
- Windows: `%APPDATA%\Code\User\settings.json`
- macOS: `~/Library/Application Support/Code/User/settings.json`
- Linux: `~/.config/Code/User/settings.json`

**JetBrains:**
- Windows: `%APPDATA%\JetBrains\IntelliJ IDEA 2024.1\...`
- macOS: `~/Library/Application Support/JetBrains/IntelliJIdea2024.1/...`
- Linux: `~/.config/JetBrains/IntelliJIdea2024.1/...`

## Verification Steps

1. **Check API Connection:**
   - Open Cline panel
   - Type: "2 + 2"
   - Should respond immediately

2. **Verify System Prompt:**
   - Open Cline chat
   - Ask: "What accessibility standards are in UXPro?"
   - Should reference system prompt content

3. **Test File Context:**
   - Open a component file
   - Right-click → "Cline: Ask about this file"
   - Ask: "Does this follow UXPro patterns?"
   - Should analyze the file

4. **Check Model:**
   - Open Cline settings
   - Verify Claude 3.5 Sonnet is selected
   - Confirm API key is valid

## Common Workflows

### Code Generation with Context

1. Click Cline in Activity Bar (VS Code) or Tool Window (JetBrains)
2. Type: "Generate a Card component following UXPro specifications"
3. Cline creates component with types, docs, and examples
4. Review and accept changes

### Refactor Existing Code

1. Select problematic code
2. Right-click → "Cline: Refactor Selection"
3. Or open Cline and paste code with "Refactor this to follow UXPro patterns"
4. Cline suggests improvements
5. Accept changes or iterate

### Understand Codebase

1. Open Cline
2. Ask: "Explain the folder structure of this project"
3. Or: "What components are missing from UXPro specification?"
4. Cline analyzes and provides summary

### Generate Tests

1. Open code file
2. Select function to test
3. Ask Cline: "Generate comprehensive unit tests for this function"
4. Cline generates test cases
5. Review and save to test file

### Create Documentation

1. Select code block or file
2. Ask Cline: "Generate JSDoc comments for this"
3. Or: "Create a README section for this component"
4. Cline generates documentation
5. Copy to appropriate location

## Troubleshooting

### Issue: "API key not recognized"

**Solution:**
1. Verify API key is valid at [console.anthropic.com](https://console.anthropic.com/)
2. Check for extra spaces before/after key
3. Restart IDE
4. Try entering via command palette instead of settings

### Issue: "System prompt not loading"

**Solution:**
1. Verify file exists: `core/UIUX-SYSTEM-PROMPT.md`
2. Check file path in settings is correct
3. Restart IDE
4. Try copying content directly instead of file path

### Issue: "Cline responses are generic"

**Solution:**
1. Verify system prompt is set correctly
2. Include more context in your question
3. Ask Cline to "Use the UXPro system prompt for this"
4. Check that include paths are correct in config

### Issue: "Response is slow or times out"

**Solution:**
1. Check internet connection
2. Try simpler questions first
3. Reduce project context (fewer include paths)
4. Check API status at [status.anthropic.com](https://status.anthropic.com/)

### Issue: "Cline panel not appearing" (JetBrains)

**Solution:**
1. Go to View → Tool Windows → Cline
2. If not listed, restart IDE
3. Check that plugin is enabled in Settings → Plugins
4. Reinstall plugin if necessary

### Issue: "File context not being included"

**Solution:**
1. Verify project is properly opened
2. Check .cline-config.json includePaths
3. Make sure files are in included directories
4. Use "Ask about this file" right-click option

## Advanced Configuration

### Custom Instructions

Add to `.cline-config.json`:

```json
{
  "customInstructions": {
    "general": "Always prioritize accessibility and performance",
    "codeStyle": "Use TypeScript strict mode",
    "naming": "Follow UXPro naming conventions"
  }
}
```

### Multi-File Refactoring

1. Open Cline chat
2. Paste multiple file contents with labels
3. Ask: "Refactor these files to work together following UXPro patterns"
4. Cline suggests coordinated changes

### Team Configuration

Share configuration with team:

```bash
git add .cline-config.json
git commit -m "Add Cline configuration for UXPro"
```

Team members can clone and use same setup.

### IDE-Specific Keyboard Shortcuts

**VS Code:**
1. Open Keybindings (Ctrl+K Ctrl+S)
2. Search "Cline"
3. Add custom shortcuts for common operations

**JetBrains:**
1. Settings → Keymap
2. Search "Cline"
3. Right-click to assign keyboard shortcuts

## Next Steps

1. **Install Extension:** Complete installation for your IDE
2. **Configure API:** Add your Anthropic API key
3. **Set System Prompt:** Configure UXPro system prompt
4. **Try Examples:** Start with simple queries before complex tasks
5. **Customize Shortcuts:** Set up keyboard shortcuts for efficiency
6. **Share with Team:** Add config to version control

## Additional Resources

- [Cline GitHub Repository](https://github.com/cline/cline)
- [Cline Documentation](https://github.com/cline/cline/wiki)
- [VS Code Extension Docs](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.cline)
- [JetBrains Plugin Docs](https://plugins.jetbrains.com/plugin/22707-cline)
- [UXPro System Prompt](../../core/UIUX-SYSTEM-PROMPT.md)
- [Project README](../../README.md)

## Support

For issues related to:
- **Cline Extension:** Check [GitHub Issues](https://github.com/cline/cline/issues)
- **VS Code Integration:** See [VS Code docs](https://code.visualstudio.com/docs)
- **JetBrains Integration:** See [JetBrains docs](https://www.jetbrains.com/help/)
- **API Keys:** Visit [console.anthropic.com](https://console.anthropic.com/)
- **UXPro Integration:** Review this guide or contact your team
