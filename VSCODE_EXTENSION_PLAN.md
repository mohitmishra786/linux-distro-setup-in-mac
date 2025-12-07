# VS Code Extension Development Plan

## Overview

This document outlines what's needed to create a VS Code extension for the Linux Distro Testing Environment.

## Extension Features

### Core Features
1. **Compile & Run Commands**
   - Compile and run C files in specific distributions
   - Test across all distributions
   - Show results in VS Code terminal/output

2. **Context Menu Integration**
   - Right-click on C files for quick actions
   - Distribution selection menu

3. **Status Bar Integration**
   - Show current selected distribution
   - Quick action buttons

4. **Command Palette Commands**
   - Setup distributions
   - Compile & run options
   - Distribution selection

5. **Task Integration**
   - VS Code tasks for compilation
   - Terminal tasks integration

## Required Files Structure

```
vscode-extension/
├── package.json              # Extension manifest
├── tsconfig.json             # TypeScript configuration
├── src/
│   ├── extension.ts         # Main extension entry point
│   ├── commands/
│   │   ├── compileRun.ts    # Compile & run commands
│   │   ├── setup.ts         # Setup commands
│   │   └── distroSelect.ts  # Distribution selection
│   ├── utils/
│   │   ├── docker.ts        # Docker operations
│   │   ├── scripts.ts       # Script execution
│   │   └── config.ts        # Configuration management
│   └── types/
│       └── distro.ts        # Type definitions
├── .vscodeignore            # Files to exclude from package
├── README.md                # Extension README
├── CHANGELOG.md             # Extension changelog
└── .vscode/
    └── tasks.json           # VS Code tasks (optional)
```

## Key Components Needed

### 1. package.json

**Required fields:**
- `name`: "linux-distro-testing" or "c-cross-distro-testing"
- `displayName`: "Linux Distro Testing"
- `description`: "Test C code across 16 Linux distributions"
- `version`: "1.0.0"
- `publisher`: Your publisher name
- `engines.vscode`: "^1.80.0" (minimum VS Code version)
- `categories`: ["Other", "Testing"]
- `keywords`: ["c", "linux", "docker", "testing", "cross-platform"]
- `activationEvents`: ["onLanguage:c"]
- `main`: "./out/extension.js"
- `contributes`: Commands, menus, tasks, configuration

**Commands to register:**
- `linuxDistroTesting.compileRun` - Compile & run current file
- `linuxDistroTesting.compileRunDistro` - Compile & run in specific distro
- `linuxDistroTesting.testAll` - Test in all distros
- `linuxDistroTesting.setup` - Setup distributions
- `linuxDistroTesting.selectDistro` - Select default distribution

**Menus:**
- `explorer/context` - Right-click in explorer
- `editor/context` - Right-click in editor
- `commandPalette` - Command palette entries

**Configuration:**
- `linuxDistroTesting.dockerComposePath`
- `linuxDistroTesting.scriptsPath`
- `linuxDistroTesting.defaultDistro`
- `linuxDistroTesting.autoSetup`

### 2. TypeScript Source Files

**extension.ts** - Main entry point:
- Activate extension
- Register commands
- Initialize status bar
- Check Docker availability

**commands/compileRun.ts**:
- Execute compile-and-run.sh script
- Parse output
- Show results in terminal/output
- Handle errors

**commands/setup.ts**:
- Run setup-distro.sh for all distros
- Show progress
- Handle errors

**utils/docker.ts**:
- Check Docker is running
- Check containers are up
- Start containers if needed

**utils/scripts.ts**:
- Execute shell scripts
- Handle paths (Windows/Mac/Linux)
- Parse script output

### 3. Dependencies

**Required npm packages:**
```json
{
  "dependencies": {},
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/vscode": "^1.80.0",
    "typescript": "^5.0.0",
    "vsce": "^2.15.0"
  }
}
```

### 4. Build Configuration

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2020",
    "outDir": "out",
    "lib": ["ES2020"],
    "sourceMap": true,
    "rootDir": "src",
    "strict": true
  },
  "exclude": ["node_modules", ".vscode-test"]
}
```

## Implementation Steps

### Phase 1: Basic Setup
1. ✅ Create extension structure
2. ✅ Set up TypeScript project
3. ✅ Create package.json with basic commands
4. ✅ Implement Docker check utility

### Phase 2: Core Commands
1. ✅ Implement compile & run command
2. ✅ Implement setup command
3. ✅ Add error handling
4. ✅ Add output display

### Phase 3: UI Integration
1. ✅ Add context menu items
2. ✅ Add status bar integration
3. ✅ Add command palette entries
4. ✅ Add configuration options

### Phase 4: Polish
1. ✅ Add icons
2. ✅ Add progress indicators
3. ✅ Improve error messages
4. ✅ Add documentation

### Phase 5: Testing & Publishing
1. ✅ Test on macOS
2. ✅ Test on Windows
3. ✅ Test on Linux
4. ✅ Package extension
5. ✅ Publish to VS Code Marketplace

## Technical Considerations

### Cross-Platform Support
- **Windows**: Use PowerShell or Git Bash for scripts
- **macOS**: Use bash/zsh
- **Linux**: Use bash

### Docker Integration
- Check if Docker Desktop is running
- Check if containers exist
- Start containers if needed
- Handle Docker errors gracefully

### Script Execution
- Execute scripts from extension directory
- Handle relative paths
- Support both absolute and relative paths
- Handle script permissions

### Output Display
- Use VS Code OutputChannel for logs
- Use Terminal for interactive output
- Use StatusBarItem for quick info
- Use Progress API for long operations

## VS Code Marketplace Requirements

### Required Files
1. **README.md** - Extension description
2. **CHANGELOG.md** - Version history
3. **LICENSE** - License file
4. **Icon** - 128x128 PNG
5. **Screenshots** - Usage examples

### Marketplace Listing
- **Name**: Linux Distro Testing
- **Description**: Test C code across 16 Linux distributions using Docker
- **Categories**: Other, Testing
- **Tags**: c, linux, docker, testing, cross-platform, compilation

### Publishing Steps
1. Install `vsce`: `npm install -g vsce`
2. Login: `vsce login <publisher-name>`
3. Package: `vsce package`
4. Publish: `vsce publish`

## Configuration Details

### Publisher Information
- **Publisher Name**: Mohit Mishra
- **Publisher ID**: mohitmishra
- **Publisher Display**: "Mohit Mishra (mohitmishra)"

### Extension Details
- **Extension Name**: **DistroLab - Linux Cross-Distro Testing**
- **Short Name**: **DistroLab**
- **Marketplace ID**: `mohitmishra.distrolab`
- **Display Name**: "DistroLab"
- **Description**: "Test your code across 16 Linux distributions using Docker. Supports C, C++, Rust, Go, and more."
- **Icon**: `distrolab.png` (128x128 PNG)
- **License**: MIT (see [LICENSE](LICENSE))
- **Repository Structure**: Extension will be in `vscode-extension/` subfolder

### Icon Requirements
- **Size**: 128x128 pixels
- **Format**: PNG with transparency
- **File size**: Under 100KB recommended
- See [EXTENSION_NAME_SUGGESTIONS.md](EXTENSION_NAME_SUGGESTIONS.md) for design guidelines

### Next Steps
1. ✅ Publisher confirmed: mohitmishra
2. ✅ License created: MIT
3. ⏳ Choose extension name (see suggestions document)
4. ⏳ Create/obtain icon (128x128 PNG)
5. ⏳ Build extension structure

## Next Steps

Once you provide the above information, I can:
1. Create the complete extension structure
2. Implement all core features
3. Add UI integrations
4. Create packaging scripts
5. Prepare for marketplace publishing

Let me know your preferences and I'll start building! 🚀

