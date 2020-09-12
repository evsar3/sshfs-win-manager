const state = {
  settings: {
    sshfsBinary: 'C:\\Program Files\\SSHFS-Win\\bin\\sshfs.exe',
    startupWithOS: true,
    displayTrayMessageOnClose: true,
    processTrackTimeout: 15,
    showDebugPanel: false
  }
}

const mutations = {
  UPDATE_SETTINGS (state, payload) {
    state.settings = payload
  },

  RESET_SETTINGS (state) {
    state.settings = {
      sshfsBinary: 'C:\\Program Files\\SSHFS-Win\\bin\\sshfs.exe',
      startupWithOS: true,
      displayTrayMessageOnClose: true,
      processTrackTimeout: 15,
      showDebugPanel: false
    }
  }
}

const actions = {
  UPDATE_SETTINGS ({ commit }, payload) {
    commit('UPDATE_SETTINGS', payload)
  },

  RESET_SETTINGS ({ commit }) {
    commit('RESET_SETTINGS')
  }
}

export default {
  state,
  mutations,
  actions
}
