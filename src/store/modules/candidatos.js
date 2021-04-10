import api from '../../api/api'

// initial state
const state = () => ({
  todos: [],
  distritos: [],
  regionSeleccionada: {
    region: "NACIONAL",
    departamento: "VER REGIÓN"
  },
  partidoSeleccionado: {
    partido_id: "TODOS",
    partido: "VER POR PARTIDO",
  }
})

let all_distritos = []
// getters
const getters = {}

// actions
const actions = {
  getAllCandidatos ({ commit }) {
    api.getAllCandidatos(candidatos => {
      commit('setAllCandidatos', candidatos)
    })
  },
  getAllDistritos ({ commit }, region) {
    if(!all_distritos[region.region]) {
      api.getAllDistritos(distritos => {
        all_distritos[region] = distritos
        commit('setAllDistritos', distritos)
      }, {dep_id: region.region})
    } else {
      commit('setAllDistritos', all_distritos[region.region].candidatos)
    }
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
  setAllDistritos(state, distritos) {
    state.distritos = distritos
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