const state = {
  connections: []
}

const mutations = {
  REFRESH_CONNECTIONS (state, payload) {
    state.connections = payload
  },

  ADD_CONNECTION (state, payload) {
    state.connections.push(payload)
  },

  UPDATE_CONNECTION (state, payload) {
    state.connections.forEach((item, index) => {
      if (item.uuid === payload.uuid) {
        state.connections.splice(index, 1, payload)
      }
    })
  },

  UPDATE_CONNECTION_STATUS (state, payload) {
    const conn = state.connections.find(a => a.uuid === payload.uuid)

    if (conn) {
      Object.keys(payload).forEach(key => {
        conn[key] = payload[key]
      })
    }
  },

  DELETE_CONNECTION (state, payload) {
    state.connections = state.connections.filter(a => a.uuid !== payload.uuid)
  },

  CLEAR_CONNECTIONS (state) {
    state.connections = []
  },

  MIGRATE_CONNECTIONS (state) {
    state.connections.forEach(conn => {
      // v1.0.2-beta.1
      if (!conn.advanced) {
        conn.advanced = {
          customCmdlOptionsEnabled: false,
          customCmdlOptions: []
        }
      }

      // v1.2.1
      if (!conn.advanced.connectOnStartup) {
        conn.advanced.connectOnStartup = false
      }

      // v1.2.1
      if (!conn.advanced.reconnect) {
        conn.advanced.reconnect = false
      }

      // v1.2.1
      if (!conn.preferredMountPoint) {
        conn.preferredMountPoint = null
      }
    })
  }
}

const actions = {
  REFRESH_CONNECTIONS ({ commit }, payload) {
    commit('REFRESH_CONNECTIONS', payload)
  },

  ADD_CONNECTION ({ commit }, payload) {
    commit('ADD_CONNECTION', payload)
  },

  UPDATE_CONNECTION ({ commit }, payload) {
    commit('UPDATE_CONNECTION', payload)
  },

  DELETE_CONNECTION ({ commit }, payload) {
    commit('DELETE_CONNECTION', payload)
  },

  UPDATE_CONNECTION_STATUS ({ commit }, payload) {
    commit('UPDATE_CONNECTION_STATUS', payload)
  },

  CLEAR_CONNECTIONS ({ commit }) {
    commit('CLEAR_CONNECTIONS')
  },

  APPLY_MIGRATIONS ({ commit }) {
    commit('MIGRATE_CONNECTIONS')
  }
}

export default {
  state,
  mutations,
  actions
}
