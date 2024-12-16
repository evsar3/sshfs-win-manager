import type { DefineComponent } from 'vue'

import type { ElectronAPI } from './electron/preload/preload'

declare module '*.vue' {
  const component: DefineComponent<object, object, unknown>

  export default component
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
