#!/bin/bash
# Detect container runtime (Docker or Podman)

# Check environment variable first
if [ -n "$CONTAINER_RUNTIME" ]; then
    # Validate that the specified runtime exists and is usable
    if command -v "$CONTAINER_RUNTIME" &> /dev/null; then
        if $CONTAINER_RUNTIME ps &> /dev/null 2>&1; then
            echo "$CONTAINER_RUNTIME"
            exit 0
        else
            echo "Error: $CONTAINER_RUNTIME is installed but not running" >&2
            exit 1
        fi
    else
        echo "Error: CONTAINER_RUNTIME is set to '$CONTAINER_RUNTIME' but command not found" >&2
        exit 1
    fi
fi

# Auto-detect: prefer Docker if both are available
if command -v docker &> /dev/null; then
    if docker ps &> /dev/null 2>&1; then
        echo "docker"
        exit 0
    fi
fi

# Fall back to Podman
if command -v podman &> /dev/null; then
    if podman ps &> /dev/null 2>&1; then
        echo "podman"
        exit 0
    fi
fi

# Neither available or running
echo "Error: Neither Docker nor Podman is available or running" >&2
exit 1
