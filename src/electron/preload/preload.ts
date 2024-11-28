import { contextBridge, ipcRenderer } from 'electron'

export interface ElectronAPI {
  os: NodeJS.Platform

  onFocus: (callback: (isFocused: boolean) => void) => void
}

contextBridge.exposeInMainWorld('electronAPI', {
  os: process.platform,

  onFocus: (callback: (isFocused: boolean) => void) => {
    ipcRenderer.on('window-focus', (_, isFocused) => callback(isFocused))
  }
})
