@echo off
REM PowerPlay v2.0.0 — OpenRouter API Key Setup
REM Automatically sets OPENROUTER_API_KEY environment variable

echo.
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║              PowerPlay — OpenRouter API Key Setup                         ║
echo ║                                                                           ║
echo ║  This script will:                                                        ║
echo ║  1. Open OpenRouter website to get your API key                           ║
echo ║  2. Let you paste your API key here                                       ║
echo ║  3. Set it permanently in Windows environment                             ║
echo ║  4. Verify it's set correctly                                             ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.

REM Check if API key is already set
if defined OPENROUTER_API_KEY (
    echo ✅ OPENROUTER_API_KEY is already set!
    echo.
    echo Current value (first 20 chars): %OPENROUTER_API_KEY:~0,20%...
    echo.
    set /p CHANGE="Do you want to change it? (Y/N): "
    if /i not "%CHANGE%"=="Y" (
        echo.
        echo OK, keeping current API key.
        echo.
        pause
        exit /b 0
    )
)

REM Step 1: Open OpenRouter to get API key
echo.
echo STEP 1: Getting your OpenRouter API key
echo ─────────────────────────────────────────
echo.
echo Opening https://openrouter.ai/keys in your browser...
echo.
echo If browser doesn't open:
echo   1. Go to: https://openrouter.ai/keys
echo   2. Sign up (if needed - free, no credit card!)
echo   3. Copy your API key (starts with sk-or-v1-)
echo.
timeout /t 3

REM Open browser
start https://openrouter.ai/keys

echo.
echo ⏳ Waiting for you to get your API key from OpenRouter...
echo.

REM Step 2: Get API key from user
echo STEP 2: Paste your API key
echo ─────────────────────────────────────────
echo.
echo Your API key should:
echo   • Start with: sk-or-v1-
echo   • Be about 50+ characters long
echo   • Look like: sk-or-v1-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
echo.
set /p API_KEY="Paste your OpenRouter API key here: "

REM Validate API key format
if "%API_KEY%"=="" (
    echo.
    echo ❌ ERROR: API key is empty!
    echo.
    pause
    exit /b 1
)

if not "%API_KEY:~0,9%"=="sk-or-v1-" (
    echo.
    echo ⚠️  WARNING: API key doesn't start with 'sk-or-v1-'
    echo.
    echo It might be invalid. OpenRouter keys should start with sk-or-v1-
    echo Double-check you copied it correctly from https://openrouter.ai/keys
    echo.
    set /p CONTINUE="Continue anyway? (Y/N): "
    if /i not "%CONTINUE%"=="Y" (
        echo.
        echo Cancelled. Please try again.
        echo.
        pause
        exit /b 1
    )
)

REM Step 3: Set environment variable
echo.
echo STEP 3: Setting environment variable
echo ─────────────────────────────────────────
echo.
echo Setting OPENROUTER_API_KEY permanently...
echo.

REM Set the environment variable (permanent)
setx OPENROUTER_API_KEY "%API_KEY%"

if errorlevel 1 (
    echo.
    echo ❌ ERROR: Failed to set environment variable!
    echo.
    echo This might happen if:
    echo   • You're not running as Administrator
    echo   • Windows restricted the operation
    echo.
    echo Try running this script as Administrator:
    echo   1. Right-click this file
    echo   2. Select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo ✅ Environment variable set successfully!

REM Step 4: Verify it's set
echo.
echo STEP 4: Verifying...
echo ─────────────────────────────────────────
echo.

REM Need to set it in current session too
set OPENROUTER_API_KEY=%API_KEY%

echo Checking if environment variable is accessible...
if defined OPENROUTER_API_KEY (
    echo ✅ OPENROUTER_API_KEY is set in current session
    echo.
    echo First 20 characters: %OPENROUTER_API_KEY:~0,20%...
) else (
    echo ⚠️  Not visible in current session (but will work after restart)
)

echo.
echo STEP 5: Next Steps
echo ─────────────────────────────────────────
echo.
echo 1. Close VS Code completely
echo 2. Wait 3 seconds
echo 3. Reopen VS Code
echo 4. Open Continue chat (Ctrl+Shift+Space)
echo 5. Select a cloud model from dropdown
echo 6. Type: "hello"
echo 7. Should get response ✅
echo.
echo Your API key is now saved permanently. You don't need to set it again!
echo.
echo ═════════════════════════════════════════════════════════════════════════════
echo.

pause
