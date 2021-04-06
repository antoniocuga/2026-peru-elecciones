import api from '../../api/api'

// initial state
const state = () => ({
  todos: [],
  regionSeleccionada: {
    region: "NACIONAL"
  },
  partidoSeleccionado: {
    partido_id: "SELECCIONAR PARTIDO"
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
  },
  updatePartidoSeleccionado ({ commit }, partido) {
      commit('setPartidoSeleccionado', partido)
  }
}

// mutations
const mutations = {
  setAllCandidatos(state, candidatos) {
    state.todos = candidatos
  },
  setRegionSeleccionada(state, region) {
    state.regionSeleccionada = region
  },
  setPartidoSeleccionado(state, partido) {
    state.partidoSeleccionado = partido
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}