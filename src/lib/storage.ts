import { PiniaPluginContext } from 'pinia'

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    useStorage?: boolean
    useSafeStorage?: boolean
  }
}

export const storage = ({ store, options }: PiniaPluginContext) => {
  if (options.useStorage === true) {
    window.electronAPI.loadData(store.$id).then((data) => {
      if (data !== '') {
        store.$patch(JSON.parse(data))
      }
    })

    store.$subscribe((mutation, state) => {
      void window.electronAPI.storeData(store.$id, JSON.stringify(state, null, 2))
    })
  }

  if (options.useSafeStorage === true) {
    window.electronAPI.loadSafeData(store.$id).then((data) => {
      if (data !== '') {
        store.$patch(JSON.parse(data))
      }
    })

    store.$subscribe((mutation, state) => {
      void window.electronAPI.storeSafeData(store.$id, JSON.stringify(state))
    })
  }
}
