import {
    app,
    Menu,
    Tray,
    BrowserWindow,
    ipcMain,
    dialog,
    autoUpdater,
} from 'electron';

import { setup as setupPushReceiver } from 'electron-push-receiver';

import * as path from 'path';

let tray: Tray;
let isQuiting = false;

app.setAppUserModelId('Notification System Client');

app.whenReady().then(() => {
    const iconPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'src/images/loading.png'
    );
    tray = new Tray(iconPath);
    tray.setToolTip('Connecting to server...');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open window',
            click: () => {
                mainWindow.show();
            },
        },
        {
            label: 'Quit',
            click: () => {
                isQuiting = true;
                app.quit();
            },
        },
    ]);

    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        mainWindow.show();
    });
});

ipcMain.on('token-received', (event, token) => {
    setTimeout(() => {
        event.reply('token-send', token);
    }, 500);
});

ipcMain.on('got-notification', (event, title, body) => {
    event.reply('notification-received', title, body);
});

ipcMain.on('change-tray-icon', (event, success) => {
    let iconPath;
    if (success) {
        iconPath = path.join(
            __dirname,
            '..',
            '..',
            '..',
            'src/images/true.png'
        );
        tray.setToolTip('Connected to server!');
    } else {
        iconPath = path.join(
            __dirname,
            '..',
            '..',
            '..',
            'src/images/false.png'
        );
        tray.setToolTip('Not connected to server!');
    }
    if (tray) {
        tray.setImage(iconPath);
    }
});

import url from 'url';

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        },
        show: false,
    });

    mainWindow.setBackgroundColor('#f5f5f5');

    mainWindow.loadURL(
        url.format({
            pathname: path.join(
                __dirname,
                '..',
                '..',
                'notification-system-client/index.html'
            ),
            protocol: 'file:',
            slashes: true,
        })
    );

    setupPushReceiver(mainWindow.webContents);

    mainWindow.on('close', function (event) {
        if (!isQuiting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.once('ready-to-show', () => {
        initUpdate();
    });
}

app.once('ready', createWindow);

app.on('before-quit', function () {
    isQuiting = true;
    tray.destroy();
    mainWindow.destroy();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

//Creating autostart and handling squirrel events

const appFolder = path.dirname(process.execPath);
const updateExe = path.resolve(appFolder, '..', 'Update.exe');
const exeName = path.basename(process.execPath);

function handleStartupEvent() {
    if (process.platform !== 'win32') {
        return false;
    }

    const squirrelCommand = process.argv[1];
    switch (squirrelCommand) {
        case '--squirrel-install':
            app.setLoginItemSettings({
                openAtLogin: true,
                path: updateExe,
                args: [
                    '--processStart',
                    `"${exeName}"`,
                    '--process-start-args',
                    '"--hidden"',
                ],
            });
            app.quit();

            return true;
        case '--squirrel-uninstall':
            app.setLoginItemSettings({
                openAtLogin: false,
                args: [],
            });
            app.quit();

            return true;
        case '--squirrel-obsolete':
            app.quit();
            return true;
    }
    return;
}

handleStartupEvent();

function initUpdate() {
    const url =
        'https://github.com/Oktikk/NotificationSystemClient/releases/latest/download/';

    autoUpdater.setFeedURL({ url });

    autoUpdater.on('update-available', () => {
        mainWindow.webContents.send('console-log-sent', 'available');
        const options: Electron.MessageBoxOptions = {
            type: 'info',
            buttons: [],
            title: 'Aktualizacja',
            message: 'Dostępna nowa aktualizacja. Rozpoczynam pobieranie...',
        };

        dialog.showMessageBox(mainWindow, options);
    });

    autoUpdater.on('update-downloaded', () => {
        mainWindow.webContents.send('console-log-sent', 'downloaded');
        const options: Electron.MessageBoxOptions = {
            type: 'info',
            buttons: [],
            title: 'Aktualizacja',
            message:
                'Pobrano aktualizację aplikacji. Rozpoczynam instalację...',
        };

        dialog.showMessageBox(mainWindow, options).then(() => {
            autoUpdater.quitAndInstall();
        });
    });

    autoUpdater.on('checking-for-update', () => {
        mainWindow.webContents.send('console-log-sent', 'checking for update');
    });

    autoUpdater.on('update-not-available', () => {
        mainWindow.webContents.send('console-log-sent', 'update not available');
    });

    autoUpdater.on('error', (error) => {
        mainWindow.webContents.send('console-log-sent', error);
    });

    autoUpdater.checkForUpdates();
}
