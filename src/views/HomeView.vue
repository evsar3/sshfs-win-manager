<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

import ConnectionItem from '../components/ConnectionItem.vue'
import ConnectionOptionsEditor from '../components/ConnectionOptionsEditor.vue'
import DialogModal from '../components/DialogModal.vue'
import GroupItem from '../components/GroupItem.vue'

import { Connection, useConnectionStore } from '../store/connections'
import { Group, useGroupStore } from '../store/groups'
import { useMainStore } from '../store/main'
import { useSettingsStore } from '../store/settings'

const appReady = ref(false)

const connectionStore = useConnectionStore()
const groupStore = useGroupStore()
const settingsStore = useSettingsStore()
const mainStore = useMainStore()

const draggingConnection = ref<Connection | null>(null)
const dropoverGroup = ref<Group | null>(null)

const isEditing = ref(false)

const showGroupEditor = ref(false)
const groupEditorData = ref<Partial<Group>>({})

const showConnectionEditor = ref(false)
const connectionEditorData = ref<Partial<Connection>>({})

const showSettings = ref(false)

const showGroupDeletionConfirmation = ref(false)
const deleteGroupId = ref('')

const showConnectionDeletionConfirmation = ref(false)
const deleteConnectionId = ref('')

const connections = computed<Connection[]>(() => {
  return mainStore.getActiveGroup()?.connections.map((id) => connectionStore.get(id)) ?? []
})

function connect(connection: Connection): void {
  connection.status = 'connecting'

  setTimeout(() => {
    connection.status = 'connected'
  }, 3000)
}

function disconnect(connection: Connection): void {
  connection.status = 'disconnected'
}

function groupDrop(event: DragEvent): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const group: Group = (event as any).target.__vnode.ctx.props.group

  dropoverGroup.value = null

  if (group.id === 'all') {
    groupStore.removeConnection(mainStore.activeGroupId, draggingConnection.value!.id)
    return
  }

  groupStore.addConnection(group.id, draggingConnection.value!.id)
}

function openGroupEditor(group?: Group): void {
  if (group) {
    groupEditorData.value = { ...group }
    isEditing.value = true
  } else {
    groupEditorData.value = {}
    isEditing.value = false
  }

  showGroupEditor.value = true
}

function openConnectionEditor(connection?: Connection): void {
  if (connection) {
    connectionEditorData.value = { ...connection }
    isEditing.value = true
  } else {
    connectionEditorData.value = {
      port: '22',
      authMethod: 'password',
      options: []
    }
    isEditing.value = false
  }

  showConnectionEditor.value = true
}

function resetGroupEditorData(): void {
  groupEditorData.value = {}
  showGroupEditor.value = false
}

function resetConnectionEditorData(): void {
  connectionEditorData.value = {}
  showConnectionEditor.value = false
}

function saveGroup(): void {
  if (isEditing.value) {
    groupStore.update(groupEditorData.value as Group)
  } else {
    groupStore.add(groupEditorData.value as Group)
  }

  resetGroupEditorData()
}

function saveConnection(): void {
  if (isEditing.value) {
    connectionStore.update(connectionEditorData.value as Connection)
  } else {
    connectionStore.add(connectionEditorData.value as Connection)
  }

  resetConnectionEditorData()
}

function openGroupDeletionConfirmation(group: Group): void {
  deleteGroupId.value = group.id
  showGroupDeletionConfirmation.value = true
}

function browseConnectionKeyFile(): void {
  window.electronAPI
    .dialog({
      properties: ['openFile']
    })
    .then((result) => {
      if (result.canceled) return

      connectionEditorData.value.keyFile = result.filePaths[0]
    })
}

function browseSshfsBin(): void {
  window.electronAPI
    .dialog({
      properties: ['openFile'],
      filters: [{ name: 'Executable', extensions: ['exe'] }]
    })
    .then((result) => {
      if (result.canceled) return

      settingsStore.settings.sshfsBin = result.filePaths[0]
    })
}

function deleteGroup(): void {
  mainStore.activeGroupId = 'all'
  groupStore.remove(deleteGroupId.value)
  showGroupDeletionConfirmation.value = false
}

function openConnectionDeletionConfirmation(connection: Connection): void {
  deleteConnectionId.value = connection.id
  showConnectionDeletionConfirmation.value = true
}

function deleteConnection(): void {
  connectionStore.remove(deleteConnectionId.value)
  showConnectionDeletionConfirmation.value = false
}

function cloneConnection(connection: Connection): void {
  const conn = connectionStore.add({
    ...connection,
    name: `${connection.name} (Copy)`
  })

  if (mainStore.activeGroupId !== 'all') {
    groupStore.addConnection(mainStore.activeGroupId, conn.id)
  }
}

onMounted(() => {
  setTimeout(() => {
    appReady.value = true
  }, 2000)
})
</script>

<template>
  <nav class="handle"></nav>

  <div v-if="!appReady" class="app-loading"></div>

  <main v-else>
    <aside>
      <h1 class="title">
        Groups

        <button class="btn btn-icon" :disabled="mainStore.dragMode" @click="openGroupEditor()">
          <v-icon name="co-plus" scale=".8" />
        </button>
      </h1>

      <section class="group-list">
        <VueDraggableNext v-model="groupStore.groups" handle=".handle">
          <GroupItem
            v-for="group in groupStore.groups"
            :key="group.id"
            :group="group"
            :style="{
              backgroundColor:
                group.id === dropoverGroup?.id && draggingConnection !== null
                  ? 'var(--theme-contrast-color-opacity-3)'
                  : undefined
            }"
            @click="mainStore.activeGroupId = group.id"
            @dragover="dropoverGroup = group"
            @dragleave="dropoverGroup = null"
            @drop="groupDrop"
            @edit="openGroupEditor"
            @delete="openGroupDeletionConfirmation"
          />
        </VueDraggableNext>
      </section>
    </aside>

    <article>
      <nav class="controls">
        <button
          class="btn btn-icon"
          :class="{ active: mainStore.dragMode }"
          @click="mainStore.dragMode = !mainStore.dragMode"
        >
          <v-icon name="co-swap-vertical" />
        </button>
        <button @click="showSettings = true" class="btn btn-icon btn-space-left">
          <v-icon name="co-cog" />
        </button>
        <button
          class="btn btn-icon btn-primary btn-space-left"
          :disabled="mainStore.dragMode"
          @click="openConnectionEditor()"
        >
          <v-icon name="co-plus" />
        </button>
      </nav>

      <section class="connection-list">
        <VueDraggableNext
          v-model="mainStore.getActiveGroup().connections"
          handle=".handle"
          @choose="draggingConnection = $event.item.__vnode.ctx.props.connection"
          @unchoose="draggingConnection = null"
        >
          <ConnectionItem
            v-for="connection in connections"
            :key="connection.id"
            :connection="connection"
            :group-id="mainStore.activeGroupId"
            :draggable="mainStore.dragMode"
            @connect="connect"
            @disconnect="disconnect"
            @edit="openConnectionEditor"
            @delete="openConnectionDeletionConfirmation"
            @clone="cloneConnection"
          />
        </VueDraggableNext>
      </section>
    </article>
  </main>

  <DialogModal :title="(isEditing ? 'Edit' : 'New') + ' Group'" v-model:show="showGroupEditor">
    <div class="form-row">
      <div class="input-group">
        <label>
          <span>Name</span>
          <input
            v-model="groupEditorData.name"
            class="form-input"
            style="width: 300px"
            placeholder="Group Name"
          />
        </label>
      </div>
    </div>

    <template #actions>
      <button class="btn" @click="resetGroupEditorData">Cancel</button>
      <button class="btn btn-primary btn-space-left" @click="saveGroup">
        {{ isEditing ? 'Save' : 'Create' }}
      </button>
    </template>
  </DialogModal>

  <DialogModal
    :title="(isEditing ? 'Edit' : 'New') + ' Connection'"
    v-model:show="showConnectionEditor"
  >
    <div class="form-row" style="width: 500px">
      <div class="input-group">
        <label>
          <span>Name</span>
          <input
            v-model="connectionEditorData.name"
            class="form-input"
            placeholder="Connection Name"
          />
        </label>
      </div>
    </div>

    <h2 class="form-section-title">Connection</h2>

    <div class="form-row">
      <div class="input-group">
        <label>
          <span>Host</span>
          <input
            v-model="connectionEditorData.host"
            class="form-input"
            placeholder="Hostname or IP"
          />
        </label>
      </div>
      <div class="input-group" style="flex: 0 0 60px">
        <label>
          <span>Port</span>
          <input v-model="connectionEditorData.port" class="form-input" placeholder="Port" />
        </label>
      </div>
    </div>

    <div class="form-row">
      <div class="input-group">
        <label>
          <span>Username</span>
          <input
            v-model="connectionEditorData.username"
            class="form-input"
            placeholder="Username"
          />
        </label>
      </div>
      <div class="input-group">
        <label>
          <span>Auth Method</span>
          <select v-model="connectionEditorData.authMethod" class="form-input">
            <option value="password">Password</option>
            <option value="key-file">Private Key (file)</option>
            <option value="key">Private Key</option>
            <option value="request-password">Ask for Password</option>
            <option value="agent">Agent</option>
          </select>
        </label>
      </div>
    </div>

    <div v-if="connectionEditorData.authMethod === 'password'" class="form-row">
      <div class="input-group">
        <label>
          <span>Password</span>
          <input
            type="password"
            v-model="connectionEditorData.password"
            class="form-input"
            placeholder="Password"
          />
        </label>
      </div>
    </div>

    <div v-if="connectionEditorData.authMethod === 'key-file'" class="form-row">
      <div class="input-group">
        <label>
          <span>Key File</span>
          <input
            v-model="connectionEditorData.keyFile"
            class="form-input"
            placeholder="%UserProfile%\.ssh\id_rsa"
          />
        </label>
      </div>
      <div class="input-group" style="flex: 0">
        <label>
          <span>&nbsp;</span>
          <button class="btn btn-icon btn-primary" @click="browseConnectionKeyFile">
            <v-icon name="co-folder-open" />
          </button>
        </label>
      </div>
    </div>

    <div v-if="connectionEditorData.authMethod === 'key'" class="form-row">
      <div class="input-group">
        <label>
          <span>Private Key</span>
          <textarea
            v-model="connectionEditorData.key"
            class="form-input"
            placeholder="Paste your private key here"
            rows="5"
          ></textarea>
        </label>
      </div>
    </div>

    <div
      v-if="
        connectionEditorData.authMethod === 'key-file' || connectionEditorData.authMethod === 'key'
      "
      class="form-row"
    >
      <div class="input-group">
        <label>
          <span>Passphrase</span>
          <input
            type="password"
            v-model="connectionEditorData.keyPassphrase"
            class="form-input"
            placeholder="Private key passphrase"
          />
        </label>
      </div>
    </div>

    <h2 class="form-section-title">Remote</h2>

    <div class="form-row">
      <div class="input-group">
        <label>
          <span>Remote Path</span>
          <input
            v-model="connectionEditorData.remotePath"
            class="form-input"
            placeholder="/home/user"
          />
        </label>
      </div>
    </div>

    <h2 class="form-section-title">Local</h2>

    <div class="form-row">
      <div class="input-group">
        <label>
          <input
            type="checkbox"
            v-model="connectionEditorData.automaticMountPoint"
            class="form-input"
          />
          <span>Automatic Mount Point</span>
        </label>
      </div>
    </div>

    <div v-if="!connectionEditorData.automaticMountPoint" class="form-row">
      <div class="input-group">
        <label>
          <span>Mount Point</span>
          <input
            v-model="connectionEditorData.mountPoint"
            class="form-input"
            placeholder="Drive letter or mount path"
          />
        </label>
      </div>
    </div>

    <h2 class="form-section-title">Options</h2>

    <div class="form-row">
      <div class="input-group">
        <label>
          <input
            v-model="connectionEditorData.connectOnStartup"
            type="checkbox"
            class="form-input"
          />
          <span>Connect on Startup</span>
        </label>
      </div>
    </div>

    <h2 class="form-section-title">Command Line Args</h2>

    <div class="form-row">
      <div class="input-group">
        <ConnectionOptionsEditor v-model="connectionEditorData.options" />
      </div>
    </div>

    <template #actions>
      <button class="btn" @click="resetConnectionEditorData">Cancel</button>
      <button class="btn btn-primary btn-space-left" @click="saveConnection">
        {{ isEditing ? 'Save' : 'Create' }}
      </button>
    </template>
  </DialogModal>

  <DialogModal title="Settings" v-model:show="showSettings">
    <div class="form-row" style="width: 350px">
      <div class="input-group">
        <label>
          <span>SSHFS Binary</span>
          <input
            v-model="settingsStore.settings.sshfsBin"
            class="form-input"
            placeholder="C:\Program Files\SSHFS-Win\bin\sshfs.exe"
          />
        </label>
      </div>
      <div class="input-group" style="flex: 0">
        <label>
          <span>&nbsp;</span>
          <button class="btn btn-icon btn-primary" @click="browseSshfsBin">
            <v-icon name="co-folder-open" />
          </button>
        </label>
      </div>
    </div>

    <div class="form-row" style="width: 180px">
      <div class="input-group">
        <label>
          <span>Process Status Check Interval</span>
          <input
            v-model="settingsStore.settings.processStatusCheckInterval"
            class="form-input"
            placeholder="Interval in seconds"
          />
        </label>
      </div>
    </div>

    <div class="form-row" style="width: 180px">
      <div class="input-group">
        <label>
          <span>Theme</span>
          <select v-model="settingsStore.settings.theme" class="form-input">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">System</option>
          </select>
        </label>
      </div>
    </div>

    <div class="form-row">
      <div class="input-group">
        <label>
          <input
            type="checkbox"
            v-model="settingsStore.settings.startupWithOS"
            class="form-input"
          />
          <span>Launch at Startup</span>
        </label>
      </div>
    </div>

    <template #actions>
      <button @click="showSettings = false" class="btn btn-primary">Close</button>
    </template>
  </DialogModal>

  <DialogModal title="Delete Group" v-model:show="showGroupDeletionConfirmation">
    <div class="deletion-message">
      <h3>Are you sure you want to delete this group?</h3>
      <p>Deleting this group won't delete connections linked to it.</p>
    </div>

    <template #actions>
      <button class="btn" @click="showGroupDeletionConfirmation = false">Cancel</button>
      <button class="btn btn-danger btn-space-left" @click="deleteGroup">Delete</button>
    </template>
  </DialogModal>

  <DialogModal title="Delete Connection" v-model:show="showConnectionDeletionConfirmation">
    <div class="deletion-message">
      <h3>Are you sure you want to delete this connection?</h3>
      <p v-if="mainStore.activeGroupId !== 'all'">
        If you want to remove this connection from this specific group,<br />
        you can do so by dragging it to the "All" group.
      </p>
    </div>

    <template #actions>
      <button class="btn" @click="showConnectionDeletionConfirmation = false">Cancel</button>
      <button class="btn btn-danger btn-space-left" @click="deleteConnection">Delete</button>
    </template>
  </DialogModal>
</template>

<style lang="less" scoped>
@handle-bar-height: 30px;

.handle {
  height: @handle-bar-height;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  -webkit-app-region: drag;
}

.app-loading {
  width: 100%;
  height: 100%;
  background-color: var(--theme-color);
  display: flex;
  justify-content: center;
  align-items: center;

  &:before {
    content: '';
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 5px solid var(--theme-contrast-color-opacity-3);
    border-top-color: var(--theme-contrast-color);
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}

main {
  display: flex;
  height: 100%;

  > aside,
  > article {
    display: flex;
    flex-direction: column;
  }

  > aside {
    flex: 0 0 35%;
    background-color: var(--theme-contrast-color-opacity-05);

    > .title {
      font-size: 14pt;
      margin: (@handle-bar-height + 20px) 20px 0 20px;
      opacity: 0.7;
      font-weight: bold;

      button {
        float: right;
        width: 24px !important;
        height: 24px !important;
      }
    }

    > .group-list {
      flex: 1;
      padding: 20px;
      overflow: hidden auto;
    }
  }

  > article {
    flex: 1;
    display: flex;
    flex-direction: column;

    > .controls {
      text-align: right;
      margin: @handle-bar-height 20px 10px 20px;
    }

    > .connection-list {
      flex: 1;
      padding: 0 20px 20px 20px;
      overflow: hidden auto;
    }
  }
}

.deletion-message {
  p {
    margin-top: 10px;
    opacity: 0.7;
  }
}
</style>
