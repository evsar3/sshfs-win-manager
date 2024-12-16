import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Settings {
  sshfsBin: string
  startupWithOS: boolean
  processStatusCheckInterval: number
  theme: 'light' | 'dark' | 'auto'
}

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const settings = ref<Settings>({
      sshfsBin: 'C:\\Program Files\\SSHFS-Win\\bin\\sshfs.exe',
      startupWithOS: false,
      processStatusCheckInterval: 5,
      theme: 'auto'
    })

    return {
      settings
    }
  },
  {
    useStorage: true
  }
)
