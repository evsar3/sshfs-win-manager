<script lang="ts" setup>
import { nextTick, useTemplateRef, watch } from 'vue'

const $content = useTemplateRef<HTMLDivElement | null>('content')

const props = defineProps<{
  title?: string
  show: boolean
}>()

defineEmits<{
  'update:show': (value: boolean) => void
}>()

watch(
  () => props.show,
  (value) => {
    if (!value) return

    const focusableElements = [
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      '[tabindex]'
    ].join(', ')

    nextTick().then(() => {
      const firstFocusableEl = $content.value?.querySelector(
        focusableElements
      ) as HTMLElement | null

      setTimeout(() => {
        firstFocusableEl?.focus()
      }, 100)
    })
  }
)
</script>

<template>
  <div v-if="show" class="dialog-modal">
    <div class="overflow"></div>
    <div class="modal">
      <h1 class="title">
        {{ title }}

        <button @click="$emit('update:show', false)" class="modal-close">
          <v-icon name="co-x" />
        </button>
      </h1>

      <div class="content" ref="content">
        <slot></slot>
      </div>

      <div v-if="$slots.actions" class="controls">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dialog-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;

  > .overflow {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
  }

  > .modal {
    position: relative;
    z-index: 1;
    background-color: var(--theme-color);
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

    > .title {
      padding: 15px;
      border-bottom: 1px solid var(--theme-contrast-color-opacity-05);
      font-size: 10pt;
      font-weight: normal;
      color: var(--theme-contrast-color-opacity-3);

      button {
        float: right;
        width: 24px;
        height: 24px;
        background-color: transparent;
        border: none;
        color: var(--theme-contrast-color-opacity-3);
        cursor: pointer;

        &:hover {
          color: var(--theme-contrast-color-opacity-5);
        }

        &:active {
          color: var(--theme-contrast-color-opacity-2);
        }
      }
    }

    > .content {
      padding: 20px;
      font-size: 11pt;
    }

    > .controls {
      padding: 15px;
      border-top: 1px solid var(--theme-contrast-color-opacity-05);
      text-align: right;
    }
  }
}
</style>
