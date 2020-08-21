const state = {
  settings: {
    sshfsBinary: 'C:\\Program Files\\SSHFS-Win\\bin\\sshfs-win.exe',
    startupWithOS: true,
    displayTrayMessageOnClose: true
  }
}

const mutations = {
  UPDATE_SETTINGS (state, payload) {
    state.settings = payload
  },

  RESET_SETTINGS (state) {
    state.settings = {
      sshfsBinary: 'C:\\Program Files\\SSHFS-Win\\bin\\sshfs-win.exe',
      startupWithOS: true,
      displayTrayMessageOnClose: true
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
