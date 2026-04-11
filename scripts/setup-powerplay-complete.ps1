# PowerPlay v2.0.0 - Set OpenRouter API Key Only (PowerShell)
# Simple script to set and validate OPENROUTER_API_KEY environment variable
# Run as Administrator!

# Color assignments
$SuccessColor = "Green"
$WarningColor = "Yellow"
$ErrorColor = "Red"
$InfoColor = "Cyan"

Write-Host ""
Write-Host "======================================================" -ForegroundColor $InfoColor
Write-Host "   PowerPlay - Set OpenRouter API Key" -ForegroundColor $InfoColor
Write-Host "======================================================" -ForegroundColor $InfoColor
Write-Host ""

# Check if already set
if ($env:OPENROUTER_API_KEY) {
    Write-Host "[OK] OPENROUTER_API_KEY is already set!" -ForegroundColor $SuccessColor
    Write-Host ""
    $keyLength = $env:OPENROUTER_API_KEY.Length
    $charsToShow = if ($keyLength -gt 20) { 20 } else { $keyLength }
    $firstChars = $env:OPENROUTER_API_KEY.Substring(0, $charsToShow)
    $msg = "Current value (first $charsToShow chars): $firstChars..."
    Write-Host $msg -ForegroundColor "Gray"
    Write-Host ""

    $changeKey = Read-Host "Change it - answer Y or N"
    if ($changeKey -ne "Y" -and $changeKey -ne "y") {
        Write-Host ""
        Write-Host "[OK] Keeping current API key." -ForegroundColor $SuccessColor
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 0
    }
}

# Open OpenRouter website
Write-Host "Opening https://openrouter.ai/keys..." -ForegroundColor $InfoColor
Write-Host ""
Write-Host "Instructions:" -ForegroundColor $InfoColor
Write-Host "  1. Sign up - free, no credit card needed" -ForegroundColor $InfoColor
Write-Host "  2. Copy your API key - starts with sk-or-v1-" -ForegroundColor $InfoColor
Write-Host ""

Start-Process "https://openrouter.ai/keys"
Start-Sleep -Seconds 2

# Get API key from user
Write-Host "Waiting for you to copy your API key..." -ForegroundColor $WarningColor
Write-Host ""
$apiKey = Read-Host "Paste your OpenRouter API key"

# Validate
if (-not $apiKey -or $apiKey -eq "") {
    Write-Host ""
    Write-Host "[ERROR] API key is empty!" -ForegroundColor $ErrorColor
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not $apiKey.StartsWith("sk-or-v1-")) {
    Write-Host ""
    Write-Host "[WARNING] API key does not start with 'sk-or-v1-'" -ForegroundColor $WarningColor
    Write-Host "Double-check you copied it correctly from OpenRouter." -ForegroundColor $WarningColor
    Write-Host ""
}

# Set environment variable
Write-Host ""
Write-Host "Setting OPENROUTER_API_KEY..." -ForegroundColor $InfoColor

try {
    [Environment]::SetEnvironmentVariable("OPENROUTER_API_KEY", $apiKey, "User")
    $env:OPENROUTER_API_KEY = $apiKey
    Write-Host "[OK] Environment variable set!" -ForegroundColor $SuccessColor
} catch {
    Write-Host "[ERROR] Failed to set environment variable!" -ForegroundColor $ErrorColor
    Write-Host "Error: $_" -ForegroundColor $ErrorColor
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Verify it's set
Write-Host ""
Write-Host "Verifying..." -ForegroundColor $InfoColor
Write-Host ""

if ($env:OPENROUTER_API_KEY) {
    Write-Host "[OK] OPENROUTER_API_KEY is set!" -ForegroundColor $SuccessColor
    $keyLength = $env:OPENROUTER_API_KEY.Length
    $charsToShow = if ($keyLength -gt 20) { 20 } else { $keyLength }
    $firstChars = $env:OPENROUTER_API_KEY.Substring(0, $charsToShow)
    $msg = "First $charsToShow characters: $firstChars..."
    Write-Host $msg -ForegroundColor "Gray"
} else {
    Write-Host "[ERROR] API key not found in environment!" -ForegroundColor $ErrorColor
}

Write-Host ""
Write-Host "Done! Your API key is saved permanently." -ForegroundColor $SuccessColor
Write-Host ""
Write-Host "Next steps:" -ForegroundColor $InfoColor
Write-Host "  1. Close VS Code completely" -ForegroundColor $InfoColor
Write-Host "  2. Wait 3 seconds" -ForegroundColor $InfoColor
Write-Host "  3. Reopen VS Code" -ForegroundColor $InfoColor
Write-Host "  4. Open Continue chat: Ctrl+Shift+Space" -ForegroundColor $InfoColor
Write-Host "  5. Should work with cloud models now!" -ForegroundColor $InfoColor
Write-Host ""

Read-Host "Press Enter to exit"
