# Change Log

All notable changes to the "DistroLab" extension will be documented in this file.

## [1.0.1] - 2025-12-07

### Fixed
- Fixed error handling in script execution to properly handle undefined stdout/stderr properties
- Prevents "undefined\nundefined" string in error output
- Improves error visibility and debugging

## [1.0.0] - 2025-12-07

### Added
- Initial release of DistroLab
- Compile and run C/C++/Rust/Go files in specific Linux distributions
- Test code across all 16 Linux distributions
- Right-click context menu integration
- Command Palette commands
- Status bar integration for distribution selection
- Docker container management (start/stop)
- Automatic distribution setup
- Configuration options for paths and default distribution

### Features
- Support for 16 Linux distributions:
  - Ubuntu (22.04 and latest)
  - Debian
  - Fedora
  - Alpine Linux
  - Arch Linux
  - CentOS
  - openSUSE (Leap and Tumbleweed)
  - Rocky Linux
  - AlmaLinux
  - Oracle Linux
  - Amazon Linux
  - Gentoo
  - Kali Linux

- Language support:
  - C (fully supported)
  - C++ (planned)
  - Rust (planned)
  - Go (planned)

