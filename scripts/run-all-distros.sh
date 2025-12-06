#!/bin/bash
# Run a command in all Linux distributions

COMMAND="$@"

if [ -z "$COMMAND" ]; then
    echo "Usage: $0 <command>"
    echo ""
    echo "Examples:"
    echo "  $0 gcc --version"
    echo "  $0 uname -a"
    echo "  $0 ls -la"
    exit 1
fi

DISTROS=("ubuntu" "ubuntu-latest" "debian" "fedora" "alpine" "archlinux" "centos")

for distro in "${DISTROS[@]}"; do
    echo "=========================================="
    echo "Running in $distro:"
    echo "=========================================="
    ./scripts/run-in-distro.sh "$distro" "$COMMAND"
    echo ""
done

