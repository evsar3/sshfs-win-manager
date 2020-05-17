import { EventEmitter } from 'events'
import os from 'os'

import store from './store'
import ProcessManagerWin from './ProcessManagerWin'

class SSHFSProcessManager extends EventEmitter {
  WATCH_INTERVAL = 5000

  watchTimers = []

  constructor (processManager) {
    super()

    this.processManager = processManager
  }

  create (conn) {
    return new Promise((resolve, reject) => {
      this.processManager.create(conn).then((pid, process) => {
        this.emit('created', {
          conn,
          pid
        })

        this.watch(pid)

        resolve(pid)
      }).catch(error => {
        reject(error)
      })
    })
  }

  terminate (pid) {
    return new Promise((resolve, reject) => {
      this.processManager.terminate(pid).then(() => {
        this.emit('terminated', pid)

        this.unwatch(pid)

        resolve()
      })
    })
  }

  watch (pid) {
    this.watchTimers[pid] = setInterval(() => {
      this.exists(pid).then(exists => {
        if (!exists) {
          this.emit('not-found', pid)

          this.unwatch(pid)
        }
      })
    }, this.WATCH_INTERVAL)
  }

  unwatch (pid) {
    clearInterval(this.watchTimers[pid])
  }

  exists (pid) {
    return this.processManager.exists(pid)
  }
}

const settings = store.state.Settings.settings

let processManager = null

if (os.platform() === 'win32') {
  processManager = new ProcessManagerWin(settings)
}

export default new SSHFSProcessManager(processManager)
