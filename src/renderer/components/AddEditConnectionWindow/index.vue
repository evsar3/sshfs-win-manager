<template>
  <Window :title="title">
    <div class="wrap">
      <div class="form-item">
        <label>Name</label>
        <input type="text" autofocus placeholder="eg. My development server 1" v-model="conn.name">
      </div>

      <h1 class="section-title">Connection</h1>
      <div class="form-row">
        <div class="form-item">
          <label>IP/Host</label>
          <input type="text" placeholder="eg. 127.0.0.1 or my.domain.com" v-model="conn.host">
        </div>
        <div class="form-item" style="flex: 0 0 80px">
          <label>Port</label>
          <input type="text" placeholder="eg. 22" v-model.number="conn.port">
        </div>
      </div>
      <div class="form-item">
        <label>User</label>
        <input type="text" placeholder="eg. root" v-model="conn.user">
      </div>
      <div class="form-item">
        <label>Authentication method</label>
        <select v-model="conn.authType">
          <option value="password">Password</option>
          <option value="key-file">Private Key (file)</option>
          <!-- <option value="key-input" disabled>Private Key (input)</option> -->
        </select>
      </div>
      <div v-show="conn.authType === 'password'" class="form-item">
        <label>Password</label>
        <input type="password" v-model="conn.password">
      </div>
      <div v-show="conn.authType === 'key-file'" class="form-item">
        <label>Key File</label>
        <input type="text" placeholder="eg. C:\Users\me\.ssh\id_rsa.pub" v-model="conn.keyFile">
      </div>
      <div v-show="conn.authType === 'key-input'" class="form-item">
        <label>Key</label>
        <textarea placeholder="eg. ssh-rsa AAAAB3Nz..." v-model="conn.key"></textarea>
      </div>

      <h1 class="section-title">Remote</h1>
      <div class="form-item">
        <label>Path</label>
        <input type="text" placeholder="eg. /home/john" v-model="conn.folder">
      </div>

      <h1 class="section-title">Local</h1>
      <div class="form-item">
        <label>Drive letter</label>
        <select v-model="conn.mountPoint">
          <option v-for="drive in drives" :value="drive + ':'" :key="drive">{{drive}}:</option>
        </select>
      </div>

      <div class="footer">
        <button class="btn" @click="cancel">Cancel</button>
        <button class="btn default" @click="save">Save</button>
      </div>
    </div>
  </Window>
</template>

<script>
import { remote } from 'electron'
import { v4 as uuid } from 'uuid'

import Window from '@/components/Window'

const windowManager = remote.require('electron-window-manager')

export default {
  name: 'add-edit-connection-window',

  components: {
    Window
  },

  methods: {
    cancel () {
      windowManager.closeCurrent()
    },

    save () {
      if (this.isEditingMode) {
        this.$store.dispatch('UPDATE_CONNECTION', this.conn)
      } else {
        this.$store.dispatch('ADD_CONNECTION', this.conn)
      }

      windowManager.closeCurrent()
    }
  },

  data () {
    return {
      isEditingMode: false,

      title: 'Add Connection',
      drives: 'EFGHIJKLMNOPQRSTUVWXYZ',

      conn: {
        uuid: uuid(),
        name: '',
        host: '',
        port: 22,
        user: '',
        folder: '/',
        authType: 'password',
        password: '',
        keyFile: process.env.USERPROFILE + '\\.ssh\\id_rsa',
        key: '',
        mountPoint: 'E:',
        status: 'disconnected',
        pid: 0
      }
    }
  },

  mounted () {
    if (this.$route.name === 'edit-connection') {
      this.isEditingMode = true

      this.title = 'Edit Connection'

      this.conn = this.$store.state.Data.connections.find(a => a.uuid === this.$route.params.uuid)
    }
  }
}
</script>

<style lang="less" scoped>
.wrap .footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  text-align: right;
}
</style>
