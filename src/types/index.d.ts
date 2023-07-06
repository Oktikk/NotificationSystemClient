export {};

declare global {
  interface Window {
    ipcRenderer: any;
    ipcMain: any;
  }
}

declare module 'firebase' {
  const value: any;
  export default value;
}