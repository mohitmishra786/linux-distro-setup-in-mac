#!/bin/bash
# Setup script to install build tools in different Linux distributions

DISTRO=$1

case "$DISTRO" in
  ubuntu|ubuntu-latest|debian|kali-linux)
    echo "Setting up Debian-based distribution ($DISTRO)..."
    apt-get update
    apt-get install -y build-essential binutils gdb
    ;;
  fedora|rocky-linux|almalinux|oraclelinux|amazonlinux)
    echo "Setting up RPM-based distribution ($DISTRO)..."
    # Try dnf first (Fedora, Rocky, AlmaLinux, Oracle Linux 9+)
    if command -v dnf &> /dev/null; then
      # AlmaLinux may need GPG key import
      if [ "$DISTRO" = "almalinux" ]; then
        rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-AlmaLinux 2>/dev/null || true
        dnf install -y --nogpgcheck gcc gcc-c++ make binutils gdb glibc-devel || \
        dnf install -y gcc gcc-c++ make binutils gdb glibc-devel
      else
        dnf install -y gcc gcc-c++ make binutils gdb glibc-devel
      fi
    # Fall back to yum (CentOS 7, Oracle Linux 8, Amazon Linux 2023)
    elif command -v yum &> /dev/null; then
      yum install -y gcc gcc-c++ make binutils gdb glibc-devel
    else
      echo "Error: Neither dnf nor yum found"
      exit 1
    fi
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
    # CentOS 7 reached EOL, use vault repositories
    sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*.repo
    sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*.repo
    yum clean all
    yum install -y gcc gcc-c++ make binutils gdb glibc-devel || {
      echo "Warning: CentOS 7 repositories may be unavailable. Trying alternative..."
      yum install -y --disablerepo=* --enablerepo=base,updates gcc gcc-c++ make binutils gdb glibc-devel
    }
    ;;
  opensuse-leap|opensuse-tumbleweed)
    echo "Setting up openSUSE ($DISTRO)..."
    # Kill any stuck zypper processes
    pkill -9 zypper 2>/dev/null || true
    sleep 1
    # Remove lock if exists
    rm -f /var/run/zypp.pid 2>/dev/null || true
    zypper --non-interactive refresh || true
    zypper --non-interactive install -y gcc gcc-c++ make binutils gdb glibc-devel
    ;;
  gentoo)
    echo "Setting up Gentoo..."
    # Gentoo requires portage to be set up, which is complex in containers
    # For now, try to install basic tools if available
    if command -v emerge &> /dev/null; then
      emerge --sync || true
      emerge -q dev-util/gdb sys-devel/gcc sys-devel/binutils sys-devel/make || true
    else
      echo "Warning: Gentoo portage not available. Manual setup may be required."
    fi
    ;;
  *)
    echo "Unknown distribution: $DISTRO"
    echo "Supported: ubuntu, ubuntu-latest, debian, fedora, alpine, archlinux, centos,"
    echo "          opensuse-leap, opensuse-tumbleweed, rocky-linux, almalinux,"
    echo "          oraclelinux, amazonlinux, gentoo, kali-linux"
    exit 1
    ;;
esac

echo "Setup complete for $DISTRO!"

