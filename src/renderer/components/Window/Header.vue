<template>
  <div class="header">
    <div class="title">{{title}}</div>
    
    <div class="controls">
      <div class="close" @click="close">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
          <path style=" " d="M 7.21875 5.78125 L 5.78125 7.21875 L 14.5625 16 L 5.78125 24.78125 L 7.21875 26.21875 L 16 17.4375 L 24.78125 26.21875 L 26.21875 24.78125 L 17.4375 16 L 26.21875 7.21875 L 24.78125 5.78125 L 16 14.5625 Z "/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'

const window = remote.getCurrentWindow()

export default {
  name: 'Header',

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
  },

  methods: {
    close () {
      if (this.closeAction === 'hide') {
        window.hide()
      } else {
        window.close()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@height: 30px;
@button-width: 46px;
@button-icon-size: 16px;

.header {
  background: @main-color;
  display: flex;
  -webkit-app-region: drag;

  > div {
    flex: 1;
  }

  .title {
    display: table-cell;
    height: @height;
    line-height: @height;
    padding-left: 8px;
    color: fade(contrast(@main-color), 80%);
    font-size: 10pt;
  }

  .controls {
    flex: 0 auto;
    -webkit-app-region: no-drag;

    > div {
      display: table-cell;
      height: @height;
      width: @button-width;
      text-align: center;
      vertical-align: middle;

      svg {
        width: @button-icon-size;
        fill: contrast(@main-color);
      }
    }

    .close {
      &:hover {
        background-color: #d41324
      }
    }
  }
}
</style>