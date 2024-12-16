<script lang="ts" setup>
import { nextTick, useTemplateRef, watch } from 'vue'

const $content = useTemplateRef<HTMLDivElement | null>('content')

const show = defineModel<boolean>('show')

defineProps<{
  title?: string
}>()

watch(show, (value) => {
  if (!value) return

  const focusableElements = [
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    '[tabindex]'
  ].join(', ')

  nextTick().then(() => {
    const firstFocusableEl = $content.value?.querySelector(focusableElements) as HTMLElement | null

    setTimeout(() => {
      firstFocusableEl?.focus()
    }, 100)
  })
})
</script>

<template>
  <div v-if="show" class="dialog-modal">
    <div class="overlay"></div>
    <div class="modal">
      <h1 class="title">
        <span>{{ title }}</span>

        <button @click="show = false" class="modal-close">
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  > .overlay {
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
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 80px);
    border-radius: 15px;
    background-color: var(--theme-color);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    z-index: 1;

    > .title {
      display: flex;
      align-items: center;
      padding: 12px;
      border-bottom: 1px solid var(--theme-contrast-color-opacity-05);

      span {
        flex: 1;
        font-size: 11pt;
        font-weight: normal;
        color: var(--theme-contrast-color-opacity-5);
      }

      button {
        flex: 0;
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
      flex: 1;
      padding: 20px;
      font-size: 11pt;
      overflow: hidden auto;
    }

    > .controls {
      padding: 15px;
      border-top: 1px solid var(--theme-contrast-color-opacity-05);
      text-align: right;
      background-color: var(--theme-contrast-color-opacity-05);
    }
  }
}
</style>
