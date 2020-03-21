<template>
  <Window title="Settings">
    <div class="wrap">
      <div class="form-item">
        <label>SSHFS-Win Binary</label>
        <input type="text" autofocus placeholder="eg. C:\Program Files\SSHFS-Win\bin\sshfs-win.exe" v-model="data.sshfsBinary">
      </div>

      <div class="form-item">
        <label>
          <input type="checkbox" v-model="data.startupWithOS" disabled> <span>Startup with windows</span>
        </label>
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

const windowManager = remote.require('electron-window-manager')

export default {
  name: 'settings-window',

  components: {
    Window
  },

  methods: {
    cancel () {
      windowManager.closeCurrent()
    },

    save () {
      this.$store.dispatch('UPDATE_SETTINGS', this.data)

      windowManager.closeCurrent()
    }
  },

  computed: {
    data () {
      return this.$store.state.Settings.settings
    }
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
