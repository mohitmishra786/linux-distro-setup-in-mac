#!/bin/bash
# Setup script to install build tools in different Linux distributions

DISTRO=$1

case "$DISTRO" in
  ubuntu|ubuntu-latest|debian)
    echo "Setting up Debian-based distribution..."
    apt-get update
    apt-get install -y build-essential binutils gdb
    ;;
  fedora)
    echo "Setting up Fedora..."
    dnf install -y gcc gcc-c++ make binutils gdb glibc-devel
    ;;
  alpine)
    echo "Setting up Alpine Linux..."
    apk add --no-cache build-base binutils gdb
    ;;
  archlinux)
    echo "Setting up Arch Linux..."
    pacman -Sy --noconfirm base-devel binutils gdb
    ;;
  centos)
    echo "Setting up CentOS..."
    yum install -y gcc gcc-c++ make binutils gdb glibc-devel
    ;;
  *)
    echo "Unknown distribution: $DISTRO"
    echo "Supported: ubuntu, ubuntu-latest, debian, fedora, alpine, archlinux, centos"
    exit 1
    ;;
esac

echo "Setup complete for $DISTRO!"

