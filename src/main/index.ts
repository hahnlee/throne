import * as path from 'path';
import * as url from 'url';

import { app, BrowserWindow, dialog, ipcMain as ipc } from 'electron';


let window: BrowserWindow|null = null;

function createWindow() {
  window = new BrowserWindow({ width: 900, height: 600 });
  window.webContents.openDevTools();
  if (process.env.NODE_ENV === 'development') {
    window.loadURL('http://localhost:3000/');
  } else {
    window.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  }

  window.on('closed', () => {
    window = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (window === null) {
    createWindow();
  }
});

ipc.on('openDialog', () => {
  dialog.showOpenDialog(
    window!,
    {
      filters: [
        { name: 'Realm File', extensions: ['realm'] }
      ],
    },
    (filePaths: string[]) => {
      if (filePaths) {
        window!.webContents.send('realmPath', filePaths[0]);
      }
    },
  );
});
