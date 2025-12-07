# Publishing DistroLab to VS Code Marketplace

## Package Created Successfully! ✅

The extension package has been created: `distrolab-1.0.0.vsix` (1.5 MB)

## Publishing Steps

### 1. Get Personal Access Token

1. Go to https://dev.azure.com
2. Sign in with your Microsoft account (same as VS Code Marketplace publisher account)
3. Click on your profile → **Security** → **Personal access tokens**
4. Click **+ New Token**
5. Name: `VS Code Marketplace`
6. Organization: `All accessible organizations`
7. Scopes: Select **Custom defined** → **Marketplace** → **Manage**
8. Click **Create**
9. **Copy the token immediately** (you won't see it again!)

### 2. Login to VS Code Marketplace

```bash
cd vscode-extension
npx @vscode/vsce login mohitmishra
```

When prompted, paste your Personal Access Token.

### 3. Publish the Extension

```bash
npm run publish
```

Or manually:
```bash
npx @vscode/vsce publish
```

### 4. Verify Publication

After publishing, check:
- https://marketplace.visualstudio.com/manage/publishers/mohitmishra
- Search for "DistroLab" in VS Code Extensions marketplace

## Important Notes

- **First publication** may take 5-10 minutes to appear in marketplace
- The extension will be available at: `mohitmishra.distrolab`
- Users can install with: `code --install-extension mohitmishra.distrolab`

## Updating the Extension

For future updates:

1. Update version in `package.json` (e.g., `1.0.1`)
2. Update `CHANGELOG.md`
3. Run `npm run compile`
4. Run `npm run publish`

## Troubleshooting

**"Publisher not found"**
- Make sure you're logged in: `npx @vscode/vsce login mohitmishra`
- Verify publisher ID matches your marketplace account

**"Token expired"**
- Generate a new Personal Access Token
- Login again with the new token

**"Extension already exists"**
- This means version 1.0.0 is already published
- Update version number in `package.json` and republish

## Testing Before Publishing

You can test the extension locally:

```bash
# Install locally
code --install-extension distrolab-1.0.0.vsix

# Or test in Extension Development Host
# Open VS Code in vscode-extension folder
# Press F5 to launch Extension Development Host
```

## Next Steps After Publishing

1. ✅ Extension published to marketplace
2. ⏳ Share the extension link
3. ⏳ Update main README with extension badge
4. ⏳ Create release notes on GitHub

Good luck! 🚀

