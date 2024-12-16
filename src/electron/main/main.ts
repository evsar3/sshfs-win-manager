import { app, BrowserWindow, dialog, ipcMain, nativeTheme, safeStorage } from 'electron'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
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

app.whenReady().then(() => {
  createWindow()

  ipcMain.handle('dialog', async (event, options) => {
    return await dialog.showOpenDialog(options)
  })

  ipcMain.handle('storeData', async (event, name, data) => {
    const filePath = join(__dirname, `${name}.json`)

    await writeFile(filePath, data, 'utf-8')
  })

  ipcMain.handle('loadData', async (event, name) => {
    const filePath = join(__dirname, `${name}.json`)

    if (!existsSync(filePath)) return ''

    return await readFile(filePath, 'utf-8')
  })

  ipcMain.handle('storeSafeData', (event, name, data) => {
    const filePath = join(__dirname, `${name}.dat`)

    void writeFile(filePath, safeStorage.encryptString(data).toString('binary'), 'binary')
  })

  ipcMain.handle('loadSafeData', async (event, name) => {
    const filePath = join(__dirname, `${name}.dat`)

    if (!existsSync(filePath)) return ''

    const buffer = Buffer.from(await readFile(filePath, 'binary'), 'binary')

    return safeStorage.decryptString(buffer)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
