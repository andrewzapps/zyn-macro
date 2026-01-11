const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let ahkProcess;

function createWindow()
{
  mainWindow = new BrowserWindow(
  {
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    backgroundColor: '#1e1e1e',
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
