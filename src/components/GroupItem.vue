<script lang="ts" setup>
import { Group } from '../store/groups'

const props = defineProps<{
  group: Group
  active: boolean
  draggable: boolean
}>()
</script>

<template>
  <div class="group-item" :class="{ active }">
    <div v-if="draggable && !(props.group.id === 'all')" class="handle">
      <v-icon name="la-equals-solid" scale=".8" />
    </div>
    <div>
      {{ group.name }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.group-item {
  display: flex;
  align-items: center;
  padding: 15px 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 11pt;

  .handle {
    flex: 0 0 25px;
    display: flex;
    align-items: center;
    color: var(--theme-contrast-color-opacity-4);
    cursor: ns-resize;
  }

  &:hover {
    background-color: var(--theme-contrast-color-opacity-05);
  }

  &:active,
  &.active {
    background-color: var(--theme-contrast-color-opacity-1);
  }
}
</style>
