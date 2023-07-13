import { ipcRenderer } from 'electron';

window.ipcRenderer = ipcRenderer;
window.ipcMain = ipcRenderer;