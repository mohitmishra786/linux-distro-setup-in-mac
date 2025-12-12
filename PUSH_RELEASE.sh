#!/bin/bash
# Script to push release to GitHub

set -e

echo "🚀 Pushing v1.0.0 release to GitHub..."
echo ""

# Push main branch
echo "📤 Pushing main branch..."
git push origin main

# Push tag
echo "📤 Pushing tag v1.0.0..."
git push origin v1.0.0 --force

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "📝 Next steps:"
echo "1. Go to: https://github.com/mohitmishra786/linux-distro-setup-in-mac/releases/new"
echo "2. Select tag: v1.0.0"
echo "3. Title: v1.0.0 - Initial Release"
echo "4. Copy content from RELEASE_NOTES.md"
echo "5. Optionally attach: vscode-extension/distrolab-1.0.0.vsix"
echo "6. Click 'Publish release'"
echo ""
echo "Release complete!"
