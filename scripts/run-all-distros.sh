#!/bin/bash
# Run a command in all Linux distributions
# Can also compile and run a C file if provided

if [ $# -eq 0 ]; then
    echo "Usage: $0 <command>"
    echo "   or: $0 --compile <source_file> [output_name]"
    echo ""
    echo "Examples:"
    echo "  $0 gcc --version"
    echo "  $0 uname -a"
    echo "  $0 ls -la"
    echo "  $0 --compile code/hello.c"
    echo "  $0 --compile code/hello.c hello_program"
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
    
    echo "=========================================="
    echo "Compiling and running $SOURCE_FILE"
    echo "across all Linux distributions"
    echo "=========================================="
    echo ""
    
    for distro in "${DISTROS[@]}"; do
        echo "=========================================="
        echo "Testing: $distro"
        echo "=========================================="
        
        if ./scripts/compile-and-run.sh "$distro" "$SOURCE_FILE" "$OUTPUT_NAME" > /tmp/test_${distro}.log 2>&1; then
            echo "✓ SUCCESS: $distro"
            SUCCESSFUL+=("$distro")
        else
            echo "✗ FAILED: $distro"
            FAILED+=("$distro")
            echo "Error log:"
            tail -3 /tmp/test_${distro}.log | grep -v "^$" || tail -3 /tmp/test_${distro}.log
        fi
        echo ""
    done
    
    echo "=========================================="
    echo "Summary"
    echo "=========================================="
    echo "Successful: ${#SUCCESSFUL[@]}/${#DISTROS[@]}"
    for distro in "${SUCCESSFUL[@]}"; do
        echo "  ✓ $distro"
    done
    
    if [ ${#FAILED[@]} -gt 0 ]; then
        echo ""
        echo "Failed: ${#FAILED[@]}/${#DISTROS[@]}"
        for distro in "${FAILED[@]}"; do
            echo "  ✗ $distro"
        done
    fi
    
    echo ""
    exit 0
fi

# Regular command execution
COMMAND="$@"

DISTROS=("ubuntu" "ubuntu-latest" "debian" "fedora" "alpine" "archlinux" "centos" "opensuse-leap" "opensuse-tumbleweed" "rocky-linux" "almalinux" "oraclelinux" "amazonlinux" "gentoo" "kali-linux")

for distro in "${DISTROS[@]}"; do
    echo "=========================================="
    echo "Running in $distro:"
    echo "=========================================="
    ./scripts/run-in-distro.sh "$distro" "$COMMAND"
    echo ""
done

