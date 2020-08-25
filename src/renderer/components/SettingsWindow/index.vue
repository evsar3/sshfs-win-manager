<template>
  <Window title="Settings">
    <div class="wrap">
      <div class="form-item">
        <label>SSHFS-Win Binary</label>
        <input type="text" autofocus placeholder="eg. C:\Program Files\SSHFS-Win\bin\sshfs-win.exe" v-model="data.sshfsBinary">
      </div>

      <div class="form-item" style="margin: 10px 0">
        <SwitchLabel label="Startup with Windows" v-model="data.startupWithOS"/>
        <SwitchLabel label="Display system tray message on close" v-model="data.displayTrayMessageOnClose"/>
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
import SwitchLabel from '@/components/SwitchLabel'

const windowManager = remote.require('electron-window-manager')
const app = remote.require('electron').app

export default {
  name: 'settings-window',

  components: {
    Window,
    SwitchLabel
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
