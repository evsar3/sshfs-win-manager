/* eslint-disable */

const { app } = require('electron')
const electronDebug = require('electron-debug')

electronDebug({ showDevTools: false })

app.on('ready', () => {
  let installExtension = require('electron-devtools-installer')

  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {})
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })
})

require('./index')
