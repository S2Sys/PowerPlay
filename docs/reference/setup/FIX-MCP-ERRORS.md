# Fix "Failed to connect" MCP Errors

**Problem**: When using PowerPlay, you see errors like:
```
Failed to connect to "Git"
Failed to connect to "Continue Docs"
Failed to connect to "Playwright Browser"
```

**Root Cause**: Your config.yaml has old/broken MCP server configurations that try to install packages that don't exist.

---

## ⚡ Quick Fix (5 minutes)

### Option 1: Use Latest config.yaml (RECOMMENDED)

1. **Delete your old config**:
   ```powershell
   Remove-Item "$env:APPDATA\Continue\config.yaml"
   ```

2. **Copy the latest PowerPlay config**:
   ```powershell
   Copy-Item "s:\Code101\PowerPlay\config.yaml" "$env:APPDATA\Continue\config.yaml" -Force
   ```

3. **Restart VS Code completely**:
   - Close all windows
   - Wait 5 seconds
   - Reopen VS Code

4. **Test**: Type `/` in Continue.dev → Should show prompts with no errors ✅

---

### Option 2: Run Setup Script

```bash
cd s:\Code101\PowerPlay
setup-powerplay.bat
```

Then select:
- `[R]` to restart VS Code

---

### Option 3: Manual Config Fix

Edit `%APPDATA%\Continue\config.yaml` and find the `mcpServers:` section.

**Replace this** (OLD - broken):
```yaml
mcpServers:
  - name: Git
    type: stdio
    command: npx
    args: ["-y", "@modelcontextprotocol/server-git", "--repository", "."]

  - name: FileSystem
    type: stdio
    command: npx
    args: ["-y", "@modelcontextprotocol/server-filesystem", "."]

  - name: Continue Docs
    type: stdio
    command: npx
    args: ["-y", "@continuedev/continue-docs-mcp"]

  # ... other servers ...
```

**With this** (NEW - working):
```yaml
# MCP SERVERS
# Note: Git, FileSystem, and Playwright are built-in to Continue.dev
# No need to install separately via npm

mcpServers: []
# Built-in providers available:
# - @git (read/write git operations)
# - @filesystem (read/write files)
# - @docs (search documentation)
# - @terminal (shell commands)
# - @codebase (search codebase)
#
# Use in chat with: @provider-name
```

Then restart VS Code.

---

## ✅ After Fix: Using Built-in Providers

Once fixed, you can use these directly in Continue.dev chat:

```
@git log                          → Show recent commits
@filesystem read src/main.ts      → Read file content
@codebase search for imports      → Find code patterns
@terminal npm install             → Run commands
@file create test.js              → Create files
```

**Example conversation**:
```
User: @git what changed since last commit?
Continue: [Agent reads git diff and responds]
```

---

## 🔧 What's Different in v2.7.0+

**Before** (Old): Had external MCP server configs trying to install packages
- ❌ Packages don't exist on npm
- ❌ Installation fails
- ❌ "Failed to connect" errors

**After** (New): Uses built-in Continue.dev providers
- ✅ No installation needed
- ✅ Always available
- ✅ Works out of the box

---

## ⚠️ If Problem Persists

After trying the fixes above, if you still see errors:

1. **Clear Continue cache**:
   ```powershell
   $cachePath = "$env:APPDATA\Continue\index"
   if (Test-Path $cachePath) {
       Remove-Item $cachePath -Recurse -Force
   }
   ```

2. **Close VS Code completely** (all windows)

3. **Wait 5 seconds**

4. **Reopen VS Code**

5. **Open Continue.dev** (Ctrl+L)

6. **Test**: Type `@git log`

If still failing, check:
- VS Code version: Should be latest
- Continue.dev version: Should be 0.8.0+
- Windows: Close any other Continue instances

---

## 📚 More Help

- [MCP-SERVERS-SETUP.md](./MCP-SERVERS-SETUP.md) — Detailed MCP guide
- [SETUP-ENVIRONMENT.md](./SETUP-ENVIRONMENT.md) — Full setup guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — General troubleshooting

---

**Questions?**  
→ Check [GitHub Issues](https://github.com/SmartWorkz-Dev/PowerPlay/issues)  
→ Join [GitHub Discussions](https://github.com/SmartWorkz-Dev/PowerPlay/discussions)
