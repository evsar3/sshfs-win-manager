import { defineStore } from 'pinia'
import { reactive } from 'vue'

export interface Settings {
  theme: 'light' | 'dark' | 'auto'
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = reactive<Settings>({
    theme: 'auto'
  })

  return {
    settings
  }
})
