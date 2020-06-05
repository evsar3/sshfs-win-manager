<template>
  <div class="custom-cmdl-list">
    <h1 v-if="params.length === 0" class="no-data">No params added yet</h1>

    <div v-for="param in params" :key="param.uuid">
      <div class="option">
        <select v-model="param.name" class="option">
          <option v-for="option in options" :key="option.name" :value="option.name" :selected="param.name === option.name">{{option.name}}</option>
        </select>
      </div>
      <div>
        <input type="text" :placeholder="getOption(param.name).description" v-model="param.value">
      </div>
      <div class="remove">
        <button @click="removeParam(param)">
          <Icon icon="trashCan"/>
        </button>
      </div>
    </div>

    <button @click="addParam" class="btn add-param"><Icon icon="plus"/> Add param</button>
  </div>
</template>

<script>
import { v4 as uuid } from 'uuid'

import Icon from '@/components/Icon'

export default {
  name: 'CustomCmdlOptions',

  components: {
    Icon
  },

  props: {
    list: {
      type: Array,
      required: true
    }
  },

  methods: {
    addParam () {
      this.params.push({
        uuid: uuid(),
        name: '',
        value: ''
      })
    },

    removeParam (param) {
      this.params = this.params.filter(a => a.uuid !== param.uuid)
    },

    getOption (name) {
      let option = this.options.find(a => a.name === name)

      if (!option) {
        option = {
          name: '',
          type: 'string',
          description: 'Select an option'
        }
      }

      return option
    }
  },

  data () {
    return {
      params: this.list,

      options: [
        {
          name: 'reconnect',
          type: 'bool',
          description: 'Reconnect to server'
        },
        {
          name: 'delay_connect',
          type: 'bool',
          description: 'Delay connection to server'
        },
        {
          name: 'sshfs_sync',
          type: 'bool',
          description: 'Synchronous writes'
        },
        {
          name: 'no_readahead',
          type: 'bool',
          description: 'Synchronous reads (no speculative readahead)'
        },
        {
          name: 'sshfs_debug',
          type: 'bool',
          description: 'Print some debugging information'
        },
        {
          name: 'cache',
          type: 'string',
          description: 'Enable caching {yes,no} (default: yes)'
        },
        {
          name: 'cache_timeout',
          type: 'number',
          description: 'Sets timeout for caches in seconds (default: 20)'
        },
        {
          name: 'cache_stat_timeout',
          type: 'number',
          description: 'Sets timeout for stat cache'
        },
        {
          name: 'cache_dir_timeout',
          type: 'number',
          description: 'Sets timeout for dir cache'
        },
        {
          name: 'cache_link_timeout',
          type: 'number',
          description: 'Sets timeout for link cache'
        },
        {
          name: 'workaround',
          type: 'string',
          description: 'Colon separated list of workarounds'
        },
        {
          name: 'idmap',
          type: 'string',
          description: 'User/group ID mapping'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.custom-cmdl-list {
  .no-data {
    font-size: 15pt;
    color: fade(contrast(@main-color), 20%);
  }

  > div {
    display: flex;
    width: 100%;
    margin-bottom: 5px;


    > div {
      flex: 1;

      select,
      input,
      button {
        height: 35px;
        width: 100%;
      }

      select {
        padding: 0 10px;
      }

      &.option {
        margin-right: 10px;
      }

      &.remove {
        flex: 0 0 35px;
        margin-left: 10px;

        button {
          border: none;
          border-radius: 50px;
          background: transparent;
          fill: @danger-color;
          outline: none;
          cursor: pointer;

          &:hover {
            background: fade(contrast(@main-color), 5%);
          }

          svg {
            width: 23px;
          }
        }
      }
    }
  }

  .add-param {
    margin-top: 5px;
  }
}
</style>