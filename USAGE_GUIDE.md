# Usage Guide

This guide will help you integrate and use the Linux Distro Testing Environment in your project to compile and run C code across multiple Linux distributions.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Setting Up Your Project](#setting-up-your-project)
3. [Basic Usage](#basic-usage)
4. [Advanced Usage](#advanced-usage)
5. [Integration Examples](#integration-examples)
6. [Troubleshooting](#troubleshooting)

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

