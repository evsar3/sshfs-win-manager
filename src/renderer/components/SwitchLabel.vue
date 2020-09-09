<template>
  <label class="switch-label">{{label}} <toggle-button :color="toggleButtonColor" v-model="_value" sync labels></toggle-button></label>
</template>

<script>
import { ToggleButton } from 'vue-js-toggle-button'

export default {
  name: 'SwitchLabel',

  components: {
    ToggleButton
  },

  props: {
    label: {
      type: String,
      required: true,
      default: ''
    },
    value: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    emitChanges () {
      this.$emit('input', this._value)
    }
  },

  computed: {
    _value: {
      get () {
        return this.value
      },

      set (value) {
        console.log(value)
        this.$emit('input', value)
      }
    }
  },

  data () {
    return {
      toggleButtonColor: {
        checked: '#2486d8',
        unchecked: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.switch-label {
  margin-top: 5px;
  
  .vue-js-switch {
    float: right;
    clear: both;
    margin-top: -4px;
  }
}
</style>
