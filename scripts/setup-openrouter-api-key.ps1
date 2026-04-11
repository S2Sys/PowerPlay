# PowerPlay v2.0.0 — OpenRouter API Key Setup (PowerShell)
# Automatically sets OPENROUTER_API_KEY environment variable

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              PowerPlay — OpenRouter API Key Setup                         ║" -ForegroundColor Cyan
Write-Host "║                                                                           ║" -ForegroundColor Cyan
Write-Host "║  This script will:                                                        ║" -ForegroundColor Cyan
Write-Host "║  1. Open OpenRouter website to get your API key                           ║" -ForegroundColor Cyan
Write-Host "║  2. Let you paste your API key here                                       ║" -ForegroundColor Cyan
Write-Host "║  3. Set it permanently in Windows environment                             ║" -ForegroundColor Cyan
Write-Host "║  4. Verify it's set correctly                                             ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if API key is already set
if ($env:OPENROUTER_API_KEY) {
    Write-Host "✅ OPENROUTER_API_KEY is already set!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Current value (first 20 chars): $($env:OPENROUTER_API_KEY.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
    $CHANGE = Read-Host "Do you want to change it? (Y/N)"
    if ($CHANGE -ne "Y" -and $CHANGE -ne "y") {
        Write-Host ""
        Write-Host "OK, keeping current API key." -ForegroundColor Green
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 0
    }
}

# Step 1: Open OpenRouter to get API key
Write-Host ""
Write-Host "STEP 1: Getting your OpenRouter API key" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────" -ForegroundColor Yellow
Write-Host ""
Write-Host "Opening https://openrouter.ai/keys in your browser..." -ForegroundColor Cyan
Write-Host ""
Write-Host "If browser doesn't open:" -ForegroundColor Gray
Write-Host "  1. Go to: https://openrouter.ai/keys" -ForegroundColor Gray
Write-Host "  2. Sign up (if needed - free, no credit card!)" -ForegroundColor Gray
Write-Host "  3. Copy your API key (starts with sk-or-v1-)" -ForegroundColor Gray
Write-Host ""

# Open browser
Start-Process "https://openrouter.ai/keys"

Write-Host "⏳ Waiting for you to get your API key from OpenRouter..." -ForegroundColor Cyan
Write-Host ""
Start-Sleep -Seconds 3

# Step 2: Get API key from user
Write-Host "STEP 2: Paste your API key" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────" -ForegroundColor Yellow
Write-Host ""
Write-Host "Your API key should:" -ForegroundColor Gray
Write-Host "  • Start with: sk-or-v1-" -ForegroundColor Gray
Write-Host "  • Be about 50+ characters long" -ForegroundColor Gray
Write-Host "  • Look like: sk-or-v1-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" -ForegroundColor Gray
Write-Host ""

$API_KEY = Read-Host "Paste your OpenRouter API key here"

# Validate API key
if ([string]::IsNullOrEmpty($API_KEY)) {
    Write-Host ""
    Write-Host "❌ ERROR: API key is empty!" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not $API_KEY.StartsWith("sk-or-v1-")) {
    Write-Host ""
    Write-Host "⚠️  WARNING: API key doesn't start with 'sk-or-v1-'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "It might be invalid. OpenRouter keys should start with sk-or-v1-" -ForegroundColor Yellow
    Write-Host "Double-check you copied it correctly from https://openrouter.ai/keys" -ForegroundColor Yellow
    Write-Host ""

    $CONTINUE = Read-Host "Continue anyway? (Y/N)"
    if ($CONTINUE -ne "Y" -and $CONTINUE -ne "y") {
        Write-Host ""
        Write-Host "Cancelled. Please try again." -ForegroundColor Gray
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Step 3: Set environment variable
Write-Host ""
Write-Host "STEP 3: Setting environment variable" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────" -ForegroundColor Yellow
Write-Host ""
Write-Host "Setting OPENROUTER_API_KEY permanently..." -ForegroundColor Cyan
Write-Host ""

try {
    # Set environment variable permanently (requires admin)
    [Environment]::SetEnvironmentVariable("OPENROUTER_API_KEY", $API_KEY, "User")
    Write-Host "✅ Environment variable set successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Failed to set environment variable!" -ForegroundColor Red
    Write-Host ""
    Write-Host "This might happen if:" -ForegroundColor Gray
    Write-Host "  • PowerShell is not running as Administrator" -ForegroundColor Gray
    Write-Host "  • Windows restricted the operation" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Try running PowerShell as Administrator:" -ForegroundColor Yellow
    Write-Host "  1. Right-click PowerShell" -ForegroundColor Yellow
    Write-Host "  2. Select 'Run as administrator'" -ForegroundColor Yellow
    Write-Host "  3. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 4: Verify it's set
Write-Host ""
Write-Host "STEP 4: Verifying..." -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────" -ForegroundColor Yellow
Write-Host ""

# Set in current session
$env:OPENROUTER_API_KEY = $API_KEY

Write-Host "Checking if environment variable is accessible..." -ForegroundColor Cyan

if ($env:OPENROUTER_API_KEY) {
    Write-Host "✅ OPENROUTER_API_KEY is set in current session" -ForegroundColor Green
    Write-Host ""
    Write-Host "First 20 characters: $($env:OPENROUTER_API_KEY.Substring(0, 20))..." -ForegroundColor Gray
} else {
    Write-Host "⚠️  Not visible in current session (but will work after restart)" -ForegroundColor Yellow
}

# Step 5: Next steps
Write-Host ""
Write-Host "STEP 5: Next Steps" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Close VS Code completely" -ForegroundColor Cyan
Write-Host "2. Wait 3 seconds" -ForegroundColor Cyan
Write-Host "3. Reopen VS Code" -ForegroundColor Cyan
Write-Host "4. Open Continue chat (Ctrl+Shift+Space)" -ForegroundColor Cyan
Write-Host "5. Select a cloud model from dropdown" -ForegroundColor Cyan
Write-Host "6. Type: 'hello'" -ForegroundColor Cyan
Write-Host "7. Should get response ✅" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your API key is now saved permanently. You don't need to set it again!" -ForegroundColor Green
Write-Host ""
Write-Host "═════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
