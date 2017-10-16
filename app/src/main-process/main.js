import { app, BrowserWindow, dialog, ipcMain as ipc } from 'electron';
import path from 'path';
import url from 'url';

let window = null;
function createWindow() {
  window = new BrowserWindow({width: 900, height: 600});
  if (process.env.NODE_ENV === 'development') {
    window.loadURL('http://localhost:3000/');
    window.openDevTools();
  } else {
    window.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  window.on('closed', () => {
    window = null;
  });
}

app.on('ready', () => {
  createWindow();
});

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


ipc.on('openDialog', (event, args) => {
  dialog.showOpenDialog(window, {
    filters: [
      {name: 'Realm File', extensions: ['realm']}
    ]
  }, filePaths => {
    if (filePaths) {
      // send realm file path
      window.webContents.send('realmPath', filePaths[0]);
    }
  });
});