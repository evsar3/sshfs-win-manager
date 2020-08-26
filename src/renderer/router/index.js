import Vue from 'vue'
import Router from 'vue-router'

import MainWindow from '@/components/MainWindow/index'
import AddEditConnectionWindow from '@/components/AddEditConnectionWindow/index'
import SettingsWindow from '@/components/SettingsWindow/index'
import PasswordPromptWindow from '@/components/PasswordPromptWindow/index'
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
      path: '/password-prompt/:uuid',
      name: 'password-prompt',
      component: PasswordPromptWindow
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
