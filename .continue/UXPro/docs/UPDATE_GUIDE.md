# UXPro Update Guide

## Quick Start: Check for Updates (1 Minute)

1. Find the `VERSION.json` file in the [UXPro GitHub repository](https://github.com/s2sys/uxpro)
2. Check the `version` field
3. Compare it with your local version (check the prompt file or `VERSION.json` in your project)
4. If numbers don't match, download the latest files from the repository

---

## Understanding Version Numbers

UXPro uses **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

### MAJOR Version (e.g., 1.0.0 → 2.0.0)
**What it means:** Breaking changes that require updates to your code
- Design token changes that affect existing components
- Removed or renamed CSS variables
- Structural changes to the design system
- Requires: Review BREAKING CHANGES section and update your implementations

### MINOR Version (e.g., 2.0.0 → 2.1.0)
**What it means:** New features, backward compatible
- New sections or components added
- New design patterns documented
- Expanded guidance
- Requires: Optional review; new features won't break existing code

### PATCH Version (e.g., 2.0.0 → 2.0.1)
**What it means:** Bug fixes, typos, clarifications
- Documentation corrections
- Improved explanations
- Typo fixes
- Requires: No action needed; safe to update anytime

---

## How to Check for Updates

### Method 1: Automated (For AI Agents)
```bash
# Fetch VERSION.json from GitHub
curl -s https://raw.githubusercontent.com/s2sys/uxpro/main/VERSION.json

# Parse version field
jq '.version' VERSION.json
```

### Method 2: Manual Check
1. Visit: https://github.com/s2sys/uxpro/blob/main/VERSION.json
2. Look for the `"version": "X.Y.Z"` field
3. Compare with your local version

### Method 3: From System Prompt
The version number appears in the header of both:
- `UIUX-MASTER-PROMPT-SYSTEM.md` (line 1)
- `UIUX-SYSTEM-PROMPT.md` (condensed version)

---

## Release Notes & Breaking Changes

Visit the GitHub repository's [Releases](https://github.com/s2sys/uxpro/releases) page to:
- Read detailed release notes for each version
- Review breaking changes and migration guides
- See what changed in each release

### Current Breaking Changes: **None**

---

## How to Apply an Update

### For Files in Your Project

#### Step 1: Backup Current Version
```bash
# Keep your current version as backup
cp UIUX-SYSTEM-PROMPT.md UIUX-SYSTEM-PROMPT.md.backup
cp design-tokens.css design-tokens.css.backup
```

#### Step 2: Download Latest Files
Download from GitHub:
- [UIUX-MASTER-PROMPT-SYSTEM.md](https://raw.githubusercontent.com/s2sys/uxpro/main/UIUX-MASTER-PROMPT-SYSTEM.md)
- [UIUX-SYSTEM-PROMPT.md](https://raw.githubusercontent.com/s2sys/uxpro/main/UIUX-SYSTEM-PROMPT.md)
- [design-tokens.css](https://raw.githubusercontent.com/s2sys/uxpro/main/design-tokens.css)

#### Step 3: Replace Files
```bash
# Copy downloaded files to your project
cp ~/Downloads/UIUX-SYSTEM-PROMPT.md ./
cp ~/Downloads/design-tokens.css ./
```

#### Step 4: Review Changes
```bash
# See what changed
diff -u UIUX-SYSTEM-PROMPT.md.backup UIUX-SYSTEM-PROMPT.md
```

#### Step 5: Validate & Test
- [ ] Check that all new tokens/rules are recognized
- [ ] Run your project's test suite
- [ ] Verify UI components render correctly
- [ ] Test responsive design at all breakpoints
- [ ] Check dark mode if applicable
- [ ] Verify accessibility (keyboard navigation, contrast)

#### Step 6: Commit Changes
```bash
git add UIUX-SYSTEM-PROMPT.md design-tokens.css VERSION.json
git commit -m "chore: Update UXPro to v2.1.0

- Add 10 new design sections (micro-interactions through advanced visualization)
- Update design tokens with new color palettes
- Improve accessibility guidelines
- Add platform-specific patterns"
```

### For AI Tools (Cursor, Windsurf, etc.)

#### Option 1: Paste Updated Prompt
1. Open the latest `UIUX-SYSTEM-PROMPT.md` from GitHub
2. Copy the entire prompt section (between the backticks)
3. Go to your AI tool's settings
4. Paste into System Prompt or Custom Instructions
5. Save and test

#### Option 2: Use `.cursorrules` or `.windsurfrules`
1. Create `.cursorrules` in your project root
2. Paste relevant sections from `UIUX-MASTER-PROMPT-SYSTEM.md`
3. Save and reload the tool

#### Option 3: Import from URL (when supported)
```
# Some tools support remote imports
.cursorrules: https://raw.githubusercontent.com/s2sys/uxpro/main/UIUX-SYSTEM-PROMPT.md
```

---

## Handling Breaking Changes

When a MAJOR version update occurs:

### 1. Read the Migration Guide
Each breaking change includes:
- What changed
- Why it changed
- How to update your code
- Before/after examples

### 2. Update Your Implementation
Example migration from v2.0.0 → v3.0.0 (hypothetical):
```css
/* OLD (v2.0.0) */
--space-1: 4px;
--space-2: 8px;

/* NEW (v3.0.0) - 6-point grid instead of 8-point */
--space-1: 6px;
--space-2: 12px;

/* You need to: Review all spacing in your components */
```

### 3. Update Your Components
- Replace old token values with new ones
- Adjust any hardcoded values
- Retest all components
- Update component documentation

### 4. Test Thoroughly
- [ ] All components render correctly
- [ ] Spacing is consistent with new system
- [ ] Colors maintain WCAG AA contrast
- [ ] Responsive design works
- [ ] No visual regressions

---

## Testing Compatibility

### Checklist Before Considering an Update Complete

- [ ] Downloaded latest files from repository
- [ ] Reviewed VERSION.json for breaking changes
- [ ] Updated all relevant files in your project
- [ ] Ran project build/tests (no errors)
- [ ] Verified UI renders correctly
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Tested responsive design (mobile 320px, tablet 768px, desktop 1280px)
- [ ] Tested dark mode (if using semantic color tokens)
- [ ] Tested with reduced motion enabled
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader compatibility verified (if applicable)
- [ ] Committed changes with clear commit message
- [ ] Updated team documentation if needed

---

## Keeping Your Design System Fresh

### Regular Maintenance Schedule

**Weekly:**
- Check if any new design patterns are needed in your project
- Review design tokens for consistency

**Monthly:**
- Check VERSION.json for minor updates
- Review release notes for new features
- Update if beneficial to your project

**Quarterly:**
- Review entire design system for gaps
- Check GitHub for community issues/suggestions
- Plan major updates if needed

### When to Update

**Immediately:**
- Critical bug fixes (PATCH version)
- Security-related changes
- Breaking accessibility issues

**Soon (within sprint):**
- New useful features (MINOR version)
- Performance improvements
- New component patterns

**Plan ahead:**
- Breaking changes (MAJOR version)
- Large structural changes
- Requires team alignment

### When to Stay on Current Version
- Mid-project sprint (avoid distractions)
- Major version with significant changes
- Limited testing resources
- System is working well

---

## Troubleshooting

### I downloaded the files but they seem huge/broken

**Solution:** Make sure you copied the raw content, not the GitHub HTML page
- Use "Raw" button on GitHub to get plain text
- Or download directly from the raw content URL

### My tool doesn't recognize new CSS variables

**Solution:** Make sure you updated `design-tokens.css`
- Check that the file was actually updated
- Reload your build process
- Restart your AI tool
- Clear browser cache

### I'm getting contrast ratio warnings

**Solution:** You may have custom colors that conflict with new tokens
- Review custom color definitions
- Check contrast using [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Update colors to meet WCAG AA standards (4.5:1 for normal text)

### The new sections don't apply to my project

**Solution:** Depending on your setup, you may need to:
- Copy relevant sections to `.cursorrules` file
- Restart your AI tool
- Update system prompt in tool settings
- Clear any cached prompts

---

## Contributing Updates

Found an issue? Have a suggestion?

1. Check [GitHub Issues](https://github.com/s2sys/uxpro/issues) to see if it's already reported
2. Create a new issue with:
   - Clear title
   - Description of the problem
   - Current version you're using
   - Steps to reproduce (if applicable)
   - Screenshots or examples

---

## FAQ

**Q: Do I need to update to every new version?**
A: No! Minor updates are optional. Only update when you need new features or on your regular schedule.

**Q: Will updating break my existing designs?**
A: Only if there's a MAJOR version change. Check the release notes and breaking changes section first.

**Q: Where do I get the latest files?**
A: GitHub repository: https://github.com/s2sys/uxpro/releases

**Q: Can I use multiple versions simultaneously?**
A: Not recommended, but you could rename files (e.g., `design-tokens-v2.0.css`, `design-tokens-v2.1.css`)

**Q: My AI tool isn't picking up the new prompt**
A: Restart the tool, clear cache, or reload the system prompt in settings.

**Q: Can I modify the design system for my project?**
A: Absolutely! It's a template meant to be customized. Keep a separate branch for your modifications.

---

## Version History

| Version | Release Date | Highlights |
|---------|--------------|-----------|
| 2.1.0   | 2026-04-08   | 10 new sections: micro-interactions, navigation, forms, content, errors, a11y, performance, platforms, icons, data viz |
| 2.0.0   | 2026-03-15   | Complete redesign with 14 foundational sections |
| 1.0.0   | 2026-01-01   | Initial release |

---

## Need Help?

- **GitHub Issues:** Report bugs or request features
- **Discussions:** Ask questions and share ideas
- **Pull Requests:** Contribute improvements
- **Email:** Check repository for contact info

Last Updated: 2026-04-08
