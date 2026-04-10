# PowerPlay Environment Setup Guide

**Version**: 2.6.0  
**Platform**: Windows (PowerShell)  
**Purpose**: Set up API keys and Continue.dev configuration

---

## ⚙️ Step 1: Set Environment Variables (PowerShell)

### Option A: Use Setup Script (Recommended)

**Download & Run**:
```powershell
# Run PowerShell as Administrator
# Copy and paste this entire block:

$keys = @{
    DHONI_API_KEY       = "V4B50HJ-EN143DP-G5S71ZN-G5WM267"
    KAPIL_API_KEY       = "V4B50HJ-EN143DP-G5S71ZN-G5WM267"
    OPENROUTER_API_KEY  = "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"
}

foreach ($key in $keys.GetEnumerator()) {
    [System.Environment]::SetEnvironmentVariable($key.Name, $key.Value, "User")
    Write-Host "✅ Set $($key.Name)" -ForegroundColor Green
}

Write-Host "`n✅ All environment variables set!" -ForegroundColor Green
Write-Host "Restart VS Code for changes to take effect" -ForegroundColor Yellow
```

### Option B: Manual (One at a time)

**Set DHONI_API_KEY**:
```powershell
[System.Environment]::SetEnvironmentVariable("DHONI_API_KEY", "V4B50HJ-EN143DP-G5S71ZN-G5WM267", "User")
```

**Set KAPIL_API_KEY**:
```powershell
[System.Environment]::SetEnvironmentVariable("KAPIL_API_KEY", "V4B50HJ-EN143DP-G5S71ZN-G5WM267", "User")
```

**Set OPENROUTER_API_KEY**:
```powershell
[System.Environment]::SetEnvironmentVariable("OPENROUTER_API_KEY", "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", "User")
```

---

## ⚙️ Step 2: Verify Environment Variables

**Check all are set**:
```powershell
Write-Host "DHONI_API_KEY: $env:DHONI_API_KEY"
Write-Host "KAPIL_API_KEY: $env:KAPIL_API_KEY"
Write-Host "OPENROUTER_API_KEY: $env:OPENROUTER_API_KEY"
```

**Expected Output**:
```
DHONI_API_KEY: V4B50HJ-EN143DP-G5S71ZN-G5WM267
KAPIL_API_KEY: V4B50HJ-EN143DP-G5S71ZN-G5WM267
OPENROUTER_API_KEY: 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
```

---

## 📋 Step 3: Copy PowerPlay Config to Continue.dev

**Option A: PowerShell Script (Recommended)**:
```powershell
# Copy config to Continue.dev
$sourcePath = "s:\Code101\PowerPlay\config.yaml"
$destPath = "$env:APPDATA\Continue\config.yaml"

if (Test-Path $sourcePath) {
    Copy-Item -Path $sourcePath -Destination $destPath -Force
    Write-Host "✅ Config copied to $destPath" -ForegroundColor Green
} else {
    Write-Host "❌ Source config not found at $sourcePath" -ForegroundColor Red
}
```

**Option B: Manual Copy**:
1. Open `s:\Code101\PowerPlay\config.yaml`
2. Copy it
3. Navigate to `%APPDATA%\Continue\` (paste in address bar)
4. Paste as `config.yaml`

**Option C: Command Line**:
```powershell
Copy-Item "s:\Code101\PowerPlay\config.yaml" "$env:APPDATA\Continue\config.yaml" -Force
```

---

## 📋 Step 4: Version-Specific Config Setup

**To use a specific version**:

```powershell
# Use v2.4.0
Copy-Item "s:\Code101\PowerPlay\config\versions\config-v2.4.0.yaml" "$env:APPDATA\Continue\config.yaml" -Force

# Use v2.5.0
Copy-Item "s:\Code101\PowerPlay\config\versions\config-v2.5.0.yaml" "$env:APPDATA\Continue\config.yaml" -Force

# Use v2.6.0 (latest)
Copy-Item "s:\Code101\PowerPlay\config\versions\config-v2.6.0.yaml" "$env:APPDATA\Continue\config.yaml" -Force
```

---

## 🧪 Step 5: Test Setup

### Test 1: Verify Environment Variables

```powershell
Write-Host "Testing environment variables..."
$vars = @("DHONI_API_KEY", "KAPIL_API_KEY", "OPENROUTER_API_KEY")

foreach ($var in $vars) {
    $value = [System.Environment]::GetEnvironmentVariable($var, "User")
    if ($value) {
        Write-Host "✅ $var is set" -ForegroundColor Green
    } else {
        Write-Host "❌ $var is NOT set" -ForegroundColor Red
    }
}
```

### Test 2: Verify Config File

```powershell
$configPath = "$env:APPDATA\Continue\config.yaml"

if (Test-Path $configPath) {
    $content = Get-Content $configPath -Raw
    
    if ($content -match "version: 2.6.0") {
        Write-Host "✅ Config version 2.6.0 loaded" -ForegroundColor Green
    }
    
    $ruleCount = ([regex]::Matches($content, "- name:") | Measure-Object).Count
    Write-Host "✅ Config has $ruleCount rules/prompts" -ForegroundColor Green
} else {
    Write-Host "❌ Config not found at $configPath" -ForegroundColor Red
}
```

### Test 3: Continue.dev Prompts

1. **Restart VS Code completely** (close all windows)
2. **Reopen VS Code**
3. **Open Continue.dev panel** (Ctrl+L or Continue icon)
4. **Type `/` in chat** — you should see 58+ prompts
5. **Try a prompt**: `/zero-trust-design`

**Expected output**:
```
> Type / to see all commands:
/ design-component
/ design-audit
/ design-system
/ responsive-design
/ motion-design
/ data-model
/ observability-audit
/ api-contract
/ git-workflow
/ dep-update
... (and 48 more)
```

---

## 🔍 Troubleshooting

### Problem: "/ shows only generic options, not custom prompts"

**Solution 1**: Restart VS Code completely
```powershell
# Close all VS Code windows
# Wait 5 seconds
# Reopen VS Code
```

**Solution 2**: Verify config loaded correctly
```powershell
$configPath = "$env:APPDATA\Continue\config.yaml"
Get-Content $configPath | Select-String "version:" | Select-Object -First 1
# Should show: version: 2.6.0
```

**Solution 3**: Clear Continue.dev cache
```powershell
$cachePath = "$env:APPDATA\Continue"
Remove-Item "$cachePath\index" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Cache cleared. Restart VS Code."
```

### Problem: "API keys not recognized"

**Check environment variable is set**:
```powershell
$key = [System.Environment]::GetEnvironmentVariable("OPENROUTER_API_KEY", "User")
Write-Host "Key is: $key"
```

**If empty**: Run the PowerShell command again (Step 1)

### Problem: "Config.yaml syntax error"

**Validate YAML**:
```powershell
# Check for duplicate entries
$content = Get-Content "$env:APPDATA\Continue\config.yaml"
$lineCount = ($content | Measure-Object -Line).Lines
Write-Host "Config has $lineCount lines"

# Look for errors
$content | Select-String "ERROR" -ErrorAction SilentlyContinue
```

---

## 📊 Complete Setup Checklist

- [ ] PowerShell Run as Administrator
- [ ] Set DHONI_API_KEY environment variable
- [ ] Set KAPIL_API_KEY environment variable
- [ ] Set OPENROUTER_API_KEY environment variable
- [ ] Verify all 3 environment variables are set
- [ ] Copy PowerPlay config to `%APPDATA%\Continue\config.yaml`
- [ ] Restart VS Code completely (close all windows)
- [ ] Reopen VS Code
- [ ] Open Continue.dev panel
- [ ] Type `/` and verify 58+ prompts appear
- [ ] Test one prompt (e.g., `/zero-trust-design`)
- [ ] All tests passing ✅

---

## 🎯 Next Steps

Once setup is complete:

1. **Read documentation**:
   ```
   docs/RELEASES_v2.5.0_v2.6.0.md
   docs/guides/v2.5.0-SECURITY-COMPLIANCE.md
   docs/guides/v2.6.0-INTEGRATION-APIs.md
   ```

2. **Try prompts**:
   - `/zero-trust-design` — Design zero-trust system
   - `/compliance-audit` — Audit compliance
   - `/event-driven-design` — Design event-driven architecture
   - `/api-composition` — Design API gateway

3. **Explore rules**:
   - `.continue/rules/zero-trust-security.md`
   - `.continue/rules/event-driven-architecture.md`
   - (and 40+ others)

---

## 🆘 Support

**Issue persists?**
1. Check logs: `$env:APPDATA\Continue\logs\`
2. Check config: `Get-Content "$env:APPDATA\Continue\config.yaml" | Select -First 30`
3. GitHub Issues: https://github.com/SmartWorkz-Dev/PowerPlay/issues

---

**Version**: 2.6.0  
**Last Updated**: 2026-04-09  
**Author**: SmartWorkz Dev
