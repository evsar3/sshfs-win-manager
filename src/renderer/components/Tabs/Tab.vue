<template>
  <div v-show="active">
      <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Tab',

  props: {
    active: {
      required: false,
      type: Boolean,
      default: false
    },
    label: {
      required: true,
      type: String
    }
  }
}
</script>