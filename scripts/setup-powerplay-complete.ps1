# PowerPlay v2.0.0 — Set OpenRouter API Key Only (PowerShell)
# Simple script to set and validate OPENROUTER_API_KEY environment variable
# Run as Administrator!

# ═══════════════════════════════════════════════════════════════
# Configuration (Top-Level Assignments)
# ═══════════════════════════════════════════════════════════════
$Success = "Green"
$Warning = "Yellow"
$Error = "Red"
$Info = "Cyan"

Write-Host ""
Write-Host "╔═════════════════════════════════════════════════════════════╗" -ForegroundColor $Info
Write-Host "║   PowerPlay — Set OpenRouter API Key                       ║" -ForegroundColor $Info
Write-Host "╚═════════════════════════════════════════════════════════════╝" -ForegroundColor $Info
Write-Host ""

# Check if already set
if ($env:OPENROUTER_API_KEY) {
    Write-Host "✅ OPENROUTER_API_KEY is already set!" -ForegroundColor $Success
    Write-Host ""
    $firstChars = $env:OPENROUTER_API_KEY.Substring(0, 20)
    Write-Host "   Current value (first 20 chars): $($firstChars)..." -ForegroundColor "Gray"
    Write-Host ""

    $changeKey = Read-Host "Change it? (Y/N)"
    if ($changeKey -ne "Y" -and $changeKey -ne "y") {
        Write-Host ""
        Write-Host "✅ Keeping current API key." -ForegroundColor $Success
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 0
    }
}

# Open OpenRouter website
Write-Host "Opening https://openrouter.ai/keys..." -ForegroundColor $Info
Write-Host ""
Write-Host "Instructions:" -ForegroundColor $Info
Write-Host "  1. Sign up `(free, no credit card needed`)" -ForegroundColor $Info
Write-Host "  2. Copy your API key `(starts with sk-or-v1-`)" -ForegroundColor $Info
Write-Host ""

Start-Process "https://openrouter.ai/keys"
Start-Sleep -Seconds 2

# Get API key from user
Write-Host "⏳ Waiting for you to copy your API key..." -ForegroundColor $Warning
Write-Host ""
$apiKey = Read-Host "Paste your OpenRouter API key"

# Validate
if (-not $apiKey -or $apiKey -eq "") {
    Write-Host ""
    Write-Host "❌ ERROR: API key is empty!" -ForegroundColor $Error
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not $apiKey.StartsWith("sk-or-v1-")) {
    Write-Host ""
    Write-Host "⚠️  WARNING: API key doesn't start with 'sk-or-v1-'" -ForegroundColor $Warning
    Write-Host "   Double-check you copied it correctly from OpenRouter." -ForegroundColor $Warning
    Write-Host ""
}

# Set environment variable
Write-Host ""
Write-Host "Setting OPENROUTER_API_KEY..." -ForegroundColor $Info

try {
    [Environment]::SetEnvironmentVariable("OPENROUTER_API_KEY", $apiKey, "User")
    $env:OPENROUTER_API_KEY = $apiKey
    Write-Host "✅ Environment variable set!" -ForegroundColor $Success
} catch {
    Write-Host "❌ Failed to set environment variable!" -ForegroundColor $Error
    Write-Host "   Error: $_" -ForegroundColor $Error
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Verify it's set
Write-Host ""
Write-Host "Verifying..." -ForegroundColor $Info
Write-Host ""

if ($env:OPENROUTER_API_KEY) {
    $firstChars = $env:OPENROUTER_API_KEY.Substring(0, 20)
    Write-Host "✅ OPENROUTER_API_KEY is set!" -ForegroundColor $Success
    Write-Host "   First 20 characters: $($firstChars)..." -ForegroundColor "Gray"
} else {
    Write-Host "❌ API key not found in environment!" -ForegroundColor $Error
}

Write-Host ""
Write-Host "Done! Your API key is saved permanently." -ForegroundColor $Success
Write-Host ""
Write-Host "Next steps:" -ForegroundColor $Info
Write-Host "  1. Close VS Code completely" -ForegroundColor $Info
Write-Host "  2. Wait 3 seconds" -ForegroundColor $Info
Write-Host "  3. Reopen VS Code" -ForegroundColor $Info
Write-Host "  4. Open Continue chat: Ctrl+Shift+Space" -ForegroundColor $Info
Write-Host "  5. Should work with cloud models now!" -ForegroundColor $Info
Write-Host ""

Read-Host "Press Enter to exit"
