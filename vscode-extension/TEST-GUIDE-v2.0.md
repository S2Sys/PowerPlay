# PowerPlay v2.0 — Test & Verification Guide

## Pre-Installation Verification

### Build Check
```bash
cd vscode-extension
npm run compile
```
Expected output: No errors, produces `out/*.js` files

### Package Check
```bash
npm run package
```
Expected output: `powerplay-ai-2.0.0.vsix` created (26.28 KB)

---

## Installation

### Install VSIX
```bash
code --install-extension powerplay-ai-2.0.0.vsix
```

### Verify Installation
1. Close all VS Code windows
2. Reopen VS Code
3. Wait 2–3 seconds for extension to activate

---

## Test Checklist (Step-by-Step)

### Part A: Sidebar Panel

#### 1. Activity Bar Icon
- [ ] ⚡ lightning bolt icon appears in left Activity Bar
- [ ] Icon is below File Explorer, above other icons
- [ ] Icon color matches theme (white for dark theme, dark for light)

#### 2. Click Icon → Sidebar Opens
- [ ] Clicking ⚡ icon opens sidebar panel on the right
- [ ] Header shows "⚡ PowerPlay v3.9.0"
- [ ] Search box says "Search commands..."
- [ ] "↺ Reload Config" button visible at bottom

#### 3. Search/Filter
- [ ] Type "review" → filters to prompts containing "review"
- [ ] Type "database" → filters to database-related prompts
- [ ] Clear search → all 252 prompts reappear
- [ ] Filters work on name, description, command, and category

#### 4. Browse Categories
- [ ] Sidebar shows categories (Core, Security, Testing, Database, etc.)
- [ ] Each category header has count (e.g., "Core (5)")
- [ ] Categories are collapsible (click header to collapse/expand)
- [ ] First category opens by default on load

#### 5. Click Prompt
Test with an active editor (Markdown file):
- [ ] Click any prompt (e.g., `/review`) → inserts at cursor with newline
- [ ] Cursor moves to next line after inserted command
- [ ] Command appears in editor exactly as shown in sidebar

Test with no active editor:
- [ ] Click prompt → toast shows "Copied `/command` to clipboard"
- [ ] Paste into Continue.dev chat → command appears correctly

#### 6. Reload Config Button
- [ ] Click "↺ Reload Config" → sidebar briefly updates
- [ ] Prompt count remains same (252)
- [ ] No errors in console

---

### Part B: Command Palette (QuickPick)

#### 1. Open with Alt+P
- [ ] Press `Alt+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) → QuickPick opens
- [ ] Title shows "PowerPlay Prompts (252 available)"
- [ ] Placeholder says "Select a PowerPlay prompt..."

#### 2. Browse All Prompts
- [ ] Top of list shows category separators ($(folder) icon)
- [ ] Prompts grouped by category (Core, Security, etc.)
- [ ] All 252 prompts visible when scrolling

#### 3. Search/Filter
- [ ] Type "helm" → shows `/generate-helm-charts`
- [ ] Type "validate" → shows `/validate-requirements`
- [ ] Type "angular" → shows Angular-related prompts
- [ ] Search works on name + description + detail

#### 4. Select with Keyboard
- [ ] Arrow down → highlights next prompt
- [ ] Arrow up → highlights previous prompt
- [ ] Press Enter → selects highlighted prompt
- [ ] Escape → closes QuickPick without selecting

#### 5. Insert on Select
- [ ] Select any prompt → inserts at cursor (if editor active)
- [ ] Or copies to clipboard (if no editor)

---

### Part C: Status Bar (v1.0 Feature Still Works)

#### 1. Status Bar Item
- [ ] Right side of status bar shows "$(zap) PowerPlay v3.9.0"
- [ ] Icon is lightning bolt (same as Activity Bar)

#### 2. Click Status Bar
- [ ] Click "PowerPlay v3.9.0" → shows message "PowerPlay v3.9.0 — Active and ready"

#### 3. Hover Tooltip
- [ ] Hover over PowerPlay status item → shows tooltip about config

---

### Part D: Snippets (v1.0 Feature Still Works)

#### 1. Test a Snippet
- [ ] Open new Markdown file
- [ ] Type `pp` and press Tab → expands to PowerPlay invocation
- [ ] Snippet contains comment about Continue.dev

#### 2. Other Snippets
- [ ] Type `pp-validate` + Tab → expands with validate-requirements example
- [ ] Type `pp-helm` + Tab → expands with helm chart example
- [ ] Type `ng-component` in TypeScript file + Tab → expands Angular component

---

### Part E: Settings

#### 1. Disable Status Bar
- [ ] Open Settings (Ctrl+,)
- [ ] Search "powerplay.statusBarEnabled"
- [ ] Toggle to false
- [ ] Status bar disappears
- [ ] Sidebar still works
- [ ] Toggle back to true → status bar reappears

#### 2. Custom Config Path
- [ ] Open Settings
- [ ] Search "powerplay.configPath"
- [ ] Leave empty (default) — uses workspace root/config.yaml
- [ ] Or set to custom path (e.g., `/path/to/custom/config.yaml`)
- [ ] Verify sidebar updates with correct prompts

---

### Part F: Theme Switching

#### 1. Dark Theme
- [ ] Switch to dark theme (Settings → Color Theme → Dark)
- [ ] Sidebar background is dark
- [ ] Text is light/white
- [ ] Search box has dark background
- [ ] Button has dark colors

#### 2. Light Theme
- [ ] Switch to light theme (Color Theme → Light)
- [ ] Sidebar background is light
- [ ] Text is dark/black
- [ ] Colors automatically adapt

#### 3. High Contrast
- [ ] Switch to High Contrast theme
- [ ] All elements remain visible
- [ ] Text contrast is good

---

### Part G: Error Handling

#### 1. Missing config.yaml
- [ ] Remove config.yaml from workspace
- [ ] Reload VS Code
- [ ] Status bar shows "PowerPlay — config.yaml not found"
- [ ] Sidebar still opens but shows "No prompts found"
- [ ] Alt+P shows warning: "PowerPlay: config.yaml not found"

#### 2. Invalid YAML
- [ ] Corrupt config.yaml (break YAML syntax)
- [ ] Reload VS Code
- [ ] Check Output panel (View → Output) for error messages
- [ ] Extension should not crash

#### 3. Empty config.yaml
- [ ] Replace config.yaml with empty file
- [ ] Reload VS Code
- [ ] Sidebar shows "No prompts found"
- [ ] QuickPick shows warning

---

## Performance Tests

### Sidebar Load Time
- [ ] Click ⚡ icon → sidebar appears within 200ms
- [ ] Search input responsive (no lag when typing)
- [ ] Category collapse/expand immediate

### QuickPick Load Time
- [ ] Alt+P → QuickPick appears within 300ms
- [ ] Fuzzy search responsive with 252 items
- [ ] No UI freezing

### Memory Usage
- [ ] Open sidebar and QuickPick together
- [ ] Reload config 5+ times
- [ ] No memory leaks (check VS Code Task Manager)

---

## Console Check

### Open Developer Tools
```
Ctrl+Shift+I (or Help → Toggle Developer Tools)
```

### Check Console
- [ ] No error messages
- [ ] No warnings about permissions
- [ ] No XSS warnings (innerHTML safety)
- [ ] No CSP violations

---

## Uninstall Verification

### Uninstall Extension
```bash
code --uninstall-extension SmartWorkz.powerplay-ai
```

### Verify Removal
- [ ] ⚡ icon disappears from Activity Bar
- [ ] Sidebar gone
- [ ] Alt+P no longer shows PowerPlay commands
- [ ] Status bar icon removed
- [ ] No errors in Output panel

---

## Final Sign-Off

When all tests pass, extension is production-ready. Create a summary:

```
✅ Sidebar panel opens and displays 252 prompts
✅ Live search filters correctly
✅ One-click insert works with active editor
✅ Copy-to-clipboard works without editor
✅ Alt+P QuickPick shows all prompts with categories
✅ Keyboard navigation (arrow keys + Enter) works
✅ Status bar still displays and is clickable
✅ All 8 snippets still expand correctly
✅ Settings (statusBarEnabled, configPath) work
✅ Theme switching (dark/light/high-contrast) works
✅ No console errors or warnings
✅ No memory leaks
✅ Extension can be installed/uninstalled cleanly
✅ Performance is snappy (< 300ms load time)

READY TO SHIP ✅
```

---

## Troubleshooting

### Sidebar Won't Open
1. Check VS Code version: `code --version` (must be ≥ 1.85.0)
2. Restart VS Code
3. Check Output panel for errors
4. Try reinstalling: `code --uninstall-extension SmartWorkz.powerplay-ai` then reinstall

### Prompts Don't Load
1. Verify config.yaml exists in workspace root
2. Check that config.yaml has valid YAML syntax
3. Verify section headers match pattern: `# ── Category Name ──`
4. Check Output panel for parse errors

### QuickPick Doesn't Appear
1. Verify Alt+P keybinding is not overridden (Settings → Keyboard Shortcuts)
2. Try command from Ctrl+Shift+P → "PowerPlay: Quick Pick Command"
3. Check that config.yaml exists

### Sidebar Crashes When Scrolling
1. Unlikely (vanilla JS, no external deps)
2. Check for memory leaks in Task Manager
3. Try disabling other extensions

### Insert Doesn't Work
1. Ensure a text editor (Markdown, TypeScript, etc.) is active
2. Check that config.yaml path is correct
3. Try copy-to-clipboard instead (no active editor)

---

## Success Criteria

All items below must pass:

| Item | Status |
|------|--------|
| Build without errors | ✅ |
| VSIX packages successfully | ✅ |
| Sidebar displays 252 prompts | ⬜ (test) |
| Search filters work | ⬜ (test) |
| Alt+P QuickPick works | ⬜ (test) |
| Insert at cursor works | ⬜ (test) |
| Copy to clipboard works | ⬜ (test) |
| Status bar still works | ⬜ (test) |
| Snippets still expand | ⬜ (test) |
| Theme switching works | ⬜ (test) |
| No console errors | ⬜ (test) |
| Performance is good | ⬜ (test) |

Mark each as ✅ after testing.

---

**Ship When All Tests Pass** ✅
