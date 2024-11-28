import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

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
      connections: []
    },
    {
      id: '0b9fb1b7-3c72-4a50-856e-c29bcaead5e3',
      name: 'Lorem Ipsum',
      connections: []
    },
    {
      id: 'eed4beef-098e-4bb5-bb8b-51924e2e711f',
      name: 'Dolot Sit Amet',
      connections: []
    },
    {
      id: '6fb4b4b6-bbe5-4a84-b894-6cefa611ff95',
      name: 'Consectetur Adipisicing',
      connections: []
    }
  ])

  const activeGroupId = ref('all')

  return {
    groups,
    activeGroupId
  }
})
