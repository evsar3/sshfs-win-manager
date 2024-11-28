import { app, BrowserWindow, nativeTheme } from 'electron'
import { join } from 'node:path'

const isDev = process.env.npm_lifecycle_event === 'app:dev' ? true : false

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    frame: false,
    title: 'SSHFS-Win Manager',
    titleBarStyle: 'hidden',
    maximizable: false,
    minimizable: false,
    fullscreen: false,
    titleBarOverlay: process.platform !== 'darwin' ? true : false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1f1f1f' : '#f5f5f5',
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js')
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../../index.html'))
  }

  mainWindow.on('focus', () => {
    mainWindow.webContents.send('window-focus', true)
  })

  mainWindow.on('blur', () => {
    mainWindow.webContents.send('window-focus', false)
  })
}

app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
