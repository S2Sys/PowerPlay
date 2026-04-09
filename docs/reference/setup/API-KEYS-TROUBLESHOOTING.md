# API Keys Not Working? — Troubleshooting Checklist

**Symptom**: API key errors like:
- ❌ "Empty API key"
- ❌ "401 Unauthorized"
- ❌ "Invalid API key"
- ❌ Continue.dev models fail to respond

**Root Cause**: Environment variables (`${DHONI_API_KEY}`, `${OPENROUTER_API_KEY}`) not resolved.

---

## Quick Diagnosis

### Step 1: Did You Restart VS Code After Setup? ✅

**This is the #1 reason API keys don't work.**

```
❌ WRONG (API keys won't load):
1. Run setup-powerplay.ps1
2. Open VS Code
3. Try /review command
   → FAILS (VS Code has old environment)

✅ CORRECT (API keys load):
1. Run setup-powerplay.ps1
2. CLOSE VS Code completely
3. WAIT 5-10 seconds
4. REOPEN VS Code
5. Try /review command
   → WORKS (VS Code has new environment)
```

**Action**: Close ALL VS Code windows. Wait 10 seconds. Reopen. Test again.

---

### Step 2: Are Environment Variables Set?

**In PowerShell**, check if variables exist:

```powershell
# Check each variable
$env:DHONI_API_KEY
$env:OPENROUTER_API_KEY
$env:KAPIL_API_KEY

# If they print a long string → ✅ SET
# If they print nothing (blank) → ❌ NOT SET
```

**If blank**: Run setup script again as Administrator:

```powershell
cd s:\Code101\PowerPlay
.\setup-powerplay.ps1
```

---

### Step 3: Verify in Registry (Advanced)

**Windows stores env vars here after setup script:**

```powershell
# View all user environment variables
Get-Item -Path 'HKCU:\Environment' | Select-Object -ExpandProperty Property

# Check specific variable
(Get-Item -Path 'HKCU:\Environment').GetValue('DHONI_API_KEY')

# Should output the actual key (not empty)
```

**If empty in registry**: Setup script failed. Run again as Administrator.

---

## Detailed Troubleshooting by Scenario

### Scenario A: "Empty API key" Error

**This means**: Variable `${DHONI_API_KEY}` resolved to empty string.

**Checklist**:
```
☐ Did you run setup-powerplay.ps1?
☐ Did setup script print "✅ All 3 environment variables set successfully"?
☐ Did you CLOSE VS Code completely after setup?
☐ Did you WAIT 5-10 seconds before reopening?
☐ Did you REOPEN VS Code?
☐ Does $env:DHONI_API_KEY print a value in PowerShell?
```

**If all YES**: Restart computer (full restart), then test again.

**If any NO**: Follow the step that failed.

---

### Scenario B: "401 Unauthorized" or "Invalid API key"

**This means**: Variable resolved, but API key is invalid or expired.

**Checklist**:
```
☐ Are you using the correct API key? (Check setup-powerplay.ps1 line 47-49)
☐ Is the API key expired? (OpenRouter keys don't expire, but check your account)
☐ Is the API endpoint reachable?
  • DHONI_API_KEY → http://rohit:4000 (local GPU)
  • OPENROUTER_API_KEY → https://openrouter.ai (cloud)
```

**If local (DHONI_API_KEY)**:
```powershell
# Test if local GPU server is running
curl http://rohit:4000/health
# Should respond with status 200
```

**If cloud (OPENROUTER_API_KEY)**:
```powershell
# Test if OpenRouter is reachable
curl https://openrouter.ai/api/v1/models
# Should respond with list of models
```

---

### Scenario C: Models Don't Appear in Continue.dev

**This means**: Config loaded, but models may not be visible.

**Checklist**:
```
☐ Did you restart VS Code after setup?
☐ Can you type '/' in Continue.dev and see prompts?
☐ Can you select a model from the model dropdown?
☐ Is config.yaml present at: %APPDATA%\Continue\config.yaml?
```

**If config missing**: Re-run setup script and ensure it prints "✅ Config copied successfully".

---

### Scenario D: "Failed to connect to Git/Continue Docs" (Different Issue)

**This is NOT an API key problem.** See [FIX-MCP-ERRORS.md](FIX-MCP-ERRORS.md) instead.

---

## Complete Solution Path

If nothing above worked, follow this **complete reset**:

### Option 1: Full Reset (Recommended)

```powershell
# Step 1: Close VS Code completely
(close all VS Code windows)

# Step 2: Clear Continue.dev cache
$cachePath = "$env:APPDATA\Continue"
if (Test-Path $cachePath) {
    Remove-Item $cachePath -Recurse -Force
    Write-Host "Cleared: $cachePath"
}

# Step 3: Re-run setup script as Administrator
cd s:\Code101\PowerPlay
.\setup-powerplay.ps1

# Step 4: Wait and restart
Write-Host "Waiting 10 seconds..."
Start-Sleep -Seconds 10

# Step 5: Restart VS Code
& code

# Step 6: Test
# In Continue.dev: Type '/' and select /review
```

### Option 2: If Setup Script Fails

```powershell
# Step 1: Set environment variables manually
[System.Environment]::SetEnvironmentVariable("DHONI_API_KEY", "V4B50HJ-EN143DP-G5S71ZN-G5WM267", "User")
[System.Environment]::SetEnvironmentVariable("KAPIL_API_KEY", "V4B50HJ-EN143DP-G5S71ZN-G5WM267", "User")
[System.Environment]::SetEnvironmentVariable("OPENROUTER_API_KEY", "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", "User")

# Step 2: Verify in registry
Get-Item -Path 'HKCU:\Environment' | Select-Object -ExpandProperty Property

# Step 3: Close PowerShell

# Step 4: Close VS Code

# Step 5: Wait 10 seconds

# Step 6: Reopen VS Code

# Step 7: Test in Continue.dev
```

### Option 3: Full Computer Restart

If still not working after Option 1:

```
1. Close all applications
2. Restart computer
3. Reopen VS Code
4. Test Continue.dev
```

---

## Verification Checklist

Once you think it's fixed, verify:

```
☑️ Run setup-powerplay.ps1 successfully
☑️ Closed VS Code completely
☑️ Waited 5-10 seconds
☑️ Reopened VS Code
☑️ In PowerShell: $env:DHONI_API_KEY shows value (not empty)
☑️ In Continue.dev: Type '/' and see 63+ prompts
☑️ Select /review command
☑️ Chat with assistant — should work without errors
☑️ Try different models:
   • Qwen 3.5 9B (uses DHONI_API_KEY)
   • GPT OSS 120B (uses OPENROUTER_API_KEY)
☑️ No "Empty API key" or "401 Unauthorized" errors
```

If all checkmarks ✅ → **Setup complete!**

---

## Prevention: Avoid This in Future

✅ **DO:**
- Run setup script **once** per machine
- **Close VS Code completely** (not just minimize)
- **Wait 10 seconds** (not 5)
- **Reopen VS Code** fresh
- Verify `$env:DHONI_API_KEY` in PowerShell before testing

❌ **DON'T:**
- Try to use Continue.dev without restarting VS Code
- Set env vars and immediately open VS Code (timing issue)
- Skip the restart step (most common mistake)
- Assume VS Code auto-loads new env vars (it doesn't)

---

## References

- [ENVIRONMENT-VARIABLES.md](ENVIRONMENT-VARIABLES.md) — Detailed env var guide
- [setup-powerplay.ps1](../../setup-powerplay.ps1) — Setup script source
- [FIX-MCP-ERRORS.md](FIX-MCP-ERRORS.md) — Fix "Failed to connect" errors

---

## Still Stuck?

1. Read [ENVIRONMENT-VARIABLES.md](ENVIRONMENT-VARIABLES.md) completely
2. Try [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for general issues
3. Check [GitHub Issues](https://github.com/SmartWorkz-Dev/PowerPlay/issues)
4. Ask in [GitHub Discussions](https://github.com/SmartWorkz-Dev/PowerPlay/discussions)

