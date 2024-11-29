<script lang="ts" setup>
import { v4 as uuid } from 'uuid'
import { Connection, useConnectionStore } from '../store/connections'
import { useGroupStore } from '../store/groups'

const connectionStore = useConnectionStore()
const groupStore = useGroupStore()

const props = defineProps<{
  connection: Connection
  groupId: string
  draggable: boolean
}>()

defineEmits<{
  connect: (connection: Connection) => void
  disconnect: (connection: Connection) => void
  edit: (connection: Connection) => void
}>()

function clone() {
  connectionStore.connections.push({
    ...props.connection,
    id: uuid(),
    name: props.connection.name + ' (Copy)'
  })
}

function removeFromGroup() {
  if (props.groupId === 'all') {
    return
  }

  const group = groupStore.groups.find((group) => group.id === props.groupId)!

  group.connections.splice(group.connections.indexOf(props.connection.id), 1)
}

function remove() {
  if (confirm('Do you really want to remove this connection?')) {
    connectionStore.connections.splice(connectionStore.connections.indexOf(props.connection), 1)
  }
}
</script>

<template>
  <div class="connection-item" :class="connection.status">
    <div v-if="draggable" class="handle">
      <v-icon name="la-equals-solid" />
    </div>
    <div>
      <div class="title">{{ connection.name }}</div>
      <div class="info">
        <span>{{ connection.driveLetter }}</span>
        <span>{{ connection.host }}</span>
        <span>{{ connection.remotePath }}</span>
      </div>
    </div>
    <div class="controls">
      <div v-if="connection.status === 'connecting'" class="loading"></div>

      <div v-if="connection.status === 'connected'" class="connected">
        <v-icon name="co-check-alt" />
      </div>

      <template v-if="!draggable">
        <button v-if="connection.status === 'disconnected'" @click="$emit('connect', connection)">
          <v-icon name="co-check-alt" />
        </button>

        <button
          v-if="connection.status !== 'disconnected'"
          @click="$emit('disconnect', connection)"
        >
          <v-icon name="co-x" />
        </button>

        <button v-if="connection.status === 'disconnected'" class="options">
          <v-icon name="bi-three-dots-vertical" />
        </button>
      </template>

      <div class="options-menu">
        <div @mousedown="$emit('edit', connection)"><v-icon name="co-pencil" /> Edit</div>
        <div @mousedown="clone"><v-icon name="co-clone" /> Clone</div>
        <div v-if="groupId !== 'all'" @mousedown="removeFromGroup" class="danger">
          <v-icon name="co-x" /> Remove from group
        </div>
        <div @mousedown="remove" class="danger"><v-icon name="co-trash" /> Remove</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.connection-item {
  display: flex;
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 10px;

  > div {
    flex: 1;
  }

  &:hover {
    background-color: var(--theme-contrast-color-opacity-05);

    .controls button {
      display: initial;
    }
  }

  .title {
    font-size: 12pt;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .info {
    font-size: 10pt;
    opacity: 0.7;
    margin-top: 10px;

    span {
      margin-right: 10px;
      background-color: var(--theme-contrast-color-opacity-05);
      padding: 2px 10px;
      border-radius: 50px;
    }
  }

  .handle {
    flex: 0 0 40px;
    display: flex;
    align-items: center;
    cursor: move;
    color: var(--theme-contrast-color-opacity-4);
  }

  .controls {
    flex: 0 0 100px;
    display: flex;
    align-items: center;
    justify-content: end;
    position: relative;

    button {
      display: none;
      border-radius: 50px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      border: none;
      color: var(--theme-constrast-color);
      background-color: var(--theme-contrast-color-opacity-05);
      margin-left: 8px;

      &:hover {
        background-color: var(--theme-contrast-color-opacity-1);
      }

      &:active,
      &:focus {
        background-color: var(--theme-contrast-color-opacity-2);
      }
    }

    .loading {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid var(--theme-contrast-color-opacity-05);
      border-top-color: var(--theme-contrast-color);
      animation: spin 1s linear infinite;
      margin-left: 8px;
    }

    .connected {
      display: flex;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: var(--theme-success-color);
      color: var(--theme-success-contrast-color);
      align-items: center;
      justify-content: center;
    }

    .options:focus + .options-menu {
      display: block;
    }

    .options-menu {
      display: none;
      position: absolute;
      top: calc(50% + 18px);
      right: 0;
      background-color: color-mix(in srgb, var(--theme-color) 95%, var(--theme-contrast-color));
      border-radius: 15px;
      padding: 5px 0;
      box-shadow: 2px 2px 7px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      overflow: hidden;
      z-index: 1;

      div {
        padding: 5px 20px;
        font-size: 10pt;
        white-space: nowrap;

        &:hover {
          background-color: var(--theme-contrast-color-opacity-1);
        }

        &:active {
          background-color: var(--theme-contrast-color-opacity-2);
        }

        &.danger {
          color: var(--theme-danger-color);
        }
      }
    }
  }

  &.connected {
    background-color: color-mix(in srgb, var(--theme-success-color) 20%, transparent);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
