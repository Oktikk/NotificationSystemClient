const { app, Menu, Tray, BrowserWindow } = require('electron')
const { ipcMain, ipcRenderer } = require('electron')
const path = require('path')

const log = require('electron-log');

log.transports.console.level = 'debug';

log.transports.console.format = '{h}:{i}:{s} {text}';

console.log = log.log;
console.error = log.error;

let tray = null
app.whenReady().then(() => {
  const iconPath = path.join(__dirname, 'src/images/false.png');
  tray = new Tray(iconPath)
  tray.setToolTip('Connecting to server...')
})

ipcMain.on('change-tray-icon', (event, success) => {
    console.log(success);
    if(success){
        iconPath = path.join(__dirname, 'src/images/true.png');
        tray.setToolTip("Connected to server!");
    }
    else {
        iconPath = path.join(__dirname, 'src/images/false.png');
        tray.setToolTip("Not connected to server!");
    }
    if (tray) {
        tray.setImage(iconPath);
    }
});

    const url = require("url");

    let mainWindow

    function createWindow () {
      mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          preload: path.join(__dirname, 'preload.js')
        }
      })

      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, `/dist/notification-system-client/index.html`),
          protocol: "file:",
          slashes: true
        })
      );
      mainWindow.webContents.openDevTools()

      mainWindow.on('closed', function () {
        mainWindow = null
      })
    }

    app.on('ready', createWindow)

    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') app.quit()
    })

    app.on('activate', function () {
      if (mainWindow === null) createWindow()
    })