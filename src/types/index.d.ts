export {};

declare global {
  interface Window {
    ipcRenderer: any;
    ipcMain: any;
  }
}