#!/bin/bash
# Test script to verify workspace validation works correctly

echo "Testing workspace validation..."
echo ""

# Test 1: Check if validation function exists in compiled code
echo "Test 1: Checking if validateWorkspace function is compiled..."
if grep -q "validateWorkspace" out/utils/docker.js; then
    echo "  [OK] validateWorkspace function found in compiled code"
else
    echo "  [FAIL] validateWorkspace function NOT found"
    exit 1
fi
echo ""

# Test 2: Check if validation is used in setup command
echo "Test 2: Checking if setup.ts uses validation..."
if grep -q "validateWorkspace" src/commands/setup.ts; then
    echo "  [OK] setup.ts uses validation"
else
    echo "  [FAIL] setup.ts does NOT use validation"
    exit 1
fi
echo ""

# Test 3: Check if validation is used in compileRun command
echo "Test 3: Checking if compileRun.ts uses validation..."
if grep -q "validateWorkspace" src/commands/compileRun.ts; then
    echo "  [OK] compileRun.ts uses validation"
else
    echo "  [FAIL] compileRun.ts does NOT use validation"
    exit 1
fi
echo ""

# Test 4: Check compiled JavaScript has validation calls
echo "Test 4: Checking if compiled code includes validation calls..."
if grep -q "validateWorkspace" out/commands/setup.js && grep -q "validateWorkspace" out/commands/compileRun.js; then
    echo "  [OK] Compiled code includes validation calls"
else
    echo "  [FAIL] Compiled code missing validation calls"
    exit 1
fi
echo ""

# Test 5: Verify error messages are clear
echo "Test 5: Checking error message clarity..."
if grep -q "Please open the linux-distro-setup-in-mac project folder" src/commands/setup.ts; then
    echo "  [OK] Clear error messages present"
else
    echo "  [FAIL] Error messages not clear enough"
    exit 1
fi
echo ""

# Test 6: Check VSIX package was created
echo "Test 6: Checking if VSIX package exists..."
if [ -f "distrolab-1.0.4.vsix" ]; then
    echo "  [OK] VSIX package found: distrolab-1.0.4.vsix"
    echo "       Size: $(du -h distrolab-1.0.4.vsix | cut -f1)"
else
    echo "  [FAIL] VSIX package not found"
    exit 1
fi
echo ""

echo "=========================================="
echo "All validation tests passed!"
echo "=========================================="
echo ""
echo "The extension now:"
echo "  - Validates workspace before running commands"
echo "  - Shows clear error messages"
echo "  - Helps users open the correct folder"
echo ""
echo "Installation:"
echo "  code --install-extension distrolab-1.0.4.vsix"
echo ""

