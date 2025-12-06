# Linux Distro Testing Environment

A Docker-based setup for testing C code across multiple Linux distributions from macOS. Perfect for book writing, cross-distribution testing, and ensuring code compatibility.

## Supported Distributions

- **Ubuntu** (22.04 and latest)
- **Debian** (Bookworm)
- **Fedora** (Latest)
- **Alpine Linux** (Latest)
- **Arch Linux** (Latest)
- **CentOS** (7)

## Quick Start

### 1. Start the Environment

```bash
# Start all containers
make start

# Or start specific distro
docker-compose up -d ubuntu
```

### 2. Setup Build Tools

```bash
# Setup all distributions at once
make setup

# Or setup a specific distro
docker exec linux-book-ubuntu /scripts/setup-distro.sh ubuntu
```

### 3. Run Code

#### Option 1: Using Helper Scripts

```bash
# Compile and run a C program
./scripts/compile-and-run.sh ubuntu code/hello.c

# Run any command in a specific distro
./scripts/run-in-distro.sh ubuntu gcc --version
./scripts/run-in-distro.sh fedora readelf -h hello

# Run command in all distros
./scripts/run-all-distros.sh gcc --version
```

#### Option 2: Direct Docker Commands

```bash
# Compile a program
docker exec -w /workspace linux-book-ubuntu gcc hello.c -o hello

# Run the program
docker exec -w /workspace linux-book-ubuntu ./hello

# Check ELF header
docker exec -w /workspace linux-book-ubuntu readelf -h hello
```

#### Option 3: Interactive Shell

```bash
# Open shell in specific distro
make shell-ubuntu
# or
docker exec -it linux-book-ubuntu bash

# Then work normally inside the container
cd /workspace
gcc hello.c -o hello
./hello
```

## Directory Structure

```
.
├── docker-compose.yml      # Docker Compose configuration
├── Makefile                # Convenience commands
├── scripts/                # Helper scripts
│   ├── setup-distro.sh     # Install build tools
│   ├── run-in-distro.sh    # Run command in distro
│   ├── compile-and-run.sh  # Compile and run C code
│   └── run-all-distros.sh  # Run command in all distros
├── code/                   # Your C code goes here (auto-created)
└── README.md              # This file
```

## Common Workflows

### Testing Code Across All Distributions

```bash
# 1. Create your C file in the code/ directory
cat > code/test.c << 'EOF'
#include <stdio.h>
int main() {
    printf("Hello from Linux!\n");
    return 0;
}
EOF

# 2. Compile and run in all distros
for distro in ubuntu debian fedora alpine archlinux; do
    echo "=== Testing in $distro ==="
    ./scripts/compile-and-run.sh $distro code/test.c
done
```

### Comparing ELF Output Across Distributions

```bash
# Compile in Ubuntu
./scripts/run-in-distro.sh ubuntu gcc code/hello.c -o code/hello-ubuntu

# Compile in Fedora
./scripts/run-in-distro.sh fedora gcc code/hello.c -o code/hello-fedora

# Compare ELF headers
./scripts/run-in-distro.sh ubuntu readelf -h code/hello-ubuntu
./scripts/run-in-distro.sh fedora readelf -h code/hello-fedora
```

### Testing Symbol Tables

```bash
# Compile with symbols
./scripts/run-in-distro.sh ubuntu gcc -g code/symbols.c -o code/symbols

# View symbol table
./scripts/run-in-distro.sh ubuntu nm code/symbols
./scripts/run-in-distro.sh ubuntu readelf --symbols code/symbols
```

## Available Tools

Each distribution comes with:
- `gcc` / `g++` - GNU Compiler Collection
- `make` - Build automation
- `binutils` - Binary utilities (readelf, objdump, nm, strip, etc.)
- `gdb` - GNU Debugger
- Standard C library development headers

## Examples for Your Book

### Chapter 1: Hello World Size Analysis

```bash
# Create hello.c
cat > code/hello.c << 'EOF'
#include <stdio.h>
int main() {
    printf("Hello, World!\n");
    return 0;
}
EOF

# Compile and analyze in Ubuntu
./scripts/run-in-distro.sh ubuntu gcc -o code/hello code/hello.c
./scripts/run-in-distro.sh ubuntu ls -lh code/hello
./scripts/run-in-distro.sh ubuntu readelf -h code/hello
./scripts/run-in-distro.sh ubuntu objdump -h code/hello
```

### Chapter 7: Symbol Analysis

```bash
# Create symbol showcase
cat > code/symbol_showcase.c << 'EOF'
#include <stdio.h>
int user_count = 42;
static double pi = 3.14159;
void log_message(const char *msg) {
    printf("[LOG] %s\n", msg);
}
int main(void) {
    log_message("Service starting");
    return 0;
}
EOF

# Compile and examine symbols
./scripts/run-in-distro.sh ubuntu gcc -c code/symbol_showcase.c -o code/symbol_showcase.o
./scripts/run-in-distro.sh ubuntu readelf --symbols code/symbol_showcase.o
./scripts/run-in-distro.sh ubuntu nm code/symbol_showcase.o
```

## Troubleshooting

### Container not starting
```bash
# Check if Docker is running
docker ps

# View logs
docker-compose logs ubuntu
```

### Build tools not found
```bash
# Re-run setup for specific distro
docker exec linux-book-ubuntu /scripts/setup-distro.sh ubuntu
```

### Permission issues
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

## Cleanup

```bash
# Stop all containers
make stop

# Remove all containers
make clean

# Remove volumes (if needed)
docker-compose down -v
```

## Tips

1. **Code Persistence**: All code in the `code/` directory is shared across all containers, so you can compile in one distro and examine in another.

2. **Quick Testing**: Use `./scripts/compile-and-run.sh` for quick compile-and-test cycles.

3. **Batch Operations**: Use `./scripts/run-all-distros.sh` to verify behavior across all distributions.

4. **Interactive Development**: Use `make shell-<distro>` for interactive debugging and exploration.

5. **Version Differences**: Different distros may have different versions of GCC and binutils. Use `gcc --version` to check.

## Next Steps

1. Create your C code examples in the `code/` directory
2. Use the helper scripts to test across distributions
3. Compare outputs to ensure consistency
4. Document any distro-specific differences in your book

Happy coding! 🐧

