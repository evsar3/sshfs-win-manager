<template>
  <div class="item">
    <transition name="reveal-to-right">
      <div v-show="showMoveGrip" class="grip">
        <Icon icon="grip"/>
      </div>
    </transition>

    <div class="icon">
      <Icon icon="cloudDrive"/>
    </div>

    <div class="info">
      <div class="title">{{conn.name}}</div>

      <div class="details">
        <span class="local-path">
          {{mountPointLabel}}
        </span>

        <span class="sep">•</span>
        {{conn.host}}
        <span class="sep">•</span>
        {{conn.folder}}
      </div>
    </div>

    <div class="controls">
      <button v-show="isConnected" @click="$emit('open', conn.mountPoint === 'auto' ? conn.preferredMountPoint : conn.mountPoint)">
        <Icon icon="openFolder"/>
      </button>

      <button v-show="isConnectingOrDisconnecting"  @click="$emit('abort', conn)">
        <Icon icon="cancel"/>
      </button>

      <button v-show="showConnectButton" :class="{ 'success': isConnected, 'connecting-disconnecting': isConnectingOrDisconnecting }" :disabled="isConnectingOrDisconnecting" @click="$emit(isConnected ? 'disconnect' : 'connect', conn)">
        <svg v-show="isConnectingOrDisconnecting" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(108.558 50 50)">
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
          </circle>
        </svg>

        <Icon v-show="!isConnectingOrDisconnecting" :icon="isConnected ? 'plugConnected' : 'plugDisconnected'"/>
      </button>

      <button v-show="showDeleteButton" class="danger" @click="$emit('delete', conn)">
        <Icon icon="trashCan"/>
      </button>

      <button v-tooltip="'Duplicate connection'" v-show="isEditing" @click="$emit('clone', conn)">
        <Icon icon="duplicate"/>
      </button>

      <button v-show="isEditing" class="success" @click="$emit('edit', conn)">
        <Icon icon="pen"/>
      </button>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon'

export default {
  name: 'connection-item',

  components: {
    Icon
  },

  props: {
    conn: {
      type: Object,
      required: true
    },

    mode: {
      type: String,
      required: false,
      default: 'none'
    }
  },

  computed: {
    isConnected () {
      return this.conn.status === 'connected'
    },

    isConnectingOrDisconnecting () {
      return this.conn.status === 'connecting' || this.conn.status === 'disconnecting'
    },

    showConnectButton () {
      return this.mode === 'none' || this.isConnected || this.isConnectingOrDisconnecting
    },

    isEditing () {
      return this.mode === 'edit' && !this.isConnected && !this.isConnectingOrDisconnecting
    },

    showMoveGrip () {
      return this.mode === 'edit'
    },

    showDeleteButton () {
      return this.mode === 'delete' && !this.isConnected && !this.isConnectingOrDisconnecting
    },

    mountPointLabel () {
      if (this.isConnected && this.conn.mountPoint === 'auto') {
        return `Auto (${this.conn.preferredMountPoint})`
      } else if (this.conn.mountPoint === 'auto') {
        return 'Auto'
      } else {
        return this.conn.mountPoint
      }
    }
  }
}
</script>

<style lang="less" scoped>
@list-item-height: 80px;
@list-control-button-size: 50px;

.item {
  display: flex;
  padding: 6px;
  height: @list-item-height;
  transition: background-color 200ms;

  &:hover {
    background-color: fade(contrast(@main-color), 1%);
  }

  > div {
    flex: 1;
    overflow: hidden;
  }

  .grip {
    flex: 0 0 40px;
    text-align: center;
    margin: auto 0;
    cursor: ns-resize;

    svg {
      fill: fade(contrast(@main-color), 10%);
      width: 20px;
    }
  }

  .icon {
    flex: 0 0 @list-item-height;
    text-align: center;
    margin: auto 0;

    svg {
      fill: fade(contrast(@main-color), 20%);
      width: 40px;
    }
  }

  .info {
    margin: auto 0;

    .sep {
      opacity: 0.4;
      margin: 0 3px;
    }

    .title {
      color: fade(contrast(@main-color), 90%);
      font-size: 13pt;
      max-width: 400px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .details {
      color: fade(contrast(@main-color), 20%);
      font-size: 11pt;
      margin-top: 5px;
    }

    .local-path {
      display: inline-block;
      background: fade(contrast(@main-color), 20%);
      min-width: 20px;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      vertical-align: middle;
      border-radius: 50px;
      padding: 2px 6px;
      font-size: 10pt;
      color: @main-color;
      font-weight: bold;
    }
  }

  .controls {
    margin: auto 0;
    margin-right: 15px;
    flex: 0 0;
    white-space: nowrap;
    overflow: visible;

    button {
      width: @list-control-button-size;
      height: @list-control-button-size;
      border: none;
      background: fade(contrast(@main-color), 5%);
      border-radius: 100%;
      padding: 10px;
      outline: none;
      cursor: pointer;
      margin-left: 6px;
      fill: contrast(@main-color);

      &:hover {
        background: @primary-color;

        svg {
          fill: contrast(@primary-color);
        }
      }

      &:active {
        background: darken(@primary-color, 5%);
      }

      &.success {
        background: @success-color;
        fill: contrast(@success-color);

        &:hover {
          background: lighten(@success-color, 10%);
        }

        &:active {
          background: darken(@success-color, 10%);
        }
      }

      &.danger {
        background: @danger-color;
        fill: contrast(@danger-color);

        &:hover {
          background: lighten(@danger-color, 10%);
        }

        &:active {
          background: darken(@danger-color, 10%);
        }
      }

      &.connecting-disconnecting {
        cursor: default;

        &:hover {
          background: fade(contrast(@main-color), 5%);
        }

        svg {
          stroke: lighten(@primary-color, 20%);
        }
      }
    }
  }
}

.reveal-to-right-enter-active, .reveal-to-right-leave-active {
  transition: all .5s;
}
.reveal-to-right-enter, .reveal-to-right-leave-to {
  opacity: 0;
  flex: 0 !important;
}
</style>
