# Quick Start Guide

## One-Time Setup

```bash
# Start all containers
make start

# Setup build tools in all distros (this may take a few minutes)
make setup
```

## Daily Usage

### Compile and Run C Code

```bash
# Compile and run in Ubuntu
./scripts/compile-and-run.sh ubuntu code/hello.c

# Compile and run in Fedora
./scripts/compile-and-run.sh fedora code/hello.c
```

### Run Any Command

```bash
# Check GCC version in Ubuntu
./scripts/run-in-distro.sh ubuntu gcc --version

# View ELF header
./scripts/run-in-distro.sh ubuntu "readelf -h hello"

# Run command in all distros
./scripts/run-all-distros.sh gcc --version
```

### Interactive Shell

```bash
# Open shell in Ubuntu
make shell-ubuntu

# Or directly
docker exec -it linux-book-ubuntu bash
```

## Important Notes

1. **File Paths**: Files in the `code/` directory are accessible as `/workspace/<filename>` inside containers
   - `code/hello.c` → `/workspace/hello.c` or just `hello.c` when in `/workspace`

2. **CentOS 7**: May have repository issues as it's EOL. Consider using other distros for testing.

3. **ARM64 Mac**: All containers run via x86_64 emulation, which is slower but works perfectly.

## Available Distributions

- `ubuntu` - Ubuntu 22.04
- `ubuntu-latest` - Latest Ubuntu
- `debian` - Debian Bookworm
- `fedora` - Latest Fedora
- `alpine` - Alpine Linux
- `archlinux` - Arch Linux
- `centos` - CentOS 7 (may have issues)

## Example Workflow

```bash
# 1. Create your C file
cat > code/test.c << 'EOF'
#include <stdio.h>
int main() {
    printf("Hello from Linux!\n");
    return 0;
}
EOF

# 2. Compile and run in Ubuntu
./scripts/compile-and-run.sh ubuntu code/test.c

# 3. Analyze ELF structure
./scripts/run-in-distro.sh ubuntu "readelf -h test"
./scripts/run-in-distro.sh ubuntu "objdump -h test"
./scripts/run-in-distro.sh ubuntu "nm test"

# 4. Compare across distros
for distro in ubuntu debian fedora; do
    echo "=== $distro ==="
    ./scripts/compile-and-run.sh $distro code/test.c
done
```

