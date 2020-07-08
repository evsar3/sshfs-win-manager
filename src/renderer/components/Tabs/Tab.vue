<template>
  <div class="tab" v-show="isActive">
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
  },

  data () {
    return {
      isActive: this.active
    }
  }
}
</script>

<style lang="less" scoped>
.tab {
  padding-top: 15px;
}
</style>