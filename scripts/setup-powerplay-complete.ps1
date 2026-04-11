# PowerPlay v2.0.0 - Set API Keys (PowerShell)
# Support for: DHONI_API_KEY, KAPIL_API_KEY, OPENROUTER_API_KEY
# Run as Administrator!

# Color assignments
$SuccessColor = "Green"
$WarningColor = "Yellow"
$ErrorColor = "Red"
$InfoColor = "Cyan"

# API Keys Configuration
$apiKeys = @(
    @{
        Name = "DHONI"
        EnvVar = "DHONI_API_KEY"
        Format = "dhoni-"
        Description = "DHONI API"
    },
    @{
        Name = "KAPIL"
        EnvVar = "KAPIL_API_KEY"
        Format = "kapil-"
        Description = "KAPIL API"
    },
    @{
        Name = "OpenRouter"
        EnvVar = "OPENROUTER_API_KEY"
        Format = "sk-or-v1-"
        Description = "Cloud models for auto-apply"
    }
)

function Show-Menu {
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor $InfoColor
    Write-Host "   PowerPlay - API Key Manager" -ForegroundColor $InfoColor
    Write-Host "======================================================" -ForegroundColor $InfoColor
    Write-Host ""
    Write-Host "Select API Key to Set:" -ForegroundColor $InfoColor
    Write-Host ""

    for ($i = 0; $i -lt $apiKeys.Count; $i++) {
        $k = $apiKeys[$i]
        $status = if (Test-EnvVar $k.EnvVar) { "[SET]" } else { "[ - ]" }
        Write-Host "  $($i+1). $($k.Name) $status" -ForegroundColor $InfoColor
        Write-Host "     $($k.Description)" -ForegroundColor "Gray"
    }

    Write-Host ""
    Write-Host "  0. Exit" -ForegroundColor $InfoColor
    Write-Host ""
}

function Test-EnvVar {
    param([string]$VarName)
    return [bool](Get-Item -Path "env:$VarName" -ErrorAction SilentlyContinue)
}

function Set-ApiKey {
    param(
        [hashtable]$KeyConfig
    )

    Write-Host ""
    Write-Host "======================================================" -ForegroundColor $InfoColor
    Write-Host "   Setting: $($KeyConfig.EnvVar)" -ForegroundColor $InfoColor
    Write-Host "======================================================" -ForegroundColor $InfoColor
    Write-Host ""

    # Check if already set
    if (Test-EnvVar $KeyConfig.EnvVar) {
        $existingKey = [System.Environment]::GetEnvironmentVariable($KeyConfig.EnvVar, "User")
        Write-Host "[OK] $($KeyConfig.EnvVar) is already set!" -ForegroundColor $SuccessColor
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
            Write-Host "[OK] Keeping current $($KeyConfig.Name) key." -ForegroundColor $SuccessColor
            Write-Host ""
            return
        }
    }

    # Get API key from user
    Write-Host "Enter your $($KeyConfig.Name) API key" -ForegroundColor $WarningColor
    Write-Host "Expected format: starts with '$($KeyConfig.Format)'" -ForegroundColor "Gray"
    Write-Host ""
    $apiKey = Read-Host "Paste your $($KeyConfig.Name) API key"

    # Validate
    if (-not $apiKey -or $apiKey -eq "") {
        Write-Host ""
        Write-Host "[ERROR] API key is empty!" -ForegroundColor $ErrorColor
        Write-Host ""
        return
    }

    if (-not $apiKey.StartsWith($KeyConfig.Format)) {
        Write-Host ""
        Write-Host "[WARNING] API key does not start with '$($KeyConfig.Format)'" -ForegroundColor $WarningColor
        Write-Host "Double-check you copied it correctly." -ForegroundColor $WarningColor
        Write-Host ""
    }

    # Set environment variable
    Write-Host ""
    Write-Host "Setting $($KeyConfig.EnvVar)..." -ForegroundColor $InfoColor

    try {
        [Environment]::SetEnvironmentVariable($KeyConfig.EnvVar, $apiKey, "User")
        [System.Environment]::SetEnvironmentVariable($KeyConfig.EnvVar, $apiKey, "Process")
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

    $setKey = [System.Environment]::GetEnvironmentVariable($KeyConfig.EnvVar, "User")
    if ($setKey) {
        Write-Host "[OK] $($KeyConfig.EnvVar) is set!" -ForegroundColor $SuccessColor
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

    if ($index -ge 0 -and $index -lt $apiKeys.Count) {
        Set-ApiKey $apiKeys[$index]
    } else {
        Write-Host ""
        Write-Host "[ERROR] Invalid choice. Please enter a number between 1 and $($apiKeys.Count)" -ForegroundColor $ErrorColor
        Write-Host ""
    }
}
