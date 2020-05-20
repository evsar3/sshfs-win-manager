<template>
  <Window title="SSHFS-Win Manager" closeAction="hide" @close="showRunningInBackgroundNotification">
    <div class="wrap">
      <PerfectScrollbar class="list">
        <div v-if="!hasConnections" class="no-data">
          <h1>No servers added yet</h1>
          <p>Try clicking at 'Add Server' in the panel aside</p>
        </div>

        <ConnectionItem v-for="conn in connections" :key="conn.uuid" :conn="conn" :mode="listMode" @connect="connect" @disconnect="disconnect" @open="openLocal" @edit="editConnection" @delete="deleteConnection"/>
      </PerfectScrollbar>

      <div class="actions">
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
import { remote } from 'electron'

import ProcessManager from '@/ProcessManager'

import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import Window from '@/components/Window'
import Icon from '@/components/Icon'
import ConnectionItem from './ConnectionItem'

const windowManager = remote.require('electron-window-manager')

export default {
  name: 'main-window',

  components: {
    PerfectScrollbar,
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

      ProcessManager.create(conn).then(pid => {
        conn.pid = pid
        conn.status = 'connected'
      }).catch(error => {
        conn.status = 'disconnected'

        this.notify(`Can't connect to '${conn.name}': ${error}`, 'error-icon')
      })
    },

    disconnect (conn) {
      conn.status = 'disconnecting'

      ProcessManager.terminate(conn.pid).then(() => {
        conn.status = 'disconnected'
      })
    },

    openLocal (path) {
      remote.shell.openItem(path)
    },

    addNewConnection () {
      const window = windowManager.createNew('add-new-connection-window', '', '/index.html#add-new-connection', null, {
        height: 710,
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
        height: 710,
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
        height: 210,
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
    },

    showRunningInBackgroundNotification () {
      if (!this.runningInBackgroundNotificationShowed) {
        this.notify('Program still running in the system tray')

        this.runningInBackgroundNotificationShowed = true
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
    }
  },

  data () {
    return {
      listMode: 'none',
      runningInBackgroundNotificationShowed: false
    }
  },

  mounted () {
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
  }
}
</script>

<style lang="less" scoped>
.wrap {
  padding: 0;
  display: flex;

  .list {
    flex: 1;
    height: calc(100vh - 32px);
    position: relative;

    .no-data {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: fade(contrast(@main-color), 20%);
    }
  }

  .actions {
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
</style>

<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"/>
