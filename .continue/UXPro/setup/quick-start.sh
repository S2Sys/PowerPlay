#!/bin/bash

################################################################################
# UXPro Quick Start Setup Script
#
# This script automates the setup of the UXPro design system for AI coding
# assistants (Claude Code, Cursor, Windsurf, Cline, etc.)
#
# Features:
# - Auto-detects system and project paths
# - Interactive platform selection
# - Platform-specific setup instructions
# - Optional automatic file copying
# - Verification and next steps
#
# Supported Systems: macOS, Linux, Windows (Git Bash/WSL)
# Usage: bash setup/quick-start.sh
################################################################################

set -e

# Colors for output (cross-platform compatible)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

# Print header
print_header() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                   UXPro Quick Start Setup                   ║${NC}"
    echo -e "${CYAN}║            Automated Setup for AI Design System             ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Print section
print_section() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Print info
print_info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

# Auto-detect project root
detect_project_root() {
    # Try to find UXPro root by looking for VERSION.json
    if [[ -f "VERSION.json" ]]; then
        echo "$(pwd)"
    elif [[ -f "setup/README.md" ]]; then
        echo "$(pwd)"
    elif [[ -f "../VERSION.json" ]]; then
        echo "$(cd .. && pwd)"
    elif [[ -f "../../VERSION.json" ]]; then
        echo "$(cd ../.. && pwd)"
    else
        echo ""
    fi
}

# Validate UXPRO_ROOT
validate_uxpro_root() {
    local root="$1"
    [[ -f "$root/VERSION.json" ]] && [[ -d "$root/core" ]] && [[ -d "$root/setup" ]]
}

# Ask for user input (yes/no)
ask_yes_no() {
    local question="$1"
    local default="${2:-n}"
    local answer=""

    while true; do
        if [[ "$default" == "y" ]]; then
            read -p "$(echo -e ${CYAN})$question (Y/n):${NC} " answer
            answer=${answer:-y}
        else
            read -p "$(echo -e ${CYAN})$question (y/N):${NC} " answer
            answer=${answer:-n}
        fi

        case "$answer" in
            [Yy]) return 0 ;;
            [Nn]) return 1 ;;
            *) print_error "Please answer y or n" ;;
        esac
    done
}

# Interactive menu
show_menu() {
    echo ""
    echo -e "${CYAN}Which AI tool are you setting up?${NC}"
    echo ""
    echo "  1) Claude Code"
    echo "  2) Cursor"
    echo "  3) Windsurf"
    echo "  4) Cline"
    echo "  5) Continue.dev"
    echo "  6) Manual Setup (I'll paste manually)"
    echo ""

    read -p "$(echo -e ${CYAN})Select an option (1-6):${NC} " choice
}

# Show instructions for Claude Code
show_claude_code_instructions() {
    print_section "Claude Code Setup Instructions"
    echo ""
    echo -e "${CYAN}Follow these steps to enable the design system in Claude Code:${NC}"
    echo ""
    echo "1. Open Claude Code application"
    echo "2. Click the Settings icon (⚙️) in the top menu"
    echo "3. Select 'Custom Instructions' or 'System Prompt'"
    echo "4. Copy the content below and paste it:"
    echo ""
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    if [[ -f "$UXPRO_ROOT/core/UIUX-SYSTEM-PROMPT.md" ]]; then
        head -50 "$UXPRO_ROOT/core/UIUX-SYSTEM-PROMPT.md"
        echo ""
        echo "... (see full content at: $UXPRO_ROOT/core/UIUX-SYSTEM-PROMPT.md) ..."
        echo ""
    fi

    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "5. Click 'Save' or 'Enable'"
    echo "6. Restart Claude Code"
    echo "7. In your next prompt, the design rules will be automatically applied"
    echo ""
}

# Show instructions for Cursor
show_cursor_instructions() {
    print_section "Cursor Setup Instructions"
    echo ""
    echo -e "${CYAN}Follow these steps to enable the design system in Cursor:${NC}"
    echo ""
    echo "Option A: Using .cursorrules file (recommended)"
    echo "────────────────────────────────────────────"
    echo "1. Create a file named '.cursorrules' in your project root"
    echo "2. Copy the content from: $UXPRO_ROOT/core/UIUX-SYSTEM-PROMPT.md"
    echo "3. Paste it into the .cursorrules file"
    echo "4. Restart Cursor"
    echo ""
    echo "Option B: Using Cursor Settings"
    echo "──────────────────────────────"
    echo "1. Open Cursor (Cmd+, on Mac, Ctrl+, on Windows/Linux)"
    echo "2. Search for 'Rules for AI'"
    echo "3. Paste the content from UIUX-SYSTEM-PROMPT.md"
    echo "4. Restart Cursor"
    echo ""

    if ask_yes_no "Would you like me to create the .cursorrules file automatically?"; then
        copy_cursorrules_file
    fi
}

# Show instructions for Windsurf
show_windsurf_instructions() {
    print_section "Windsurf Setup Instructions"
    echo ""
    echo -e "${CYAN}Follow these steps to enable the design system in Windsurf:${NC}"
    echo ""
    echo "Option A: Using .windsurfrules file (recommended)"
    echo "──────────────────────────────────────────────"
    echo "1. Create a file named '.windsurfrules' in your project root"
    echo "2. Copy the content from: $UXPRO_ROOT/core/UIUX-SYSTEM-PROMPT.md"
    echo "3. Paste it into the .windsurfrules file"
    echo "4. Restart Windsurf"
    echo ""
    echo "Option B: Using Windsurf Settings"
    echo "─────────────────────────────────"
    echo "1. Open Windsurf settings"
    echo "2. Find 'Wind Rules' or 'Custom Instructions'"
    echo "3. Paste the content from UIUX-SYSTEM-PROMPT.md"
    echo "4. Restart Windsurf"
    echo ""

    if ask_yes_no "Would you like me to create the .windsurfrules file automatically?"; then
        copy_windsurfrules_file
    fi
}

# Show instructions for Cline
show_cline_instructions() {
    print_section "Cline Setup Instructions"
    echo ""
    echo -e "${CYAN}Follow these steps to enable the design system in Cline:${NC}"
    echo ""
    echo "1. Open your VS Code settings (Cmd+, / Ctrl+,)"
    echo "2. Search for 'Cline' settings"
    echo "3. Find 'Custom Rules' or 'System Rules' field"
    echo "4. Copy the content from: $UXPRO_ROOT/core/UIUX-SYSTEM-PROMPT.md"
    echo "5. Paste it into the custom rules field"
    echo "6. Restart VS Code or reopen the Cline chat"
    echo ""
    echo "Alternative: Create a .cline_rules file"
    echo "1. Create '.cline_rules' in your project root"
    echo "2. Paste the UIUX-SYSTEM-PROMPT.md content"
    echo "3. Restart Cline"
    echo ""
}

# Show instructions for Continue.dev
show_continue_instructions() {
    print_section "Continue.dev Setup Instructions"
    echo ""
    echo -e "${CYAN}Follow these steps to enable the design system in Continue.dev:${NC}"
    echo ""
    echo "1. Open Continue settings (click ⚙️ in the Continue sidebar)"
    echo "2. Edit the config file (usually .continue/config.py or config.json)"
    echo "3. Add the system prompt to your configuration:"
    echo ""
    echo "   For Python config:"
    echo "   ────────────────"
    echo "   system_prompt = open('path/to/UIUX-SYSTEM-PROMPT.md').read()"
    echo ""
    echo "   For JSON config:"
    echo "   ───────────────"
    echo "   Add the content to your systemPrompt field"
    echo ""
    echo "4. Copy the content from: $UXPRO_ROOT/core/UIUX-SYSTEM-PROMPT.md"
    echo "5. Restart Continue"
    echo ""
}

# Show manual instructions
show_manual_instructions() {
    print_section "Manual Setup Instructions"
    echo ""
    echo -e "${CYAN}Follow these steps to set up manually:${NC}"
    echo ""
    echo "Step 1: Copy the Design System Prompt"
    echo "─────────────────────────────────────"
    echo "1. Open the file: $UXPRO_ROOT/core/UIUX-SYSTEM-PROMPT.md"
    echo "2. Select all content (Ctrl+A / Cmd+A)"
    echo "3. Copy it (Ctrl+C / Cmd+C)"
    echo ""
    echo "Step 2: Paste into Your AI Tool"
    echo "───────────────────────────────"
    echo "Your tool's instructions:"
    echo "  • Claude Code: Settings → Custom Instructions → Paste"
    echo "  • Cursor: Create .cursorrules in project root → Paste"
    echo "  • Windsurf: Create .windsurfrules in project root → Paste"
    echo "  • Cline: VS Code Settings → Cline → Custom Rules → Paste"
    echo "  • Continue: Edit .continue/config → Paste"
    echo ""
    echo "Step 3: Copy CSS Tokens (Optional)"
    echo "──────────────────────────────────"
    echo "For web projects:"
    echo "  1. Copy: $UXPRO_ROOT/core/design-tokens.css"
    echo "  2. Paste into your project's CSS folder"
    echo "  3. Import in your HTML or main CSS file"
    echo ""
    echo "Step 4: Reference Examples"
    echo "─────────────────────────"
    echo "Check these files for implementation examples:"
    echo "  • $UXPRO_ROOT/examples/README.md"
    echo "  • $UXPRO_ROOT/core/UIUX-MASTER-PROMPT-SYSTEM.md"
    echo ""
}

# Copy .cursorrules file
copy_cursorrules_file() {
    local source="$UXPRO_ROOT/core/UIUX-SYSTEM-PROMPT.md"
    local target=".cursorrules"

    if [[ ! -f "$source" ]]; then
        print_error "Source file not found: $source"
        return 1
    fi

    if [[ -f "$target" ]]; then
        print_warning "File $target already exists"
        if ! ask_yes_no "Overwrite it?"; then
            print_info "Skipped copying .cursorrules"
            return 0
        fi
    fi

    cp "$source" "$target"
    print_success "Created .cursorrules file"
}

# Copy .windsurfrules file
copy_windsurfrules_file() {
    local source="$UXPRO_ROOT/core/UIUX-SYSTEM-PROMPT.md"
    local target=".windsurfrules"

    if [[ ! -f "$source" ]]; then
        print_error "Source file not found: $source"
        return 1
    fi

    if [[ -f "$target" ]]; then
        print_warning "File $target already exists"
        if ! ask_yes_no "Overwrite it?"; then
            print_info "Skipped copying .windsurfrules"
            return 0
        fi
    fi

    cp "$source" "$target"
    print_success "Created .windsurfrules file"
}

# Copy design tokens
copy_design_tokens() {
    local source="$UXPRO_ROOT/core/design-tokens.css"
    local target="design-tokens.css"

    if [[ ! -f "$source" ]]; then
        print_error "Source file not found: $source"
        return 1
    fi

    if [[ -f "$target" ]]; then
        print_warning "File $target already exists"
        if ! ask_yes_no "Overwrite it?"; then
            print_info "Skipped copying design-tokens.css"
            return 0
        fi
    fi

    cp "$source" "$target"
    print_success "Copied design-tokens.css to project root"
}

# Verify setup
verify_setup() {
    print_section "Verification"
    echo ""

    local success=true

    # Check UIUX files exist
    if [[ -f "$UXPRO_ROOT/core/UIUX-SYSTEM-PROMPT.md" ]]; then
        print_success "UIUX-SYSTEM-PROMPT.md found"
    else
        print_error "UIUX-SYSTEM-PROMPT.md not found"
        success=false
    fi

    if [[ -f "$UXPRO_ROOT/core/design-tokens.css" ]]; then
        print_success "design-tokens.css found"
    else
        print_error "design-tokens.css not found"
        success=false
    fi

    if [[ -f "$UXPRO_ROOT/VERSION.json" ]]; then
        print_success "VERSION.json found"
        local version=$(grep -o '"version"[^,]*' "$UXPRO_ROOT/VERSION.json" | head -1 | cut -d'"' -f4)
        print_info "Current version: $version"
    else
        print_error "VERSION.json not found"
        success=false
    fi

    echo ""
    if [[ "$success" == true ]]; then
        print_success "All files verified successfully!"
    else
        print_warning "Some files are missing. Check the paths and try again."
    fi
}

# Show next steps
show_next_steps() {
    print_section "Next Steps"
    echo ""
    echo "After setup completes, do this:"
    echo ""
    echo "1. Restart your AI tool"
    echo "   • Close and reopen Claude Code, Cursor, Windsurf, etc."
    echo ""
    echo "2. Test the design system"
    echo "   • Ask it to create a simple button component"
    echo "   • It should mention 44px touch targets, color contrast, etc."
    echo ""
    echo "3. Review the design system"
    echo "   • Read: $UXPRO_ROOT/core/UIUX-MASTER-PROMPT-SYSTEM.md"
    echo "   • Check all 29 sections"
    echo ""
    echo "4. Check for updates"
    echo "   • See: $UXPRO_ROOT/VERSION.json"
    echo "   • Read: $UXPRO_ROOT/UPDATE_GUIDE.md"
    echo ""
    echo "5. Look at examples"
    echo "   • Browse: $UXPRO_ROOT/examples/"
    echo ""
    echo -e "${GREEN}Setup complete! Happy designing! 🎨${NC}"
    echo ""
}

# Main script flow
main() {
    print_header

    # Detect OS
    OS=$(detect_os)
    print_info "Detected OS: $OS"

    # Detect project root
    DETECTED_ROOT=$(detect_project_root)

    if [[ -z "$DETECTED_ROOT" ]]; then
        print_section "Project Detection"
        print_error "Could not auto-detect UXPro root directory"
        print_info "Please make sure you run this script from the UXPro directory"
        echo ""
        read -p "Enter the path to UXPro root: " UXPRO_ROOT
    else
        UXPRO_ROOT="$DETECTED_ROOT"
        print_info "Detected UXPro root: $UXPRO_ROOT"
    fi

    # Validate paths
    if ! validate_uxpro_root "$UXPRO_ROOT"; then
        print_section "Error"
        print_error "Invalid UXPro root: $UXPRO_ROOT"
        print_info "This directory should contain VERSION.json, core/, and setup/ directories"
        exit 1
    fi

    print_success "UXPro root validated: $UXPRO_ROOT"
    echo ""

    # Show menu
    show_menu

    case "$choice" in
        1) show_claude_code_instructions ;;
        2) show_cursor_instructions ;;
        3) show_windsurf_instructions ;;
        4) show_cline_instructions ;;
        5) show_continue_instructions ;;
        6) show_manual_instructions ;;
        *)
            print_error "Invalid option"
            exit 1
            ;;
    esac

    # Ask about CSS tokens
    print_section "CSS Design Tokens"
    echo ""
    echo "The design system includes CSS variables (tokens) for:"
    echo "  • Colors (primary, accent, neutral, etc.)"
    echo "  • Spacing (8-point grid)"
    echo "  • Typography (modular scale)"
    echo "  • Shadows, borders, and more"
    echo ""
    if ask_yes_no "Would you like to copy design-tokens.css to your project?"; then
        copy_design_tokens
    fi

    # Verify
    verify_setup

    # Next steps
    show_next_steps
}

# Run main function
main "$@"
