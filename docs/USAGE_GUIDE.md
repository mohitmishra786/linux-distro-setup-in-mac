# Usage Guide

This guide will help you integrate and use the Linux Distro Testing Environment in your project to compile and run C code across multiple Linux distributions.

## Table of Contents

1. [Quick Start](#quick-start)
2. [VS Code Extension Usage](#vs-code-extension-usage)
3. [Setting Up Your Project](#setting-up-your-project)
4. [Basic Usage](#basic-usage)
5. [Advanced Usage](#advanced-usage)
6. [Integration Examples](#integration-examples)
7. [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites

- Docker Desktop installed and running
- macOS (or Linux/Windows with Docker)
- Basic familiarity with command line

### Initial Setup

1. **Clone or copy this repository** into your project:

```bash
# Option 1: Add as a git submodule
git submodule add <repository-url> linux-distro-testing

# Option 2: Copy the files directly
cp -r linux-distro-setup-in-mac/* /path/to/your/project/
```

2. **Start the environment**:

```bash
cd linux-distro-testing  # or your copied directory
make start
```

3. **Set up build tools** (one-time setup):

```bash
make setup
```

This will install GCC, make, binutils, and GDB in all Linux distributions.

## VS Code Extension Usage

### Installation

1. **Install the Extension**:
   - Open VS Code
   - Go to Extensions (Cmd+Shift+X / Ctrl+Shift+X)
   - Search for "Linux Distro Testing" or "C Cross-Distro Testing"
   - Click Install

2. **Prerequisites Check**:
   - The extension will check if Docker Desktop is running
   - If not, you'll be prompted to start it

3. **Initial Setup** (one-time):
   - Open Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
   - Run: `Linux Distro Testing: Setup All Distributions`
   - Wait for build tools to install (may take a few minutes)

### Using the Extension

#### Method 1: Right-Click Context Menu

1. **Open a C file** in VS Code
2. **Right-click** on the file in Explorer or editor
3. Select from menu:
   - `Compile & Run in Ubuntu`
   - `Compile & Run in Fedora`
   - `Compile & Run in All Distributions`
   - `Test Across All Distributions`

#### Method 2: Command Palette

1. **Open Command Palette** (Cmd+Shift+P / Ctrl+Shift+P)
2. Type `Linux Distro` to see available commands:
   - `Linux Distro Testing: Compile & Run Current File`
   - `Linux Distro Testing: Compile & Run in Ubuntu`
   - `Linux Distro Testing: Compile & Run in Fedora`
   - `Linux Distro Testing: Test in All Distributions`
   - `Linux Distro Testing: Select Distribution`
   - `Linux Distro Testing: Setup Distribution`

#### Method 3: Status Bar

- Click the distribution name in the status bar (bottom right)
- Select a distribution to test in
- Use the play button (▶) to compile and run current file

#### Method 4: Terminal Integration

The extension adds tasks you can run:

1. **Open Terminal** (Ctrl+` / Cmd+`)
2. **Run Task** (Cmd+Shift+P → "Run Task")
3. Select:
   - `Linux Distro: Compile & Run (Ubuntu)`
   - `Linux Distro: Compile & Run (All)`
   - `Linux Distro: Setup All`

### Extension Features

- ✅ **One-click compilation** - Right-click any C file to compile and run
- ✅ **Multi-distro testing** - Test across all 16 Linux distributions
- ✅ **Status bar integration** - Quick access to distribution selection
- ✅ **Terminal output** - See compilation results in VS Code terminal
- ✅ **Error highlighting** - Compilation errors shown in Problems panel
- ✅ **Quick actions** - Fast access via Command Palette

### Configuration

The extension uses settings in `.vscode/settings.json`:

```json
{
  "linuxDistroTesting.dockerComposePath": "./docker-compose.yml",
  "linuxDistroTesting.scriptsPath": "./scripts",
  "linuxDistroTesting.defaultDistro": "ubuntu",
  "linuxDistroTesting.autoSetup": true
}
```

### Example Workflow in VS Code

1. **Create a C file** (`hello.c`):
   ```c
   #include <stdio.h>
   int main() {
       printf("Hello from Linux!\n");
       return 0;
   }
   ```

2. **Right-click** on `hello.c` → `Compile & Run in All Distributions`

3. **View results** in the Output panel or Terminal

4. **Check status** - Success/failure indicators in status bar

### Troubleshooting Extension

**Extension not working?**
- Check Docker Desktop is running
- Verify containers are started: `docker ps`
- Run: `Linux Distro Testing: Setup All Distributions`

**Can't find commands?**
- Reload VS Code window (Cmd+R / Ctrl+R)
- Check extension is enabled in Extensions panel

**Permission errors?**
- Make sure scripts are executable: `chmod +x scripts/*.sh`
- Check Docker has proper permissions

## Setting Up Your Project

### Directory Structure

Your project structure should look like this:

```
your-project/
├── src/
│   ├── main.c
│   └── utils.c
├── linux-distro-testing/  # This repository
│   ├── docker-compose.yml
│   ├── scripts/
│   └── ...
└── Makefile  # Your project's Makefile
```

### Adding Your C Files

Place your C source files in the `code/` directory (or mount your own directory):

```bash
# Create code directory if it doesn't exist
mkdir -p code

# Copy your C files
cp src/*.c code/
```

Or modify `docker-compose.yml` to mount your source directory:

```yaml
volumes:
  - ./src:/workspace  # Instead of ./code:/workspace
```

## Basic Usage

### Compile and Run a Single File

```bash
# Compile and run hello.c in Ubuntu
./scripts/compile-and-run.sh ubuntu code/hello.c

# Specify output name
./scripts/compile-and-run.sh fedora code/main.c myprogram
```

### Run Across All Distributions

```bash
# Compile and run hello.c in all distros
./scripts/run-all-distros.sh --compile code/hello.c
```

### Run Custom Commands

```bash
# Run any command in a specific distro
./scripts/run-in-distro.sh ubuntu gcc --version
./scripts/run-in-distro.sh fedora readelf -h code/myprogram

# Run command in all distros
./scripts/run-all-distros.sh uname -a
./scripts/run-all-distros.sh gcc --version
```

## Advanced Usage

### Interactive Shell Access

```bash
# Open shell in specific distro
make shell-ubuntu
# or
docker exec -it linux-book-ubuntu bash
```

### Compiling with Custom Flags

```bash
# Compile with debug symbols
./scripts/run-in-distro.sh ubuntu gcc -g -o code/debug code/main.c

# Compile with optimizations
./scripts/run-in-distro.sh fedora gcc -O2 -o code/optimized code/main.c

# Compile with specific standard
./scripts/run-in-distro.sh debian gcc -std=c11 -o code/modern code/main.c
```

### Testing Multiple Files

Create a test script:

```bash
#!/bin/bash
# test-all.sh

FILES=("code/test1.c" "code/test2.c" "code/test3.c")

for file in "${FILES[@]}"; do
    echo "Testing $file..."
    ./scripts/run-all-distros.sh --compile "$file"
done
```

### Using in CI/CD

Example GitHub Actions workflow:

```yaml
name: Test Across Linux Distros

on: [push, pull_request]

jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Start Docker
        run: |
          docker-compose up -d
          make setup
      
      - name: Test code
        run: |
          ./scripts/run-all-distros.sh --compile code/main.c
```

## Integration Examples

### Example 1: Simple Project Makefile

```makefile
# Your project Makefile

.PHONY: test-all test-ubuntu clean

# Test in all distros
test-all:
	cd linux-distro-testing && \
	./scripts/run-all-distros.sh --compile ../src/main.c

# Test in specific distro
test-ubuntu:
	cd linux-distro-testing && \
	./scripts/compile-and-run.sh ubuntu ../src/main.c

# Clean compiled files
clean:
	find src -type f ! -name "*.c" ! -name "*.h" -delete
```

### Example 2: Python Test Runner

```python
#!/usr/bin/env python3
# test_runner.py

import subprocess
import sys

DISTROS = [
    "ubuntu", "debian", "fedora", "alpine",
    "archlinux", "centos", "rocky-linux"
]

def test_file(source_file):
    """Test a C file across all distros"""
    results = {}
    
    for distro in DISTROS:
        print(f"Testing {source_file} in {distro}...")
        result = subprocess.run(
            ["./scripts/compile-and-run.sh", distro, source_file],
            capture_output=True,
            text=True
        )
        results[distro] = result.returncode == 0
        
    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 test_runner.py <source_file>")
        sys.exit(1)
    
    results = test_file(sys.argv[1])
    
    print("\nResults:")
    for distro, success in results.items():
        status = "✓" if success else "✗"
        print(f"{status} {distro}")
```

### Example 3: Shell Script Integration

```bash
#!/bin/bash
# build-and-test.sh

set -e

SOURCE_DIR="src"
BUILD_DIR="build"
TEST_ENV="linux-distro-testing"

# Compile locally first
echo "Compiling locally..."
mkdir -p "$BUILD_DIR"
gcc -o "$BUILD_DIR/test" "$SOURCE_DIR/test.c"

# Test across distros
echo "Testing across Linux distributions..."
cd "$TEST_ENV"
./scripts/run-all-distros.sh --compile "../$SOURCE_DIR/test.c"

echo "All tests completed!"
```

## Troubleshooting

### Container Not Starting

```bash
# Check Docker is running
docker ps

# View logs
docker-compose logs ubuntu

# Restart specific container
docker-compose restart ubuntu
```

### Build Tools Not Found

```bash
# Re-setup specific distro
docker exec linux-book-ubuntu /scripts/setup-distro.sh ubuntu

# Or setup all distros
make setup
```

### Permission Issues

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Fix file permissions in code directory
chmod -R 755 code/
```

### Network Issues

If containers can't download packages:

```bash
# Check network connectivity
docker exec linux-book-ubuntu ping -c 3 8.8.8.8

# Restart Docker network
docker-compose down
docker-compose up -d
```

### Out of Disk Space

```bash
# Clean up Docker
docker system prune -a

# Remove unused images
docker image prune -a
```

## Best Practices

1. **Keep code separate**: Don't commit compiled binaries to git
2. **Use version control**: Track your C source files, not the test environment
3. **Test incrementally**: Test in one distro first before testing all
4. **Clean up**: Stop containers when not in use to save resources
5. **Document issues**: Keep notes on distro-specific behaviors

## Next Steps

- Explore the `scripts/` directory to understand available tools
- Customize `docker-compose.yml` for your specific needs
- Add more distributions if needed
- Integrate into your development workflow

## Support

For issues or questions:
- Check the main README.md
- Review script comments for usage details
- Open an issue on the repository

Happy testing! 🐧

