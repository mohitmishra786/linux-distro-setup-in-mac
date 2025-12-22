# Quick Reference - Progress Indicators & GitHub Management

## Progress Indicators

### Using in VS Code Extension
1. Reload VS Code window (Cmd+R)
2. Open Command Palette (Cmd+Shift+P)
3. Run commands:
   - `DistroLab: Setup All Distributions` - See real-time setup progress
   - `DistroLab: Compile and Run` - See 4-step compilation progress
   - `DistroLab: Test in All Distributions` - See progress for each distro

### Progress Display Format
```
[1/15] Testing: ubuntu
[OK] ubuntu compilation and execution

[2/15] Testing: debian
[OK] debian compilation and execution
```

### Status Indicators
- `[OK]` - Success
- `[FAIL]` - Failure
- `[INFO]` - Information
- `[WARN]` - Warning

## GitHub Management

### Creating Labels (One-time setup)
```bash
cd /path/to/linux-distro-setup-in-mac
./scripts/gh-labels.sh
```

Creates 90+ labels organized by:
- Type, Priority, Status, Component
- Future plans, Enhancements, Platforms
- Performance, Meta, Epics

### Creating Issues
```bash
./scripts/gh-issues.sh
```

Creates 16 issues for:
- Bug fixes
- Enhancements
- Documentation
- Future roadmap

### Viewing Issues
```bash
# All issues
gh issue list

# By label
gh issue list --label "priority:high"
gh issue list --label "type:bug"
gh issue list --label "future:cpp-support"

# By status
gh issue list --label "status:backlog"
gh issue list --label "status:ready"
```

## Shell Script Usage

### Compile and Run (Single Distro)
```bash
./scripts/compile-and-run.sh ubuntu code/hello.c
```

Output:
```
[1/4] Checking container status...
[INFO] Container already running
[2/4] Checking build tools...
[INFO] Build tools already installed
[3/4] Compiling code/hello.c in ubuntu...
[OK] Compilation successful
[4/4] Running hello...
---
Hello, World!
---
[OK] Execution complete
```

### Test All Distributions
```bash
./scripts/run-all-distros.sh --compile code/hello.c
```

Shows real-time progress for each distribution.

## Progress Library Functions

To use in your own scripts:

```bash
#!/bin/bash
source ./scripts/lib/progress.sh

# Show progress steps
progress_step "1" "3" "Starting operation"
progress_step "2" "3" "Processing"
progress_step "3" "3" "Finishing"

# Show status
status_success "Operation completed"
status_error "Operation failed"
status_warning "Warning message"
status_info "Information message"

# Section headers
section_header "Build Process"
section_summary "Build Complete"

# Statistics
print_summary_stats 14 1 15 325  # successful, failed, total, elapsed_seconds
```

## Troubleshooting

### Progress not appearing in real-time
- Check if `script` command is available: `which script`
- If missing, buffering may occur (rare on macOS/Linux)

### ANSI codes showing in VS Code
- Should be automatically stripped
- If issue persists, check VS Code extension rebuild: `npm run compile`

### Labels/Issues not creating
- Verify GitHub CLI auth: `gh auth status`
- Re-authenticate if needed: `gh auth login`
- Check repository access

## Quick Start Checklist

- [ ] Pull latest changes from branch
- [ ] Run `./scripts/gh-labels.sh` to create labels
- [ ] Run `./scripts/gh-issues.sh` to create issues
- [ ] Rebuild VS Code extension: `cd vscode-extension && npm run compile`
- [ ] Reload VS Code window
- [ ] Test progress indicators with any command
- [ ] Review GitHub issues for roadmap

## Resources

- Release Notes: `docs/RELEASE_NOTES_v1.0.4.md`
- Progress Library: `scripts/lib/progress.sh`
- GitHub Scripts: `scripts/gh-labels.sh`, `scripts/gh-issues.sh`
- VS Code Extension: `vscode-extension/`

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create new issue with appropriate labels
3. Use `meta:help-wanted` if you need community assistance



