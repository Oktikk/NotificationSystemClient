const { ipcRenderer } = require('electron');

window.ipcRenderer = ipcRenderer;
window.ipcMain = ipcRenderer;