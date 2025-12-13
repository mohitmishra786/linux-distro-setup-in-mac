#!/bin/bash
# Compile and run a C program in a specific Linux distribution


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
SOURCE_FILE=$2
OUTPUT_NAME=${3:-$(basename "$SOURCE_FILE" .c)}

if [ -z "$DISTRO" ] || [ -z "$SOURCE_FILE" ]; then
    echo "Usage: $0 <distro> <source_file> [output_name]"
    echo ""
    echo "Available distributions:"
    echo "  ubuntu, ubuntu-latest, debian, fedora, alpine, archlinux, centos,"
    echo "  opensuse-leap, opensuse-tumbleweed, rocky-linux, almalinux,"
    echo "  oraclelinux, amazonlinux, gentoo, kali-linux"
    echo ""
    echo "Examples:"
    echo "  $0 ubuntu hello.c"
    echo "  $0 fedora hello.c hello_program"
    exit 1
fi

if [ ! -f "$SOURCE_FILE" ]; then
    echo "Error: Source file '$SOURCE_FILE' not found"
    exit 1
fi

CONTAINER_NAME="linux-book-${DISTRO}"

# Ensure container is running
if ! $RUNTIME ps | grep -q "$CONTAINER_NAME"; then
    echo "Starting container $CONTAINER_NAME..."
    $COMPOSE_CMD up -d "$DISTRO"
    sleep 2
fi

# Check if gcc is available, if not, set up the distro
if ! $RUNTIME exec "$CONTAINER_NAME" which gcc > /dev/null 2>&1; then
    echo "Setting up $DISTRO (installing build tools)..."
    # Alpine uses sh instead of bash
    if [ "$DISTRO" = "alpine" ]; then
        $RUNTIME exec "$CONTAINER_NAME" sh /scripts/setup-distro.sh "$DISTRO"
    else
        $RUNTIME exec "$CONTAINER_NAME" /scripts/setup-distro.sh "$DISTRO"
    fi
fi

# Get the basename of the source file (relative to code directory)
SOURCE_BASENAME=$(basename "$SOURCE_FILE")
SOURCE_DIR=$(dirname "$SOURCE_FILE")
# If source file is in code/ directory, adjust path
if [[ "$SOURCE_FILE" == code/* ]]; then
    SOURCE_BASENAME=$(basename "$SOURCE_FILE")
    SOURCE_PATH="/workspace/$SOURCE_BASENAME"
else
    SOURCE_PATH="/workspace/$SOURCE_FILE"
fi

# Compile
echo "Compiling $SOURCE_FILE in $DISTRO..."
$RUNTIME exec -w /workspace "$CONTAINER_NAME" gcc -o "$OUTPUT_NAME" "$SOURCE_PATH"

if [ $? -eq 0 ]; then
    echo "Compilation successful!"
    echo ""
    echo "Running $OUTPUT_NAME..."
    echo "---"
    $RUNTIME exec -w /workspace "$CONTAINER_NAME" ./"$OUTPUT_NAME"
    echo "---"
else
    echo "Compilation failed!"
    exit 1
fi

