const { remote, ipcRenderer } = require('electron')
const axios = require('axios')
const authService = remote.require('./services/auth-service')
const authProcess = remote.require('./main/auth-process')

const webContents = remote.getCurrentWebContents()

webContents.on('dom-ready', () => {
  const profile = authService.getProfile()
  document.getElementById('picture').src = profile.picture
  document.getElementById('name').innerText = profile.name
  document.getElementById('success').innerText =
    'You successfully used OpenID Connect and OAuth 2.0 to authenticate.'
})

document.getElementById('logout').onclick = () => {
  authProcess.createLogoutWindow()
  remote.getCurrentWindow().close()
}

document.getElementById('secured-request').onclick = () => {
  axios
    .get('http://localhost:3000/private', {
      headers: {
        Authorization: `Bearer ${authService.getAccessToken()}`,
      },
    })
    .then((response) => {
      const messageJumbotron = document.getElementById('message')
      messageJumbotron.innerText = response.data
      messageJumbotron.style.display = 'block'
    })
    .catch((error) => {
      if (error) throw new Error(error)
    })
}

//+++++

const version = document.getElementById('version')

ipcRenderer.send('app_version')
ipcRenderer.on('app_version', (event, arg) => {
  ipcRenderer.removeAllListeners('app_version')
  version.innerText = 'Version ' + arg.version
})

//##########
const notification = document.getElementById('notification')
const message = document.getElementById('message')
const restartButton = document.getElementById('restart-button')
ipcRenderer.on('update_available', () => {
  ipcRenderer.removeAllListeners('update_available')
  message.innerText = 'A new update is available. Downloading now...'
  notification.classList.remove('hidden')
})
ipcRenderer.on('update_downloaded', () => {
  ipcRenderer.removeAllListeners('update_downloaded')
  message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?'
  restartButton.classList.remove('hidden')
  notification.classList.remove('hidden')
})

document.getElementById('restart-button').onclick = () => {
  ipcRenderer.send('restart_app')
}

document.getElementById('close-button').onclick = () => {
  notification.classList.add('hidden')
}
