#!/bin/bash
# Run a command across all distributions with progress tracking

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
    
    echo "=========================================="
    echo "Compiling and running $SOURCE_FILE"
    echo "across all Linux distributions"
    echo "=========================================="
    echo ""
    
    for distro in "${DISTROS[@]}"; do
        CURRENT=$((CURRENT + 1))
        echo "=========================================="
        echo "[$CURRENT/$TOTAL] Testing: $distro"
        echo "=========================================="
        
        if ./scripts/compile-and-run.sh "$distro" "$SOURCE_FILE" "$OUTPUT_NAME" > /tmp/test_${distro}.log 2>&1; then
            echo "[$CURRENT/$TOTAL] $distro [SUCCESS]"
            SUCCESSFUL+=("$distro")
        else
            echo "[$CURRENT/$TOTAL] $distro [FAILED]"
            FAILED+=("$distro")
            echo "Error log:"
            tail -3 /tmp/test_${distro}.log | grep -v "^$" || tail -3 /tmp/test_${distro}.log
        fi
        echo ""
    done
    
    echo "=========================================="
    echo "Summary"
    echo "=========================================="
    echo "Successful: ${#SUCCESSFUL[@]}/$TOTAL"
    for distro in "${SUCCESSFUL[@]}"; do
        echo "  [+] $distro"
    done
    
    if [ ${#FAILED[@]} -gt 0 ]; then
        echo ""
        echo "Failed: ${#FAILED[@]}/$TOTAL"
        for distro in "${FAILED[@]}"; do
            echo "  [-] $distro"
        done
    fi
    
    echo ""
    exit 0
fi

# Regular command execution
COMMAND="$@"

DISTROS=("ubuntu" "ubuntu-latest" "debian" "fedora" "alpine" "archlinux" "centos" "opensuse-leap" "opensuse-tumbleweed" "rocky-linux" "almalinux" "oraclelinux" "amazonlinux" "gentoo" "kali-linux")
TOTAL=${#DISTROS[@]}
CURRENT=0

echo "=========================================="
echo "Running command across $TOTAL distributions"
echo "Command: $COMMAND"
echo "=========================================="
echo ""

for distro in "${DISTROS[@]}"; do
    CURRENT=$((CURRENT + 1))
    echo "=========================================="
    echo "[$CURRENT/$TOTAL] Running in $distro"
    echo "=========================================="
    ./scripts/run-in-distro.sh "$distro" "$COMMAND"
    echo ""
done

echo "=========================================="
echo "Complete: $TOTAL/$TOTAL distributions processed"
echo "=========================================="
