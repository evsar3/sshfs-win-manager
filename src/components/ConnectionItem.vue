<script lang="ts" setup>
import { Connection } from '../store/connections'

defineProps<{
  connection: Connection
}>()
</script>

<template>
  <div class="connection-item">
    <div>
      <div class="title">{{ connection.name }}</div>
      <div class="info">
        <span>{{ connection.driveLetter }}</span>
        <span>{{ connection.host }}</span>
        <span>{{ connection.remotePath }}</span>
      </div>
    </div>
    <div class="controls">
      <button>
        <v-icon name="co-check-alt" />
      </button>
      <button>
        <v-icon name="bi-three-dots-vertical" />
      </button>
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

  .controls {
    flex: 0 0 100px;
    display: flex;
    align-items: center;
    justify-content: end;

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

      &:active {
        background-color: var(--theme-contrast-color-opacity-2);
      }
    }
  }
}
</style>
