import { defineStore } from 'pinia'
import api from '../api/api'

const distritosCache = {}
const distritosSegundaCache = {}

// In-flight promise cache — prevents duplicate simultaneous requests
const inflight = {}

export const useCandidatosStore = defineStore('candidatos', {
  state: () => ({
    todos: [],
    todosSegunda: [],
    congresistas: [],
    distritos: [],
    distritosSegunda: [],
    regionSeleccionada: {
      region: 'NACIONAL',
      departamento: 'EXPLORAR REGIÓN',
    },
    regionSeleccionadaSegunda: {
      region: 'NACIONAL',
      departamento: 'EXPLORAR REGIÓN',
    },
    partidoSeleccionado: {
      partido_id: 'TODOS',
      partido: 'EXPLORAR POR PARTIDO',
    },
    partidoSeleccionadoSegunda: {
      partido_id: 'TODOS',
      partido: 'EXPLORAR POR PARTIDO',
    },
  }),

  actions: {
    async getAllCandidatos() {
      if (this.todos.length > 0) return
      if (!inflight.todos) {
        inflight.todos = api.getAllCandidatos().finally(() => { delete inflight.todos })
      }
      this.todos = await inflight.todos
    },
    async getAllCandidatosSegunda() {
      if (this.todosSegunda.length > 0) return
      if (!inflight.todosSegunda) {
        inflight.todosSegunda = api.getAllCandidatosSegunda().finally(() => { delete inflight.todosSegunda })
      }
      this.todosSegunda = await inflight.todosSegunda
    },
    async getAllCongreso() {
      if (this.congresistas.length > 0) return
      if (!inflight.congresistas) {
        inflight.congresistas = api.getAllCongreso().finally(() => { delete inflight.congresistas })
      }
      this.congresistas = await inflight.congresistas
    },

    async getAllDistritos(region) {
      const rawKey = region?.region ?? 'NACIONAL'
      const key = rawKey === 'NACIONAL' ? rawKey : String(rawKey).toLowerCase().trim()
      if (distritosCache[key] != null) {
        const cached = distritosCache[key]
        this.distritos = Array.isArray(cached) ? cached : cached?.candidatos ?? []
        return
      }
      const result = await api.getAllDistritos({ dep_id: key })
      distritosCache[key] = result
      this.distritos = Array.isArray(result) ? result : result?.candidatos ?? result ?? []
    },
    async getAllDistritosSegunda(region) {
      const rawKey = region?.region ?? 'NACIONAL'
      const key = rawKey === 'NACIONAL' ? rawKey : String(rawKey).toLowerCase().trim()
      if (distritosSegundaCache[key] != null) {
        const cached = distritosSegundaCache[key]
        this.distritosSegunda = Array.isArray(cached) ? cached : cached?.candidatos ?? []
        return
      }
      const result = await api.getAllDistritosSegunda({ dep_id: key })
      distritosSegundaCache[key] = result
      this.distritosSegunda = Array.isArray(result) ? result : result?.candidatos ?? result ?? []
    },

    updateRegionSeleccionada(region) {
      this.regionSeleccionada = region
    },
    updateRegionSeleccionadaSegunda(region) {
      this.regionSeleccionadaSegunda = region
    },
    updatePartidoSeleccionado(partido) {
      this.partidoSeleccionado = partido
    },
    updatePartidoSeleccionadoSegunda(partido) {
      this.partidoSeleccionadoSegunda = partido
    },
  },
})
