<template>
  <Window :title="`Password for ${conn.user}@${conn.host}`">
    <div class="wrap">
      <div class="form-item">
        <label>Password</label>
        <input type="password" autofocus v-model="password" @keydown.enter="ok" @keydown.esc="cancel">
      </div>

      <div class="footer">
        <button class="btn" @click="cancel">Cancel</button>
        <button class="btn default" @click="ok">OK</button>
      </div>
    </div>
  </Window>
</template>

<script>
import { remote } from 'electron'

import Window from '@/components/Window'

const windowManager = remote.require('electron-window-manager')

export default {
  name: 'password-prompt-window',

  components: {
    Window
  },

  methods: {
    cancel () {
      windowManager.bridge.emit('main-window-message', {
        message: 'connection-password-cancel',
        conn: this.conn
      })

      windowManager.closeCurrent()
    },

    ok () {
      this.conn.password = this.password

      windowManager.bridge.emit('main-window-message', {
        message: 'connection-password',
        conn: this.conn
      })

      windowManager.closeCurrent()
    }
  },

  data () {
    return {
      password: '',
      conn: null
    }
  },

  mounted () {
    this.conn = this.$store.state.Data.connections.find(a => a.uuid === this.$route.params.uuid)
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
