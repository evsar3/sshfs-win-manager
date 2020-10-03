<template>
  <Window title="About">
    <div class="wrap">
      <div class="logo-container">
        <img class="logo" src="@/assets/app-logo.png">
      </div>
      <div class="content">
        <h1>SSHFS-Win Manager</h1>
        <p class="repo-url">
          <a href="https://github.com/evsar3/sshfs-win-manager">https://github.com/evsar3/sshfs-win-manager</a>
        </p>
        <p class="donate-btn">
          <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HXZUJ8WX47238">
            <img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" alt="Donate" title="PayPal - The safer, easier way to pay online!">
          </a>
        </p>
        <p>
          Version: {{appVersion}}<br>
          Author: Evandro Araujo (<a href="https://github.com/evsar3">@evsar3</a>)
        </p>
        <p>This program is licensed under <a href="https://opensource.org/licenses/MIT">MIT license</a></p>
        <p>This program contains parts of following open-source projects:
          <ul>
            <li>Node.js (<a href="https://github.com/nodejs/node">https://github.com/nodejs/node</a>)</li>
            <li>Electron (<a href="https://github.com/electron/electron">https://github.com/electron/electron</a>)</li>
            <li>Vue.js (<a href="https://github.com/vuejs/vue">https://github.com/vuejs/vue</a>)</li>
            <li>Electron-Vue (<a href="https://github.com/SimulatedGREG/electron-vue">https://github.com/SimulatedGREG/electron-vue</a>)</li>
            <li>SSHFS-Win (<a href="https://github.com/billziss-gh/sshfs-win">https://github.com/billziss-gh/sshfs-win</a>)</li>
          </ul>
        </p>
        <p>Icons kindly provided by <a href="https://icons8.com">Icons8.com</a></p>
      </div>
    </div>
  </Window>
</template>

<script>
import { shell, remote } from 'electron'

import Window from '@/components/Window'

const app = remote.app

export default {
  name: 'about-window',

  components: {
    Window
  },

  data () {
    return {
      appVersion: app.getVersion()
    }
  },

  mounted () {
    this.$el.querySelectorAll('a').forEach(item => {
      item.addEventListener('click', event => {
        event.preventDefault()

        shell.openExternal(item.href)
      })
    })
  }
}
</script>

<style lang="less" scoped>
.wrap {
  color: contrast(@main-color);

  > div {
    display: inline-block;
  }

  .logo-container {
    width: 70px;

    .logo {
      width: 60px;
      position: absolute;
      top: 50px;
    }
  }

  .content {  
    h1 {
      color: @primary-color;
      font-size: 18pt;
      margin-bottom: 5px;
    }

    p {
      font-size: 10pt;
      color: fade(contrast(@main-color), 80%);
      margin: 10px 0;

      &.donate-btn {
        position: fixed;
        top: 40px;
        right: 20px;
      }

      &.repo-url {
        margin-bottom: 20px;
      }
    }

    ul {
      margin-left: 25px;
    }

    a {
      color: lighten(@primary-color, 20%);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
