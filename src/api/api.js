/**
 * API client - returns Promises
 *
 * Data file and directory can be switched via env (e.g. 2026 vs 2021):
 *   VITE_DATA_PRIMERA_DIR     - folder for primera vuelta (default: data-primera-vuelta)
 *   VITE_RESULTADOS_PRIMERA   - filename for candidatos (default: resultados_total.json)
 *   VITE_DATA_SEGUNDA_DIR     - folder for segunda vuelta (default: data)
 *   VITE_RESULTADOS_SEGUNDA   - filename for segunda (default: resultados_total.json)
 */
import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || 'https://ojo-publico.com/especiales/resultados-onpe-elecciones-2021'
const DATA_PRIMERA_DIR = import.meta.env.VITE_DATA_PRIMERA_DIR || 'data-primera-vuelta'
const RESULTADOS_PRIMERA = import.meta.env.VITE_RESULTADOS_PRIMERA || 'resultados_total.json'
const DATA_SEGUNDA_DIR = import.meta.env.VITE_DATA_SEGUNDA_DIR || 'data'
const RESULTADOS_SEGUNDA = import.meta.env.VITE_RESULTADOS_SEGUNDA || 'resultados_total.json'

// In dev, Vite serves public/ at root, so data must be requested as /data-primera-vuelta/...
// In production, BASE is the app origin/base path.
function getPrimeraUrl(filename) {
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

export default {
  async getAllCongreso() {
    const url = `${BASE}/${DATA_PRIMERA_DIR}/congreso_total.json`
    if (import.meta.env.DEV) console.log('[API] getAllCongreso', url)
    const { data } = await axios.get(url)
    return data
  },
  async getAllSenado() {
    const url = `${BASE}/${DATA_PRIMERA_DIR}/senado_total.json`
    if (import.meta.env.DEV) console.log('[API] getAllSenado', url)
    const { data } = await axios.get(url)
    return data
  },
  async getAllCandidatos() {
    const { data } = await axios.get(`${BASE}/${DATA_PRIMERA_DIR}/${RESULTADOS_PRIMERA}`)
    return data
  },
  async getAllCandidatosSegunda() {
    const { data } = await axios.get(`${BASE}/${DATA_SEGUNDA_DIR}/${RESULTADOS_SEGUNDA}`)
    return data
  },
  async getAllDistritos({ dep_id }) {
    if (!dep_id) return []
    const { data } = await axios.get(`${BASE}/${DATA_PRIMERA_DIR}/${dep_id}.json`)
    return data
  },
  async getAllDistritosSegunda({ dep_id }) {
    if (!dep_id) return []
    const { data } = await axios.get(`${BASE}/${DATA_SEGUNDA_DIR}/${dep_id}.json`)
    return data
  },
}
