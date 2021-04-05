/**
 * Mocking client-server processing
 */
import axios from 'axios'

export default {
  getAllCandidatos (cb) {
    let candidatos = []
    axios
    .get(`/resultados-2021/data/resultados_total.json`)
    .then(response => {
      
      candidatos = response.data

      setTimeout(() => cb(candidatos), 100)
    })
  }
}
