import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'
import { ref } from 'vue'

export interface Group {
  id: 'all' | (string & {})
  name: string
  /**
   * List of connection IDs
   */
  connections: string[]
}

export const useGroupStore = defineStore(
  'groups',
  () => {
    const groups = ref<Group[]>([
      {
        id: 'all',
        name: 'All',
        connections: []
      }
    ])

    function all(): Group[] {
      return groups.value
    }

    function get(groupId: string): Group {
      return groups.value.find((group) => group.id === groupId)!
    }

    function add(group: Omit<Group, 'id' | 'connections'>): Group | null {
      if (group.name === '') return null
      if (group.name === 'All') return null

      const gro: Group = {
        ...group,
        id: uuid(),
        connections: []
      }

      groups.value.push(gro)

      return gro
    }

    function update(group: Partial<Group>): void {
      if (group.id === 'all') return

      const index = groups.value.findIndex((g) => g.id === group.id)

      groups.value[index] = {
        ...groups.value[index],
        ...group
      }
    }

    function remove(groupId: string): void {
      if (groupId === 'all') return

      const index = groups.value.findIndex((group) => group.id === groupId)

      groups.value.splice(index, 1)
    }

    function addConnection(groupId: string, connectionId: string): void {
      const group = groups.value.find((group) => group.id === groupId)!

      if (group.connections.includes(connectionId)) return

      group.connections.push(connectionId)
    }

    function removeConnection(groupId: string, connectionId: string): void {
      if (groupId === 'all') return

      const group = groups.value.find((group) => group.id === groupId)!
      const index = group.connections.findIndex((id) => id === connectionId)

      group.connections.splice(index, 1)
    }

    function removeConnectionFromAll(connectionId: string): void {
      groups.value.forEach((group) => {
        const index = group.connections.findIndex((id) => id === connectionId)

        group.connections.splice(index, 1)
      })
    }

    return {
      groups,
      all,
      get,
      add,
      update,
      remove,
      addConnection,
      removeConnection,
      removeConnectionFromAll
    }
  },
  {
    useStorage: true
  }
)
