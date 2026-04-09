# PowerPlay Troubleshooting Guide

**Version**: 2.6.0  
**Common Issues**: Setup, prompts, configuration

---

## 🔴 Issue: "/" Shows Only Generic Options, Not PowerPlay Prompts

### Symptoms
- Type `/` in Continue.dev chat
- See generic options (like "clear", "edit") but NOT custom prompts
- Don't see: `/zero-trust-design`, `/compliance-audit`, `/event-driven-design`, etc.

### Root Cause
Continue.dev didn't fully reload the new configuration after setup.

### Solution 1: Force Full Restart ✅ (Most Common Fix)

```powershell
# PowerShell
# 1. Close VS Code COMPLETELY (all windows)
Get-Process code -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Wait 5 seconds
Start-Sleep -Seconds 5

# 3. Reopen VS Code
& "code"
```

**Manual way**:
1. Click VS Code close button (X)
2. Make sure NO VS Code windows are open
3. Wait 5 seconds
4. Double-click VS Code shortcut or run `code` from terminal
5. Open Continue.dev panel (Ctrl+L)
6. Type `/` → Should now show 58+ prompts

### Solution 2: Clear Continue.dev Cache

```powershell
# Close VS Code first
Get-Process code -ErrorAction SilentlyContinue | Stop-Process -Force

# Clear cache
$cachePath = "$env:APPDATA\Continue\index"
if (Test-Path $cachePath) {
    Remove-Item $cachePath -Recurse -Force
    Write-Host "✅ Cache cleared"
}

# Restart VS Code
& "code"
```

### Solution 3: Verify Config File

```powershell
# Check config exists and has correct version
$config = "$env:APPDATA\Continue\config.yaml"

# Show first 10 lines
Get-Content $config -TotalCount 10

# Should show:
# name: SmartWorkz PowerPlay — Maximum Config
# version: 2.6.0
# schema: v1
```

**If missing or wrong version**:
```powershell
# Copy latest config
Copy-Item "s:\Code101\PowerPlay\config.yaml" "$env:APPDATA\Continue\config.yaml" -Force
Write-Host "✅ Config updated"
```

### Solution 4: Verify Environment Variables

```powershell
# Check API keys are set
$vars = @("DHONI_API_KEY", "KAPIL_API_KEY", "OPENROUTER_API_KEY")
foreach ($var in $vars) {
    $value = [System.Environment]::GetEnvironmentVariable($var, "User")
    if ($value) {
        Write-Host "✅ $var is set"
    } else {
        Write-Host "❌ $var is MISSING"
    }
}
```

**If any are missing**:
```powershell
# Run setup script
.\setup-powerplay.ps1
```

---

## 🔴 Issue: "Config.yaml not found" or "Invalid YAML"

### Solution

```powershell
# Verify source config exists
$sourcePath = "s:\Code101\PowerPlay\config.yaml"
if (Test-Path $sourcePath) {
    Write-Host "✅ Source config found"
    
    # Copy to Continue
    $destPath = "$env:APPDATA\Continue\config.yaml"
    Copy-Item $sourcePath $destPath -Force
    Write-Host "✅ Copied to $destPath"
} else {
    Write-Host "❌ Source not found: $sourcePath"
}
```

---

## 🔴 Issue: "API Keys Not Working"

### Symptoms
- Continue.dev throws authentication error
- "Invalid API key" or "Unauthorized"

### Solution

```powershell
# Verify keys are set
[System.Environment]::GetEnvironmentVariable("OPENROUTER_API_KEY", "User")
# Should show: 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

# If empty, set them:
[System.Environment]::SetEnvironmentVariable("OPENROUTER_API_KEY", "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", "User")

# Restart VS Code
Get-Process code -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
& "code"
```

---

## 🔴 Issue: "Prompts Show But Don't Work"

### Symptoms
- Type `/zero-trust-design` → prompt loads
- But chat shows error or no response

### Solution 1: Check Model Configuration

```powershell
# View which models are configured
$config = Get-Content "$env:APPDATA\Continue\config.yaml" -Raw
if ($config -match "models:") {
    Write-Host "✅ Models configured"
} else {
    Write-Host "❌ No models found in config"
}
```

### Solution 2: Test with Simple Prompt

```
Try: /review

If that works, custom prompts should also work.
```

### Solution 3: Rebuild Config

```powershell
# Use latest config version
Copy-Item "s:\Code101\PowerPlay\config\versions\config-v2.6.0.yaml" "$env:APPDATA\Continue\config.yaml" -Force

# Restart
Get-Process code | Stop-Process -Force
Start-Sleep -Seconds 2
& "code"
```

---

## 🟡 Issue: "PowerPlay Prompts Are Slow"

### Cause
Large configuration file, slow API

### Solution

```powershell
# Use specific version (smaller file size if available)
Copy-Item "s:\Code101\PowerPlay\config\versions\config-v2.4.0.yaml" "$env:APPDATA\Continue\config.yaml" -Force

# Or configure fewer models in config.yaml (optional)
```

---

## 🟡 Issue: "Only See Some Prompts (Not All 58)"

### Cause
Config not fully loaded

### Solution

```powershell
# Clear all Continue.dev cache
$continuePath = "$env:APPDATA\Continue"
Remove-Item "$continuePath\index" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$continuePath\dev_data" -Recurse -Force -ErrorAction SilentlyContinue

# Restart
Get-Process code | Stop-Process -Force
Start-Sleep -Seconds 5
& "code"

# Wait 10 seconds for Continue to rebuild cache
# Then check: type "/" and count prompts
```

---

## 📋 Diagnostic Checklist

Run this to diagnose issues:

```powershell
Write-Host "PowerPlay Diagnostic Checklist`n" -ForegroundColor Cyan

# 1. Check config file
$configPath = "$env:APPDATA\Continue\config.yaml"
if (Test-Path $configPath) {
    Write-Host "✅ Config file exists" -ForegroundColor Green
    $version = (Get-Content $configPath | Select-String "version:") -match "v\d+\.\d+\.\d+"
    Write-Host "   Version: $(($version | Select-String -Pattern '\d+\.\d+\.\d+').Matches.Value)" -ForegroundColor Gray
} else {
    Write-Host "❌ Config file missing: $configPath" -ForegroundColor Red
}

# 2. Check environment variables
Write-Host "`n✅ Checking environment variables..." -ForegroundColor Yellow
$vars = @("DHONI_API_KEY", "KAPIL_API_KEY", "OPENROUTER_API_KEY")
$varCount = 0
foreach ($var in $vars) {
    $value = [System.Environment]::GetEnvironmentVariable($var, "User")
    if ($value) {
        Write-Host "   ✅ $var" -ForegroundColor Green
        $varCount++
    } else {
        Write-Host "   ❌ $var" -ForegroundColor Red
    }
}

# 3. Check Continue.dev installation
if (Get-Command code -ErrorAction SilentlyContinue) {
    Write-Host "`n✅ VS Code installed" -ForegroundColor Green
} else {
    Write-Host "`n❌ VS Code not found" -ForegroundColor Red
}

# 4. Check Continue.dev extension
$extensionsPath = "$env:APPDATA\Code\User\extensions"
if (Get-ChildItem $extensionsPath -Filter "*continue*" -ErrorAction SilentlyContinue) {
    Write-Host "✅ Continue.dev extension installed" -ForegroundColor Green
} else {
    Write-Host "❌ Continue.dev extension not installed" -ForegroundColor Red
}

# Summary
Write-Host "`nSummary:" -ForegroundColor Cyan
if (Test-Path $configPath) {
    if ($varCount -eq 3) {
        Write-Host "✅ All systems ready - Restart VS Code and test" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Missing $($3 - $varCount) environment variables" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Config file missing - Run setup-powerplay.ps1" -ForegroundColor Red
}
```

---

## 🔗 Resources

- **Setup Guide**: [SETUP-ENVIRONMENT.md](./SETUP-ENVIRONMENT.md)
- **Release Notes**: [RELEASES_v2.5.0_v2.6.0.md](./RELEASES_v2.5.0_v2.6.0.md)
- **Main README**: [README.md](./README.md)
- **GitHub Issues**: https://github.com/SmartWorkz-Dev/PowerPlay/issues

---

## 📞 Still Having Issues?

1. **Run full diagnostic**:
   ```powershell
   .\setup-powerplay.ps1
   ```

2. **Check logs**:
   ```powershell
   explorer "$env:APPDATA\Continue\logs"
   ```

3. **Report on GitHub**:
   - Include diagnostic output
   - Include VS Code version: `code --version`
   - Include Continue.dev version info

---

**Last Updated**: 2026-04-09  
**Version**: 2.6.0  
**Author**: SmartWorkz Dev
