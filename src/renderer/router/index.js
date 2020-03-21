import Vue from 'vue'
import Router from 'vue-router'

import MainWindow from '@/components/MainWindow/index'
import AddEditConnectionWindow from '@/components/AddEditConnectionWindow/index'
import SettingsWindow from '@/components/SettingsWindow/index'
import AboutWindow from '@/components/AboutWindow/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainWindow
    },
    {
      path: '/add-new-connection',
      name: 'add-new-connection',
      component: AddEditConnectionWindow
    },
    {
      path: '/edit-connection/:uuid',
      name: 'edit-connection',
      component: AddEditConnectionWindow
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsWindow
    },
    {
      path: '/about',
      name: 'about',
      component: AboutWindow
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
