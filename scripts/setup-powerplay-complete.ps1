# PowerPlay v2.0.0 — Complete Setup (PowerShell)
# Sets up everything: Ollama, OpenRouter API key, environment variables
# Run as Administrator!

# Color codes
$Success = "Green"
$Warning = "Yellow"
$Error = "Red"
$Info = "Cyan"
$Title = "Magenta"

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════════════════╗" -ForegroundColor $Title
Write-Host "║           PowerPlay v2.0.0 — Complete Setup                              ║" -ForegroundColor $Title
Write-Host "║                                                                           ║" -ForegroundColor $Title
Write-Host "║  This script will set up:                                                ║" -ForegroundColor $Title
Write-Host "║  1. Ollama (local AI server on localhost:11434)                           ║" -ForegroundColor $Title
Write-Host "║  2. OpenRouter API key (for cloud models)                                 ║" -ForegroundColor $Title
Write-Host "║  3. Environment variables                                                 ║" -ForegroundColor $Title
Write-Host "║  4. Verify everything works                                               ║" -ForegroundColor $Title
Write-Host "║                                                                           ║" -ForegroundColor $Title
Write-Host "║  ⚠️  Run this script as Administrator!                                    ║" -ForegroundColor $Title
Write-Host "╚═══════════════════════════════════════════════════════════════════════════╝" -ForegroundColor $Title
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "⚠️  WARNING: This script should be run as Administrator!" -ForegroundColor $Warning
    Write-Host ""
    Write-Host "To run as Administrator:" -ForegroundColor $Info
    Write-Host "  1. Right-click PowerShell" -ForegroundColor $Info
    Write-Host "  2. Select 'Run as administrator'" -ForegroundColor $Info
    Write-Host "  3. Run this script again" -ForegroundColor $Info
    Write-Host ""
    $continue = Read-Host "Continue anyway? (Y/N)"
    if ($continue -ne "Y" -and $continue -ne "y") {
        Write-Host ""
        Write-Host "Cancelled." -ForegroundColor $Warning
        exit 1
    }
}

# ═════════════════════════════════════════════════════════════════════════════
# STEP 1: Check/Install Ollama
# ═════════════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "STEP 1: Ollama Setup" -ForegroundColor $Info
Write-Host "─────────────────────────────────────────" -ForegroundColor $Info
Write-Host ""

# Check if Ollama is installed
$ollamaPath = "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe"
$ollamaInstalled = Test-Path $ollamaPath

if ($ollamaInstalled) {
    Write-Host "✅ Ollama is already installed!" -ForegroundColor $Success
    Write-Host ""

    # Try to get version
    try {
        $version = & $ollamaPath --version 2>$null
        Write-Host "   Version: $version" -ForegroundColor $Success
    } catch {
        Write-Host "   (Version info not available)" -ForegroundColor "Gray"
    }
} else {
    Write-Host "⚠️  Ollama is not installed" -ForegroundColor $Warning
    Write-Host ""
    Write-Host "To install Ollama:" -ForegroundColor $Info
    Write-Host "  1. Go to: https://ollama.ai" -ForegroundColor $Info
    Write-Host "  2. Download Ollama for Windows" -ForegroundColor $Info
    Write-Host "  3. Run the installer" -ForegroundColor $Info
    Write-Host "  4. Restart your computer" -ForegroundColor $Info
    Write-Host "  5. Run this script again" -ForegroundColor $Info
    Write-Host ""
    $install = Read-Host "Open https://ollama.ai to download? (Y/N)"
    if ($install -eq "Y" -or $install -eq "y") {
        Start-Process "https://ollama.ai"
    }
}

Write-Host ""
Write-Host "Next: Start Ollama by clicking the app (or running 'ollama serve')" -ForegroundColor $Warning
Write-Host "Keep Ollama running while using Continue.dev" -ForegroundColor $Warning
Write-Host ""

# ═════════════════════════════════════════════════════════════════════════════
# STEP 2: Check Ollama Models
# ═════════════════════════════════════════════════════════════════════════════

Write-Host "STEP 2: Check Ollama Models" -ForegroundColor $Info
Write-Host "─────────────────────────────────────────" -ForegroundColor $Info
Write-Host ""

Write-Host "Checking if Ollama is running on localhost:11434..." -ForegroundColor $Info
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434" -Method GET -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Ollama is running!" -ForegroundColor $Success

        # Get models
        try {
            $tagsResponse = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 5 -UseBasicParsing
            $tagsJson = $tagsResponse.Content | ConvertFrom-Json
            $models = $tagsJson.models

            if ($models -and $models.Count -gt 0) {
                Write-Host "✅ Models found:" -ForegroundColor $Success
                foreach ($model in $models) {
                    Write-Host "   • $($model.name)" -ForegroundColor $Success
                }
            } else {
                Write-Host "⚠️  No models downloaded yet" -ForegroundColor $Warning
                Write-Host ""
                Write-Host "Download models with:" -ForegroundColor $Info
                Write-Host "  ollama pull deepseek-coder:6.7b" -ForegroundColor $Info
                Write-Host "  ollama pull qwen2.5:7b" -ForegroundColor $Info
                Write-Host "  ollama pull deepseek-r1:8b" -ForegroundColor $Info
            }
        } catch {
            Write-Host "⚠️  Could not get models list" -ForegroundColor $Warning
            Write-Host "   Make sure Ollama is fully started" -ForegroundColor $Warning
        }
    }
} catch {
    Write-Host "❌ Ollama is not running on localhost:11434" -ForegroundColor $Error
    Write-Host ""
    Write-Host "To start Ollama:" -ForegroundColor $Info
    Write-Host "  1. Click the Ollama app (wait 10-15 seconds to start)" -ForegroundColor $Info
    Write-Host "  2. Or run in Command Prompt: ollama serve" -ForegroundColor $Info
    Write-Host ""
    Write-Host "You can continue setup, but chat won't work until Ollama is running." -ForegroundColor $Warning
}

Write-Host ""

# ═════════════════════════════════════════════════════════════════════════════
# STEP 3: OpenRouter API Key
# ═════════════════════════════════════════════════════════════════════════════

Write-Host "STEP 3: OpenRouter API Key" -ForegroundColor $Info
Write-Host "─────────────────────────────────────────" -ForegroundColor $Info
Write-Host ""

# Check if already set
if ($env:OPENROUTER_API_KEY) {
    Write-Host "✅ OPENROUTER_API_KEY is already set!" -ForegroundColor $Success
    Write-Host ""
    $firstChars = $env:OPENROUTER_API_KEY.Substring(0, 20)
    Write-Host "   Current value (first 20 chars): $firstChars..." -ForegroundColor "Gray"
    Write-Host ""

    $changeKey = Read-Host "Change it? (Y/N)"
    if ($changeKey -ne "Y" -and $changeKey -ne "y") {
        Write-Host "   Keeping current API key." -ForegroundColor $Success
        Write-Host ""
    } else {
        # Get new key
        Write-Host ""
        Write-Host "Opening https://openrouter.ai/keys..." -ForegroundColor $Info
        Start-Process "https://openrouter.ai/keys"
        Start-Sleep -Seconds 3

        $apiKey = Read-Host "Paste your new OpenRouter API key"
        if ($apiKey) {
            [Environment]::SetEnvironmentVariable("OPENROUTER_API_KEY", $apiKey, "User")
            $env:OPENROUTER_API_KEY = $apiKey
            Write-Host "✅ API key updated!" -ForegroundColor $Success
        }
    }
} else {
    Write-Host "ℹ️  OPENROUTER_API_KEY not set" -ForegroundColor $Warning
    Write-Host ""
    Write-Host "Opening https://openrouter.ai/keys in browser..." -ForegroundColor $Info
    Write-Host ""
    Write-Host "Instructions:" -ForegroundColor $Info
    Write-Host "  1. Sign up at OpenRouter (free, no credit card needed)" -ForegroundColor $Info
    Write-Host "  2. Go to: https://openrouter.ai/keys" -ForegroundColor $Info
    Write-Host "  3. Copy your API key (starts with sk-or-v1-)" -ForegroundColor $Info
    Write-Host ""

    Start-Process "https://openrouter.ai/keys"
    Start-Sleep -Seconds 3

    $apiKey = Read-Host "Paste your OpenRouter API key"

    if (-not $apiKey -or $apiKey -eq "") {
        Write-Host ""
        Write-Host "❌ API key is empty!" -ForegroundColor $Error
        Write-Host ""
        Write-Host "You can set it manually later:" -ForegroundColor $Info
        Write-Host "  [Environment]::SetEnvironmentVariable('OPENROUTER_API_KEY', 'your-key', 'User')" -ForegroundColor $Info
    } else {
        if (-not $apiKey.StartsWith("sk-or-v1-")) {
            Write-Host ""
            Write-Host "⚠️  WARNING: API key doesn't start with 'sk-or-v1-'" -ForegroundColor $Warning
            Write-Host "   It might be invalid. Double-check you copied it correctly." -ForegroundColor $Warning
            Write-Host ""
        }

        try {
            [Environment]::SetEnvironmentVariable("OPENROUTER_API_KEY", $apiKey, "User")
            $env:OPENROUTER_API_KEY = $apiKey
            Write-Host "✅ OPENROUTER_API_KEY set successfully!" -ForegroundColor $Success
            Write-Host ""
            $firstChars = $apiKey.Substring(0, 20)
            Write-Host "   First 20 characters: $firstChars..." -ForegroundColor "Gray"
        } catch {
            Write-Host "❌ Failed to set environment variable!" -ForegroundColor $Error
            Write-Host "   Error: $_" -ForegroundColor $Error
        }
    }
}

Write-Host ""

# ═════════════════════════════════════════════════════════════════════════════
# STEP 4: Other Environment Variables (Optional)
# ═════════════════════════════════════════════════════════════════════════════

Write-Host "STEP 4: Other Environment Variables (Optional)" -ForegroundColor $Info
Write-Host "─────────────────────────────────────────" -ForegroundColor $Info
Write-Host ""

# OLLAMA_HOST (optional)
if ($env:OLLAMA_HOST) {
    Write-Host "✅ OLLAMA_HOST: $env:OLLAMA_HOST" -ForegroundColor $Success
} else {
    Write-Host "ℹ️  OLLAMA_HOST not set (using default: localhost:11434)" -ForegroundColor "Gray"
    Write-Host ""
    $setOllama = Read-Host "Set custom OLLAMA_HOST? (Y/N)"
    if ($setOllama -eq "Y" -or $setOllama -eq "y") {
        $ollamaHost = Read-Host "Enter OLLAMA_HOST (e.g., localhost:11434)"
        [Environment]::SetEnvironmentVariable("OLLAMA_HOST", $ollamaHost, "User")
        $env:OLLAMA_HOST = $ollamaHost
        Write-Host "✅ OLLAMA_HOST set to: $ollamaHost" -ForegroundColor $Success
    }
}

Write-Host ""

# ═════════════════════════════════════════════════════════════════════════════
# STEP 5: Verify All Settings
# ═════════════════════════════════════════════════════════════════════════════

Write-Host "STEP 5: Verify All Settings" -ForegroundColor $Info
Write-Host "─────────────────────────────────────────" -ForegroundColor $Info
Write-Host ""

Write-Host "Environment Variables Set:" -ForegroundColor $Info
Write-Host ""

$allSet = $true

# Check OPENROUTER_API_KEY
if ($env:OPENROUTER_API_KEY) {
    $firstChars = $env:OPENROUTER_API_KEY.Substring(0, 20)
    Write-Host "✅ OPENROUTER_API_KEY: $firstChars..." -ForegroundColor $Success
} else {
    Write-Host "❌ OPENROUTER_API_KEY: Not set" -ForegroundColor $Error
    $allSet = $false
}

# Check OLLAMA_HOST
if ($env:OLLAMA_HOST) {
    Write-Host "✅ OLLAMA_HOST: $env:OLLAMA_HOST" -ForegroundColor $Success
} else {
    Write-Host "ℹ️  OLLAMA_HOST: Using default (localhost:11434)" -ForegroundColor "Gray"
}

# Check Ollama running
Write-Host ""
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434" -Method GET -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Ollama Server: Running (localhost:11434)" -ForegroundColor $Success
    }
} catch {
    Write-Host "⚠️  Ollama Server: Not running" -ForegroundColor $Warning
    Write-Host "    Start it with: ollama serve" -ForegroundColor $Warning
}

Write-Host ""

# ═════════════════════════════════════════════════════════════════════════════
# STEP 6: Next Steps
# ═════════════════════════════════════════════════════════════════════════════

Write-Host "STEP 6: Next Steps" -ForegroundColor $Info
Write-Host "─────────────────────────────────────────" -ForegroundColor $Info
Write-Host ""

Write-Host "1. ✅ Start Ollama (if not already running):" -ForegroundColor $Info
Write-Host "   Click Ollama app (wait 10-15 seconds)" -ForegroundColor "Gray"
Write-Host ""

Write-Host "2. ✅ Close VS Code completely:" -ForegroundColor $Info
Write-Host "   Exit VS Code entirely, don't just close the window" -ForegroundColor "Gray"
Write-Host ""

Write-Host "3. ✅ Wait 3 seconds:" -ForegroundColor $Info
Write-Host "   Let Windows register environment variable changes" -ForegroundColor "Gray"
Write-Host ""

Write-Host "4. ✅ Reopen VS Code:" -ForegroundColor $Info
Write-Host "   Open VS Code fresh (wait 15 seconds to load)" -ForegroundColor "Gray"
Write-Host ""

Write-Host "5. ✅ Open Continue chat:" -ForegroundColor $Info
Write-Host "   Press: Ctrl+Shift+Space" -ForegroundColor "Gray"
Write-Host ""

Write-Host "6. ✅ Test chat (local Ollama):" -ForegroundColor $Info
Write-Host "   Type: 'hello'" -ForegroundColor "Gray"
Write-Host "   Should get response from DeepSeek Coder or Qwen model" -ForegroundColor "Gray"
Write-Host ""

Write-Host "7. ✅ Test auto-apply (cloud OpenRouter):" -ForegroundColor $Info
Write-Host "   Select code → Right-click → Ask Continue to edit" -ForegroundColor "Gray"
Write-Host "   Should use cloud model (Qwen Coder [Cloud])" -ForegroundColor "Gray"
Write-Host ""

Write-Host "═════════════════════════════════════════════════════════════════════════════" -ForegroundColor $Title
Write-Host ""

if ($allSet) {
    Write-Host "✅ Setup complete! All environment variables are set." -ForegroundColor $Success
} else {
    Write-Host "⚠️  Setup mostly complete, but check the warnings above." -ForegroundColor $Warning
}

Write-Host ""
Write-Host "Your PowerPlay configuration is ready!" -ForegroundColor $Success
Write-Host "Continue.dev will use:" -ForegroundColor $Success
Write-Host "  • Local Ollama for chat (fast, private)" -ForegroundColor $Success
Write-Host "  • Cloud OpenRouter for auto-apply (accurate, reliable)" -ForegroundColor $Success
Write-Host ""

Read-Host "Press Enter to finish"
