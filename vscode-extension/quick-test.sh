#!/bin/bash
# Quick test script for DistroLab extension

set -e

echo "Compiling TypeScript..."
npm run compile

echo ""
echo "Compilation successful!"
echo ""
echo "To test the extension:"
echo "   1. Press F5 in VS Code (opens Extension Development Host)"
echo "   2. Test your extension in the new window"
echo ""
echo "To publish after testing:"
echo "   npm run publish"
echo ""
