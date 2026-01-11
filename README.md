# Zyn Macro - Modern UI for Natro Macro

![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

A modern, dark-themed Electron UI redesign for [Natro Macro](https://github.com/NatroTeam/NatroMacro) - the powerful AutoHotkey automation tool for Bee Swarm Simulator.

## ✨ Features

- 🎨 **Modern Dark UI** - Sleek, professional interface inspired by Cursor IDE
- 🔄 **Full Backend Integration** - Syncs with original Natro Macro configuration
- ⚡ **Real-time Config Sync** - All settings save instantly to `nm_config.ini`
- 📱 **Intuitive Layout** - Clean tabs with icons (Lucide Icons)
- 🎯 **All Original Features** - Complete 1:1 functionality with enhanced UX
- 🔧 **Dynamic UI** - Context-aware settings (Planters mode, sub-tabs, etc.)

## 📥 Download

### Latest Release

**[⬇️ Download Zyn Macro v1.0.0 (139 MB)](https://github.com/andrewzapps/zyn-macro/releases/latest)**

### Installation (Super Easy!)

1. **Download** `Zyn-Macro-v1.0.0-Standalone-Windows.zip` from [Releases](https://github.com/andrewzapps/zyn-macro/releases)
2. **Extract** to any folder (e.g., `C:\Games\ZynMacro\`)
3. **Double-click** `Zyn Macro.exe`
4. **Done!** ✅

**No installation, no dependencies, no npm commands needed!** Just extract and run!

### System Requirements

- **OS:** Windows 10/11 (64-bit)
- **RAM:** 4 GB minimum
- **Disk Space:** ~300 MB after extraction
- **Prerequisites:** None! Everything is included!

## 🖼️ Screenshots

### Gather Tab
Clean field rotation setup with dynamic add/remove fields

### Collect/Kill Tab
Sub-tabs for organized collection and boss/bug management

### Boost & Quests
Streamlined boost management and quest configuration

### Planters Tab
Dynamic mode-based UI (OFF/Manual/Planters+)

### Settings Tab
Complete control over GUI, hive, reconnect, and character settings

## 🚀 Quick Start

### For Users (No Technical Knowledge Required!)

1. **Download** `Zyn-Macro-v1.0.0-Standalone-Windows.zip`
2. **Extract** the ZIP anywhere you want
3. **Open** the `win-unpacked` folder
4. **Double-click** `Zyn Macro.exe`
5. **Configure** your settings in the modern UI
6. **Use** `START.bat` to run the AutoHotkey macro

**That's it!** No programming required, no npm, no Node.js, no complicated setup!

### For Developers

```bash
# Clone the repository
git clone https://github.com/andrewzapps/zyn-macro.git
cd zyn-macro

# Install dependencies
npm install

# Run in development mode
npm start

# Build standalone executable for Windows
npm run build:zip
```

## 📂 Project Structure

```
zyn-macro/
├── electron/          # Electron UI files
│   ├── main.js        # Main process
│   ├── preload.js     # IPC bridge
│   ├── index.html     # UI structure
│   ├── styles.css     # Dark theme styles
│   ├── app.js         # Frontend logic
│   └── zyn2.png       # App icon
├── submacros/         # AutoHotkey scripts
│   └── natro_macro.ahk  # Main AHK macro
├── lib/               # Libraries (Gdip, JSON, etc.)
├── paths/             # Navigation paths
├── patterns/          # Gather patterns
├── nm_image_assets/   # Image recognition assets
├── settings/          # Configuration files
│   └── nm_config.ini  # Main config (synced with UI)
└── START.bat          # Launch script
```

## 🎮 Usage

### Launching the UI
Just **double-click** `Zyn Macro.exe` - that's it!

(Developers can use `npm start`)

### Running the Macro
Inside the extracted folder, double-click `START.bat`

Or run directly:
```bash
submacros/AutoHotkey64.exe submacros/natro_macro.ahk
```

### Configuration
- All settings are saved to `settings/nm_config.ini`
- Changes in the UI are saved instantly
- The macro reads these settings on startup
- **No coding required!** Everything is point-and-click

## 🔧 Features Overview

### ✅ Synced Tabs
- **Gather** - Field rotation, patterns, drift compensation, sprinklers
- **Collect/Kill** - Dispensers, memory match, blender, beesmas, bug run, bosses
- **Boost** - Field boosters, hotbar slots, stickers
- **Quests** - Polar, Black, Brown, Honey, Bucko, Riley
- **Planters** - Dynamic mode (OFF/Manual/+), nectar priority, harvest controls
- **Settings** - GUI, hive, reconnect, character configuration

### 🎨 UI Improvements
- Dark theme with modern aesthetics
- Icon-based navigation (Lucide Icons)
- Context-aware settings visibility
- Dynamic field management (add/remove up to 7 fields)
- Sub-tabs for better organization
- Responsive layout

## 📜 License

This project is licensed under **GPL-3.0** (inherited from Natro Macro).

### Credits

- **Original Macro:** [Natro Macro](https://github.com/NatroTeam/NatroMacro) by NatroTeam
- **UI Redesign:** [andrewzapps](https://github.com/andrewzapps)
- **Game:** [Bee Swarm Simulator](https://www.roblox.com/games/1537690962/Bee-Swarm-Simulator) by Onett

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Bug Reports

Found a bug? Please open an [issue](https://github.com/andrewzapps/zyn-macro/issues) with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your system info (OS, Node.js version)

## ⭐ Support

If you find this project useful, please consider:
- ⭐ Starring the repository
- 🍴 Forking to create your own version
- 📢 Sharing with friends who play Bee Swarm Simulator
- 🐛 Reporting bugs to help improve the project

## 📞 Contact

- **GitHub:** [@andrewzapps](https://github.com/andrewzapps)
- **Repository:** [zyn-macro](https://github.com/andrewzapps/zyn-macro)
- **Issues:** [Report a bug](https://github.com/andrewzapps/zyn-macro/issues)

---

Made with ❤️ for the Bee Swarm Simulator community

**Note:** This is a UI redesign of Natro Macro. All core automation functionality is provided by the original Natro Macro backend.
