const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const ini = require('ini');

let mainWindow;
let ahkProcess;

function getResourcePath()
{
  if (app.isPackaged)
  {
    return process.resourcesPath;
  }
  else
  {
    return path.join(__dirname, '..');
  }
}

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

ipcMain.handle('start-macro', async (event, data) =>
{
  if (ahkProcess)
  {
    mainWindow.webContents.send('macro-error', { error: 'Macro is already running' });
    return { success: false, error: 'Macro is already running' };
  }

  const resourcePath = getResourcePath();
  const ahkExePath = path.join(resourcePath, 'submacros', 'AutoHotkey32.exe');
  const ahkScriptPath = path.join(resourcePath, 'submacros', 'natro_macro.ahk');
  
  try
  {
    ahkProcess = spawn(ahkExePath, [ahkScriptPath, '/zynui']);
    
    ahkProcess.stdout.on('data', (data) =>
    {
      const message = data.toString().trim();
      if (message && mainWindow)
      {
        mainWindow.webContents.send('macro-status', { status: message });
      }
    });
    
    ahkProcess.stderr.on('data', (data) =>
    {
      const error = data.toString().trim();
      if (error && mainWindow)
      {
        mainWindow.webContents.send('macro-error', { error });
      }
    });
    
    ahkProcess.on('close', (code) =>
    {
      ahkProcess = null;
      if (mainWindow)
      {
        mainWindow.webContents.send('macro-stopped', { code });
      }
    });
    
    ahkProcess.on('error', (err) =>
    {
      if (mainWindow)
      {
        mainWindow.webContents.send('macro-error', { error: `Failed to start macro: ${err.message}` });
      }
      ahkProcess = null;
    });
    
    if (mainWindow)
    {
      mainWindow.webContents.send('macro-started', { success: true });
    }
    
    return { success: true };
  }
  catch (error)
  {
    ahkProcess = null;
    if (mainWindow)
    {
      mainWindow.webContents.send('macro-error', { error: `Failed to start macro: ${error.message}` });
    }
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-macro', async () =>
{
  if (ahkProcess)
  {
    ahkProcess.kill();
    ahkProcess = null;
    if (mainWindow)
    {
      mainWindow.webContents.send('macro-stopped', { success: true });
    }
    return { success: true };
  }
  return { success: false, error: 'No macro running' };
});

ipcMain.handle('pause-macro', async () =>
{
  if (mainWindow)
  {
    mainWindow.webContents.send('macro-paused', { success: true });
  }
  return { success: true };
});

ipcMain.handle('load-config', async () =>
{
  const resourcePath = getResourcePath();
  const configPath = path.join(resourcePath, 'settings', 'nm_config.ini');
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
  const resourcePath = getResourcePath();
  const configPath = path.join(resourcePath, 'settings', 'nm_config.ini');
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
