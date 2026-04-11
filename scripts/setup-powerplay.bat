@echo off
REM PowerPlay Setup Batch Wrapper
REM This wrapper bypasses PowerShell execution policy issues
REM Usage: setup-powerplay.bat [version]
REM Example: setup-powerplay.bat 2.7.0

setlocal enabledelayedexpansion

if "%1"=="" (
    set "VERSION=2.7.0"
) else (
    set "VERSION=%1"
)

echo.
echo ╔════════════════════════════════════════╗
echo ║  PowerPlay Setup v%VERSION% (via Batch)      ║
echo ╚════════════════════════════════════════╝
echo.

REM Run PowerShell with ExecutionPolicy Bypass
powershell -NoProfile -ExecutionPolicy Bypass -Command "& 'S:\Code101\PowerPlay\setup-powerplay.ps1' -Version %VERSION%"

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ Setup completed successfully
    echo.
) else (
    echo.
    echo ❌ Setup failed with error code %ERRORLEVEL%
    echo.
)

pause
