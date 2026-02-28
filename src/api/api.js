/**
 * API client - returns Promises
 */
import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || 'https://ojo-publico.com/especiales/resultados-onpe-elecciones-2021'

export default {
  async getAllCongreso() {
    const { data } = await axios.get(`${BASE}/data-primera-vuelta/congreso_total.json`)
    return data
  },
  async getAllCandidatos() {
    const { data } = await axios.get(`${BASE}/data-primera-vuelta/resultados_total.json`)
    return data
  },
  async getAllCandidatosSegunda() {
    const { data } = await axios.get(`${BASE}/data/resultados_total.json`)
    return data
  },
  async getAllDistritos({ dep_id }) {
    if (!dep_id) return []
    const { data } = await axios.get(`${BASE}/data-primera-vuelta/${dep_id}.json`)
    return data
  },
  async getAllDistritosSegunda({ dep_id }) {
    if (!dep_id) return []
    const { data } = await axios.get(`${BASE}/data/${dep_id}.json`)
    return data
  },
}
