<script lang="ts" setup>
import { Connection } from '../store/connections'

import { useMainStore } from '../store/main'

const mainStore = useMainStore()

defineProps<{
  connection: Connection
}>()

defineEmits<{
  connect: (connection: Connection) => void
  disconnect: (connection: Connection) => void
  edit: (connection: Connection) => void
  delete: (connection: Connection) => void
  clone: (connection: Connection) => void
}>()
</script>

<template>
  <div class="connection-item" :class="connection.status">
    <div v-if="mainStore.dragMode" class="handle">
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

      <template v-if="!mainStore.dragMode">
        <button
          v-if="connection.status === 'disconnected'"
          class="btn btn-icon btn-success"
          @click="$emit('connect', connection)"
        >
          <v-icon name="co-check-alt" />
        </button>

        <button
          v-if="connection.status !== 'disconnected'"
          class="btn btn-icon btn-danger"
          @click="$emit('disconnect', connection)"
        >
          <v-icon name="co-x" />
        </button>

        <button v-if="connection.status === 'disconnected'" class="btn btn-icon options">
          <v-icon name="bi-three-dots-vertical" />
        </button>
      </template>

      <div class="options-menu">
        <div @mousedown="$emit('edit', connection)"><v-icon name="co-pencil" /> Edit</div>
        <div @mousedown="$emit('clone', connection)"><v-icon name="co-clone" /> Clone</div>
        <div @mousedown="$emit('delete', connection)" class="danger">
          <v-icon name="co-trash" /> Delete
        </div>
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
