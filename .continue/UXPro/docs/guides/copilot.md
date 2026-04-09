# GitHub Copilot Installation Guide

**Platform:** GitHub's AI Assistant  
**Version:** Latest  
**Difficulty Level:** Beginner

## Overview

GitHub Copilot is GitHub's AI-powered code assistant providing intelligent code completion and generation. While it defaults to GPT-4, it can be configured to work with custom prompts and can be a valuable addition to your development toolkit for rapid prototyping and code suggestions.

## Prerequisites

- GitHub account (free or paid)
- VS Code (1.60+) or JetBrains IDE
- Active Copilot subscription or GitHub Copilot Free
- Basic IDE familiarity
- Internet connection

## Installation Steps (VS Code)

### Step 1: Install GitHub Copilot Extension

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "GitHub Copilot"
4. Click "Install" on official GitHub Copilot extension by GitHub
5. Also install "GitHub Copilot Chat" for chat features
6. Extensions are now active

### Step 2: Authenticate with GitHub

1. Click Copilot icon in Activity Bar (looks like a feather)
2. Click "Sign in to GitHub" or "Authorize"
3. VS Code opens browser to github.com/login/device
4. Enter the device code from VS Code
5. Complete GitHub authentication
6. Return to VS Code
7. Authorization complete

### Step 3: Verify Copilot Connection

1. Create a new file or open existing code
2. Start typing a comment: `// function to handle button click`
3. Wait a moment - Copilot suggests code completion
4. Press Tab or Enter to accept
5. Should see gray suggestion text

### Step 4: Create Copilot Configuration

Create `.copilot/config.json` in project root:

```json
{
  "ide": "VS Code",
  "version": "1.0.0",
  "copilotSettings": {
    "enabled": true,
    "autoComplete": true,
    "chatEnabled": true,
    "inlineSuggestions": true
  },
  "projectContext": {
    "description": "UXPro - Comprehensive UI/UX Design System",
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
  "customInstructions": "Use UXPro design patterns. Include TypeScript types. Add JSDoc comments. Follow accessibility standards."
}
```

### Step 5: Set Custom Instructions

To guide Copilot toward UXPro patterns:

1. Open VS Code Settings (Ctrl+, or Cmd+,)
2. Search "Copilot"
3. Find "Chat: System Prompt" or "Custom Instructions"
4. Add instructions:

```
You are assisting with the UXPro design system project. Follow these guidelines:
- Reference the UXPro design system at core/UIUX-SYSTEM-PROMPT.md
- Include TypeScript types in all code
- Add comprehensive JSDoc comments
- Prioritize accessibility (WCAG 2.1 AA)
- Use React best practices
- Include error handling and edge cases
```

### Step 6: Verify Installation

1. Open Copilot Chat (Ctrl+Shift+I or Cmd+Shift+I)
2. Type: "What is the UXPro design system?"
3. Copilot should provide general information
4. Try: "Generate a Button component"
5. Check that suggestions follow your project patterns

## Installation Steps (JetBrains IDEs)

### Step 1: Install Copilot Plugin

1. Open JetBrains IDE (IntelliJ, WebStorm, etc.)
2. Settings/Preferences → Plugins
3. Click "Marketplace"
4. Search "GitHub Copilot"
5. Click "Install" on official plugin
6. Restart IDE

### Step 2: Authenticate

1. Go to Settings/Preferences → GitHub Copilot
2. Click "Get GitHub Copilot"
3. Opens browser to GitHub login
4. Complete authentication
5. Return to IDE
6. Check "Copilot is active" indicator

### Step 3: Create Project Configuration

Create `.copilot/config.json`:

```json
{
  "ide": "JetBrains",
  "version": "1.0.0",
  "copilotSettings": {
    "enabled": true,
    "autoComplete": true,
    "codeCompletion": true
  },
  "projectContext": {
    "description": "UXPro Design System",
    "includePaths": ["core/", "src/", "components/"],
    "customInstructions": "Follow UXPro patterns. Include types. Add JSDoc."
  }
}
```

### Step 4: Set Custom Instructions

1. Settings/Preferences → GitHub Copilot
2. Find "Custom Instructions" field
3. Add instructions from Step 5 above
4. Apply and save

### Step 5: Test Installation

1. Start typing code or comments
2. Copilot provides suggestions (look for gray text)
3. Accept with Tab or Enter
4. Or use Copilot Chat: Alt+/ (Windows) or Option+/ (Mac)

## Configuration Details

### System Prompt Integration

While Copilot doesn't directly load system prompts like Claude, you can:

1. Reference UXPro in comments:
   ```javascript
   // Generate Button component following UXPro patterns
   ```

2. Use Copilot Chat with full context:
   - Open Copilot Chat (Ctrl+Shift+I)
   - Reference the system prompt: "According to core/UIUX-SYSTEM-PROMPT.md..."

3. Set custom instructions in settings

### Configuration Files

```
.copilot/
├── config.json              # Project configuration
└── copilot-instructions.md  # Custom instructions
```

### Custom Instructions Format

Create `.copilot/copilot-instructions.md`:

```markdown
# UXPro Project Guidelines for Copilot

## Code Generation Rules

1. **TypeScript**: Always use TypeScript with strict mode
2. **Components**: Follow React functional components pattern
3. **Types**: Define clear interfaces for props
4. **Accessibility**: Implement WCAG 2.1 AA standards
5. **Documentation**: Include JSDoc for all functions
6. **Testing**: Generate unit and integration tests
7. **Styling**: Use CSS modules or Tailwind following UXPro

## Example Component

Always generate components similar to this structure:
- TypeScript interface for Props
- Component function with proper typing
- JSDoc comments
- Accessibility attributes (aria-*, role, etc.)
- Event handlers
- Export statements
```

## Verification Steps

1. **Check Copilot Status:**
   - Look for Copilot icon in VS Code Activity Bar
   - Should show "Copilot is running"
   - If not, click icon to activate

2. **Test Code Completion:**
   - Type a descriptive comment
   - Wait for Copilot suggestion
   - Should see gray text preview
   - Accept with Tab

3. **Test Copilot Chat:**
   - Press Ctrl+Shift+I (VS Code) or Alt+/ (JetBrains)
   - Ask: "Generate a Card component"
   - Should provide code suggestion

4. **Verify Custom Instructions:**
   - Ask Copilot: "Generate a button component"
   - Check if response includes TypeScript types and JSDoc
   - Look for accessibility attributes

## Common Workflows

### Auto-Complete Code

1. Type a meaningful comment
2. Press Enter or wait
3. Copilot suggests implementation
4. Press Tab to accept or keep typing to reject

### Generate Component

1. Open Copilot Chat (Ctrl+Shift+I or Alt+/)
2. Type: "Generate a CardComponent for UXPro with types and documentation"
3. Review suggestion
4. Copy to your file

### Ask About Code

1. Select code section
2. Open Copilot Chat
3. Ask: "What does this do?" or "How can this be improved?"
4. Copilot analyzes selected code

### Generate Tests

1. Open test file
2. Type comment: `// test for Button component`
3. Copilot suggests test code
4. Accept and modify as needed

### Get Documentation

1. Open Copilot Chat
2. Ask: "Generate JSDoc for this function"
3. Or: "Create a README for this component"
4. Copilot provides documentation

## Tips for Better Suggestions

1. **Use Clear Comments:**
   - Good: `// Create a reusable Button component with TypeScript types`
   - Bad: `// make button`

2. **Include Context:**
   - Reference patterns in your codebase
   - Example: `// Following UXPro patterns, create...`

3. **Be Specific:**
   - Include requirements: accessibility, styling, props
   - Mention patterns you want followed

4. **Use Copilot Chat:**
   - More detailed for complex tasks
   - Can maintain conversation context
   - Better for explanations

5. **Review Suggestions:**
   - Always verify generated code
   - Check for security issues
   - Ensure patterns are followed

## Troubleshooting

### Issue: "Copilot not suggesting completions"

**Solution:**
1. Verify authentication (check Settings)
2. Try opening Copilot Chat to confirm connection
3. Restart IDE
4. Check internet connection
5. Try typing a very clear comment first

### Issue: "Subscriptions message after free trial"

**Solution:**
1. Use GitHub Copilot Free (limited)
2. Or subscribe at github.com/copilot
3. Note: Copilot Free has limitations

### Issue: "Suggestions don't follow project patterns"

**Solution:**
1. Add clearer custom instructions
2. Include specific examples in comments
3. Use Copilot Chat for more control
4. Reference your style guide in instructions

### Issue: "Can't authenticate"

**Solution:**
1. Sign out and sign back in
2. Check GitHub credentials are correct
3. Verify GitHub account has Copilot access
4. Try browser authentication
5. Check firewall/proxy settings

### Issue: "Copilot disabled in certain files"

**Solution:**
1. Check if file type is allowed in settings
2. Look for exclusion patterns in configuration
3. Verify file isn't in .gitignore
4. Check IDE settings for exclusions

## Limitations to Note

- **Model**: Uses GPT-4 (not Claude)
- **Cost**: Requires subscription (except Copilot Free)
- **Integration**: Less customizable than some alternatives
- **Context**: Limited to current file/workspace context
- **Availability**: Requires GitHub account

## Advanced Usage

### Using with Chat Features

1. Open Copilot Chat (Ctrl+Shift+I)
2. Use markdown formatting for clarity
3. Include file references with @filename
4. Ask multi-turn questions for complex tasks
5. Reference specific lines with line numbers

### Keyboard Shortcuts (VS Code)

- `Tab` - Accept suggestion
- `Escape` - Dismiss suggestion
- `Alt+[` - Previous suggestion
- `Alt+]` - Next suggestion
- `Ctrl+Shift+I` - Open Copilot Chat

### Keyboard Shortcuts (JetBrains)

- `Tab` - Accept suggestion
- `Escape` - Dismiss
- `Alt+/` - Toggle Copilot
- `Alt+\` - Open Chat

## Alternatives and Complements

Consider using alongside:
- **Claude Code** (for deep analysis)
- **Cursor** (Claude-powered editor)
- **Continue.dev** (multi-model support)
- **Cline** (IDE extension for Claude)

## Next Steps

1. **Install Extension:** Complete installation for your IDE
2. **Authenticate:** Connect GitHub account
3. **Set Instructions:** Add custom UXPro guidelines
4. **Try Completion:** Generate sample code
5. **Explore Chat:** Use Copilot Chat for complex tasks
6. **Refine Instructions:** Adjust as needed
7. **Share Config:** Add .copilot/config.json to version control

## Additional Resources

- [GitHub Copilot Official Site](https://github.com/features/copilot)
- [Copilot Documentation](https://docs.github.com/en/copilot)
- [VS Code Copilot Guide](https://code.visualstudio.com/docs/copilot/overview)
- [Best Practices Guide](https://github.blog/2023-05-17-how-to-use-github-copilot-effectively/)
- [UXPro System Prompt](../../core/UIUX-SYSTEM-PROMPT.md)
- [Project README](../../README.md)

## Support

For issues related to:
- **GitHub Copilot:** Visit [GitHub Support](https://github.com/support)
- **Subscriptions:** See [Copilot Pricing](https://github.com/features/copilot#pricing)
- **IDE Issues:** Check VS Code or JetBrains documentation
- **UXPro Integration:** Review this guide or contact your team

## Note on Model Limitations

GitHub Copilot uses GPT-4 for code generation. For Claude-specific features, consider:
- **Claude Code** - Direct Claude API access
- **Cursor** - Claude-powered IDE
- **Cline** - IDE extension for Claude

You can use both Copilot and Claude tools together for complementary strengths!
