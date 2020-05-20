import { EventEmitter } from 'events'
import os from 'os'

import store from './store'
import ProcessHandlerWin from './ProcessHandlerWin'

let processList = []
let processWatchList = {}

class ProcessManager extends EventEmitter {
  WATCH_INTERVAL = 5000

  constructor (processHandler) {
    super()

    this.processHandler = processHandler
  }

  create (conn) {
    return new Promise((resolve, reject) => {
      this.processHandler.create(conn).then((pid, process) => {
        this.emit('created', {
          conn,
          process,
          pid
        })

        this.watch(pid)

        processList.push(pid)

        resolve(pid)
      }).catch(error => {
        reject(error)
      })
    })
  }

  terminate (pid) {
    return new Promise((resolve, reject) => {
      this.processHandler.terminate(pid).then(() => {
        this.emit('terminated', pid)

        this.unwatch(pid)

        processList = processList.filter(a => a !== pid)

        resolve()
      })
    })
  }

  terminateAll () {
    const promises = []

    processList.forEach(pid => {
      promises.push(this.terminate(pid))
    })

    return Promise.all(promises)
  }

  watch (pid) {
    processWatchList[pid] = setInterval(() => {
      this.exists(pid).then(exists => {
        if (!exists) {
          this.emit('not-found', pid)

          this.unwatch(pid)
        }
      })
    }, this.WATCH_INTERVAL)
  }

  unwatch (pid) {
    clearInterval(processWatchList[pid])
  }

  exists (pid) {
    return this.processHandler.exists(pid)
  }
}

const settings = store.state.Settings.settings

let processManager = null

if (os.platform() === 'win32') {
  processManager = new ProcessHandlerWin(settings)
}

export default new ProcessManager(processManager)
