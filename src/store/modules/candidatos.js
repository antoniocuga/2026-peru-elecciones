import api from '../../api/api'

// initial state
const state = () => ({
  todos: [],
  regionSeleccionada: {
    region: "NACIONAL"
  }
})

// getters
const getters = {}

// actions
const actions = {
  getAllCandidatos ({ commit }) {
    api.getAllCandidatos(candidatos => {
      commit('setAllCandidatos', candidatos)
    })
  },
  updateRegionSeleccionada ({ commit }, region) {
      commit('setRegionSeleccionada', region)
  }
}

// mutations
const mutations = {
  setAllCandidatos(state, candidatos) {
    state.todos = candidatos
  },
  setRegionSeleccionada(state, region) {
    state.regionSeleccionada = region
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}