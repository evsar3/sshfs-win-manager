import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'
import { ref } from 'vue'
import { useGroupStore } from './groups'

export interface ConnectionOption {
  id: string
  key: string
  value: string
}

export interface Connection {
  id: string
  name: string
  host: string
  port: string
  username: string
  authMethod: 'password' | 'request-password' | 'key' | 'key-file' | 'agent'
  password: string
  key: string
  keyFile: string
  keyPassphrase: string
  remotePath: string
  automaticMountPoint: boolean
  mountPoint: string
  connectOnStartup: boolean
  options: ConnectionOption[]
  status: 'connected' | 'connecting' | 'disconnected'
}

export const useConnectionStore = defineStore(
  'connections',
  () => {
    const groupStore = useGroupStore()

    const connections = ref<Connection[]>([])

    function all(): Connection[] {
      return connections.value
    }

    function get(connectionId: string): Connection {
      return connections.value.find((connection) => connection.id === connectionId)!
    }

    function add(connection: Omit<Connection, 'id'>): Connection {
      const conn: Connection = {
        ...connection,
        id: uuid(),
        status: 'disconnected'
      }

      conn.options = conn.options.filter((i) => i.key !== '')

      connections.value.push(conn)

      groupStore.addConnection('all', conn.id)

      return conn
    }

    function update(connection: Partial<Connection>): void {
      const index = connections.value.findIndex((c) => c.id === connection.id)

      connection.options = connection.options?.filter((i) => i.key !== '')

      connections.value[index] = {
        ...connections.value[index],
        ...connection
      }
    }

    function remove(connectionId: string): void {
      const index = connections.value.findIndex((connection) => connection.id === connectionId)!

      groupStore.removeConnectionFromAll(connectionId)

      connections.value.splice(index, 1)
    }

    return {
      connections,
      all,
      get,
      add,
      update,
      remove
    }
  },
  {
    useSafeStorage: true
  }
)
