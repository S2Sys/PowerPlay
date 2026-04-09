# MCP Servers Setup Guide

**Last Updated**: 2026-04-09  
**PowerPlay Version**: v2.7.0

---

## Overview

PowerPlay includes 5 Model Context Protocol (MCP) servers that provide AI agents with autonomous tool access:

| Server | Purpose | Type |
|--------|---------|------|
| **Git** | Read logs, diffs, blame, branches | stdio (npx) |
| **FileSystem** | Read/write/create files autonomously | stdio (npx) |
| **Continue Docs** | Search Continue.dev documentation | stdio (npx) |
| **SQLite Dev DB** | Query local development databases | stdio (npx) |
| **Playwright Browser** | Browser automation: scrape, test, fill forms | stdio (npx) |

---

## ⚠️ Common Issues & Solutions

### **Issue: "Failed to connect to [Server Name]"**

This means the MCP server failed to start. The most common causes are:

1. **Node.js/npm not installed**
2. **npm packages not installed globally**
3. **Continue.dev cache is stale**
4. **Package permission issues**

---

## ✅ Solution 1: Install Node.js (If Not Already Done)

### Check if Node.js is installed:
```powershell
node --version
npm --version
```

Expected output:
```
v24.14.0 (or later)
11.9.0 (or later)
```

### If not installed:
1. Download from https://nodejs.org (LTS version)
2. Install with default settings
3. Restart PowerShell/Command Prompt
4. Verify: `node --version`

---

## ✅ Solution 2: Install MCP Server Packages

Run this in PowerShell (no admin required):

```powershell
# Install core MCP servers globally
npm install -g @modelcontextprotocol/server-git
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @continuedev/continue-docs-mcp
npm install -g mcp-sqlite
npm install -g @modelcontextprotocol/server-playwright

# Verify installation
npm list -g @modelcontextprotocol/server-git
```

Expected output shows installed version paths.

---

## ✅ Solution 3: Clear Continue.dev Cache

**This is the most effective fix:**

### Option A: PowerPlay Setup Script
1. Run `setup-powerplay.bat` (or `.ps1`)
2. Select `[C] Clear Continue.dev cache`
3. Restart VS Code completely

### Option B: Manual Cache Clear

```powershell
# Clear cache manually
$cachePath = "$env:APPDATA\Continue\index"
if (Test-Path $cachePath) {
    Remove-Item $cachePath -Recurse -Force
    Write-Host "✅ Cache cleared"
}
```

Then:
1. **Close VS Code completely** (all windows)
2. Wait 5 seconds
3. **Reopen VS Code**

---

## ✅ Solution 4: Update config.yaml

Ensure your config.yaml has the correct MCP server entries. They should look like this:

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

  - name: SQLite Dev DB
    type: stdio
    command: npx
    args: ["-y", "mcp-sqlite", "./dev.db"]

  - name: Playwright Browser
    type: stdio
    command: npx
    args: ["-y", "@modelcontextprotocol/server-playwright"]
```

Your current config.yaml already has this. Just verify it's been copied to:
```
C:\Users\[YourUsername]\AppData\Roaming\Continue\config.yaml
```

---

## 🔧 Troubleshooting Steps (In Order)

### Step 1: Verify Node.js
```powershell
node --version
npm --version
```
✅ Should show versions v24+ and 11+

### Step 2: Verify npm packages installed
```powershell
npm list -g @modelcontextprotocol/server-git
npm list -g @modelcontextprotocol/server-filesystem
```
✅ Should show paths, not errors

### Step 3: Verify PowerPlay config copied
```powershell
cat "$env:APPDATA\Continue\config.yaml" | Select-String "mcpServers" -A 20
```
✅ Should show the mcpServers section

### Step 4: Clear cache and restart
```powershell
$cachePath = "$env:APPDATA\Continue\index"
if (Test-Path $cachePath) {
    Remove-Item $cachePath -Recurse -Force
}
```
Then close and reopen VS Code completely.

### Step 5: Check Continue.dev version
In VS Code:
- Open Continue settings (gear icon)
- Check "About" tab
- Should be v0.8.0 or later

---

## 📋 Complete Setup Checklist

- [ ] Node.js v24+ installed (`node --version`)
- [ ] npm v11+ installed (`npm --version`)
- [ ] MCP packages installed globally:
  - [ ] `npm list -g @modelcontextprotocol/server-git`
  - [ ] `npm list -g @modelcontextprotocol/server-filesystem`
  - [ ] `npm list -g @continuedev/continue-docs-mcp`
  - [ ] `npm list -g mcp-sqlite`
  - [ ] `npm list -g @modelcontextprotocol/server-playwright`
- [ ] PowerPlay config.yaml copied to `%APPDATA%\Continue\config.yaml`
- [ ] Continue.dev cache cleared: `$cachePath = "$env:APPDATA\Continue\index"`
- [ ] VS Code closed completely and reopened
- [ ] Continue.dev chat tested (type `/` to see prompts)

---

## ✨ Testing MCP Servers

After setup, test each server:

### Test Git Server
```
Chat: @git what are the last 5 commits?
Expected: Agent reads git log and responds with recent commits
```

### Test FileSystem Server
```
Chat: @file read docs/README.md
Expected: Agent reads and displays file content
```

### Test Continue Docs
```
Chat: How do I use @mentions in Continue.dev?
Expected: Agent searches Continue documentation and responds
```

### Test Playwright Browser
```
Chat: /explain-deep using Playwright, explain what you see at https://continue.dev
Expected: Agent opens browser, navigates, analyzes page
```

### Test SQLite Dev DB
```
Chat: @db show me the schema of the dev database
Expected: Agent queries SQLite and shows schema (if dev.db exists)
```

---

## 🆘 If MCP Servers Still Won't Connect

### Option 1: Disable MCP Servers Temporarily
Edit `config.yaml` and comment out the `mcpServers` section:

```yaml
# mcpServers:
#   - name: Git
#     ...
```

Then restart VS Code. Core functionality will work without MCP.

### Option 2: File a GitHub Issue
If steps above don't work, file an issue with:
- `node --version` output
- `npm list -g | grep mcp` output
- PowerPlay version: `2.7.0`
- OS: Windows 11

https://github.com/SmartWorkz-Dev/PowerPlay/issues

### Option 3: Manual npx Installation Test
```powershell
# Test if npx can run the packages directly
npx -y @modelcontextprotocol/server-git --help
npx -y @modelcontextprotocol/server-filesystem --help
```

If these fail, it's an npm/Node.js issue, not PowerPlay.

---

## 📚 Related Documentation

- [SETUP-ENVIRONMENT.md](./SETUP-ENVIRONMENT.md) — Main setup guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — General troubleshooting
- [../README.md](../../README.md) — Feature overview

---

**Questions or issues?**  
→ Check [Troubleshooting Guide](./TROUBLESHOOTING.md)  
→ Open [GitHub Issue](https://github.com/SmartWorkz-Dev/PowerPlay/issues)  
→ Join [GitHub Discussions](https://github.com/SmartWorkz-Dev/PowerPlay/discussions)
