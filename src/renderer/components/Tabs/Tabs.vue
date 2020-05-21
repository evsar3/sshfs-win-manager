<template>
  <div class="tabs-container">
    <div class="tabs-selector">
      <button v-for="tab in tabs" :key="tab.label" class="tab-selector" :class="{'tab-selector--selected': tab.active}" @click="select(tab)">
        {{tab.label}}
      </button>
    </div>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Tabs',

  methods: {
    select (tab) {
      this.tabs.forEach(tab => {
        tab.active = false
      })

      tab.active = true
    }
  },

  data () {
    return {
      tabs: []
    }
  },

  mounted () {
    this.$children.forEach(tab => {
      this.tabs.push(tab)
    })
  }
}
</script>

<style lang="less" scoped>
.tabs-container {
  .tabs-selector {
    border-bottom: 1px solid fade(contrast(@main-color), 10%);

    .tab-selector {
      border: none;
      height: 40px;
      padding: 0 10px;
      background: transparent;
      color: fade(contrast(@main-color), 80%);
      cursor: pointer;
      outline: none;

      &--selected {
        font-weight: bold;
        color: lighten(@primary-color, 10%);
        border-bottom: 2px solid @primary-color;
      }
    }
  }
}
</style>