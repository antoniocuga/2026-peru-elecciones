/**
 * API client - returns Promises
 *
 * Primera vuelta 2026 JSON under data-primera-vuelta/ is built by crawler/2026
 * (export_frontend_data.py; optional live refresh per region during scrapy crawl).
 *
 * Env overrides (e.g. 2026 vs 2021):
 *   VITE_DATA_PRIMERA_DIR     - folder for primera vuelta (default: data-primera-vuelta)
 *   VITE_RESULTADOS_PRIMERA   - filename for candidatos (default: resultados_total_2026.json)
 *   VITE_DATA_SEGUNDA_DIR     - folder for segunda vuelta (default: data)
 *   VITE_RESULTADOS_SEGUNDA   - filename for segunda (default: resultados_total.json)
 */
import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || '/especiales/resultados-onpe-elecciones-2026'
const DATA_PRIMERA_DIR = import.meta.env.VITE_DATA_PRIMERA_DIR || 'data-primera-vuelta'
const RESULTADOS_PRIMERA = import.meta.env.VITE_RESULTADOS_PRIMERA || 'resultados_total_2026.json'
const DATA_SEGUNDA_DIR = import.meta.env.VITE_DATA_SEGUNDA_DIR || 'data'
const RESULTADOS_SEGUNDA = import.meta.env.VITE_RESULTADOS_SEGUNDA || 'resultados_total.json'

// In dev, use full URL to current origin so requests hit the Vite dev server.
// Public files are served at /data-primera-vuelta/ via vite.config server.proxy.
function getPrimeraUrl(filename) {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const path = `/${DATA_PRIMERA_DIR}/${filename}`
    return new URL(path, window.location.origin).href
  }
  if (import.meta.env.DEV) {
    return `/${DATA_PRIMERA_DIR}/${filename}`
  }
  return `${BASE}/${DATA_PRIMERA_DIR}/${filename}`
}

function getSegundaUrl(filename) {
  if (import.meta.env.DEV) {
    return `/${DATA_SEGUNDA_DIR}/${filename}`
  }
  return `${BASE}/${DATA_SEGUNDA_DIR}/${filename}`
}

function requestWithTimestamp(url) {
  return axios.get(url, {
    baseURL: '',
    params: { t: Date.now() },
  })
}

export default {
  async getAllCongreso() {
    const url = getPrimeraUrl('congreso_total.json')
    const { data } = await requestWithTimestamp(url)
    return data
  },
  async getCongresoPartidoRegion() {
    const url = getPrimeraUrl('congreso_partido_region.json')
    const { data } = await requestWithTimestamp(url)
    return data
  },
  async getAllSenado() {
    const url = getPrimeraUrl('senado_total.json')
    const { data } = await requestWithTimestamp(url)
    return data
  },
  async getAllCandidatos() {
    const url = getPrimeraUrl(RESULTADOS_PRIMERA)
    const { data } = await requestWithTimestamp(url)
    return data
  },
  async getAllCandidatosSegunda() {
    const { data } = await requestWithTimestamp(`${BASE}/${DATA_SEGUNDA_DIR}/${RESULTADOS_SEGUNDA}`)
    return data
  },
  async getAllDistritos({ dep_id }) {
    if (!dep_id) return []
    const { data } = await requestWithTimestamp(`${BASE}/${DATA_PRIMERA_DIR}/${dep_id}.json`)
    return data
  },
  async getAllDistritosSegunda({ dep_id }) {
    if (!dep_id) return []
    const { data } = await requestWithTimestamp(`${BASE}/${DATA_SEGUNDA_DIR}/${dep_id}.json`)
    return data
  },
}
 