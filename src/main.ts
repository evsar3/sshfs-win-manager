import { createApp } from 'vue'

import router from './router'
import pinia from './store'

import App from './App.vue'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  BiThreeDotsVertical,
  CoApps,
  CoCheckAlt,
  CoClone,
  CoCog,
  CoFolderOpen,
  CoPencil,
  CoPlus,
  CoSwapVertical,
  CoTrash,
  CoX,
  LaEqualsSolid
} from 'oh-vue-icons/icons'

addIcons(
  CoPlus,
  CoCheckAlt,
  BiThreeDotsVertical,
  CoX,
  CoPencil,
  CoTrash,
  CoClone,
  CoSwapVertical,
  CoApps,
  LaEqualsSolid,
  CoCog,
  CoFolderOpen
)

createApp(App).use(router).use(pinia).component('v-icon', OhVueIcon).mount('#app')
