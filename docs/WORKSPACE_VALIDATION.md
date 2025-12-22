# Workspace Validation Guide

## Overview

The DistroLab VS Code extension now includes workspace validation to ensure all required files are present before running commands.

## Common Error Messages

### "Workspace validation failed. Missing: ..."

This error occurs when you try to use the extension but the workspace doesn't contain the required files.

**Example errors:**
```
Workspace validation failed. Missing: docker-compose.yml, Makefile, scripts directory.

Please open the linux-distro-setup-in-mac project folder (the folder containing docker-compose.yml and Makefile).
```

```
make: *** No rule to make target 'setup'. Stop.
```

```
Failed to start containers: Command failed: docker-compose -f "/path/to/docker-compose.yml" up -d 
open /path/to/docker-compose.yml: no such file or directory
```

## Root Cause

These errors happen when:
1. You open a subfolder instead of the project root
2. You open a different project that doesn't have the required files
3. You clone the repository but open VS Code in the wrong folder

## Solution

### Step 1: Close Current Workspace
In VS Code:
- File → Close Folder (macOS: Cmd+K, Cmd+F)
- Or: Close VS Code entirely

### Step 2: Open the Correct Folder

Open the **root project folder** that contains:
- `docker-compose.yml`
- `Makefile`
- `scripts/` directory
- `code/` directory (auto-created if missing)

**Correct structure:**
```
linux-distro-setup-in-mac/          ← OPEN THIS FOLDER
├── docker-compose.yml              ← Required
├── Makefile                         ← Required
├── scripts/                         ← Required
│   ├── compile-and-run.sh
│   ├── run-all-distros.sh
│   └── ...
├── code/                            ← Your code files
├── vscode-extension/
└── README.md
```

**Wrong - opening a subdirectory:**
```
code-testing/                        ← WRONG - Missing required files
└── my-test.c
```

### Step 3: Verify Workspace

After opening the correct folder:
1. Check the VS Code status bar (bottom) - it should show the correct project name
2. Open the integrated terminal (View → Terminal)
3. Run: `ls -la`
4. You should see: `docker-compose.yml`, `Makefile`, `scripts/`, etc.

### Step 4: Try Extension Again

Now try running any DistroLab command:
- `DistroLab: Setup All Distributions`
- `DistroLab: Compile and Run`
- `DistroLab: Test in All Distributions`

## Validation Checks

The extension now validates the following files before running commands:

| File/Directory | Purpose |
|----------------|---------|
| `docker-compose.yml` | Docker container configuration |
| `Makefile` | Build and setup commands |
| `scripts/` | Bash scripts for compilation and testing |

## Opening the Correct Workspace

### Method 1: From Terminal
```bash
cd /path/to/linux-distro-setup-in-mac
code .
```

### Method 2: From VS Code
1. File → Open Folder (macOS: Cmd+O)
2. Navigate to `linux-distro-setup-in-mac`
3. Click "Open"

### Method 3: Recent Workspaces
1. File → Open Recent
2. Select `linux-distro-setup-in-mac`

## Testing the Fix

After opening the correct workspace, test with a simple command:

1. Create a test file: `code/hello.c`
2. Open the file in VS Code
3. Command Palette (Cmd+Shift+P)
4. Run: `DistroLab: Compile and Run`
5. Select a distribution (e.g., `ubuntu`)
6. Watch the output channel

If you see output and no validation errors, you're all set!

## For Multiple Projects

If you work with multiple projects, you can:

### Option 1: Workspace Settings
Create `.vscode/settings.json` in your project root:
```json
{
    "distrolab.dockerComposePath": "/absolute/path/to/docker-compose.yml",
    "distrolab.scriptsPath": "/absolute/path/to/scripts"
}
```

### Option 2: Symbolic Links
Create symbolic links in your project to the main repository:
```bash
cd /path/to/your-project
ln -s /path/to/linux-distro-setup-in-mac/docker-compose.yml .
ln -s /path/to/linux-distro-setup-in-mac/Makefile .
ln -s /path/to/linux-distro-setup-in-mac/scripts .
```

## Troubleshooting

### "No workspace folder open"
- You need to open a folder in VS Code (not just individual files)
- Use File → Open Folder

### Extension commands not showing
- Ensure the extension is installed
- Reload VS Code window (Cmd+R)
- Check the Extensions panel

### Still getting validation errors
1. Verify file existence:
   ```bash
   ls -la docker-compose.yml Makefile scripts/
   ```
2. Check file permissions:
   ```bash
   ls -l docker-compose.yml
   ```
3. Reinstall extension:
   - Extensions panel → DistroLab → Uninstall
   - Restart VS Code
   - Install from VSIX

## Summary

The key to avoiding these errors is to **always open the root project folder** in VS Code, not subfolders or individual files. The extension now validates this automatically and provides clear error messages if something is missing.

## Related Files

- `vscode-extension/src/utils/docker.ts` - Validation logic
- `vscode-extension/src/commands/setup.ts` - Setup command with validation
- `vscode-extension/src/commands/compileRun.ts` - Compile/run commands with validation

