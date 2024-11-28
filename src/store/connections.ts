import { defineStore } from 'pinia'
import { reactive } from 'vue'

export interface Connection {
  id: string
  name: string
  host: string
  driveLetter: string
  remotePath: string
}

export const useConnectionStore = defineStore('connections', () => {
  const connections = reactive<Connection[]>([
    {
      id: '71c56ad1-19b0-4512-839b-a8827385d6d2',
      name: 'Lorem Ipsum',
      driveLetter: 'X:',
      host: 'foo.example.com',
      remotePath: '/home/user'
    },
    {
      id: '0427abb9-6442-4e87-8ce2-a4794532ad3c',
      name: 'Dolot Sit Amet',
      driveLetter: 'Y:',
      host: 'bar.example.com',
      remotePath: '/home/user'
    },
    {
      id: 'de6fa09a-98b8-49b9-8dbc-56ddcbc7630c',
      name: 'Consectetur Adipisicing',
      driveLetter: 'Z:',
      host: 'baz.example.com',
      remotePath: '/home/user'
    }
  ])

  return {
    connections
  }
})
