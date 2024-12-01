<script lang="ts" setup>
import { Group } from '../store/groups'

import { useMainStore } from '../store/main'

const mainStore = useMainStore()

const props = defineProps<{
  group: Group
}>()

defineEmits<{
  edit: (group: Group) => void
  delete: (group: Group) => void
}>()
</script>

<template>
  <div class="group-item" :class="{ active: group.id === mainStore.activeGroupId }">
    <div v-if="mainStore.dragMode && props.group.id !== 'all'" class="handle">
      <v-icon name="la-equals-solid" scale=".8" />
    </div>
    <div class="name">
      {{ group.name }}
    </div>
    <div v-if="!mainStore.dragMode && props.group.id !== 'all'" class="controls">
      <button class="btn btn-icon options">
        <v-icon name="bi-three-dots-vertical" />
      </button>

      <div class="options-menu">
        <div @mousedown="$emit('edit', group)"><v-icon name="co-pencil" /> Edit</div>
        <div @mousedown="$emit('delete', group)" class="danger">
          <v-icon name="co-trash" /> Delete
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.group-item {
  display: flex;
  margin-bottom: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 11pt;

  > .handle {
    flex: 0 0 30px;
    display: flex;
    align-items: center;
    justify-content: right;
    color: var(--theme-contrast-color-opacity-4);
    cursor: ns-resize;
  }

  > .name {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 15px 10px;
  }

  > .controls {
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 0 10px 0 0;
    position: relative;

    button {
      display: none;
      scale: 0.8;
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

  &:hover {
    background-color: var(--theme-contrast-color-opacity-05);

    .controls button {
      display: initial;
    }
  }

  &:active,
  &.active {
    background-color: var(--theme-contrast-color-opacity-1);
  }
}
</style>
