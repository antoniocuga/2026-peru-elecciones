/**
 * Client-server processing
 */
import axios from 'axios'

export default {
  getAllCongreso (cb) {
    let candidatos = []
    axios
    .get(`/resultados-2021/data/congreso_total.json`)
    .then(response => {
      
      candidatos = response.data

      setTimeout(() => cb(candidatos), 100)
    })
  },
  getAllCandidatos (cb) {
    let candidatos = []
    axios
    .get(`/resultados-2021/data/resultados_total.json`)
    .then(response => {
      
      candidatos = response.data

      setTimeout(() => cb(candidatos), 100)
    })
  },
  getAllDistritos (cb, { dep_id }) {
    let candidatos = []
    if(dep_id) {
      axios
      .get(`/resultados-2021/data/${dep_id}.json`)
      .then(response => {
        candidatos = response.data
        
        setTimeout(() => cb(candidatos), 100)
      })
    }
  }
}
