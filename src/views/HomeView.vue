<script lang="ts" setup>
import ConnectionItem from '../components/ConnectionItem.vue'
import GroupItem from '../components/GroupItem.vue'
import { useConnectionStore } from '../store/connections'
import { useGroupStore } from '../store/groups'

const connectionStore = useConnectionStore()
const groupStore = useGroupStore()
</script>

<template>
  <div class="handle"></div>
  <main>
    <aside>
      <h1>
        Groups
        <button class="control-btn">
          <v-icon name="co-plus" scale=".8" />
        </button>
      </h1>

      <section>
        <GroupItem
          v-for="group in groupStore.groups"
          :key="group.id"
          :group="group"
          :active="group.id === groupStore.activeGroupId"
          @click="groupStore.activeGroupId = group.id"
        />
      </section>
    </aside>
    <article>
      <section>
        <div class="controls">
          <button class="control-btn">
            <v-icon name="co-plus" />
          </button>
        </div>
        <div class="connection-list">
          <ConnectionItem
            v-for="connection in connectionStore.connections"
            :key="connection.id"
            :connection="connection"
          />
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

  > aside {
    flex: 0 0 35%;
    background-color: var(--theme-contrast-color-opacity-05);
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

  &:hover {
    background-color: var(--theme-contrast-color-opacity-1);
  }

  &:active {
    background-color: var(--theme-contrast-color-opacity-2);
  }
}
</style>
