import { contextBridge, ipcRenderer } from 'electron'

export interface ElectronAPI {
  os: NodeJS.Platform

  onFocus: (callback: (isFocused: boolean) => void) => void
  dialog: (options: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>
  storeData: (path: string, data: string) => Promise<void>
  loadData: (path: string) => Promise<string>
  storeSafeData: (path: string, data: string) => Promise<void>
  loadSafeData: (path: string) => Promise<string>
}

contextBridge.exposeInMainWorld('electronAPI', {
  os: process.platform,

  onFocus: (callback: (isFocused: boolean) => void) => {
    ipcRenderer.on('window-focus', (_, isFocused) => callback(isFocused))
  },

  dialog: async (options: Electron.OpenDialogOptions) => {
    return await ipcRenderer.invoke('dialog', options)
  },

  storeData: async (name: string, data: string) => {
    return await ipcRenderer.invoke('storeData', name, data)
  },

  loadData: async (name: string) => {
    return await ipcRenderer.invoke('loadData', name)
  },

  storeSafeData: async (name: string, data: string) => {
    return await ipcRenderer.invoke('storeSafeData', name, data)
  },

  loadSafeData: async (name: string) => {
    return await ipcRenderer.invoke('loadSafeData', name)
  }
} satisfies ElectronAPI)
