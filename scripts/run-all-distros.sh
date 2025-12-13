#!/bin/bash
# Run a command across all distributions with progress tracking

# Force unbuffered output (cross-platform)
# This ensures real-time output in VS Code and other environments
exec 1> >(exec cat)
exec 2> >(exec cat >&2)

# Source progress indicator library if available
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/lib/progress.sh" ]; then
    source "$SCRIPT_DIR/lib/progress.sh"
fi

# Ensure output is flushed immediately (for real-time progress in VS Code)
# This helps when stdout is not a TTY
export PYTHONUNBUFFERED=1

if [ $# -eq 0 ]; then
    echo "Usage: $0 <command>"
    echo "   or: $0 --compile <source_file> [output_name]"
    echo ""
    echo "Examples:"
    echo "  $0 gcc --version"
    echo "  $0 uname -a"
    echo "  $0 --compile code/hello.c"
    exit 1
fi

# Check if we're compiling and running a C file
if [ "$1" = "--compile" ]; then
    SOURCE_FILE=$2
    OUTPUT_NAME=${3:-$(basename "$SOURCE_FILE" .c)}
    
    if [ -z "$SOURCE_FILE" ]; then
        echo "Error: Source file required when using --compile"
        exit 1
    fi
    
    if [ ! -f "$SOURCE_FILE" ]; then
        echo "Error: Source file '$SOURCE_FILE' not found"
        exit 1
    fi
    
    DISTROS=("ubuntu" "ubuntu-latest" "debian" "fedora" "alpine" "archlinux" "centos" "opensuse-leap" "opensuse-tumbleweed" "rocky-linux" "almalinux" "oraclelinux" "amazonlinux" "gentoo" "kali-linux")
    
    SUCCESSFUL=()
    FAILED=()
    TOTAL=${#DISTROS[@]}
    CURRENT=0
    START_TIME=$(date +%s)
    
    section_header "Compiling and running $SOURCE_FILE across $TOTAL distributions"
    
    for distro in "${DISTROS[@]}"; do
        CURRENT=$((CURRENT + 1))
        progress_step "$CURRENT" "$TOTAL" "Testing: $distro"
        echo ""
        
        # Run with direct output (no piping to avoid buffering)
        ./scripts/compile-and-run.sh "$distro" "$SOURCE_FILE" "$OUTPUT_NAME"
        EXIT_CODE=$?
        
        if [ $EXIT_CODE -eq 0 ]; then
            status_success "$distro compilation and execution"
            SUCCESSFUL+=("$distro")
        else
            status_error "$distro failed"
            FAILED+=("$distro")
        fi
        echo ""
    done
    
    # Calculate statistics
    END_TIME=$(date +%s)
    ELAPSED=$((END_TIME - START_TIME))
    
    section_summary "Test Results Summary"
    print_success_list "Successful (${#SUCCESSFUL[@]})" "${SUCCESSFUL[@]}"
    if [ ${#FAILED[@]} -gt 0 ]; then
        echo ""
        print_error_list "Failed (${#FAILED[@]})" "${FAILED[@]}"
    fi
    
    print_summary_stats "${#SUCCESSFUL[@]}" "${#FAILED[@]}" "$TOTAL" "$ELAPSED"
    
    echo ""
    exit 0
fi

# Regular command execution
COMMAND="$@"

DISTROS=("ubuntu" "ubuntu-latest" "debian" "fedora" "alpine" "archlinux" "centos" "opensuse-leap" "opensuse-tumbleweed" "rocky-linux" "almalinux" "oraclelinux" "amazonlinux" "gentoo" "kali-linux")
TOTAL=${#DISTROS[@]}
CURRENT=0

section_header "Running command across $TOTAL distributions"
echo "Command: $COMMAND"
echo ""

for distro in "${DISTROS[@]}"; do
    CURRENT=$((CURRENT + 1))
    progress_step "$CURRENT" "$TOTAL" "Running in $distro"
    ./scripts/run-in-distro.sh "$distro" "$COMMAND"
    echo ""
done

section_summary "Complete: $TOTAL/$TOTAL distributions processed"
echo ""
