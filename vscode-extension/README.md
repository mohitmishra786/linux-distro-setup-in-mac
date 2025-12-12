# DistroLab - Linux Cross-Distro Testing

Test your code across 16 Linux distributions using Docker directly from VS Code.

## Features

- **One-click compilation** - Right-click any C/C++/Rust/Go file to compile and run
- **Multi-distro testing** - Test across all 16 Linux distributions
- **Status bar integration** - Quick access to distribution selection
- **Terminal output** - See compilation results in VS Code terminal
- **Error highlighting** - Compilation errors shown in Problems panel
- **Quick actions** - Fast access via Command Palette

## Prerequisites

- Docker Desktop installed and running
- VS Code 1.80.0 or higher
- The Linux Distro Testing Environment setup in your workspace

## Installation

1. Install from VS Code Marketplace
2. Open a workspace containing the Linux Distro Testing Environment
3. Run: `DistroLab: Setup All Distributions` (one-time setup)

## Usage

### Right-Click Menu

1. Open any C/C++/Rust/Go file
2. Right-click → `Compile & Run Current File` or `Test in All Distributions`

### Command Palette

Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux) and type:
- `DistroLab: Compile & Run Current File`
- `DistroLab: Test in All Distributions`
- `DistroLab: Setup All Distributions`
- `DistroLab: Select Default Distribution`

### Status Bar

Click the distribution name in the status bar (bottom right) to change default distribution.

## Configuration

Add to `.vscode/settings.json`:

```json
{
  "distrolab.dockerComposePath": "./docker-compose.yml",
  "distrolab.scriptsPath": "./scripts",
  "distrolab.defaultDistro": "ubuntu",
  "distrolab.autoSetup": true
}
```

## Supported Distributions

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

## Troubleshooting

**Extension not working?**
- Check Docker Desktop is running
- Verify containers are started: `docker ps`
- Run: `DistroLab: Setup All Distributions`

**Can't find commands?**
- Reload VS Code window (`Cmd+R` / `Ctrl+R`)
- Check extension is enabled in Extensions panel

## License

MIT License - see LICENSE file for details.

## Support

For issues or questions, please open an issue on the repository.

