# PowerPlay v2.0.0 — Quick Reference

## Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Open Chat Panel | `Ctrl+Shift+Space` | `Cmd+Shift+Space` |
| Open Settings | `Ctrl+Shift+P` → `PowerPlay: Open Settings` | Same |
| Open Quick Pick | `Alt+P` | `Option+P` |
| Reload Config | `Ctrl+Shift+P` → `PowerPlay: Reload Config` | Same |

---

## Chat Panel Controls

| Control | Action |
|---------|--------|
| `/` | Start typing to trigger autocomplete |
| ↑/↓ | Navigate autocomplete items |
| Enter | Select autocomplete item or send message |
| Shift+Enter | New line in message |
| ↺ | Clear chat history |
| ⚙️ | Open settings inside chat panel |

---

## Settings Panel (Inside Chat)

**Open with:** ⚙️ button in chat header

**Fields:**
1. **Config Path** — Path to config.yaml file
   - Example: `s:/Code101/PowerPlay/config.yaml`
2. **Default Model** — Claude model to use
   - Options: Opus 4.6, Sonnet 4.6, Haiku 4.5
3. **API Key** — Your Anthropic API key
   - Format: `sk-ant-...` (40+ chars)
4. **Temperature** — Slider 0-2 for model randomness
   - Lower (0-0.5) = more focused
   - Higher (1.5-2) = more creative

**Buttons:**
- 🔗 **Test Connection** — Verifies API key is valid
- 💾 **Save Settings** — Persists all settings to VS Code config
- ✕ **Close** — Hide settings panel

---

## Installation (Quick Path)

1. **Uninstall old version** (if needed)
   ```
   Ctrl+Shift+X → Search "PowerPlay" → Uninstall
   ```

2. **Download new version**
   - Go to: https://github.com/S2Sys/PowerPlay/releases
   - Download: `powerplay-ai-2.0.0.vsix`

3. **Install**
   ```
   Ctrl+Shift+X → ... (menu) → Install from VSIX → Select file
   ```

4. **Restart VS Code**
   ```
   File → Exit, then reopen VS Code
   ```

5. **Configure**
   ```
   Ctrl+Shift+Space (open chat) → ⚙️ (settings) → Fill in form → 💾 Save
   ```

---

## Features

### Chat Panel ✅
- 134 slash commands with autocomplete
- Real-time command filtering
- Message history with markdown rendering
- Bold text: `**bold**`
- Inline code: `` `code` ``
- Code blocks: ` ```bash ... ``` `

### Prompts Available
Type `/` to see all 134 commands including:
- `/review` — Code review
- `/inline-review` — Inline review suggestions
- `/explain` — Explain code
- `/refactor` — Refactor code
- `/test` — Generate tests
- And 129 more...

### Settings Integration
- Config path validation
- Model selection (3 Claude versions)
- API key testing (verifies connectivity)
- Temperature tuning
- All settings saved to VS Code global config

### Auto-Features
- ✅ Auto-reload prompts on config change
- ✅ Auto-reload prompts on settings save
- ✅ Auto-reload when opening chat panel
- ✅ Auto-resize textarea as you type
- ✅ Auto-scroll to latest message

---

## Troubleshooting

### Chat shows "0 commands"
**Solution:** Settings panel → Set config path → Save settings

**Example path:** `s:/Code101/PowerPlay/config.yaml`

### Settings not saving
**Possible causes:**
- Invalid config path (file doesn't exist)
- API key format wrong (should be `sk-ant-...`)

**Solution:** 
1. Click "Test Connection" to verify API key
2. Check config path exists
3. Try "Save Settings" again

### Extension not showing in Activity Bar
**Solution:** 
1. Close VS Code completely
2. Wait 3 seconds
3. Reopen VS Code
4. Wait 15 seconds for extension activation

### Chat panel slow to open
**Solution:** Settings panel loads on first open. Subsequent opens are instant. This is normal.

---

## Configuration Example

```yaml
# config.yaml
prompts:
  - command: /review
    description: Conduct a comprehensive code review
    prompt: "Review this code for quality..."
  
  - command: /explain
    description: Explain what this code does
    prompt: "Explain this code clearly..."

# Add your custom commands here
```

---

## Tips & Tricks

**Tip 1:** Use `/` to discover available commands
- Just type `/` and scroll through the list

**Tip 2:** Settings are saved globally, not per-workspace
- Configure once, use everywhere in VS Code

**Tip 3:** Chat history is preserved within the session
- Clear with ↺ button if needed
- History is cleared on panel close

**Tip 4:** Test your API key before closing settings
- Use 🔗 Test Connection button
- Shows latency to Anthropic API

**Tip 5:** Temperature affects command output
- Set to 0.7 for balanced responses
- Set lower for code/technical output
- Set higher for creative writing

---

## Support & Links

| Resource | Link |
|----------|------|
| GitHub Repository | https://github.com/S2Sys/PowerPlay |
| Releases | https://github.com/S2Sys/PowerPlay/releases |
| Installation Guide | See: `UNINSTALL-REINSTALL-GUIDE.md` |
| Detailed Documentation | See: `SESSION-DELIVERY-v2.0.0-CHAT-PANEL.md` |

---

## Version Info

**PowerPlay v2.0.0**
- Chat Panel with Slash Commands ✅
- Settings Panel (Inside Chat) ✅
- Sidebar with 134 Prompts ✅
- Quick Pick (Alt+P) ✅
- Status Bar Integration ✅
- Config Auto-Reload ✅

**Last Updated:** April 11, 2026
**Status:** Production Ready
