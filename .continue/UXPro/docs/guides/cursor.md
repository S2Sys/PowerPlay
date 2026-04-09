# Cursor Installation Guide

**Platform:** AI-First Code Editor  
**Version:** Latest  
**Difficulty Level:** Beginner

## Overview

Cursor is an AI-first code editor built on VS Code that provides built-in AI pair programming capabilities. It's perfect for rapid development with real-time context-aware code suggestions and completions powered by Claude or other models.

## Prerequisites

- Windows, macOS, or Linux
- 200MB+ free disk space
- Internet connection for AI features
- Anthropic API key (or Cursor Pro account)

## Installation Steps

### Step 1: Download and Install Cursor

Visit [cursor.sh](https://www.cursor.sh/) and download the appropriate version for your OS.

**Windows:**
- Download the installer (.exe)
- Run the installer
- Follow the setup wizard
- Cursor will appear in your applications menu

**macOS:**
- Download the .dmg file
- Drag Cursor to Applications folder
- Launch from Applications

**Linux:**
- Download the AppImage or .deb file
- Make executable: `chmod +x cursor-*.AppImage`
- Run or install with your package manager

### Step 2: Launch Cursor and Sign In

1. Open Cursor
2. Click "Sign in" or "Get started"
3. Choose your authentication method:
   - **GitHub** (recommended for Cursor Pro)
   - **Google**
   - **Email**
4. Follow the authentication flow

### Step 3: Configure Model Selection

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
2. Type "Settings: Open Settings" and press Enter
3. Search for "Model" in settings
4. Choose your preferred model:
   - Claude 3.5 Sonnet (recommended)
   - GPT-4
   - Claude 2

### Step 4: Add Your API Key (Optional, if not using Cursor Pro)

If you're using your own Anthropic API key:

1. Open Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "API Key"
3. In the "Cursor API Key" field, paste your Anthropic API key
4. Save settings

### Step 5: Create UXPro Configuration

Create a `.cursor-config` file in your project root:

```bash
touch .cursorconfig
```

Add the following configuration:

```json
{
  "IDE": "Cursor",
  "version": "1.0.0",
  "aiModel": "claude-3-5-sonnet-20241022",
  "systemPrompt": "./core/UIUX-SYSTEM-PROMPT.md",
  "projectContext": {
    "includeDirs": ["core/", "src/", "components/", "docs/"],
    "excludeDirs": ["node_modules/", ".git/", "dist/", "build/"]
  },
  "codeSettings": {
    "autoComplete": true,
    "codeGeneration": true,
    "refactoring": true,
    "documentation": true
  }
}
```

### Step 6: Integrate the System Prompt

1. Open Cursor settings (`Ctrl+,` or `Cmd+,`)
2. Search for "System Prompt"
3. Open the system prompt configuration:
   - **Windows/Linux:** `%APPDATA%\Cursor\User\settings.json`
   - **macOS:** `~/Library/Application Support/Cursor/User/settings.json`

4. Add or modify the `systemPrompt` setting:

```json
{
  "systemPrompt": "core/UIUX-SYSTEM-PROMPT.md"
}
```

### Step 7: Copy System Prompt Content (If Using Local Setup)

If Cursor doesn't auto-load from file path:

1. Open `core/UIUX-SYSTEM-PROMPT.md` in Cursor
2. Select all content (`Ctrl+A` or `Cmd+A`)
3. Copy (`Ctrl+C` or `Cmd+C`)
4. Open Cursor Settings (`Ctrl+,` or `Cmd+,`)
5. Search for "Custom Instructions"
6. Paste the system prompt content
7. Save settings

### Step 8: Verify Installation

1. Create a test prompt:
   - Press `Ctrl+K` (Windows/Linux) or `Cmd+K` (macOS)
   - Type: "What is the UXPro design system?"
   - Press Enter

2. Cursor should respond with information from the system prompt

3. Check the chat history to confirm it's using the correct model

## Configuration Details

### System Prompt File Location

```
core/UIUX-SYSTEM-PROMPT.md
```

### Settings File Locations

**Windows:**
```
C:\Users\<USERNAME>\AppData\Roaming\Cursor\User\settings.json
```

**macOS:**
```
~/Library/Application Support/Cursor/User/settings.json
```

**Linux:**
```
~/.config/Cursor/User/settings.json
```

### Custom Instructions Format

If using custom instructions directly:

```
[Insert entire contents of core/UIUX-SYSTEM-PROMPT.md here]
```

## Verification Steps

1. **Check Model Selection:**
   - Open Cursor settings
   - Search for "Model"
   - Verify Claude 3.5 Sonnet (or your chosen model) is selected

2. **Test AI Features:**
   - Press `Ctrl+K` or `Cmd+K`
   - Ask: "Explain the accessibility guidelines in UXPro"
   - Should reference system prompt content

3. **Verify System Prompt:**
   - Start a chat with `Ctrl+K` or `Cmd+K`
   - Ask: "What design patterns are mentioned in your system prompt?"
   - Should cite specific patterns from `core/UIUX-SYSTEM-PROMPT.md`

4. **Check File References:**
   - Navigate to a component file
   - Press `Ctrl+K` or `Cmd+K`
   - Ask: "How does this file fit into the UXPro design system?"
   - Should provide context-aware response

## Common Workflows

### Generate Component Code

1. Open Cursor in your project
2. Press `Ctrl+K` or `Cmd+K`
3. Type: "Generate a Button component following UXPro design patterns"
4. Review and accept the generated code

### Fix Code with AI

1. Select problematic code
2. Press `Ctrl+K` or `Cmd+K`
3. Type: "Fix this code and explain the issues"
4. Cursor will suggest improvements

### Ask Context-Aware Questions

1. Press `Ctrl+L` or `Cmd+L` (to include file context)
2. Type your question
3. Cursor includes current file in context

### Generate Documentation

1. Select a code block
2. Press `Ctrl+K` or `Cmd+K`
3. Type: "Generate JSDoc comments for this function"
4. Accept the generated documentation

## Troubleshooting

### Issue: "No API key configured"

**Solution:** 
1. Check if using Cursor Pro (doesn't need API key)
2. If not, open Settings and add your Anthropic API key
3. Verify the key is valid at [console.anthropic.com](https://console.anthropic.com/)

### Issue: "System prompt not being used"

**Solution:**
1. Check the settings file is in the correct location
2. Verify file syntax is valid JSON
3. Restart Cursor completely
4. Check that the file path in settings is correct

### Issue: "AI features slow or timing out"

**Solution:**
1. Check internet connection
2. Try with a smaller file context
3. Reduce the number of files in your include list
4. Check Anthropic API status

### Issue: "Model selection not saving"

**Solution:**
1. Make sure settings.json is writable
2. Use Settings UI instead of manual JSON editing
3. Restart Cursor after changing settings
4. Try selecting the model from dropdown menu

### Issue: "Cursor not recognizing file paths in config"

**Solution:**
1. Use relative paths from project root
2. Use forward slashes even on Windows: `core/UIUX-SYSTEM-PROMPT.md`
3. Verify the file exists at that path

## Advanced Configuration

### Using Environment Variables

Set API key via environment:

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY = "your-api-key"
```

**macOS/Linux:**
```bash
export ANTHROPIC_API_KEY="your-api-key"
```

### Custom Keyboard Shortcuts

Open Keybindings (`Ctrl+K Ctrl+S` or `Cmd+K Cmd+S`) and add:

```json
[
  {
    "key": "ctrl+shift+a",
    "command": "cursor.chat",
    "when": "editorTextFocus"
  }
]
```

### Team Collaboration

Add `.cursorconfig` to version control:

```bash
git add .cursorconfig
git commit -m "Add Cursor configuration for UXPro"
```

Team members can now clone and use the same configuration.

## Next Steps

1. **Explore Cursor Features:** Try code generation, refactoring, and chat
2. **Customize Shortcuts:** Set up keyboard shortcuts for common operations
3. **Use Composer:** Try Cursor's multi-file editing with AI assistance
4. **Set Rules:** Configure `.cursor/rules` for project-specific AI behavior
5. **Integrate with Team:** Add config to version control and share settings

## Additional Resources

- [Cursor Official Documentation](https://docs.cursor.sh/)
- [Cursor Settings Guide](https://docs.cursor.sh/settings)
- [Cursor API Integration](https://docs.cursor.sh/chat/custom-models)
- [UXPro System Prompt](../../core/UIUX-SYSTEM-PROMPT.md)
- [Project README](../../README.md)

## Support

For issues related to:
- **Cursor:** Visit [support.cursor.sh](https://support.cursor.sh/) or use in-app help
- **UXPro Integration:** Review this guide or contact your project team
- **API Issues:** Check [Anthropic Support](https://support.anthropic.com/)
