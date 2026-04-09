# Claude Code Installation Guide

**Platform:** Anthropic's Official CLI for Claude  
**Version:** Latest  
**Difficulty Level:** Beginner

## Overview

Claude Code is Anthropic's official command-line interface for Claude. It provides direct access to Claude's powerful reasoning and code generation capabilities, making it ideal for deep architectural analysis, refactoring, and complex system design work.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Anthropic API key ([get one here](https://console.anthropic.com/))
- Basic terminal/command-line familiarity

## Installation Steps

### Step 1: Install Claude Code Globally

Open your terminal and run:

```bash
npm install -g @anthropic-ai/claude-code
```

Or with yarn:

```bash
yarn global add @anthropic-ai/claude-code
```

### Step 2: Authenticate with Your API Key

Configure your Anthropic API key:

```bash
claude-code auth setup
```

When prompted, enter your Anthropic API key. This will be stored securely in your system's credential storage.

Alternatively, set the environment variable:

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

### Step 3: Create Your UXPro Configuration

Create a Claude Code configuration file in your project root:

```bash
touch .claude-code.json
```

Edit `.claude-code.json` and add the following configuration:

```json
{
  "version": "1.0.0",
  "systemPrompt": "./core/UIUX-SYSTEM-PROMPT.md",
  "projectName": "UXPro",
  "codeContext": {
    "includePaths": [
      "core/",
      "src/",
      "docs/",
      "components/"
    ],
    "excludePaths": [
      "node_modules/",
      ".git/",
      "dist/",
      "build/"
    ]
  },
  "features": {
    "codeAnalysis": true,
    "refactoring": true,
    "documentation": true
  }
}
```

### Step 4: Integrate the System Prompt

Copy the UXPro system prompt into your Claude Code initialization:

```bash
claude-code init --system-prompt-file core/UIUX-SYSTEM-PROMPT.md
```

This command will:
- Read the system prompt from `core/UIUX-SYSTEM-PROMPT.md`
- Set it as the default context for all Claude Code operations
- Store the configuration locally

### Step 5: Verify Installation

Test that Claude Code is working correctly:

```bash
claude-code --version
```

Expected output: `Claude Code v<version>`

Test a simple query:

```bash
claude-code "Explain the UXPro design system" --cwd .
```

This should load the project context and respond with information about the system.

## Configuration Details

### System Prompt Integration

The UXPro system prompt is located at:
```
core/UIUX-SYSTEM-PROMPT.md
```

To verify it's properly loaded:

```bash
claude-code config get systemPrompt
```

### Project Context

Configure which directories Claude Code analyzes:

```bash
claude-code config set codeContext.includePaths '["core/", "src/", "docs/"]'
```

## Verification Steps

1. **Check Version:**
   ```bash
   claude-code --version
   ```
   Should show a version number (e.g., v1.2.0)

2. **Verify API Connection:**
   ```bash
   claude-code "What is 2+2?"
   ```
   Should respond immediately without errors

3. **Test System Prompt Loading:**
   ```bash
   claude-code "What design principles are in the UXPro system?" --cwd .
   ```
   Should reference content from `core/UIUX-SYSTEM-PROMPT.md`

4. **Check Configuration:**
   ```bash
   claude-code config list
   ```
   Should show your configuration settings

## Common Workflows

### Analyze Codebase Architecture

```bash
claude-code "Analyze the current architecture of the codebase and suggest improvements"
```

### Generate Component Documentation

```bash
claude-code "Generate comprehensive documentation for the design system components"
```

### Refactor Code Section

```bash
claude-code "Refactor the authentication module for better maintainability"
```

## Troubleshooting

### Issue: "Command not found: claude-code"

**Solution:** Ensure the installation completed successfully:
```bash
npm list -g @anthropic-ai/claude-code
```

If not found, reinstall:
```bash
npm install -g @anthropic-ai/claude-code
```

### Issue: "Authentication failed"

**Solution:** Verify your API key is correct:
```bash
echo $ANTHROPIC_API_KEY
```

If empty, set it again:
```bash
claude-code auth setup
```

### Issue: "System prompt not loading"

**Solution:** Verify the file path is correct:
```bash
ls -la core/UIUX-SYSTEM-PROMPT.md
```

If missing, extract it from the project backup or documentation.

### Issue: "Timeout or slow responses"

**Solution:** Check your network connection and reduce project scope:
```bash
claude-code config set codeContext.includePaths '["core/"]'
```

### Issue: "Rate limit errors"

**Solution:** Wait a few minutes between requests or upgrade your Anthropic plan at https://console.anthropic.com/

## Advanced Configuration

### Custom System Prompt

To use a modified version of the system prompt:

```bash
claude-code config set systemPrompt "./custom/my-system-prompt.md"
```

### Exclude Sensitive Files

Update `.claude-code.json`:

```json
{
  "codeContext": {
    "excludePaths": [
      "node_modules/",
      ".git/",
      ".env",
      "secrets/"
    ]
  }
}
```

### Multi-Project Setup

Create separate configurations:

```bash
claude-code init --config .claude-code.design.json --system-prompt-file core/UIUX-SYSTEM-PROMPT.md
claude-code init --config .claude-code.dev.json --system-prompt-file core/DEV-SYSTEM-PROMPT.md
```

## Next Steps

1. **Explore the System Prompt:** Review `core/UIUX-SYSTEM-PROMPT.md` to understand its capabilities
2. **Try Design Queries:** Use Claude Code to analyze and improve design system components
3. **Set Up Integration:** Configure it with your IDE or CI/CD pipeline
4. **Share with Team:** Add `.claude-code.json` to version control for team consistency
5. **Document Workflows:** Create custom prompts for your team's specific needs

## Additional Resources

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Claude Code Repository](https://github.com/anthropic/claude-code)
- [UXPro System Prompt](../../core/UIUX-SYSTEM-PROMPT.md)
- [Project README](../../README.md)

## Support

For issues related to:
- **Claude Code:** Check [Anthropic's support](https://support.anthropic.com/)
- **UXPro Integration:** Review this guide or contact your project team
- **API Keys:** Visit [console.anthropic.com](https://console.anthropic.com/)
