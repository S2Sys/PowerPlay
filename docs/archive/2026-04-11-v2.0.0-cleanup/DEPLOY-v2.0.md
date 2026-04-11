# PowerPlay v2.0.0 — Deployment Guide

**Status**: ✅ Ready to Ship  
**Version**: 2.0.0  
**Date**: April 10, 2026  
**VSIX**: powerplay-ai-2.0.0.vsix (26.28 KB)  
**MD5**: f72a322e80bc5772ea95914d2e5af45b

---

## Quick Deployment (5 minutes)

### For End Users
```bash
# Download: powerplay-ai-2.0.0.vsix from release assets

# Install in VS Code
code --install-extension powerplay-ai-2.0.0.vsix

# Restart VS Code

# Verify: Click ⚡ icon in Activity Bar
```

### For Team Distribution
1. **Option A - Direct Install**:
   - Share VSIX file via Slack/email/GitHub releases
   - Users run: `code --install-extension powerplay-ai-2.0.0.vsix`

2. **Option B - VS Code Marketplace**:
   - Publish to marketplace (requires PublisherID + PAT)
   - Users search "PowerPlay" in Extensions panel
   - Click Install

3. **Option C - Internal Share**:
   - Store on shared drive / wiki
   - Link in team documentation

---

## Pre-Deployment Checklist

Before distributing, verify:

- [x] VSIX file created (26.28 KB)
- [x] File checksum verified (MD5: f72a322e80bc5772ea95914d2e5af45b)
- [x] Git commit created (9144a76 and ff3b8fb)
- [x] Git tag created (v2.0.0)
- [x] Documentation complete:
  - [x] RELEASE-NOTES-v2.0.md
  - [x] TEST-GUIDE-v2.0.md
  - [x] SHIP-CHECKLIST-v2.0.md
  - [x] EXTENSION-v2.0-SUMMARY.md
  - [x] CHANGELOG.md
  - [x] README.md, INSTALL.md, BUILD.md
- [x] No console errors in build output
- [x] No TypeScript compilation errors
- [x] All 4 modules compiled to JavaScript
- [x] Sidebar UI assets included (icon.svg, html, css, js)

---

## Installation Verification

After users install, they should verify:

### 1. Sidebar Panel
- [ ] ⚡ Lightning bolt icon visible in Activity Bar (left side of VS Code)
- [ ] Click icon → Sidebar panel opens on right
- [ ] Sidebar shows "⚡ PowerPlay v3.9.0" header
- [ ] Search box visible ("Search commands...")
- [ ] At least 3 prompt categories visible
- [ ] "↺ Reload Config" button at bottom

### 2. Search & Filter
- [ ] Type "review" → sidebar updates in real-time
- [ ] Results show prompts matching "review"
- [ ] Clear search → all prompts reappear
- [ ] Works across name, description, command, category

### 3. Insert Command
- [ ] With active Markdown editor: Click prompt → inserts at cursor
- [ ] Without editor: Click prompt → toast shows "Copied to clipboard"
- [ ] Pasted command in Continue.dev chat works

### 4. Alt+P Command Palette
- [ ] Press Alt+P → QuickPick opens
- [ ] Title shows "PowerPlay Prompts (252 available)"
- [ ] Type "validate" → filters to matching prompts
- [ ] Arrow down → highlights next prompt
- [ ] Press Enter → inserts command

### 5. Status Bar (v1.0 feature)
- [ ] Right edge of status bar shows "⚡ PowerPlay v3.9.0"
- [ ] Click → shows "Active and ready" message

### 6. Snippets (v1.0 feature)
- [ ] Type `pp` in Markdown + Tab → expands to PowerPlay invocation
- [ ] Type `ng-component` in TypeScript + Tab → expands Angular snippet

---

## Deployment Environments

### Development
```bash
# For local testing
cd vscode-extension
npm run compile
code --install-extension powerplay-ai-2.0.0.vsix
```

### Staging / Internal Team
```bash
# Share VSIX via internal channels
# Users test in their own VS Code
# Collect feedback before wider rollout
```

### Production / Public Release
```bash
# Option 1: Publish to VS Code Marketplace
vsce publish --token <PAT>

# Option 2: Distribute VSIX directly
# Share on GitHub releases page
# Share via package manager (if supported)
```

---

## Troubleshooting

### Extension Won't Install
**Problem**: `code --install-extension` fails  
**Solution**:
1. Verify VS Code version ≥ 1.85.0: `code --version`
2. Check VSIX file integrity: `unzip -t powerplay-ai-2.0.0.vsix`
3. Try alternative: Manual install via Extensions panel → ... → Install from VSIX

### Sidebar Doesn't Appear
**Problem**: ⚡ icon not visible in Activity Bar  
**Solution**:
1. Restart VS Code completely
2. Wait 3+ seconds after startup
3. Check Output panel for errors (Help → Toggle Developer Tools)
4. Disable conflicting extensions
5. Reinstall: `code --uninstall-extension SmartWorkz.powerplay-ai` then reinstall

### Prompts Don't Load
**Problem**: Sidebar shows "No prompts found"  
**Solution**:
1. Verify config.yaml exists in workspace root
2. Check YAML syntax: `cat config.yaml | head -20`
3. Verify section headers match: `# ── Category Name ──`
4. Reload: Click "↺ Reload Config" button

### QuickPick Won't Open
**Problem**: Alt+P doesn't work  
**Solution**:
1. Check if keybinding overridden (Settings → Keyboard Shortcuts → powerplay)
2. Try command palette: Ctrl+Shift+P → "PowerPlay: Quick Pick Command"
3. Verify config.yaml exists

---

## User Documentation

Share these files with users:

| Document | For |
|----------|-----|
| README.md | Overview and quick start |
| INSTALL.md | Installation steps |
| RELEASE-NOTES-v2.0.md | What's new in v2.0 |
| TEST-GUIDE-v2.0.md | How to verify installation |

---

## Rollback Plan

If critical issues discovered:

```bash
# Uninstall current version
code --uninstall-extension SmartWorkz.powerplay-ai

# Reinstall previous version
code --install-extension powerplay-ai-1.0.0.vsix

# Notify users of rollback
# Post issue on GitHub
```

---

## Support Contacts

- **Build Issues**: See BUILD.md
- **Installation Help**: See INSTALL.md
- **Feature Requests**: Create GitHub issue
- **Bug Reports**: Include:
  - VS Code version
  - OS (Windows/Mac/Linux)
  - Config.yaml excerpt
  - Error from Output panel

---

## Metrics to Track

After deployment, monitor:

- [ ] Installation count (VS Code Marketplace)
- [ ] User feedback/rating
- [ ] Bug reports
- [ ] Feature requests
- [ ] Performance metrics (load time, memory usage)

---

## Deployment Checklists

### For GitHub Release

```bash
git tag v2.0.0
git push origin main
git push origin v2.0.0

# On GitHub:
# 1. Go to Releases
# 2. Create new release from v2.0.0 tag
# 3. Title: "PowerPlay v2.0.0 — Sidebar Panel + Command Palette"
# 4. Upload: powerplay-ai-2.0.0.vsix
# 5. Description: Copy from RELEASE-NOTES-v2.0.md
```

### For VS Code Marketplace

```bash
# Prerequisites:
# 1. Create publisher account at https://marketplace.visualstudio.com
# 2. Generate Personal Access Token (PAT)
# 3. Store in secure location

# Publish:
vsce publish --token <PAT>

# Update documentation with marketplace link
# Edit INSTALL.md → add marketplace link
```

### For Internal Distribution

```bash
# Option 1: Direct file share
# Upload VSIX to: shared-drive / wiki / slack

# Option 2: Organizational deployment
# Push to internal VS Code extension repository
# Use organizational policies for distribution

# Option 3: Email blast
# Send to team with installation instructions
```

---

## Post-Deployment Tasks (1–2 weeks)

1. **Monitor Feedback**
   - [ ] GitHub issues
   - [ ] User comments
   - [ ] Performance reports

2. **Plan Hotfixes**
   - [ ] v2.0.1 if bugs found
   - [ ] Schedule releases

3. **Plan v2.1**
   - [ ] Favorite prompts
   - [ ] Settings UI
   - [ ] Copy-with-context

---

## Success Criteria

Deployment successful when:

✅ Users can install VSIX without errors  
✅ Sidebar panel displays 252 prompts  
✅ Alt+P QuickPick works  
✅ Insert at cursor works  
✅ Copy to clipboard works  
✅ No console errors reported  
✅ Positive user feedback received  

---

## Timeline

| Phase | Timeline | Status |
|-------|----------|--------|
| Development | ✅ Complete | Done |
| Testing | ✅ Complete | Done |
| Documentation | ✅ Complete | Done |
| Git Commit/Tag | ✅ Complete | Done |
| Build Package | ✅ Complete | 26.28 KB VSIX |
| Deploy to GitHub | 📅 Ready | Next step |
| Deploy to Marketplace | 📅 Optional | Later |
| Monitor & Support | 📅 Ongoing | Post-deploy |

---

## Final Sign-Off

**Ready for Production Deployment**

- Version: 2.0.0
- Release Date: April 10, 2026
- VSIX: powerplay-ai-2.0.0.vsix (26.28 KB)
- MD5: f72a322e80bc5772ea95914d2e5af45b
- Documentation: ✅ Complete
- Testing: ✅ Complete
- Quality: ✅ Production-Ready

**🚀 DEPLOY NOW**

---

## Deployment Commands

### Quick Deployment (Copy & Paste)
```bash
# From vscode-extension directory

# Install locally for testing
code --install-extension powerplay-ai-2.0.0.vsix

# Verify installed
code --list-extensions | grep powerplay

# Update git
cd ..
git add EXTENSION-v2.0-SUMMARY.md
git commit -m "PowerPlay v2.0.0 — Ready for production"
git tag v2.0.0
git push origin main v2.0.0

# Done! 🚀
```

---

**End of Deployment Guide**

For questions, refer to:
- RELEASE-NOTES-v2.0.md — What's new
- TEST-GUIDE-v2.0.md — How to test
- INSTALL.md — Installation help
- BUILD.md — Build troubleshooting
