<template>
  <div class="window">
    <div class="header-container">
      <Header :title="title" :closeAction="closeAction" @close="$emit('close')"/>
    </div>
    <div class="content-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Header from './Header'

export default {
  name: 'Window',

  components: {
    Header
  },

  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },

    closeAction: {
      type: String,
      required: false,
      default: 'close'
    }
  }
}
</script>

<style lang="less" scoped>
.window {
  border: 1px solid @main-color;
  height: 100%;

  .content-container {
    background-color: lighten(@main-color, 5%);
    overflow: hidden;
    height: calc(100vh - 2px - 30px); // 2px from border top and bottom and 30px for title bar
  }
}
</style>