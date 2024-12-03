<script lang="ts" setup>
import { computed, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

import ConnectionItem from '../components/ConnectionItem.vue'
import DialogModal from '../components/DialogModal.vue'
import GroupItem from '../components/GroupItem.vue'

import { Connection, useConnectionStore } from '../store/connections'
import { Group, useGroupStore } from '../store/groups'
import { useMainStore } from '../store/main'
import { useSettingsStore } from '../store/settings'

const mainStore = useMainStore()
const connectionStore = useConnectionStore()
const groupStore = useGroupStore()
const settingsStore = useSettingsStore()

const draggingConnection = ref<Connection | null>(null)
const dropoverGroup = ref<Group | null>(null)

const showGroupEditor = ref(false)
const groupEditorData = ref<Partial<Group>>({})
const isEditingGroup = ref(false)

const showSettings = ref(false)

const showGroupDeletionConfirmation = ref(false)
const deleteGroupId = ref('')

const showConnectionDeletionConfirmation = ref(false)
const deleteConnectionId = ref('')

const connections = computed<Connection[]>(() => {
  return mainStore.getActiveGroup().connections.map((id) => connectionStore.get(id))
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
    isEditingGroup.value = true
  } else {
    groupEditorData.value = {}
    isEditingGroup.value = false
  }

  showGroupEditor.value = true
}

function resetGroupEditorData(): void {
  groupEditorData.value = {}

  showGroupEditor.value = false
}

function saveGroup(): void {
  if (isEditingGroup.value) {
    groupStore.update(groupEditorData.value as Group)
  } else {
    groupStore.add(groupEditorData.value as Group)
  }

  resetGroupEditorData()
}

function openGroupDeletionConfirmation(group: Group): void {
  deleteGroupId.value = group.id
  showGroupDeletionConfirmation.value = true
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
</script>

<template>
  <nav class="handle"></nav>

  <main>
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
        <button @click="showSettings = true" class="btn btn-icon">
          <v-icon name="co-cog" />
        </button>
        <button class="btn btn-icon btn-primary" :disabled="mainStore.dragMode">
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
            @delete="openConnectionDeletionConfirmation"
            @clone="cloneConnection"
          />
        </VueDraggableNext>
      </section>
    </article>
  </main>

  <DialogModal :title="(isEditingGroup ? 'Edit' : 'New') + ' Group'" v-model:show="showGroupEditor">
    <input
      v-model="groupEditorData.name"
      class="input-field"
      style="width: 300px"
      placeholder="Group Name"
    />

    <template #actions>
      <button class="btn" @click="resetGroupEditorData">Cancel</button>
      <button class="btn btn-primary" @click="saveGroup">
        {{ isEditingGroup ? 'Save' : 'Create' }}
      </button>
    </template>
  </DialogModal>

  <DialogModal title="Settings" v-model:show="showSettings">
    <p>
      <label>
        Theme:
        <select v-model="settingsStore.settings.theme" class="input-field">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">System</option>
        </select>
      </label>
    </p>

    <template #actions>
      <button @click="showSettings = false" class="btn btn-primary">Close</button>
    </template>
  </DialogModal>

  <DialogModal title="Delete Group" v-model:show="showGroupDeletionConfirmation">
    <p>Are you sure you want to delete this group?</p>
    <p>Deleting this group won't delete connections linked to it.</p>

    <template #actions>
      <button class="btn" @click="showGroupDeletionConfirmation = false">Cancel</button>
      <button class="btn btn-danger" @click="deleteGroup">Delete</button>
    </template>
  </DialogModal>

  <DialogModal title="Delete Connection" v-model:show="showConnectionDeletionConfirmation">
    <p>Are you sure you want to delete this connection?</p>
    <p v-if="mainStore.activeGroupId !== 'all'">
      If you want to remove this connection from this specific group,<br />
      you can do so by dragging it to the "All" group.
    </p>

    <template #actions>
      <button class="btn" @click="showConnectionDeletionConfirmation = false">Cancel</button>
      <button class="btn btn-danger" @click="deleteConnection">Delete</button>
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

.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--theme-contrast-color-opacity-1);
  border-radius: 10px;
  background-color: var(--theme-contrast-color-opacity-05);
  color: var(--theme-contrast-color);
  outline: none;
}
</style>
