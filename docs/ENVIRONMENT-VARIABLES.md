# Environment Variables Setup Guide

**Problem**: API keys in `config.yaml` use `${DHONI_API_KEY}` and `${OPENROUTER_API_KEY}` but Continue.dev doesn't pick them up.

**Root Cause**: Environment variables must be set BEFORE Continue.dev starts reading the config, and Continue.dev must be restarted to load new env vars.

---

## ⚡ Quick Fix

### Option 1: Use Setup Script (Recommended) ✅

```powershell
cd s:\Code101\PowerPlay
.\setup-powerplay.ps1
```

Then:
1. **Close VS Code completely** (all windows)
2. **Wait 5 seconds**
3. **Reopen VS Code**
4. **Test**: In Continue.dev, type `/` → should show commands with no errors

---

### Option 2: Manual Environment Variable Setup

1. **Open PowerShell as Administrator**
2. **Run these commands**:

```powershell
# Set DHONI_API_KEY (local GPU server)
[System.Environment]::SetEnvironmentVariable("DHONI_API_KEY", "V4B50HJ-EN143DP-G5S71ZN-G5WM267", "User")

# Set KAPIL_API_KEY (alternate GPU server)
[System.Environment]::SetEnvironmentVariable("KAPIL_API_KEY", "V4B50HJ-EN143DP-G5S71ZN-G5WM267", "User")

# Set OPENROUTER_API_KEY (cloud fallback)
[System.Environment]::SetEnvironmentVariable("OPENROUTER_API_KEY", "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", "User")
```

3. **Close PowerShell**
4. **Close VS Code completely**
5. **Wait 5 seconds**
6. **Reopen VS Code**

---

### Option 3: Verify Variables Are Set

**Check if variables exist**:

```powershell
# In PowerShell
$env:DHONI_API_KEY
$env:OPENROUTER_API_KEY

# Should output the key value (not empty)
```

**If empty**, run Option 2 above.

---

## Why This Happens

### The Issue: Environment Variable Resolution Timeline

```
Timeline:
├─ T=0:00  → Run setup script
│          → SetEnvironmentVariable() called (sets USER scope vars)
│          → Prints "✅ Variables set"
│          → BUT: VS Code is still running with OLD environment
├─ T=0:05  → You open config.yaml
│          → Continue.dev reads "${DHONI_API_KEY}"
│          → Tries to resolve from VS Code's environment
│          → VS Code is still using OLD environment (from startup)
│          → Variables appear "empty" to Continue.dev
└─ Solution: CLOSE and REOPEN VS Code completely
             → VS Code restarts with NEW environment
             → Continue.dev reads variables correctly
```

### The Fix: Restart VS Code

When you set environment variables with `SetEnvironmentVariable()`, **Windows stores them permanently** in the registry:
- `HKEY_CURRENT_USER\Environment\{KEY_NAME}`

But **VS Code only reads environment at startup**. So you must:

1. ✅ Run setup script (sets env vars in registry)
2. ✅ **Close VS Code completely** (releases old environment)
3. ✅ **Reopen VS Code** (reads new environment from registry)
4. ✅ **Verify** by checking `/` command in Continue.dev

---

## How Continue.dev Resolves Variables

### Correct Path (What Should Happen)

```yaml
# In config.yaml
- name: Qwen 3.5 9B
  apiKey: ${DHONI_API_KEY}
```

```
Continue.dev startup:
1. Reads config.yaml
2. Sees ${DHONI_API_KEY}
3. Resolves from VS Code's environment variables
4. Retrieves value from Windows registry
5. Uses actual key for API calls
```

### Broken Path (What Happens If VS Code Not Restarted)

```
If VS Code NOT restarted after setting env vars:
1. Reads config.yaml
2. Sees ${DHONI_API_KEY}
3. Tries to resolve from VS Code's environment
4. VS Code STILL has old environment (from before env vars were set)
5. Variable resolves to EMPTY STRING ""
6. API calls fail with "empty API key"
```

---

## Verification

### Test That Variables Are Working

After restarting VS Code, test each model:

**In Continue.dev chat (Ctrl+L)**:

```
Test 1: /review (uses default chat model)
Expected: Response appears without "API key" errors
If fails: Variables may not be loaded

Test 2: Select "Qwen 3.5 9B [Local Chat]" model
Expected: Chat works, DHONI_API_KEY is working
If fails: DHONI_API_KEY not set

Test 3: Select "GPT OSS 120B [Cloud]" model
Expected: Chat works, OPENROUTER_API_KEY is working
If fails: OPENROUTER_API_KEY not set
```

### Check Registry (Advanced)

```powershell
# View all user environment variables in registry
Get-Item -Path 'HKCU:\Environment' | ForEach-Object { $_.GetValueNames() | ForEach-Object { Write-Host "$_`: $(Get-ItemProperty -Path 'HKCU:\Environment' -Name $_).$_" } }

# Check specific variable
Get-ItemProperty -Path 'HKCU:\Environment' -Name DHONI_API_KEY
```

---

## Troubleshooting

### Problem: "Empty API key" error

**Checklist**:
- [ ] Did you run `setup-powerplay.ps1`?
- [ ] Did you **close VS Code completely** after running script?
- [ ] Did you **wait 5+ seconds**?
- [ ] Did you **reopen VS Code**?
- [ ] Is environment variable in registry?
  ```powershell
  Get-ItemProperty -Path 'HKCU:\Environment' -Name DHONI_API_KEY
  # Should show the actual key value, not empty
  ```

**Solution**: 
1. Close VS Code
2. Rerun setup script
3. Wait 10 seconds (not 5)
4. Reopen VS Code
5. Test again

---

### Problem: "Failed to connect to Git/Continue Docs" (Different Issue)

**This is NOT an API key problem.** See [FIX-MCP-ERRORS.md](FIX-MCP-ERRORS.md) instead.

---

## Best Practices

### ✅ DO:
- Run setup script **once** per machine
- **Close VS Code completely** after setup (not just tab close)
- **Wait 5+ seconds** before reopening
- Use setup script if available (handles all steps)

### ❌ DON'T:
- Hardcode API keys in config.yaml (security risk)
- Set variables without restarting VS Code
- Try to use config without setting variables first
- Copy config.yaml to other machines without running setup script

---

## Environment Variables Reference

| Variable | Usage | Value | Scope |
|----------|-------|-------|-------|
| `DHONI_API_KEY` | Local Qwen/DeepSeek (http://rohit:4000) | `V4B50HJ-EN143DP-...` | User |
| `KAPIL_API_KEY` | Alternate GPU server | `V4B50HJ-EN143DP-...` | User |
| `OPENROUTER_API_KEY` | Cloud fallback (OpenRouter) | `sk-or-v1-43ae7cba...` | User |

**Scope: User** = Applies to current Windows user, persists across restarts

---

## References

- [setup-powerplay.ps1](../../setup-powerplay.ps1) — Automated setup
- [MCP-SERVERS-SETUP.md](MCP-SERVERS-SETUP.md) — MCP server configuration
- [FIX-MCP-ERRORS.md](FIX-MCP-ERRORS.md) — Fix "Failed to connect" errors
- [Continue.dev Documentation](https://docs.continue.dev) — Official Continue docs

---

**Still not working?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

