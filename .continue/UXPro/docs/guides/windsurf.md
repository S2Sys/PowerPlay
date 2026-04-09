# Windsurf Installation Guide

**Platform:** Advanced AI Code Editor  
**Version:** Latest  
**Difficulty Level:** Intermediate

## Overview

Windsurf is an advanced AI code editor featuring agentic coding capabilities with real-time error detection and fixing. It's specifically designed for complex refactoring tasks and large-scale code transformations, making it ideal for implementing and maintaining the UXPro design system.

## Prerequisites

- Windows, macOS, or Linux
- 300MB+ free disk space
- Internet connection for AI features
- Anthropic API key or Windsurf license
- Familiarity with code editors

## Installation Steps

### Step 1: Download and Install Windsurf

Visit [Windsurf official site](https://www.windsurf.ai/) and download the appropriate version.

**Windows:**
1. Download the Windows installer
2. Run the `.exe` file
3. Choose installation directory
4. Complete the setup wizard
5. Windsurf will open automatically

**macOS:**
1. Download the `.dmg` file
2. Drag Windsurf to Applications
3. Open from Applications folder
4. Grant necessary permissions

**Linux:**
1. Download the AppImage or Linux package
2. Make executable: `chmod +x windsurf-*.AppImage`
3. Run or install based on your distribution
4. Add to PATH for easy access

### Step 2: Initialize Windsurf Configuration

1. Launch Windsurf
2. Accept the initial setup wizard
3. Choose "Continue with GitHub" or "Continue with Email"
4. Follow authentication prompts
5. Complete onboarding

### Step 3: Configure AI Model and API Access

1. Open Settings (`Ctrl+,` or `Cmd+,`)
2. Navigate to "AI" settings
3. Select model:
   - Claude 3.5 Sonnet (recommended)
   - Claude 3 Opus
   - Other available models
4. If using your own API key:
   - Go to "API Keys" section
   - Paste your Anthropic API key
   - Save settings

### Step 4: Create Windsurf Configuration Files

Create `.windsurf` directory in project root:

```bash
mkdir -p .windsurf
cd .windsurf
```

Create `windsurf.json`:

```json
{
  "ide": "Windsurf",
  "version": "1.0.0",
  "aiModel": "claude-3-5-sonnet-20241022",
  "systemPrompt": "../core/UIUX-SYSTEM-PROMPT.md",
  "agentic": {
    "enabled": true,
    "autoFix": true,
    "errorDetection": true,
    "refactoring": true
  },
  "projectSettings": {
    "includePaths": [
      "core/",
      "src/",
      "components/",
      "docs/",
      "tests/"
    ],
    "excludePaths": [
      "node_modules/",
      ".git/",
      "dist/",
      "build/",
      ".next/"
    ],
    "codeStyle": {
      "formatter": "prettier",
      "linter": "eslint"
    }
  }
}
```

### Step 5: Set Up System Prompt Integration

Create `.windsurf/system-prompt-config.md`:

```markdown
# UXPro System Prompt Configuration

This file configures how Windsurf uses the UXPro system prompt.

## Loading Instructions

1. System prompt is located at: `core/UIUX-SYSTEM-PROMPT.md`
2. Windsurf automatically loads this on startup
3. The prompt is used for all AI operations including:
   - Code generation
   - Refactoring suggestions
   - Error analysis and fixing
   - Documentation generation

## Integration Points

- Agentic coding uses system prompt for context
- Error detection references design patterns
- Refactoring suggestions follow UXPro conventions
- Generated code adheres to system specifications

## Custom Rules

To add project-specific rules, edit `.windsurf/rules.json`
```

### Step 6: Configure Agentic Features

Open or create `.windsurf/agentic-config.json`:

```json
{
  "agenticFeatures": {
    "autoErrorDetection": {
      "enabled": true,
      "severity": "all",
      "autoFix": true
    },
    "smartRefactoring": {
      "enabled": true,
      "scope": "projectwide",
      "systemPromptContext": "core/UIUX-SYSTEM-PROMPT.md"
    },
    "codeGeneration": {
      "style": "UXPro",
      "testGeneration": true,
      "documentationGeneration": true
    }
  },
  "performance": {
    "analysisDepth": "deep",
    "contextWindow": "full",
    "caching": true
  }
}
```

### Step 7: Link System Prompt in Settings

1. Open Windsurf Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "System Prompt"
3. Set the path: `core/UIUX-SYSTEM-PROMPT.md`
4. Enable system prompt for:
   - Code generation
   - Refactoring
   - Error fixes
   - Documentation

### Step 8: Verify Installation

Test the installation:

1. Open a code file in your project
2. Press `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (macOS)
3. Type: "Analyze this file against UXPro guidelines"
4. Windsurf should provide agentic analysis

Verify agentic features:

1. Introduce a coding error intentionally
2. Windsurf should detect it automatically
3. Use the "Fix with AI" suggestion
4. Verify it follows UXPro patterns

## Configuration Details

### System Prompt File

```
core/UIUX-SYSTEM-PROMPT.md
```

### Settings Locations

**Windows:**
```
%APPDATA%\Windsurf\User\settings.json
```

**macOS:**
```
~/Library/Application Support/Windsurf/User/settings.json
```

**Linux:**
```
~/.config/Windsurf/User/settings.json
```

### Configuration Files

**Project-level:**
```
.windsurf/windsurf.json
.windsurf/agentic-config.json
.windsurf/rules.json
```

**User-level:**
```
~/.windsurf/config.json
```

## Verification Steps

1. **Check AI Model:**
   - Open Settings
   - Verify Claude 3.5 Sonnet is selected
   - Test with "What is UXPro?"

2. **Verify Agentic Features:**
   - Open a component file
   - Right-click → "Windsurf Intelligence"
   - Should show agentic analysis options

3. **Test System Prompt:**
   - Select a code block
   - Press `Ctrl+Shift+A` or `Cmd+Shift+A`
   - Ask: "Does this follow UXPro patterns?"
   - Should reference system prompt

4. **Check Error Detection:**
   - Introduce a potential issue
   - Windsurf should flag it automatically
   - Hover over the indicator for details

5. **Test Auto-Fix:**
   - Right-click on detected error
   - Select "Fix with Windsurf"
   - Verify fix aligns with UXPro guidelines

## Common Workflows

### Agentic Code Refactoring

1. Select a function or file
2. Press `Ctrl+Shift+A` or `Cmd+Shift+A`
3. Type: "Refactor this to follow UXPro component patterns"
4. Review suggested changes
5. Apply with one click

### Implement Component from Design

1. Open `.windsurf` and activate agentic mode
2. Type task: "Create a Button component based on UXPro specifications"
3. Windsurf generates full component with:
   - Props interface
   - JSDoc comments
   - Unit tests
   - Storybook stories

### Real-Time Error Fixing

1. Write code normally
2. Windsurf detects issues in real-time
3. Red underlines appear for problems
4. Click "Fix" to auto-correct
5. Fixes follow system prompt guidelines

### Large Refactoring Task

1. Select entire folder or multiple files
2. Press `Ctrl+Shift+A` or `Cmd+Shift+A`
3. Describe the refactoring goal
4. Windsurf analyzes project-wide impact
5. Apply changes across multiple files

### Generate Documentation

1. Select code section
2. Right-click → "Generate Documentation"
3. Windsurf creates:
   - JSDoc comments
   - README sections
   - API documentation
   - Usage examples

## Troubleshooting

### Issue: "Agentic features not working"

**Solution:**
1. Verify agentic mode is enabled in settings
2. Check that AI model is properly configured
3. Restart Windsurf
4. Check internet connection

### Issue: "System prompt not being applied"

**Solution:**
1. Verify file path is correct: `core/UIUX-SYSTEM-PROMPT.md`
2. Check file exists and is readable
3. Restart Windsurf to reload configuration
4. Check settings.json for syntax errors

### Issue: "Auto-fix suggestions don't follow patterns"

**Solution:**
1. Ensure system prompt is in correct location
2. Verify agentic config includes system prompt path
3. Check project-level rules are configured
4. Run "Refresh AI Context" from command palette

### Issue: "Error detection not appearing"

**Solution:**
1. Open Settings → AI → Error Detection
2. Enable all severity levels
3. Check that project linters (ESLint) are configured
4. Restart Windsurf

### Issue: "Out of quota or rate limiting"

**Solution:**
1. Check API usage at [console.anthropic.com](https://console.anthropic.com/)
2. Reduce analysis depth in agentic-config.json
3. Disable some agentic features temporarily
4. Upgrade API plan if needed

### Issue: "Slow performance or hanging"

**Solution:**
1. Reduce number of files in includePaths
2. Disable deep analysis: set analysisDepth to "shallow"
3. Disable caching if issues persist
4. Check system resources (RAM, CPU)

## Advanced Configuration

### Custom Project Rules

Create `.windsurf/rules.json`:

```json
{
  "rules": [
    {
      "pattern": "components/**/*.tsx",
      "rules": [
        "Must include PropTypes",
        "Must follow UXPro naming conventions",
        "Must include accessibility attributes"
      ]
    },
    {
      "pattern": "core/**/*.md",
      "rules": [
        "Must use standard markdown",
        "Must include version information",
        "Must be UTF-8 encoded"
      ]
    }
  ]
}
```

### Multi-Workspace Setup

Configure multiple projects:

```json
{
  "workspaces": [
    {
      "name": "UXPro Core",
      "path": ".",
      "systemPrompt": "core/UIUX-SYSTEM-PROMPT.md"
    },
    {
      "name": "Component Library",
      "path": "./packages/components",
      "systemPrompt": "core/UIUX-SYSTEM-PROMPT.md"
    }
  ]
}
```

### Custom AI Instructions

Add to `.windsurf/windsurf.json`:

```json
{
  "customInstructions": {
    "codeGeneration": "Always include TypeScript types and JSDoc comments",
    "refactoring": "Prioritize readability and maintainability",
    "testing": "Generate both unit and integration tests"
  }
}
```

## Next Steps

1. **Explore Agentic Capabilities:** Try refactoring, error fixing, and code generation
2. **Configure Project Rules:** Add .windsurf/rules.json for team consistency
3. **Set Team Shortcuts:** Configure keyboard shortcuts for common operations
4. **Enable Auto-Save:** Configure automatic save after AI operations
5. **Share Configuration:** Add .windsurf/ to version control
6. **Monitor Usage:** Track API usage and optimize as needed

## Additional Resources

- [Windsurf Documentation](https://docs.windsurf.ai/)
- [Agentic Coding Guide](https://docs.windsurf.ai/features/agentic-coding)
- [System Prompt Configuration](https://docs.windsurf.ai/configuration/system-prompt)
- [UXPro System Prompt](../../core/UIUX-SYSTEM-PROMPT.md)
- [Project README](../../README.md)

## Support

For issues related to:
- **Windsurf:** Visit [Windsurf Support](https://support.windsurf.ai/)
- **Agentic Features:** Check documentation at docs.windsurf.ai
- **API Issues:** See [Anthropic Support](https://support.anthropic.com/)
- **UXPro Integration:** Review this guide or contact your team
