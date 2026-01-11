const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const ini = require('ini');

let mainWindow;
let ahkProcess;

function createWindow()
{
  mainWindow = new BrowserWindow(
  {
    width: 1100,
    height: 750,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#1e1e1e',
    icon: path.join(__dirname, 'zyn2.png'),
    webPreferences:
    {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    frame: true,
    titleBarStyle: 'default'
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() =>
{
  createWindow();

  app.on('activate', () =>
  {
    if (BrowserWindow.getAllWindows().length === 0)
    {
      createWindow();
    }
  });
});

app.on('window-all-closed', () =>
{
  if (process.platform !== 'darwin')
  {
    app.quit();
  }
});

ipcMain.on('start-macro', (event, data) =>
{
  const ahkExePath = path.join(__dirname, '..', 'submacros', 'AutoHotkey32.exe');
  const ahkScriptPath = path.join(__dirname, '..', 'submacros', 'natro_macro.ahk');
  
  ahkProcess = spawn(ahkExePath, [ahkScriptPath]);
  
  ahkProcess.stdout.on('data', (data) =>
  {
    event.reply('macro-status', { status: data.toString() });
  });
  
  ahkProcess.stderr.on('data', (data) =>
  {
    event.reply('macro-error', { error: data.toString() });
  });
  
  ahkProcess.on('close', (code) =>
  {
    event.reply('macro-stopped', { code });
  });
  
  event.reply('macro-started', { success: true });
});

ipcMain.on('stop-macro', (event) =>
{
  if (ahkProcess)
  {
    ahkProcess.kill();
    ahkProcess = null;
    event.reply('macro-stopped', { success: true });
  }
});

ipcMain.on('pause-macro', (event) =>
{
  event.reply('macro-paused', { success: true });
});

const configPath = path.join(__dirname, '..', 'settings', 'nm_config.ini');

ipcMain.handle('load-config', async () =>
{
  try
  {
    if (fs.existsSync(configPath))
    {
      const configFile = fs.readFileSync(configPath, 'utf-8');
      const config = ini.parse(configFile);
      return { success: true, config };
    }
    return { success: false, error: 'Config file not found' };
  }
  catch (error)
  {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-config', async (event, section, key, value) =>
{
  try
  {
    let config = {};
    
    if (fs.existsSync(configPath))
    {
      const configFile = fs.readFileSync(configPath, 'utf-8');
      config = ini.parse(configFile);
    }
    
    if (!config[section])
    {
      config[section] = {};
    }
    
    config[section][key] = value;
    
    fs.writeFileSync(configPath, ini.stringify(config));
    
    return { success: true };
  }
  catch (error)
  {
    return { success: false, error: error.message };
  }
});
