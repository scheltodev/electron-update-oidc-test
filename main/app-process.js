const { BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')

function createAppWindow() {
  let win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  })

  win.loadFile('./renderers/home.html')

  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('update-available', () => {
    win.webContents.send('update_available')
  })
  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update_downloaded')
  })

  win.on('closed', () => {
    win = null
  })
}

module.exports = createAppWindow
