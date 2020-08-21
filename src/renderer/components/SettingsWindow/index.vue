<template>
  <Window title="Settings">
    <div class="wrap">
      <div class="form-item">
        <label>SSHFS-Win Binary</label>
        <input type="text" autofocus placeholder="eg. C:\Program Files\SSHFS-Win\bin\sshfs-win.exe" v-model="data.sshfsBinary">
      </div>

      <div class="form-item" style="margin: 10px 0">
        <div class="check-item">
          <label>Startup with windows <toggle-button :color="toggleButtonColor" v-model="data.startupWithOS" sync labels></toggle-button></label>
        </div>
        <div class="check-item">
          <label>Display system tray message on close <toggle-button :color="toggleButtonColor" v-model="data.displayTrayMessageOnClose" sync labels></toggle-button></label>
        </div>
      </div>

      <div class="footer">
        <button class="btn" @click="cancel">Cancel</button>
        <button class="btn default" @click="save">OK</button>
      </div>
    </div>
  </Window>
</template>

<script>
import { remote } from 'electron'

import Window from '@/components/Window'

import { ToggleButton } from 'vue-js-toggle-button'

const windowManager = remote.require('electron-window-manager')
const app = remote.require('electron').app

export default {
  name: 'settings-window',

  components: {
    Window,
    ToggleButton
  },

  methods: {
    cancel () {
      windowManager.closeCurrent()
    },

    save () {
      this.$store.dispatch('UPDATE_SETTINGS', this.data)

      app.setLoginItemSettings({
        ...{
          openAtLogin: this.data.startupWithOS
        },
        ...this.loginItemSettings
      })

      windowManager.closeCurrent()
    }
  },

  computed: {
    data () {
      return this.$store.state.Settings.settings
    }
  },

  data () {
    return {
      toggleButtonColor: {
        checked: '#2486d8',
        unchecked: 'rgba(255, 255, 255, 0.1)'
      },
      loginItemSettings: {
        args: [
          '--systray'
        ]
      }
    }
  },

  mounted () {
    const settings = app.getLoginItemSettings(this.loginItemSettings)

    this.data.startupWithOS = settings.openAtLogin
  }
}
</script>

<style lang="less" scoped>
.wrap {
  padding: 15px 20px;

  .form-item .check-item .vue-js-switch {
    float: right;
    clear: both;
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 15px;
    text-align: right;
  }
}
</style>
