/**
 * Client-server processing
 */
import axios from 'axios'

export default {
  getAllCongreso (cb) {
    let candidatos = []
    axios
    .get(`https://ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data-primera-vuelta/congreso_total.json`)
    .then(response => {
      
      candidatos = response.data

      setTimeout(() => cb(candidatos), 100)
    })
  },
  getAllCandidatos (cb) {
    let candidatos = []
    axios
    .get(`https://ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data-primera-vuelta/resultados_total.json`)
    .then(response => {
      
      candidatos = response.data 

      setTimeout(() => cb(candidatos), 100)
    })
  },
  getAllCandidatosSegunda (cb) {
    let candidatos = []
    axios
    .get(`https://ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/resultados_total.json`)
    .then(response => {
      
      candidatos = response.data 

      setTimeout(() => cb(candidatos), 100)
    })
  },
  getAllDistritos (cb, { dep_id }) {
    let candidatos = []
    if(dep_id) {
      axios
      .get(`https://ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data-primera-vuelta/${dep_id}.json`)
      .then(response => {
        candidatos = response.data
        
        setTimeout(() => cb(candidatos), 100)
      })
    }
  },
  getAllDistritosSegunda (cb, { dep_id }) {
    let candidatos = []
    console.log(dep_id)
    if(dep_id) {
      axios
      .get(`https://ojo-publico.com/especiales/resultados-onpe-elecciones-2021/data/${dep_id}.json`)
      .then(response => {
        candidatos = response.data
        
        setTimeout(() => cb(candidatos), 100)
      })
    }
  }
}
