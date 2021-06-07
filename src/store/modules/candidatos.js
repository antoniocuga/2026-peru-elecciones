import api from '../../api/api'

// initial state
const state = () => ({
  todos: [],
  todosSegunda: [],
  congresistas: [],
  distritos: [],
  distritosSegunda: [],
  regionSeleccionada: {
    region: "NACIONAL",
    departamento: "VER REGIÓN"
  },
  regionSeleccionadaSegunda: {
    region: "NACIONAL",
    departamento: "VER REGIÓN"
  },
  partidoSeleccionado: {
    partido_id: "TODOS",
    partido: "VER POR PARTIDO",
  }
})

let all_distritos = []
let all_distritos_segunda = []
// getters
const getters = {}

// actions
const actions = {
  getAllCandidatos ({ commit }) {
    api.getAllCandidatos(candidatos => {
      commit('setAllCandidatos', candidatos)
    })
  },
  getAllCandidatosSegunda ({ commit }) {
    api.getAllCandidatosSegunda(candidatos => {
      commit('setAllCandidatosSegunda', candidatos)
    })
  },
  getAllCongreso ({ commit }) {
    api.getAllCongreso(candidatos => {
      commit('setAllCongreso', candidatos)
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
  getAllDistritosSegunda ({ commit }, region) {
    if(!all_distritos_segunda[region.region]) {
      api.getAllDistritosSegunda(distritos => {
        all_distritos_segunda[region] = distritos
        commit('setAllDistritosSegunda', distritos)
      }, {dep_id: region.region})
    } else {
      commit('setAllDistritosSegunda', all_distritos_segunda[region.region].candidatos)
    }
  },
  updateRegionSeleccionada ({ commit }, region) {
    commit('setRegionSeleccionada', region)
  },
  updateRegionSeleccionadaSegunda ({ commit }, region) {
    commit('setRegionSeleccionadaSegunda', region)
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
  setAllCandidatosSegunda(state, candidatos) {
    state.todosSegunda = candidatos
  },
  setAllCongreso(state, candidatos) {
    state.congresistas = candidatos
  },
  setAllDistritos(state, distritos) {
    state.distritos = distritos
  },
  setAllDistritosSegunda(state, distritos) {
    state.distritosSegunda = distritos
  },
  setRegionSeleccionada(state, region) {
    state.regionSeleccionada = region
  },
  setRegionSeleccionadaSegunda(state, region) {
    state.regionSeleccionadaSegunda = region
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