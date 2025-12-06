#!/bin/bash
# Compile and run a C program in a specific Linux distribution

DISTRO=$1
SOURCE_FILE=$2
OUTPUT_NAME=${3:-$(basename "$SOURCE_FILE" .c)}

if [ -z "$DISTRO" ] || [ -z "$SOURCE_FILE" ]; then
    echo "Usage: $0 <distro> <source_file> [output_name]"
    echo ""
    echo "Available distributions:"
    echo "  ubuntu, ubuntu-latest, debian, fedora, alpine, archlinux, centos"
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
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "Starting container $CONTAINER_NAME..."
    docker-compose up -d "$DISTRO"
    sleep 2
    docker exec "$CONTAINER_NAME" /scripts/setup-distro.sh "$DISTRO"
fi

# Compile
echo "Compiling $SOURCE_FILE in $DISTRO..."
docker exec -w /workspace "$CONTAINER_NAME" gcc -o "$OUTPUT_NAME" "$SOURCE_FILE"

if [ $? -eq 0 ]; then
    echo "Compilation successful!"
    echo ""
    echo "Running $OUTPUT_NAME..."
    echo "---"
    docker exec -w /workspace "$CONTAINER_NAME" ./"$OUTPUT_NAME"
    echo "---"
else
    echo "Compilation failed!"
    exit 1
fi

