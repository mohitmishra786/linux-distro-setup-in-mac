# Release Checklist - v1.0.0

## Pre-Release ✅

- [x] All features implemented
- [x] Documentation complete
- [x] VS Code extension created
- [x] LICENSE file added (MIT)
- [x] Maintainer information added
- [x] Code tested

## Release Steps

### 1. Commit All Changes
```bash
git add -A
git commit -m "Release v1.0.0: Initial release with 16 Linux distributions and VS Code extension"
```

### 2. Create Tag
```bash
git tag -a v1.0.0 -m "Release v1.0.0 - Initial release"
```

### 3. Push to GitHub
```bash
git push origin main
git push origin v1.0.0
```

### 4. Create GitHub Release

Go to: https://github.com/mohitmishra786/linux-distro-setup-in-mac/releases/new

- **Tag**: `v1.0.0`
- **Title**: `v1.0.0 - Initial Release`
- **Description**: Copy from `RELEASE_NOTES.md`
- **Attach**: `vscode-extension/distrolab-1.0.0.vsix` (optional)

### 5. Publish VS Code Extension

```bash
cd vscode-extension
npx @vscode/vsce login mohitmishra
npm run publish
```

## Post-Release

- [ ] Verify GitHub release is published
- [ ] Verify VS Code extension is published
- [ ] Update any external documentation
- [ ] Announce release (if applicable)

## Files Included in Release

- ✅ Docker Compose configuration
- ✅ Setup scripts
- ✅ Helper scripts
- ✅ Documentation (README, USAGE_GUIDE)
- ✅ VS Code extension
- ✅ LICENSE (MIT)
- ✅ Release notes

## Excluded from Release

- ❌ `code/` folder (user's code)
- ❌ Compiled binaries
- ❌ Node modules
- ❌ Build artifacts

