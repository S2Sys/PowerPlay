# PowerPlay v2.0.0 - Set API Keys (PowerShell)
# Support for multiple API providers: OpenRouter, OpenAI, Anthropic, etc.
# Run as Administrator!

# Color assignments
$SuccessColor = "Green"
$WarningColor = "Yellow"
$ErrorColor = "Red"
$InfoColor = "Cyan"

# API Providers Configuration
$providers = @(
    @{
        Name = "OpenRouter"
        EnvVar = "OPENROUTER_API_KEY"
        Url = "https://openrouter.ai/keys"
        Format = "sk-or-v1-"
        Description = "Cloud models for auto-apply"
    },
    @{
        Name = "OpenAI"
        EnvVar = "OPENAI_API_KEY"
        Url = "https://platform.openai.com/api-keys"
        Format = "sk-"
        Description = "GPT models"
    },
    @{
        Name = "Anthropic"
        EnvVar = "ANTHROPIC_API_KEY"
        Url = "https://console.anthropic.com/account/keys"
        Format = "sk-ant-"
        Description = "Claude models"
    },
    @{
        Name = "Groq"
        EnvVar = "GROQ_API_KEY"
        Url = "https://console.groq.com/keys"
        Format = "gsk_"
        Description = "Groq models"
    },
    @{
        Name = "HuggingFace"
        EnvVar = "HUGGINGFACE_API_KEY"
        Url = "https://huggingface.co/settings/tokens"
        Format = "hf_"
        Description = "HuggingFace models"
    }
)

function Show-Menu {
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor $InfoColor
    Write-Host "   PowerPlay - API Key Manager" -ForegroundColor $InfoColor
    Write-Host "======================================================" -ForegroundColor $InfoColor
    Write-Host ""
    Write-Host "Select API Provider:" -ForegroundColor $InfoColor
    Write-Host ""

    for ($i = 0; $i -lt $providers.Count; $i++) {
        $p = $providers[$i]
        $status = if (Test-EnvVar $p.EnvVar) { "[SET]" } else { "[ - ]" }
        Write-Host "  $($i+1). $($p.Name) $status" -ForegroundColor $InfoColor
        Write-Host "     $($p.Description)" -ForegroundColor "Gray"
    }

    Write-Host ""
    Write-Host "  0. Exit" -ForegroundColor $InfoColor
    Write-Host ""
}

function Test-EnvVar {
    param([string]$VarName)
    return [bool](Get-Item -Path "env:$VarName" -ErrorAction SilentlyContinue)
}

function Get-ApiKey {
    param(
        [hashtable]$Provider
    )

    Write-Host ""
    Write-Host "======================================================" -ForegroundColor $InfoColor
    Write-Host "   Setting: $($Provider.Name) - $($Provider.EnvVar)" -ForegroundColor $InfoColor
    Write-Host "======================================================" -ForegroundColor $InfoColor
    Write-Host ""

    # Check if already set
    if (Test-EnvVar $Provider.EnvVar) {
        $existingKey = [System.Environment]::GetEnvironmentVariable($Provider.EnvVar, "User")
        Write-Host "[OK] $($Provider.EnvVar) is already set!" -ForegroundColor $SuccessColor
        Write-Host ""

        $keyLength = $existingKey.Length
        $charsToShow = if ($keyLength -gt 20) { 20 } else { $keyLength }
        $firstChars = $existingKey.Substring(0, $charsToShow)
        $msg = "Current value (first $charsToShow chars): $firstChars..."
        Write-Host $msg -ForegroundColor "Gray"
        Write-Host ""

        $changeKey = Read-Host "Change it - answer Y or N"
        if ($changeKey -ne "Y" -and $changeKey -ne "y") {
            Write-Host ""
            Write-Host "[OK] Keeping current $($Provider.Name) key." -ForegroundColor $SuccessColor
            Write-Host ""
            return
        }
    }

    # Open provider website
    Write-Host "Opening $($Provider.Url)..." -ForegroundColor $InfoColor
    Write-Host ""
    Write-Host "Instructions:" -ForegroundColor $InfoColor
    Write-Host "  1. Go to: $($Provider.Url)" -ForegroundColor $InfoColor
    Write-Host "  2. Sign up or log in (if needed)" -ForegroundColor $InfoColor
    Write-Host "  3. Create a new API key" -ForegroundColor $InfoColor
    Write-Host "  4. Copy the key (starts with: $($Provider.Format))" -ForegroundColor $InfoColor
    Write-Host ""

    Start-Process $Provider.Url
    Start-Sleep -Seconds 2

    # Get API key from user
    Write-Host "Waiting for you to copy your $($Provider.Name) API key..." -ForegroundColor $WarningColor
    Write-Host ""
    $apiKey = Read-Host "Paste your $($Provider.Name) API key"

    # Validate
    if (-not $apiKey -or $apiKey -eq "") {
        Write-Host ""
        Write-Host "[ERROR] API key is empty!" -ForegroundColor $ErrorColor
        Write-Host ""
        return
    }

    if (-not $apiKey.StartsWith($Provider.Format)) {
        Write-Host ""
        Write-Host "[WARNING] API key does not start with '$($Provider.Format)'" -ForegroundColor $WarningColor
        Write-Host "Double-check you copied it correctly from $($Provider.Name)." -ForegroundColor $WarningColor
        Write-Host ""
    }

    # Set environment variable
    Write-Host ""
    Write-Host "Setting $($Provider.EnvVar)..." -ForegroundColor $InfoColor

    try {
        [Environment]::SetEnvironmentVariable($Provider.EnvVar, $apiKey, "User")
        [System.Environment]::SetEnvironmentVariable($Provider.EnvVar, $apiKey, "Process")
        Write-Host "[OK] Environment variable set!" -ForegroundColor $SuccessColor
    } catch {
        Write-Host "[ERROR] Failed to set environment variable!" -ForegroundColor $ErrorColor
        Write-Host "Error: $_" -ForegroundColor $ErrorColor
        Write-Host ""
        return
    }

    # Verify it's set
    Write-Host ""
    Write-Host "Verifying..." -ForegroundColor $InfoColor
    Write-Host ""

    $setKey = [System.Environment]::GetEnvironmentVariable($Provider.EnvVar, "User")
    if ($setKey) {
        Write-Host "[OK] $($Provider.EnvVar) is set!" -ForegroundColor $SuccessColor
        $keyLength = $setKey.Length
        $charsToShow = if ($keyLength -gt 20) { 20 } else { $keyLength }
        $firstChars = $setKey.Substring(0, $charsToShow)
        $msg = "First $charsToShow characters: $firstChars..."
        Write-Host $msg -ForegroundColor "Gray"
    } else {
        Write-Host "[ERROR] API key not found in environment!" -ForegroundColor $ErrorColor
    }

    Write-Host ""
}

# Main loop
while ($true) {
    Show-Menu

    $choice = Read-Host "Enter your choice"

    if ($choice -eq "0") {
        Write-Host ""
        Write-Host "Done! Your API keys are saved permanently." -ForegroundColor $SuccessColor
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor $InfoColor
        Write-Host "  1. Close VS Code completely" -ForegroundColor $InfoColor
        Write-Host "  2. Wait 3 seconds" -ForegroundColor $InfoColor
        Write-Host "  3. Reopen VS Code" -ForegroundColor $InfoColor
        Write-Host "  4. Open Continue chat: Ctrl+Shift+Space" -ForegroundColor $InfoColor
        Write-Host "  5. Should work with your selected models now!" -ForegroundColor $InfoColor
        Write-Host ""
        Read-Host "Press Enter to exit"
        break
    }

    $index = [int]$choice - 1

    if ($index -ge 0 -and $index -lt $providers.Count) {
        Get-ApiKey $providers[$index]
    } else {
        Write-Host ""
        Write-Host "[ERROR] Invalid choice. Please enter a number between 1 and $($providers.Count)" -ForegroundColor $ErrorColor
        Write-Host ""
    }
}
