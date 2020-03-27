import { app, Menu, Tray, ipcMain } from 'electron'

import windowManager from 'electron-window-manager'

/* eslint-disable-next-line */
import store from '../renderer/store'

const isSecondInstance = !app.requestSingleInstanceLock()

let mainWindow = null
let tray = null

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

app.setAppUserModelId('SSHFS-Win Manager')

windowManager.init({
  appBase: process.env.NODE_ENV === 'production'
    ? `file://${__dirname}`
    : 'http://localhost:9080'
})

if (isSecondInstance) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      mainWindow.object.show()
      mainWindow.object.focus()
    }
  })

  app.on('ready', () => {
    mainWindow = windowManager.createNew('main-window', '', '/index.html', null, {
      title: 'SSHFS-Win Manager',
      height: 500,
      width: 900,
      useContentSize: true,
      frame: false,
      maximizable: false,
      minimizable: false,
      resizable: false
    }).create()

    if (!process.argv.includes('--systray')) {
      mainWindow.object.once('ready-to-show', () => {
        mainWindow.object.show()
      })
    }

    tray = new Tray(__static + '/tray-icon.ico')

    const trayMenu = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click () {
          mainWindow.object.webContents.send('terminate-child-processes')

          ipcMain.on('child-processes-terminated', () => {
            app.quit()
          })
        }
      },
      {
        label: 'About',
        click () {
          const window = windowManager.createNew('about-window', '', '/index.html#about', null, {
            height: 380,
            width: 550,
            useContentSize: true,
            frame: false,
            maximizable: false,
            minimizable: false,
            resizable: false,
            modal: true,
            parent: windowManager.get('main-window').object
          }).create()

          window.object.once('ready-to-show', () => {
            window.object.show()
          })
        }
      }
    ])

    tray.setToolTip('SSHFS-Win Manager')
    tray.setContextMenu(trayMenu)

    tray.on('click', () => {
      mainWindow.object.show()
    })
  })
}
