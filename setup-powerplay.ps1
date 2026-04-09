#Requires -RunAsAdministrator
<#
.SYNOPSIS
    PowerPlay Setup Script - Configure environment and Continue.dev

.DESCRIPTION
    This script:
    1. Sets environment variables (API keys)
    2. Copies PowerPlay config to Continue.dev
    3. Tests the setup

.EXAMPLE
    .\setup-powerplay.ps1
#>

param(
    [ValidateSet("2.4.0", "2.5.0", "2.6.0")]
    [string]$Version = "2.6.0"
)

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  PowerPlay Setup Script v$Version        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

# ============================================================================
# STEP 1: Set Environment Variables
# ============================================================================

Write-Host "STEP 1: Setting Environment Variables" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"

$keys = @{
    DHONI_API_KEY      = "V4B50HJ-EN143DP-G5S71ZN-G5WM267"
    KAPIL_API_KEY      = "V4B50HJ-EN143DP-G5S71ZN-G5WM267"
    OPENROUTER_API_KEY = "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"
}

$envVarsSet = 0
foreach ($key in $keys.GetEnumerator()) {
    try {
        [System.Environment]::SetEnvironmentVariable($key.Name, $key.Value, "User")
        Write-Host "  ✅ $($key.Name)" -ForegroundColor Green
        $envVarsSet++
    }
    catch {
        Write-Host "  ❌ Failed to set $($key.Name): $_" -ForegroundColor Red
    }
}

if ($envVarsSet -eq 3) {
    Write-Host "`n  ✅ All 3 environment variables set successfully`n" -ForegroundColor Green
} else {
    Write-Host "`n  ⚠️  Only $envVarsSet/3 environment variables set`n" -ForegroundColor Yellow
}

# ============================================================================
# STEP 2: Verify Environment Variables
# ============================================================================

Write-Host "STEP 2: Verifying Environment Variables" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"

$allSet = $true
foreach ($key in $keys.GetEnumerator()) {
    $value = [System.Environment]::GetEnvironmentVariable($key.Name, "User")
    if ($value) {
        Write-Host "  ✅ $($key.Name) is set" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $($key.Name) is NOT set" -ForegroundColor Red
        $allSet = $false
    }
}

if ($allSet) {
    Write-Host "`n  ✅ All environment variables verified`n" -ForegroundColor Green
} else {
    Write-Host "`n  ❌ Some environment variables are missing`n" -ForegroundColor Red
}

# ============================================================================
# STEP 3: Copy Config to Continue.dev
# ============================================================================

Write-Host "STEP 3: Copying PowerPlay Config to Continue.dev" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"

$basePath = "s:\Code101\PowerPlay"
$configVersion = if ($Version -eq "2.6.0") {
    "config.yaml"
} else {
    "config\versions\config-v$Version.yaml"
}

$sourcePath = Join-Path $basePath $configVersion
$destPath = "$env:APPDATA\Continue\config.yaml"

Write-Host "  Source: $sourcePath" -ForegroundColor Gray
Write-Host "  Destination: $destPath" -ForegroundColor Gray
Write-Host ""

if (Test-Path $sourcePath) {
    try {
        # Create destination directory if needed
        $destDir = Split-Path $destPath
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }

        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✅ Config copied successfully" -ForegroundColor Green
        Write-Host "`n  📄 Version: $Version" -ForegroundColor Cyan
    }
    catch {
        Write-Host "  ❌ Failed to copy config: $_" -ForegroundColor Red
    }
} else {
    Write-Host "  ❌ Source config not found: $sourcePath" -ForegroundColor Red
}

# ============================================================================
# STEP 4: Verify Config File
# ============================================================================

Write-Host "`nSTEP 4: Verifying Config File" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"

if (Test-Path $destPath) {
    try {
        $content = Get-Content $destPath -Raw

        # Check version
        if ($content -match "version: $Version") {
            Write-Host "  ✅ Config version $Version verified" -ForegroundColor Green
        } else {
            $currentVersion = [regex]::Match($content, "version: ([\d.]+)").Groups[1].Value
            Write-Host "  ⚠️  Version mismatch - Expected $Version, got $currentVersion" -ForegroundColor Yellow
        }

        # Count rules and prompts
        $ruleMatches = [regex]::Matches($content, "^  - name:")
        $ruleCount = $ruleMatches.Count

        Write-Host "  ✅ Config has $ruleCount rules/prompts configured" -ForegroundColor Green
    }
    catch {
        Write-Host "  ❌ Error reading config: $_" -ForegroundColor Red
    }
} else {
    Write-Host "  ❌ Config not found at: $destPath" -ForegroundColor Red
}

# ============================================================================
# STEP 5: Test Continue.dev
# ============================================================================

Write-Host "`nSTEP 5: Continue.dev Test Instructions" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"

Write-Host "  📋 Follow these steps to test:" -ForegroundColor Cyan
Write-Host "  1. Close VS Code completely (all windows)"
Write-Host "  2. Wait 5 seconds"
Write-Host "  3. Reopen VS Code"
Write-Host "  4. Open Continue.dev panel (Ctrl+L or Continue icon)"
Write-Host "  5. Type '/' in the chat input"
Write-Host "  6. You should see 58+ prompts available"
Write-Host ""
Write-Host "  ✨ Example prompts to try:" -ForegroundColor Cyan
Write-Host "     • /zero-trust-design (v2.5.0)"
Write-Host "     • /compliance-audit (v2.5.0)"
Write-Host "     • /event-driven-design (v2.6.0)"
Write-Host "     • /api-composition (v2.6.0)"
Write-Host ""

# ============================================================================
# FINAL SUMMARY
# ============================================================================

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Setup Complete! ✅                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  • Environment variables: Set ✅"
Write-Host "  • Config file: Copied to Continue.dev ✅"
Write-Host "  • Version: $Version ✅"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Restart VS Code"
Write-Host "  2. Type '/' in Continue.dev chat"
Write-Host "  3. Select a prompt to test"
Write-Host "  4. Read docs: docs/RELEASES_v2.5.0_v2.6.0.md"
Write-Host ""

# ============================================================================
# Interactive Menu (Optional)
# ============================================================================

Write-Host "Additional Options:" -ForegroundColor Yellow
Write-Host "  [R] Restart VS Code now"
Write-Host "  [O] Open docs folder"
Write-Host "  [C] Clear Continue.dev cache"
Write-Host "  [X] Exit"
Write-Host ""

$choice = Read-Host "Select option (R/O/C/X)"

switch ($choice.ToUpper()) {
    'R' {
        Write-Host "Closing VS Code..." -ForegroundColor Yellow
        Get-Process code -ErrorAction SilentlyContinue | Stop-Process -Force
        Start-Sleep -Seconds 2
        Write-Host "Relaunching VS Code..." -ForegroundColor Yellow
        & "code"
    }
    'O' {
        Write-Host "Opening docs folder..." -ForegroundColor Yellow
        explorer "s:\Code101\PowerPlay\docs"
    }
    'C' {
        Write-Host "Clearing Continue.dev cache..." -ForegroundColor Yellow
        $cachePath = "$env:APPDATA\Continue\index"
        if (Test-Path $cachePath) {
            Remove-Item $cachePath -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Cache cleared. Restart VS Code." -ForegroundColor Green
        } else {
            Write-Host "⚠️  Cache directory not found" -ForegroundColor Yellow
        }
    }
    'X' {
        Write-Host "Setup complete. Goodbye!" -ForegroundColor Green
    }
    default {
        Write-Host "Exiting..." -ForegroundColor Gray
    }
}

Write-Host ""
