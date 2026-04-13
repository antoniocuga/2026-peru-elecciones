import { defineStore } from 'pinia'
import api from '../api/api'

/** ONPE JSON lists must be arrays for groupBy / charts; avoid runtime errors on bad payloads */
function asCandidateArray(data) {
  return Array.isArray(data) ? data : []
}

// In-flight promise cache — prevents duplicate simultaneous requests
const inflight = {}
/** Per-región distrito fetch: always hit the network again when re-entering a región (JSON may have updated). */
const inflightDistritos = {}
const inflightDistritosSegunda = {}

export const useCandidatosStore = defineStore('candidatos', {
  state: () => ({
    todos: [],
    todosSegunda: [],
    congresistas: [], 
    senadores: [],
    distritos: [],
    distritosSegunda: [],
    regionSeleccionada: {
      region: 'NACIONAL',
      departamento: 'Explorar región',
    },
    regionSeleccionadaSegunda: {
      region: 'NACIONAL',
      departamento: 'Explorar región',
    },
    partidoSeleccionado: {
      partido_id: 'TODOS',
      partido: 'Explorar por partido',
    },
    partidoSeleccionadoSegunda: {
      partido_id: 'TODOS',
      partido: 'Explorar por partido',
    },
  }),

  actions: {
    async getAllCandidatos() {
      if (this.todos.length > 0) return
      if (!inflight.todos) {
        inflight.todos = api.getAllCandidatos().finally(() => { delete inflight.todos })
      }
      const raw = await inflight.todos
      this.todos = asCandidateArray(raw)
    },
    async getAllCandidatosSegunda() {
      if (this.todosSegunda.length > 0) return
      if (!inflight.todosSegunda) {
        inflight.todosSegunda = api.getAllCandidatosSegunda().finally(() => { delete inflight.todosSegunda })
      }
      const raw = await inflight.todosSegunda
      this.todosSegunda = asCandidateArray(raw)
    },
    async getAllCongreso() {
      if (this.congresistas.length > 0) return
      if (!inflight.congresistas) {
        inflight.congresistas = api.getAllCongreso().finally(() => { delete inflight.congresistas })
      }
      const raw = await inflight.congresistas
      this.congresistas = asCandidateArray(raw)
    },
    async getAllSenado() {
      if (this.senadores.length > 0) return
      if (!inflight.senadores) {
        inflight.senadores = api.getAllSenado().finally(() => { delete inflight.senadores })
      }
      const raw = await inflight.senadores
      this.senadores = asCandidateArray(raw)
    },

    async getAllDistritos(region) {
      const rawKey = region?.region ?? 'NACIONAL'
      const key = rawKey === 'NACIONAL' ? rawKey : String(rawKey).toLowerCase().trim()
      if (!inflightDistritos[key]) {
        inflightDistritos[key] = api.getAllDistritos({ dep_id: key }).finally(() => {
          delete inflightDistritos[key]
        })
      }
      const result = await inflightDistritos[key]
      this.distritos = Array.isArray(result) ? result
        : Array.isArray(result?.candidatos) ? result.candidatos : []
    },
    async getAllDistritosSegunda(region) {
      const rawKey = region?.region ?? 'NACIONAL'
      const key = rawKey === 'NACIONAL' ? rawKey : String(rawKey).toLowerCase().trim()
      if (!inflightDistritosSegunda[key]) {
        inflightDistritosSegunda[key] = api.getAllDistritosSegunda({ dep_id: key }).finally(() => {
          delete inflightDistritosSegunda[key]
        })
      }
      const result = await inflightDistritosSegunda[key]
      this.distritosSegunda = Array.isArray(result) ? result
        : Array.isArray(result?.candidatos) ? result.candidatos : []
    },

    /** Shallow clone so Pinia/Vue always notify (re-picking same región from dropdown reused the same dep object ref). */
    updateRegionSeleccionada(region) {
      this.regionSeleccionada = region && typeof region === 'object' ? { ...region } : region
    },
    updateRegionSeleccionadaSegunda(region) {
      this.regionSeleccionadaSegunda = region && typeof region === 'object' ? { ...region } : region
    },
    updatePartidoSeleccionado(partido) {
      this.partidoSeleccionado = partido && typeof partido === 'object' ? { ...partido } : partido
    },
    updatePartidoSeleccionadoSegunda(partido) {
      this.partidoSeleccionadoSegunda = partido && typeof partido === 'object' ? { ...partido } : partido
    },
  },
})
