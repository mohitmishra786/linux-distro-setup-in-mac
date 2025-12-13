#!/bin/bash
# Run a command in a specific Linux distribution container


# Detect container runtime
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME=$("$SCRIPT_DIR/detect-runtime.sh")
if [ $? -ne 0 ]; then
    echo "$RUNTIME"
    exit 1
fi

# Set compose command
if [ "$RUNTIME" = "docker" ]; then
    COMPOSE_CMD="docker-compose"
elif [ "$RUNTIME" = "podman" ]; then
    if command -v podman-compose &> /dev/null; then
        COMPOSE_CMD="podman-compose"
    else
        COMPOSE_CMD="podman compose"
    fi
fi

DISTRO=$1
shift
COMMAND="$@"

if [ -z "$DISTRO" ] || [ -z "$COMMAND" ]; then
    echo "Usage: $0 <distro> <command>"
    echo ""
    echo "Available distributions:"
    echo "  ubuntu, ubuntu-latest, debian, fedora, alpine, archlinux, centos,"
    echo "  opensuse-leap, opensuse-tumbleweed, rocky-linux, almalinux,"
    echo "  oraclelinux, amazonlinux, gentoo, kali-linux"
    echo ""
    echo "Examples:"
    echo "  $0 ubuntu gcc --version"
    echo "  $0 fedora gcc hello.c -o hello"
    echo "  $0 alpine ./hello"
    exit 1
fi

CONTAINER_NAME="linux-book-${DISTRO}"

# Check if container is running
if ! $RUNTIME ps | grep -q "$CONTAINER_NAME"; then
    echo "Container $CONTAINER_NAME is not running. Starting it..."
    $COMPOSE_CMD up -d "$DISTRO"
    sleep 2
    
    # Setup the distro if not already done
    echo "Setting up $DISTRO..."
    # Alpine uses sh instead of bash
    if [ "$DISTRO" = "alpine" ]; then
        $RUNTIME exec "$CONTAINER_NAME" sh /scripts/setup-distro.sh "$DISTRO"
    else
        $RUNTIME exec "$CONTAINER_NAME" /scripts/setup-distro.sh "$DISTRO"
    fi
fi

# Execute the command
$RUNTIME exec -w /workspace "$CONTAINER_NAME" bash -c "$COMMAND"

