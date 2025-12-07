# Building and Publishing DistroLab Extension

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** (comes with Node.js)
3. **vsce** (VS Code Extension Manager)

## Setup

```bash
cd vscode-extension
npm install
```

## Development

### Compile TypeScript

```bash
npm run compile
```

### Watch Mode (auto-compile on changes)

```bash
npm run watch
```

### Test Locally

1. Open VS Code in the `vscode-extension` directory
2. Press `F5` to launch Extension Development Host
3. Test the extension in the new VS Code window

## Building Package

```bash
npm run package
```

This creates a `.vsix` file that can be installed manually:
- `code --install-extension distrolab-1.0.0.vsix`

## Publishing to Marketplace

### First Time Setup

1. Install vsce globally:
   ```bash
   npm install -g vsce
   ```

2. Login to marketplace:
   ```bash
   vsce login mohitmishra
   ```
   (You'll need a Personal Access Token from https://dev.azure.com)

### Publishing

```bash
npm run publish
```

Or manually:
```bash
vsce publish
```

### Publishing a Patch/Minor Update

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run `npm run publish`

## File Structure

```
vscode-extension/
├── src/                    # TypeScript source files
│   ├── extension.ts        # Main entry point
│   ├── commands/          # Command implementations
│   ├── utils/             # Utility functions
│   └── types/             # Type definitions
├── out/                    # Compiled JavaScript (generated)
├── package.json           # Extension manifest
├── tsconfig.json          # TypeScript config
├── distrolab.png          # Extension icon
├── README.md              # Extension README
├── CHANGELOG.md           # Version history
└── .vscodeignore          # Files to exclude from package
```

## Important Notes

- The icon (`distrolab.png`) should be 128x128 pixels (VS Code will scale from larger sizes)
- Update `CHANGELOG.md` for each release
- Test on macOS, Windows, and Linux before publishing
- Ensure all dependencies are listed in `package.json`

