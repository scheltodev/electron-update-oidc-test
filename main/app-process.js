const { BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");

function createAppWindow() {
  let win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  ipcMain.on("restart_app", () => {
    autoUpdater.quitAndInstall();
  });

  win.once("ready-to-show", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  win.loadFile("./renderers/home.html");

  win.on("closed", () => {
    win = null;
  });
}

autoUpdater.on("update-available", () => {
  win.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
  win.webContents.send("update_downloaded");
});

module.exports = createAppWindow;
