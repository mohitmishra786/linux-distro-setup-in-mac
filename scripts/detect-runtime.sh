#!/bin/bash
# Detect container runtime (Docker or Podman)

# Check environment variable first
if [ -n "$CONTAINER_RUNTIME" ]; then
    echo "$CONTAINER_RUNTIME"
    exit 0
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
