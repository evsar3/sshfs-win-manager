<script lang="ts" setup>
import { Group } from '../store/groups'

defineProps<{
  group: Group
  active: boolean
}>()
</script>

<template>
  <div class="group-item" :class="{ active }">{{ group.name }}</div>
</template>

<style lang="less" scoped>
.group-item {
  display: flex;
  align-items: center;
  padding: 15px 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: var(--theme-contrast-color-opacity-05);
  }

  &:active,
  &.active {
    background-color: var(--theme-contrast-color-opacity-1);
  }
}
</style>
