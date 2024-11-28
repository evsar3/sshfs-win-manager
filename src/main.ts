import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { BiThreeDotsVertical, CoCheckAlt, CoPencil, CoPlus, CoTrash, CoX } from 'oh-vue-icons/icons'

addIcons(CoPlus, CoCheckAlt, BiThreeDotsVertical, CoX, CoPencil, CoTrash)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('v-icon', OhVueIcon)

app.mount('#app')