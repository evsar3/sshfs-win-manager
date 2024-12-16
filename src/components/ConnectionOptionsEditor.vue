<script lang="ts" setup>
import { v4 as uuid } from 'uuid'
import { computed, nextTick, useTemplateRef } from 'vue'

import { ConnectionOption } from '../store/connections'

const $editor = useTemplateRef<HTMLDivElement | null>('editor')

const options = defineModel<ConnectionOption[]>()

const addOptionDisabled = computed(() => options.value?.some((i) => !i.key))

function addOption() {
  ;(options.value ??= []).push({ id: uuid(), key: '', value: '' })

  nextTick(() => {
    const $els = $editor.value?.querySelectorAll('.item')

    $els?.[$els?.length - 1].querySelector('input')?.focus()
  })
}

function removeOption(option: ConnectionOption): void {
  options.value?.splice(options.value.indexOf(option), 1)
}
</script>

<template>
  <div class="connection-options-editor" ref="editor">
    <div v-if="(options ?? []).length > 0" class="header">
      <div>Key</div>
      <div style="margin-right: 32px">Value</div>
    </div>
    <div class="form-row item" v-for="option in options" :key="option.id">
      <div class="input-group">
        <input v-model="option.key" class="form-input" type="text" />
      </div>
      <div class="input-group">
        <input v-model="option.value" class="form-input" type="text" />
      </div>
      <div class="input-group" style="flex: 0">
        <button class="btn btn-icon btn-danger" @click="removeOption(option)">
          <v-icon name="co-trash" />
        </button>
      </div>
    </div>
    <div class="form-row add">
      <div class="input-group">
        <button class="btn btn-icon btn-primary" :disabled="addOptionDisabled" @click="addOption">
          <v-icon name="co-plus" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.connection-options-editor {
  background-color: var(--theme-contrast-color-opacity-05);
  border-radius: 10px;
  margin-top: 10px;
  width: 100%;

  .header {
    display: flex;
    font-size: 10pt;
    font-weight: bold;
    color: var(--theme-contrast-color-opacity-5);
    padding: 10px;

    > div {
      padding: 0 0 2px 5px;
      flex: 1;
    }
  }

  .item {
    padding: 10px 10px;
    margin-bottom: 0;

    + .add {
      border-top: 1px solid var(--theme-contrast-color-opacity-05);
    }

    &:nth-child(even) {
      background-color: var(--theme-contrast-color-opacity-05);
    }

    &:nth-child(odd) {
      background-color: var(--theme-contrast-color-opacity-1);
    }
  }

  .add {
    padding: 10px;
    text-align: center;
  }
}
</style>
