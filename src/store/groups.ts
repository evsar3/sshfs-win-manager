import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'
import { reactive } from 'vue'

export interface Group {
  id: string
  name: string
  /**
   * List of connection IDs
   */
  connections: string[]
}

export const useGroupStore = defineStore('groups', () => {
  const groups = reactive<Group[]>([
    {
      id: 'all',
      name: 'All',
      connections: [
        '71c56ad1-19b0-4512-839b-a8827385d6d2',
        '0427abb9-6442-4e87-8ce2-a4794532ad3c',
        'de6fa09a-98b8-49b9-8dbc-56ddcbc7630c'
      ]
    }
  ])

  function getGroup(groupId: string): Group {
    return groups.find((group) => group.id === groupId)!
  }

  function addGroup(group: Omit<Group, 'id' | 'connections'>): Group | null {
    if (group.name === '') return null
    if (group.name === 'All') return null

    const gro: Group = {
      ...group,
      id: uuid(),
      connections: []
    }

    groups.push(gro)

    return gro
  }

  function updateGroup(group: Partial<Group>): void {
    if (group.id === 'all') return

    const index = groups.findIndex((g) => g.id === group.id)

    Object.assign(groups[index], group)
  }

  function removeGroup(groupId: string): void {
    if (groupId === 'all') return

    const index = groups.findIndex((group) => group.id === groupId)

    groups.splice(index, 1)
  }

  function addConnectionToGroup(groupId: string, connectionId: string): void {
    const group = groups.find((group) => group.id === groupId)!

    if (group.connections.includes(connectionId)) return

    group.connections.push(connectionId)
  }

  function removeConnectionFromGroup(groupId: string, connectionId: string): void {
    if (groupId === 'all') return

    const group = groups.find((group) => group.id === groupId)!
    const index = group.connections.findIndex((id) => id === connectionId)

    group.connections.splice(index, 1)
  }

  return {
    groups,
    getGroup,
    addGroup,
    updateGroup,
    removeGroup,
    addConnectionToGroup,
    removeConnectionFromGroup
  }
})
