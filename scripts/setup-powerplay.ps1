#Requires -RunAsAdministrator
<#
.SYNOPSIS
    PowerPlay Setup Script - Configure environment and Continue.dev

.DESCRIPTION
    This script:
    1. Sets execution policy (RemoteSigned)
    2. Sets environment variables (API keys)
    3. Copies PowerPlay config to Continue.dev
    4. Tests the setup

.EXAMPLE
    .\setup-powerplay.ps1
    .\setup-powerplay.ps1 -Version 2.7.0
#>

param(
    [ValidateSet("2.4.0", "2.5.0", "2.6.0", "2.7.0")]
    [string]$Version = "2.7.0",

    [switch]$SkipVSCodeRestart = $false
)

# Set execution policy (AFTER param block)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force -ErrorAction SilentlyContinue
Unblock-File -Path $PSCommandPath -ErrorAction SilentlyContinue

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  PowerPlay Setup Script v$Version        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Verify script is running as Administrator
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "⚠️  WARNING: This script should be run as Administrator" -ForegroundColor Yellow
    Write-Host "   Some features may not work properly without admin rights`n" -ForegroundColor Yellow
}

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
$totalKeys = $keys.Count

foreach ($key in $keys.GetEnumerator()) {
    try {
        if ([string]::IsNullOrWhiteSpace($key.Value)) {
            Write-Host "  ⚠️  $($key.Name) is empty - skipping" -ForegroundColor Yellow
            continue
        }

        [System.Environment]::SetEnvironmentVariable($key.Name, $key.Value, "User")
        Write-Host "  ✅ $($key.Name) = $($key.Value.Substring(0, [Math]::Min(20, $key.Value.Length)))..." -ForegroundColor Green
        $envVarsSet++
    }
    catch {
        Write-Host "  ❌ Failed to set $($key.Name): $_" -ForegroundColor Red
    }
}

Write-Host ""
if ($envVarsSet -eq $totalKeys) {
    Write-Host "  ✅ All $totalKeys environment variables set successfully`n" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Only $envVarsSet/$totalKeys environment variables set`n" -ForegroundColor Yellow
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

# Validate base path exists
if (-not (Test-Path $basePath)) {
    Write-Host "  ❌ PowerPlay path not found: $basePath" -ForegroundColor Red
    Write-Host "  ⚠️  Please ensure PowerPlay is installed at: $basePath" -ForegroundColor Yellow
    exit 1
}

$configVersion = if ($Version -eq "2.7.0") {
    "config.yaml"
} else {
    "config\versions\config-v$Version.yaml"
}

$sourcePath = Join-Path $basePath $configVersion
$destPath = Join-Path $env:APPDATA "Continue\config.yaml"

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
        $content = Get-Content $destPath -Raw -ErrorAction Stop

        # Check version
        $versionMatch = [regex]::Match($content, "version:\s+([\d.]+)")
        if ($versionMatch.Success) {
            $currentVersion = $versionMatch.Groups[1].Value
            if ($currentVersion -eq $Version) {
                Write-Host "  ✅ Config version $Version verified" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  Version mismatch - Expected $Version, got $currentVersion" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  ⚠️  Could not determine config version" -ForegroundColor Yellow
        }

        # Count rules and prompts
        $ruleMatches = [regex]::Matches($content, "^\s+-\s+name:")
        $ruleCount = $ruleMatches.Count

        if ($ruleCount -gt 0) {
            Write-Host "  ✅ Config has $ruleCount rules/prompts configured" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Could not count rules/prompts" -ForegroundColor Yellow
        }
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

Write-Host "`nSTEP 5: IMPORTANT - Restart VS Code to Load Environment Variables" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"

Write-Host "  ⚠️  CRITICAL: Close and reopen VS Code COMPLETELY" -ForegroundColor Red
Write-Host "  Environment variables are only loaded when VS Code starts." -ForegroundColor Red
Write-Host ""
Write-Host "  1. ❌ CLOSE VS Code (all windows, all instances)"
Write-Host "  2. ⏱️  WAIT 5-10 seconds"
Write-Host "  3. ✅ REOPEN VS Code fresh"
Write-Host ""
Write-Host "  Why? Environment variables are set in Windows registry." -ForegroundColor Gray
Write-Host "       VS Code only reads them at startup. If you skip restart," -ForegroundColor Gray
Write-Host "       API keys will be empty and Continue.dev will fail." -ForegroundColor Gray
Write-Host ""

Write-Host "`nSTEP 6: Continue.dev Test Instructions" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"

Write-Host "  📋 After restarting VS Code, test:" -ForegroundColor Cyan
Write-Host "  1. Open Continue.dev panel (Ctrl+L or Continue icon)"
Write-Host "  2. Type '/' in the chat input"
Write-Host "  3. You should see 63+ prompts available"
Write-Host "  4. No 'Empty API key' errors should appear"
Write-Host ""
Write-Host "  ✨ Example prompts to try:" -ForegroundColor Cyan
Write-Host "     • /zero-trust-design (v2.5.0)"
Write-Host "     • /compliance-audit (v2.5.0)"
Write-Host "     • /event-driven-design (v2.6.0)"
Write-Host "     • /api-composition (v2.6.0)"
Write-Host "     • /mobile-architecture (v2.7.0)"
Write-Host "     • /offline-sync (v2.7.0)"
Write-Host ""

# ============================================================================
# FINAL SUMMARY
# ============================================================================

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Setup Complete! ✅                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  • Environment variables: Set ✅" -ForegroundColor Green
Write-Host "  • Config file: Copied to Continue.dev ✅" -ForegroundColor Green
Write-Host "  • Version: $Version ✅" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT - You MUST do this next:" -ForegroundColor Yellow
Write-Host "  1. ❌ CLOSE VS Code completely (all windows)"
Write-Host "  2. ⏱️  WAIT 5-10 seconds (important!)"
Write-Host "  3. ✅ REOPEN VS Code (it will load environment variables)"
Write-Host ""
Write-Host "Then test:" -ForegroundColor Cyan
Write-Host "  1. Open Continue.dev (Ctrl+L)"
Write-Host "  2. Type '/' in chat"
Write-Host "  3. Select /review or any prompt"
Write-Host "  4. Should work without 'Empty API key' errors"
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
        if (-not $SkipVSCodeRestart) {
            Write-Host "Closing VS Code..." -ForegroundColor Yellow
            Get-Process code -ErrorAction SilentlyContinue | Stop-Process -Force
            Start-Sleep -Seconds 2
            Write-Host "Relaunching VS Code..." -ForegroundColor Yellow
            try {
                & code
                Write-Host "✅ VS Code relaunched successfully" -ForegroundColor Green
            }
            catch {
                Write-Host "⚠️  Could not auto-launch VS Code: $_" -ForegroundColor Yellow
                Write-Host "   Please launch VS Code manually" -ForegroundColor Yellow
            }
        }
    }
    'O' {
        Write-Host "Opening docs folder..." -ForegroundColor Yellow
        $docsPath = Join-Path $basePath "docs"
        if (Test-Path $docsPath) {
            try {
                explorer $docsPath
                Write-Host "✅ Docs folder opened" -ForegroundColor Green
            }
            catch {
                Write-Host "⚠️  Could not open docs folder: $_" -ForegroundColor Yellow
            }
        } else {
            Write-Host "⚠️  Docs folder not found at: $docsPath" -ForegroundColor Yellow
        }
    }
    'C' {
        Write-Host "Clearing Continue.dev cache..." -ForegroundColor Yellow
        $cachePath = Join-Path $env:APPDATA "Continue\index"
        if (Test-Path $cachePath) {
            try {
                Remove-Item $cachePath -Recurse -Force -ErrorAction Stop
                Write-Host "✅ Cache cleared. Restart VS Code." -ForegroundColor Green
            }
            catch {
                Write-Host "⚠️  Could not clear cache: $_" -ForegroundColor Yellow
            }
        } else {
            Write-Host "ℹ️  Cache directory not found (nothing to clear)" -ForegroundColor Cyan
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
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
