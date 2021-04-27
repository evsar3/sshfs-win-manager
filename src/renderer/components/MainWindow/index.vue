<template>
  <Window title="SSHFS-Win Manager" closeAction="hide" @close="showRunningInBackgroundNotification">
    <div class="wrap">
      <div class="left">
        <div class="connection-list" :class="{'has-debug-panel': appSettings.showDebugPanel}">
          <div v-if="!hasConnections" class="no-data">
            <h1>No servers added yet</h1>
            <p>Try clicking at 'Add Server' in the panel aside</p>
          </div>

          <draggable :list="connections" @end="updateConnectionList" chosenClass="highlight-item" dragClass="hide-dragging-item" handle=".grip" animation="200">
            <ConnectionItem v-for="conn in connections" :key="conn.uuid" :conn="conn" :mode="listMode" @connect="connect" @disconnect="disconnect" @open="openLocal" @edit="editConnection" @delete="deleteConnection" @clone="cloneConnection"/>
          </draggable>
        </div>

        <div v-show="appSettings.showDebugPanel" class="debug-panel">
          <div class="title">DEBUG OUTPUT</div>
          <div class="debug-actions">
            <button v-tooltip="'Clear debug output'" @click="clearDebugOutput">
              <Icon icon="unavailable"/>
            </button>
            <button v-tooltip="'Copy debug output to clipboard'" @click="copyDebugOutput">
              <Icon icon="duplicate"/>
            </button>
          </div>
          <textarea v-model="debugOutput" readonly ref="debugOutput"></textarea>
        </div>
      </div>

      <div class="right">
        <button class="btn" :disabled="listMode !== 'none'" @click="addNewConnection">
          <Icon icon="plus"/>
          Add Connection
        </button>

        <div class="sep"></div>

        <button class="btn" :class="{ 'active': isEditModeEnabled }" :disabled="!hasConnections" @click="toggleEditMode">
          <Icon icon="pen"/>
          Edit mode
        </button>
        <button class="btn" :class="{ 'active': isDeleteModeEnabled }" :disabled="!hasConnections" @click="toggleDeleteMode">
          <Icon icon="trashCan"/>
          Delete mode
        </button>

        <div class="bottom-actions">
          <button v-if="isDev" class="btn" @click="clearVuex">
            <Icon icon="unavailable"/>
            Clear Vuex State
          </button>
          <button class="btn" @click="settings">
            <Icon icon="settings"/>
            Settings
          </button>
          <button class="btn" @click="about">
            <Icon icon="help"/>
            About
          </button>
        </div>
      </div>
    </div>
  </Window>
</template>

<script>
import fs from 'fs'
import { remote, clipboard } from 'electron'

import { v4 as uuid } from 'uuid'

import draggable from 'vuedraggable'

import ProcessManager from '@/ProcessManager'

import Window from '@/components/Window'
import Icon from '@/components/Icon'
import ConnectionItem from './ConnectionItem'

const windowManager = remote.require('electron-window-manager')

export default {
  name: 'main-window',

  components: {
    draggable,

    Window,
    Icon,

    ConnectionItem
  },

  methods: {
    toggleDeleteMode () {
      this.listMode = this.listMode === 'delete' ? 'none' : 'delete'
    },

    toggleEditMode () {
      this.listMode = this.listMode === 'edit' ? 'none' : 'edit'
    },

    connect (conn) {
      conn.status = 'connecting'

      const connect = c => {
        ProcessManager.create(c).then(pid => {
          conn.pid = pid
          conn.status = 'connected'

          this.updateConnectionList()
        }).catch(error => {
          conn.status = 'disconnected'

          this.updateConnectionList()

          this.notify(`Can't connect to '${conn.name}': ${error}`, 'error-icon')
        })
      }

      if (conn.authType === 'password-ask') {
        const window = windowManager.createNew('password-prompt-window', '', `/index.html#password-prompt/${conn.uuid}`, null, {
          height: 190,
          width: 350,
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

        windowManager.bridge.once('main-window-message', data => {
          switch (data.message) {
            case 'connection-password':
              connect(data.conn)
              break

            case 'connection-password-cancel':
              conn.status = 'disconnected'
              break
          }
        })
      } else {
        connect(conn)
      }
    },

    disconnect (conn) {
      conn.status = 'disconnecting'

      ProcessManager.terminate(conn.pid).then(() => {
        conn.status = 'disconnected'

        this.updateConnectionList()
      })
    },

    openLocal (path) {
      remote.shell.openItem(path)
    },

    addNewConnection () {
      const window = windowManager.createNew('add-new-connection-window', '', '/index.html#add-new-connection', null, {
        height: 770,
        width: 500,
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
    },

    editConnection (conn) {
      const window = windowManager.createNew('edit-connection-window', '', `/index.html#edit-connection/${conn.uuid}`, null, {
        height: 770,
        width: 500,
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
    },

    cloneConnection (conn) {
      const connCopy = {...conn}

      const randName = Math.random().toString(30).substr(-4)

      connCopy.uuid = uuid()
      connCopy.name += ` (copy-${randName})`

      this.$store.dispatch('ADD_CONNECTION', connCopy)
    },

    deleteConnection (conn) {
      this.$store.dispatch('DELETE_CONNECTION', conn)

      setTimeout(() => {
        if (this.connections.length === 0) {
          this.listMode = 'none'
        }
      }, 200)
    },

    settings () {
      const window = windowManager.createNew('settings-window', '', '/index.html#settings', null, {
        height: 365,
        width: 500,
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
    },

    about () {
      const window = windowManager.createNew('about-window', '', '/index.html#about', null, {
        height: 350,
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
    },

    showRunningInBackgroundNotification () {
      if (!this.runningInBackgroundNotificationShowed) {
        if (this.$store.state.Settings.settings.displayTrayMessageOnClose) {
          this.notify('Program still running in the system tray')

          this.runningInBackgroundNotificationShowed = true
        }
      }
    },

    clearVuex () {
      this.$store.dispatch('CLEAR_CONNECTIONS')
      this.$store.dispatch('RESET_SETTINGS')
    },

    notify (text, icon = 'app-icon') {
      /* eslint-disable-next-line */
      new Notification('SSHFS-Win Manager', {
        icon: __static + '/' + icon + '.png',
        body: text
      })
    },

    getConnectionByPid (pid) {
      return this.connections.find(a => a.pid === pid)
    },

    clearDebugOutput () {
      this.debugOutput = ''
    },

    copyDebugOutput () {
      clipboard.writeText(this.debugOutput)

      this.notify('Debug output copied to clipboard')
    },

    updateConnectionList () {
      this.$store.dispatch('REFRESH_CONNECTIONS', this.connections)
    }
  },

  computed: {
    hasConnections () {
      return this.connections.length > 0
    },

    isEditModeEnabled () {
      return this.listMode === 'edit'
    },

    isDeleteModeEnabled () {
      return this.listMode === 'delete'
    },

    isDev () {
      return process.env.NODE_ENV === 'development'
    },

    connections () {
      return this.$store.state.Data.connections
    },

    appSettings () {
      return this.$store.state.Settings.settings
    }
  },

  data () {
    return {
      listMode: 'none',
      runningInBackgroundNotificationShowed: false,
      debugOutput: ''
    }
  },

  mounted () {
    const originalConsoleLog = console.log.bind(console)

    console.log = (...args) => {
      if (this.appSettings.showDebugPanel) {
        const data = args.join(' ').trim()

        if (!data.match(/\[?\d{5}\]?/gm)) {
          this.debugOutput += '\n' + data

          this.$nextTick().then(() => {
            this.$refs.debugOutput.scrollTop = this.$refs.debugOutput.scrollHeight
          })
        }
      }

      originalConsoleLog(...args)
    }

    this.connections.forEach(conn => {
      conn.status = 'disconnected'
      conn.pid = null

      if (conn.advanced.connectOnStartup) {
        this.connect(conn)
      }
    })

    ProcessManager.on('terminated', pid => {
      let conn = this.getConnectionByPid(pid)

      if (conn) {
        conn.pid = null
        conn.status = 'disconnected'
      }
    })

    ProcessManager.on('not-found', pid => {
      let conn = this.getConnectionByPid(pid)

      if (conn) {
        conn.pid = null
        conn.status = 'disconnected'

        this.notify(`'${conn.name}' was disconnected due to a connection error.\nCheck your internet connection`, 'error-icon')
      }
    })

    ProcessManager.on('timeout', conn => {
      if (fs.existsSync(conn.mountPoint)) {
        ProcessManager.getLastSpawnedProcess().then(process => {
          let foundConnection = this.connections.find(i => i.pid === process.pid)

          if (!foundConnection) {
            conn.pid = process.pid
            conn.status = 'connected'

            ProcessManager.watch(process.pid)

            this.notify(`'${conn.name}' tracked using alternative method`)
          }
        })
      } else {
        conn.pid = null
        conn.status = 'disconnected'

        this.notify(`Process Timeout: Couldn't connect to '${conn.name}'`, 'error-icon')
      }
    })
  }
}
</script>

<style lang="less" scoped>
.wrap {
  padding: 0;
  display: flex;

  .left {
    @debug-panel-height: 200px;

    flex: 1;
    height: calc(100vh - 32px);
    position: relative;

    .connection-list {
      height: 100%;
      overflow: auto;

      &.has-debug-panel {
        height: calc(100% - @debug-panel-height);
      }

      .no-data {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: fade(contrast(@main-color), 20%);
      }
    }

    .debug-panel {
      position: relative;
      height: @debug-panel-height;
      border-top: 1px solid lighten(@main-color, 1%);

      .title {
        font-size: 10pt;
        color: fade(contrast(@main-color), 30%);
        padding: 10px;
      }

      .debug-actions {
        position: absolute;
        top: 7px;
        right: 10px;

        button {
          margin-left: 3px;
          width: 25px;
          height: 25px;
          border: none;
          border-radius: 100%;
          padding: 4px;
          background: fade(contrast(@main-color), 5%);
          cursor: pointer;
          outline: none;

          &:hover {
            background: @primary-color;
          }

          &:active {
            background: darken(@primary-color, 5%);
          }

          svg {
            fill: contrast(@main-color);
          }
        }
      }

      textarea {
        width: 100%;
        height: calc(100% - 38px);
        background: transparent;
        border: none;
        font-family: 'Consolas', 'Courier New', Courier, monospace;
        padding: 10px;
        color: #2FFF54;
        outline: none;
        resize: none;
      }
    }
  }

  .right {
    position: relative;
    width: 200px;
    background: lighten(@main-color, 3%);
    padding: 15px;

    .bottom-actions {
      position: absolute;
      bottom: 12px;
      left: 15px;
      right: 15px;
    }

    button {
      width: 100%;
    }

    .sep {
      width: 100%;
      border-bottom: 1px solid fade(contrast(@main-color), 5%);
      margin-bottom: 5px;
    }
  }
}

.hide-dragging-item {
  opacity: 0;
}
.highlight-item {
  border: 1px solid @primary-color;
}
</style>
