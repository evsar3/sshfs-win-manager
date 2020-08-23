<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

import ProcessManager from '@/ProcessManager'

export default {
  name: 'sshfs-win-manager',

  mounted () {
    this.$store.dispatch('APPLY_CONNECTIONS_MIGRATIONS')

    ipcRenderer.on('terminate-child-processes', () => {
      ProcessManager.terminateAll().then(() => {
        ipcRenderer.send('child-processes-terminated')
      })
    })
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe WPC', 'Segoe UI', 'Arial', sans-serif;
}

body {
  cursor: default;
  user-select: none;
}

body,
html {
  height: 100%;
}

.wrap {
  padding: 15px 20px;
}

button.btn {
  min-width: 100px;
  border: none;
  border-radius: 50px;
  padding: 8px 10px;
  line-height: 22px;
  text-align: center;
  outline: none;
  background: fade(contrast(@main-color), 10%);
  color: contrast(@main-color);
  cursor: pointer;
  margin-bottom: 5px;

  &.active,
  &.default {
    background: lighten(@primary-color, 3%);
    color: contrast(@primary-color);
  }

  &:hover {
    background: @primary-color;
    color: contrast(@primary-color);

    svg {
      fill: contrast(@primary-color);
    }
  }

  &:active {
    background: darken(@primary-color, 5%);
    color: contrast(@primary-color);
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;

    &:hover {
      background: fade(contrast(@main-color), 10%);
    }
  }

  svg {
    fill: contrast(@main-color);
    width: 22px;
    float: left;
    margin-right: 5px;
  }
}

h1.section-title {
  font-size: 15pt;
  color: @primary-color;
  font-weight: normal;
}

div.form-row {
  display: flex;

  div.form-item {
    flex: 1;
    margin-right: 6px;

    &:last-child {
      margin-right: 0;
    }
  }
}

div.form-item {
  padding: 6px 0;
  
  // &:focus-within {
  //   label {
  //     color: @primary-color;
  //   }
  // }

  label {
    display: block;
    color: fade(contrast(@main-color), 50%);
    text-transform: uppercase;
    font-size: 10pt;
    padding-bottom: 5px;
  }

  input[type='text'],
  input[type='password'],
  textarea,
  select {
    width: 100%;
    padding: 10px;
    background-color: transparent;
    border: 1px solid fade(contrast(@main-color), 5%);
    outline: none;
    color: contrast(@main-color);

    &:focus {
      border-color: @primary-color;
      background-color: fade(@primary-color, 10%);
    }

    option {
      color: #000;
    }
  }
}
</style>

<style>
/* v-Tooltip styles */
.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}
</style>