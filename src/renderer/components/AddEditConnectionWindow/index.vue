<template>
  <Window :title="title">
    <div class="wrap">
      <Tabs>
        <Tab label="BASIC" active>
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
            <select v-model="conn.authType" @change="authTypeChange">
              <option value="password">Password</option>
              <option value="password-ask">Password (ask on connect)</option>
              <option value="key-file">Private Key (file)</option>
              <!-- <option value="key-input" disabled>Private Key (input)</option> -->
            </select>
          </div>
          <div v-show="conn.authType === 'password'" class="form-item">
            <label>Password</label>
            <input type="password" v-model="conn.password">
          </div>
          <div v-show="conn.authType === 'key-file'" class="form-row">
            <div class="form-item">
              <label>Key File</label>
              <input type="text" placeholder="eg. C:\Users\me\.ssh\id_rsa" v-model="conn.keyFile">
            </div>
            <div class="form-item" style="flex: 0">
              <button class="btn icon-btn" style="margin-top: 23px" @click="selectPrivateKey" v-tooltip="'Select private key'">
                <Icon icon="openFolder"/>
              </button>
            </div>
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
        </Tab>
        <Tab label="ADVANCED">
          <div class="form-item">
            <SwitchLabel label="Connect on Startup" v-model="conn.advanced.connectOnStartup"/>
          </div>

          <div class="form-item">
            <SwitchLabel label="Custom Command Line params" v-model="conn.advanced.customCmdlOptionsEnabled"/>

            <CustomCmdlOptions v-model="conn.advanced.customCmdlOptions"/>
          </div>
        </Tab>
      </Tabs>

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
import Tabs from '@/components/Tabs/Tabs'
import Tab from '@/components/Tabs/Tab'
import SwitchLabel from '@/components/SwitchLabel'
import CustomCmdlOptions from './CustomCmdlOptions'
import Icon from '../Icon'

const windowManager = remote.require('electron-window-manager')

export default {
  name: 'add-edit-connection-window',

  components: {
    Window,
    Tabs,
    Tab,
    SwitchLabel,
    CustomCmdlOptions,
    Icon
  },

  methods: {
    cancel () {
      windowManager.closeCurrent()
    },

    save () {
      this.conn.advanced.customCmdlOptions =
        this.conn.advanced.customCmdlOptions.filter(a => a.name !== '')

      if (this.isEditingMode) {
        this.$store.dispatch('UPDATE_CONNECTION', this.conn)
      } else {
        this.$store.dispatch('ADD_CONNECTION', this.conn)
      }

      windowManager.closeCurrent()
    },

    authTypeChange () {
      this.conn.password = ''
      this.conn.keyFile = process.env.USERPROFILE + '\\.ssh\\id_rsa'
    },

    selectPrivateKey () {
      const file = remote.dialog.showOpenDialog({
        title: 'Select private key',
        properties: ['openFile'],
        defaultPath: process.env.USERPROFILE + '\\.ssh\\'
      })

      if (file) {
        this.conn.keyFile = file
      }
    }
  },

  data () {
    return {
      isEditingMode: false,

      title: 'Add Connection',
      drives: 'DEFGHIJKLMNOPQRSTUVWXYZ',

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
        pid: 0,
        advanced: {
          customCmdlOptionsEnabled: false,
          customCmdlOptions: [],
          connectOnStartup: false
        }
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
