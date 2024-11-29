<script lang="ts" setup>
import { computed, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

import ConnectionItem from '../components/ConnectionItem.vue'
import GroupItem from '../components/GroupItem.vue'

import { Connection, useConnectionStore } from '../store/connections'
import { Group, useGroupStore } from '../store/groups'

const connectionStore = useConnectionStore()
const groupStore = useGroupStore()

const draggableMode = ref(false)
const draggingConnection = ref<Connection | null>(null)
const dropoverGroup = ref<Group | null>(null)

const connections = computed(() => {
  const group = groupStore.groups.find((group) => group.id === groupStore.activeGroupId)!

  return connectionStore.connections.filter((connection) => {
    return groupStore.activeGroupId === 'all' || group.connections.includes(connection.id)
  })
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

function connectionDragStart(event: CustomEvent): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draggingConnection.value = (event as any).item.__vnode.ctx.props.connection
}

function connectionDragEnd(): void {
  draggingConnection.value = null
}

function groupDragOver(group: Group | null): void {
  dropoverGroup.value = group
}

function groupDrop(event: DragEvent): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const group: Group = (event as any).target.__vnode.ctx.props.group

  dropoverGroup.value = null

  group.connections.push(draggingConnection.value!.id)
}
</script>

<template>
  <div class="handle"></div>
  <main>
    <aside>
      <h1>
        Groups
        <button class="control-btn" :disabled="draggableMode">
          <v-icon name="co-plus" scale=".8" />
        </button>
      </h1>

      <section>
        <VueDraggableNext v-model="groupStore.groups" handle=".handle">
          <GroupItem
            v-for="group in groupStore.groups"
            :key="group.id"
            :group="group"
            :active="group.id === groupStore.activeGroupId"
            :draggable="draggableMode"
            :style="{
              backgroundColor:
                group.id === dropoverGroup?.id && draggingConnection !== null
                  ? 'var(--theme-contrast-color-opacity-3)'
                  : undefined
            }"
            @click="groupStore.activeGroupId = group.id"
            @dragover="groupDragOver(group)"
            @dragleave="groupDragOver(null)"
            @drop="groupDrop"
          />
        </VueDraggableNext>
      </section>
    </aside>
    <article>
      <section>
        <div class="controls">
          <button
            class="control-btn"
            :class="{ active: draggableMode }"
            @click="draggableMode = !draggableMode"
          >
            <v-icon name="co-swap-vertical" />
          </button>
          <button class="control-btn" :disabled="draggableMode">
            <v-icon name="co-plus" />
          </button>
        </div>
        <div class="connection-list">
          <VueDraggableNext
            v-model="connectionStore.connections"
            handle=".handle"
            @choose="connectionDragStart"
            @unchoose="connectionDragEnd"
          >
            <ConnectionItem
              v-for="connection in connections"
              :key="connection.id"
              :connection="connection"
              :group-id="groupStore.activeGroupId"
              :draggable="draggableMode"
              @connect="connect"
              @disconnect="disconnect"
            />
          </VueDraggableNext>
        </div>
      </section>
    </article>
  </main>
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
    padding: @handle-bar-height 20px 20px 20px;
  }

  > aside {
    flex: 0 0 35%;
    background-color: var(--theme-contrast-color-opacity-05);

    > h1 {
      font-size: 14pt;
      margin: 20px 0;
      opacity: 0.7;
      font-weight: bold;

      button {
        float: right;
        width: 24px !important;
        height: 24px !important;
      }
    }
  }

  > article {
    flex: 1;

    .controls {
      text-align: right;
      margin-bottom: 10px;
    }
  }
}

.control-btn {
  border-radius: 50px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  border: 2px solid var(--theme-contrast-color-opacity-1);
  color: var(--theme-constrast-color);
  background-color: var(--theme-contrast-color-opacity-05);
  margin-left: 8px;

  &:hover {
    background-color: var(--theme-contrast-color-opacity-1);
  }

  &:active,
  &.active {
    background-color: var(--theme-contrast-color-opacity-2);
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
