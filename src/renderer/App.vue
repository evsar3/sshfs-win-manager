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
}

body {
  font-family: 'Segoe WPC', 'Segoe UI', 'Arial', sans-serif;
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
  }

  &:hover {
    background: @primary-color;
  }

  &:active {
    background: darken(@primary-color, 5%);
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
