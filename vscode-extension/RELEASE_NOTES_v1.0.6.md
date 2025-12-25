# DistroLab Extension v1.0.6 - Release Notes

## 🎯 What's Fixed

The extension now works from **ANY workspace** - you no longer need to open the linux-distro-setup-in-mac folder!

## 🚀 Key Changes

### 1. Global Installation Path Configuration
- Extension now uses a **global configuration** for the DistroLab installation path
- Works from any folder in VS Code
- No need to be in the linux-distro-setup-in-mac directory

### 2. Auto-Detection
- Automatically detects common installation locations on activation
- Prompts user to configure if not found
- Suggests the detected path for easy setup

### 3. New Command
- **"DistroLab: Configure Installation Path"** - Easy setup wizard
- Auto-detects or allows manual entry
- Validates the path immediately

### 4. Simplified User Experience
- One-time setup when first using the extension
- Clear error messages if path not configured
- No workspace restrictions

## 📦 Installation & Setup

### Step 1: Install Extension
```bash
code --install-extension distrolab-1.0.6.vsix
```

### Step 2: First-Time Setup
When you first open VS Code after installation:
1. Extension will attempt to auto-detect your linux-distro-setup-in-mac installation
2. If found, you'll see a prompt asking to use that path
3. If not found, you'll be prompted to configure manually

**Or configure manually anytime:**
- Open Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
- Run: `DistroLab: Configure Installation Path`
- Enter the full path to your linux-distro-setup-in-mac directory
  - Example: `/Users/yourname/Projects/linux-distro-setup-in-mac`
  - Example: `/Users/yourname/Desktop/Projects/Github/linux-distro-setup-in-mac`

### Step 3: Use from Any Folder!
- Open **any** project/folder in VS Code
- Create or open a `.c`, `.cpp`, `.rs`, or `.go` file
- Use all DistroLab commands as normal

## 🎨 How It Works Now

### Before (v1.0.5):
- ❌ Had to open linux-distro-setup-in-mac folder
- ❌ Couldn't use from other projects
- ❌ Confusing workspace requirements

### After (v1.0.6):
- ✅ Works from ANY folder
- ✅ One-time global configuration
- ✅ Auto-detection of installation path
- ✅ Clear setup prompts
- ✅ Use extension anywhere in VS Code

## 🔧 Configuration

The extension stores the path globally (per user), so you configure it once and it works everywhere.

**Settings:**
- `distrolab.distroLabPath` - Path to linux-distro-setup-in-mac directory
- `distrolab.defaultDistro` - Default distribution (ubuntu, debian, fedora, etc.)
- `distrolab.autoSetup` - Auto-setup distributions if needed

## 📋 Available Commands

All commands work from any workspace once configured:

1. **DistroLab: Configure Installation Path** ⭐ NEW
2. **DistroLab: Compile & Run Current File**
3. **DistroLab: Compile & Run in Distribution...**
4. **DistroLab: Test in All Distributions**
5. **DistroLab: Setup All Distributions**
6. **DistroLab: Select Default Distribution**
7. **DistroLab: Start Docker Containers**
8. **DistroLab: Stop Docker Containers**

## 🔄 Migration from v1.0.5

If you're upgrading:
1. Uninstall v1.0.5
2. Install v1.0.6
3. Reload VS Code
4. Configure installation path when prompted
5. Done! Use from any folder

## 💡 Example Workflow

```bash
# Work on your own project
cd ~/MyProjects/my-c-app
code .

# In VS Code:
# 1. Open a .c file
# 2. Cmd+Shift+P → "DistroLab: Compile & Run"
# 3. Select distribution
# 4. See results!

# The extension uses the configured linux-distro-setup-in-mac 
# installation for docker-compose and scripts
```

## 🐛 Troubleshooting

### "Installation path not configured"
- Run: `DistroLab: Configure Installation Path`
- Enter the full path to linux-distro-setup-in-mac

### "Invalid installation path"
- Verify the path points to the correct directory
- Must contain: docker-compose.yml, Makefile, scripts/

### Commands don't work
- Check Docker is running: `docker ps`
- Verify path configuration is correct
- Check VS Code Output panel → DistroLab

## 📁 What's Included in VSIX

```
distrolab-1.0.6.vsix (1.47 MB, 25 files)
├── Extension code with global path support
├── Auto-detection for common paths
├── Configuration wizard
└── Validation and helpful error messages
```

## 🎉 Summary

**The extension is now truly workspace-independent!**

Configure once, use everywhere. No more need to open the linux-distro-setup-in-mac folder every time you want to test code across Linux distributions.

---

**Ready to release v1.0.6** ✅

