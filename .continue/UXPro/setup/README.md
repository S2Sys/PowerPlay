# UXPro Setup Guide

Welcome! This guide will help you set up the UXPro design system in your project. Choose between **automated setup** (recommended) or **manual setup** (30 seconds).

## 🚀 Quick Setup Options

### Option 1: Automated Setup (Recommended)

**Supported Systems:** macOS, Linux, Windows (Git Bash/WSL)

```bash
# Run the interactive setup script
bash setup/quick-start.sh
```

The script will:
- Auto-detect your system and project paths
- Ask which coding assistant you're using
- Provide platform-specific instructions
- Optionally copy required files automatically
- Verify everything is set up correctly

**Script Availability:**
- ✅ macOS & Linux - Native support
- ✅ Windows with Git Bash - Full support (Git for Windows required)
- ✅ Windows with WSL - Full support (Windows Subsystem for Linux)
- ⚠️ Windows Command Prompt - Use Git Bash or WSL instead

### Option 2: Manual Setup (30 Seconds)

If you prefer to set up manually or the script doesn't work for you:

#### Step 1: Copy the Design System Prompt

1. Open `core/UIUX-SYSTEM-PROMPT.md` in this repository
2. Select all text (Ctrl+A / Cmd+A)
3. Copy it (Ctrl+C / Cmd+C)

#### Step 2: Paste into Your AI Tool

Choose your tool:

**For Claude Code:**
1. Open Claude Code application
2. Click Settings (⚙️ icon)
3. Go to "Custom Instructions" or "System Prompt"
4. Paste the copied content
5. Save and restart Claude Code

**For Cursor:**
1. Open Cursor settings (Cmd+, / Ctrl+,)
2. Search for "Rules for AI"
3. Create a `.cursorrules` file in your project root
4. Paste the copied content
5. Restart Cursor

**For Windsurf:**
1. Open Windsurf settings
2. Find "Wind Rules" or similar
3. Create a `.windsurfrules` file in your project root
4. Paste the copied content
5. Restart Windsurf

**For Cline / Continue.dev:**
1. Create a `.cline_rules` or similar rules file in your project root
2. Paste the copied content
3. Restart the tool

#### Step 3: Copy CSS Tokens (Optional but Recommended)

For web projects using CSS, copy the design tokens file to your project:

```bash
# From the UXPro directory
cp core/design-tokens.css /path/to/your/project/src/
```

Then import in your CSS or HTML:

```html
<link rel="stylesheet" href="src/design-tokens.css">
```

Or in your CSS:

```css
@import url("./design-tokens.css");
```

#### Step 4: Reference Examples

Check the `examples/` directory for:
- React component examples
- HTML/CSS examples
- Vue/Svelte examples
- Implementation patterns

## 📋 What Gets Set Up

### Required Files
- **UIUX-SYSTEM-PROMPT.md** - Core design system rules (paste into AI tool)
- **UIUX-MASTER-PROMPT-SYSTEM.md** - Complete detailed reference (for your team)

### Optional Files (Automated Setup Copies These)
- **.cursorrules** - For Cursor IDE
- **.windsurfrules** - For Windsurf IDE
- **design-tokens.css** - CSS variables for all design tokens

### Reference Files
- **VERSION.json** - Current version and compatibility info
- **UPDATE_GUIDE.md** - How to check for and apply updates
- **CHANGELOG.md** - Version history and changes
- **examples/** - Implementation examples and patterns

## 🔍 Verify Your Setup

After setup, verify everything is working:

1. **Check the prompt is loaded:**
   - In Claude Code: Open Settings → Custom Instructions (should show the system prompt)
   - In Cursor/Windsurf: Open a new chat and ask "What are the key design principles you follow?"
   - Should mention the 60-30-10 color rule, 8-point spacing, and WCAG 2.1 AA

2. **Test with a simple request:**
   ```
   Create a simple button component with:
   - Proper contrast ratio
   - Accessible touch target (44px minimum)
   - Dark mode support using CSS variables
   ```
   The AI should reference design tokens and spacing rules.

3. **Check CSS tokens (if using CSS):**
   - Verify `design-tokens.css` is imported
   - Check that CSS variables like `--space-4`, `--accent-500` are available
   - Test in browser DevTools (Inspect → Computed → filter by "--")

## 🆘 Troubleshooting

### Script Won't Run (Permission Denied)

**Problem:** `bash: setup/quick-start.sh: Permission denied`

**Solution:**
```bash
# Make script executable
chmod +x setup/quick-start.sh

# Then run it
bash setup/quick-start.sh
```

### "Command not found: bash" on Windows

**Problem:** Script can't run on Windows Command Prompt

**Solution:** Use Git Bash or WSL instead
- Install [Git for Windows](https://gitforwindows.org/) (includes Git Bash)
- Or enable [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install)
- Then run: `bash setup/quick-start.sh`

### AI Tool Doesn't Recognize the Rules

**Problem:** Pasted rules but AI isn't following them

**Solution:**
1. Verify the prompt was pasted correctly (check for truncation)
2. Restart the AI tool completely
3. Try asking "What design rules are you following?" 
4. If still not working, check the tool's documentation for where custom instructions should go

### CSS Variables Not Working

**Problem:** `var(--space-4)` showing as undefined

**Solution:**
1. Verify `design-tokens.css` is imported first (before other stylesheets)
2. Check the browser console for any CSS errors
3. Make sure you're using the correct variable names (see `design-tokens.css` for full list)
4. Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)

### Script Shows Wrong Paths

**Problem:** Auto-detected paths are incorrect

**Solution:**
1. Run script from the project root: `cd /path/to/UXPro && bash setup/quick-start.sh`
2. Or manually set the paths:
   ```bash
   UXPRO_ROOT=/path/to/UXPro bash setup/quick-start.sh
   ```

### Different Results on Windows vs Mac/Linux

**Problem:** Behavior differs between systems

**Solution:** This is normal. The script detects your OS and provides appropriate instructions. Git Bash on Windows should behave like Linux. If issues persist:
1. Try WSL for a closer Linux experience
2. Check that Git Bash is fully updated
3. Verify file permissions with `ls -la`

## 📞 Getting Help

### Common Questions

**Q: Do I need to use the script?**
A: No! Manual setup takes 30 seconds. The script is just for convenience.

**Q: Can I use this with multiple AI tools?**
A: Absolutely! You can set up the same system prompt in multiple tools.

**Q: How often should I update?**
A: Check `VERSION.json` monthly. Major updates are rare. See `UPDATE_GUIDE.md` for details.

**Q: Can I customize the design system?**
A: Yes! After setup, you can modify tokens in `design-tokens.css` or adjust the prompt based on your project needs.

**Q: Is this compatible with my CI/CD pipeline?**
A: Yes! The setup is just file copying, which works in any environment.

### For More Help

1. **Version & Compatibility:** Check `VERSION.json`
2. **Updates:** See `UPDATE_GUIDE.md`
3. **Changes:** Review `CHANGELOG.md`
4. **Examples:** Browse `examples/`
5. **Detailed Rules:** Read `core/UIUX-MASTER-PROMPT-SYSTEM.md`

## ✅ Next Steps

After setup completes:

1. **Review the design system** - Check `core/UIUX-MASTER-PROMPT-SYSTEM.md` to understand all 29 sections
2. **Test with a component** - Ask your AI tool to create a simple button/form/card
3. **Check the examples** - Look at `examples/` for reference implementations
4. **Update your tokens** - Customize `design-tokens.css` if needed for your brand
5. **Share with your team** - This design system works across tools, so your whole team can use it

## 📊 Setup Checklist

- [ ] Ran setup script or completed manual setup
- [ ] AI tool shows the design system prompt is loaded
- [ ] Verified with a test component (if not using CSS only)
- [ ] Copied `design-tokens.css` to project (if using CSS)
- [ ] Reviewed the design system sections in `core/`
- [ ] Checked `VERSION.json` for current version
- [ ] Bookmarked `UPDATE_GUIDE.md` for future updates

---

**Current Version:** Check `../VERSION.json`

**Need to update?** See `../UPDATE_GUIDE.md`

**Questions?** Check `../CHANGELOG.md` or `../docs/` for more info
