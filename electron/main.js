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
  const ahkScriptPath = path.join(resourcePath, 'submacros', 'zyn_macro.ahk');
  const workingDir = resourcePath;
  
  try
  {
    ahkProcess = spawn(ahkExePath, [ahkScriptPath], { cwd: workingDir });
    
    console.log('Spawning AHK process:', ahkExePath);
    console.log('Script path:', ahkScriptPath);
    console.log('Working directory:', workingDir);
    console.log('Arguments:', ['1', '/zynui']);
    
    if (!ahkProcess || !ahkProcess.pid)
    {
      throw new Error('Failed to spawn AHK process - process object is invalid');
    }
    
    console.log('AHK process spawned with PID:', ahkProcess.pid);
    
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
      console.log('AHK process closed with code:', code);
      ahkProcess = null;
      if (mainWindow)
      {
        mainWindow.webContents.send('macro-stopped', { code });
      }
    });
    
    setTimeout(() =>
    {
      if (ahkProcess && ahkProcess.killed)
      {
        console.error('AHK process was killed immediately after spawn');
        if (mainWindow)
        {
          mainWindow.webContents.send('macro-error', { error: 'AHK process exited immediately. Check if AutoHotkey32.exe exists and is not blocked by antivirus.' });
        }
      }
      else if (ahkProcess && !ahkProcess.killed)
      {
        console.log('AHK process is running successfully');
      }
    }, 1000);
    
    ahkProcess.on('error', (err) =>
    {
      console.error('AHK process error:', err);
      if (mainWindow)
      {
        mainWindow.webContents.send('macro-error', { error: `Failed to start macro: ${err.message}` });
      }
      ahkProcess = null;
    });
    
    setTimeout(() =>
    {
      if (ahkProcess && !ahkProcess.killed && ahkProcess.pid)
      {
        try
        {
          const os = require('os');
          const tmpDir = os.tmpdir();
          const helperScriptPath = path.join(tmpDir, 'zyn_send_start.ahk');
          const pid = ahkProcess.pid;
          const helperScript = `#Requires AutoHotkey v2.0
#SingleInstance Force
DetectHiddenWindows On
SetTitleMatchMode 2

pid := ${pid}
hwnd := WinExist("ahk_pid " pid)

if (hwnd)
{
    PostMessage 0x5550, 1, 0, , "ahk_id " hwnd
    ExitApp 0
}
ExitApp 1`;
          
          fs.writeFileSync(helperScriptPath, helperScript, 'utf8');
          
          const { exec } = require('child_process');
          exec(`"${ahkExePath}" "${helperScriptPath}"`, { timeout: 5000 }, (error, stdout, stderr) =>
          {
            try { fs.unlinkSync(helperScriptPath); } catch(e) {}
            
            if (error)
            {
              console.log('Could not send start message:', error.message);
              if (mainWindow)
              {
                mainWindow.webContents.send('macro-status', { status: 'AHK process running. Press F1 to start the macro.' });
              }
            }
            else
            {
              console.log('Successfully sent start command to AHK process');
              if (mainWindow)
              {
                mainWindow.webContents.send('macro-status', { status: 'Macro start command sent!' });
              }
            }
          });
        }
        catch (err)
        {
          console.error('Error sending start message:', err);
          if (mainWindow)
          {
            mainWindow.webContents.send('macro-status', { status: 'AHK process running. Press F1 to start.' });
          }
        }
      }
    }, 3000);
    
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
