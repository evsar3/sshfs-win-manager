import { defineStore } from 'pinia'
import { ref } from 'vue'

import { Group, useGroupStore } from './groups'

export const useMainStore = defineStore('main', () => {
  const dragMode = ref(false)
  const activeGroupId = ref('all')

  const groupStore = useGroupStore()

  function getActiveGroup(): Group {
    return (
      groupStore.groups.find((group) => group.id === activeGroupId.value) ?? groupStore.groups[0]
    )
  }

  return {
    dragMode,
    activeGroupId,
    getActiveGroup
  }
})
