import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'
import { reactive } from 'vue'
import { useGroupStore } from './groups'

export interface Connection {
  id: string
  name: string
  host: string
  driveLetter: string
  remotePath: string
  status: 'connected' | 'connecting' | 'disconnected'
}

export const useConnectionStore = defineStore('connections', () => {
  const groupStore = useGroupStore()

  const connections = reactive<Connection[]>([
    {
      id: '71c56ad1-19b0-4512-839b-a8827385d6d2',
      name: 'Production Server',
      driveLetter: 'X:',
      host: 'foo.example.com',
      remotePath: '/home/user',
      status: 'disconnected'
    },
    {
      id: '0427abb9-6442-4e87-8ce2-a4794532ad3c',
      name: 'Development Server',
      driveLetter: 'Y:',
      host: 'bar.example.com',
      remotePath: '/home/user',
      status: 'disconnected'
    },
    {
      id: 'de6fa09a-98b8-49b9-8dbc-56ddcbc7630c',
      name: 'Testing Server',
      driveLetter: 'Z:',
      host: 'baz.example.com',
      remotePath: '/home/user',
      status: 'disconnected'
    }
  ])

  function all(): Connection[] {
    return connections
  }

  function get(connectionId: string): Connection {
    return connections.find((connection) => connection.id === connectionId)!
  }

  function add(connection: Omit<Connection, 'id'>): Connection {
    const conn: Connection = {
      ...connection,
      id: uuid()
    }

    connections.push(conn)

    groupStore.addConnection('all', conn.id)

    return conn
  }

  function update(connection: Partial<Connection>): void {
    const index = connections.findIndex((c) => c.id === connection.id)

    Object.assign(connections[index], connection)
  }

  function remove(connectionId: string): void {
    const index = connections.findIndex((connection) => connection.id === connectionId)!

    groupStore.removeConnectionFromAll(connectionId)

    connections.splice(index, 1)
  }

  return {
    connections,
    all,
    get,
    add,
    update,
    remove
  }
})
