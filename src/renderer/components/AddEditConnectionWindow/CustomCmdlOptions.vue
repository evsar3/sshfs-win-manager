<template>
  <div class="custom-cmdl-list">
    <h1 v-if="value.length === 0" class="no-data">No params added yet</h1>

    <div v-for="param in value" :key="param.uuid">
      <div class="option">
        <select v-model="param.name" class="option" @input="emmitChanges">
          <option v-for="option in options" :key="option.name" :value="option.name" :selected="param.name === option.name">{{option.name}}</option>
        </select>
      </div>
      <div>
        <input type="text" :placeholder="getOption(param.name).description" v-model="param.value" :disabled="getOption(param.name).type === 'bool'" @input="emmitChanges">
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

import SshfsParamsList from '@/SshfsParamsList'

export default {
  name: 'CustomCmdlOptions',

  components: {
    Icon
  },

  props: {
    value: {
      type: Array,
      required: false,
      default: []
    }
  },

  methods: {
    addParam () {
      this.value.push({
        uuid: uuid(),
        name: '',
        value: ''
      })

      this.emmitChanges()
    },

    removeParam (param) {
      this.value.splice(this.value.findIndex(a => a.uuid === param.uuid), 1)

      this.emmitChanges()
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
    },

    emmitChanges () {
      this.$emit('input', this.value)
    }
  },

  data () {
    return {
      options: SshfsParamsList
    }
  }
}
</script>

<style lang="less" scoped>
.custom-cmdl-list {
  .no-data {
    font-size: 15pt;
    color: fade(contrast(@main-color), 20%);
    margin: 9px 0;
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