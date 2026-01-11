const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI',
{
  startMacro: (data) => ipcRenderer.send('start-macro', data),
  stopMacro: () => ipcRenderer.send('stop-macro'),
  pauseMacro: () => ipcRenderer.send('pause-macro'),
  
  onMacroStarted: (callback) => ipcRenderer.on('macro-started', (event, data) => callback(data)),
  onMacroStopped: (callback) => ipcRenderer.on('macro-stopped', (event, data) => callback(data)),
  onMacroPaused: (callback) => ipcRenderer.on('macro-paused', (event, data) => callback(data)),
  onMacroStatus: (callback) => ipcRenderer.on('macro-status', (event, data) => callback(data)),
  onMacroError: (callback) => ipcRenderer.on('macro-error', (event, data) => callback(data)),
  
  loadConfig: () => ipcRenderer.invoke('load-config'),
  saveConfig: (section, key, value) => ipcRenderer.invoke('save-config', section, key, value)
});
