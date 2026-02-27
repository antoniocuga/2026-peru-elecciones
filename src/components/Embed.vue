<template>
  <div class="col-12 col-sm-12 resultados2021">
      <div class="row justify-content-center top-candidates pb-3 pt-3">
        <div class="col-12 mb-3">
          <h3 class="m-0 text-center">Resultados a nivel nacional - <b>conteo ONPE al 61%</b> - Última actualización: 11 de Abril a las 23:00</h3>
        </div>
        <div class="col-auto text-center" :key="c.candidato_id" v-for="(c, ix) in top_candidatos">
          <div>
            <div class="mr-2"><img width="65px" :src="getImageCandidate(c.candidato_id)" /></div>
          </div>
          <div class="d-flex">
            <div class="card-resultado">              
              <div class="candidato-mapa">{{ c.candidato }}</div>
              <div class="partido-mapa"><img width="25px" :src="getImagePartido(c.partido_id)" /> {{ c.partido }}</div>

              <div class="text-center mt-2 mb-2 porcentaje">{{ c.porcentaje }} <span>%</span></div>
              <div class="diferencia">+ 120,459 diferencia</div>              
              <div class="puesto" v-if="ix == 0 || ix == 1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
              </svg> En segunda vuelta</div>
            </div>
          </div>
        </div>
      </div>
  </div>    
</template>

<script>

import { storeToRefs } from 'pinia'
import { useCandidatosStore } from '../stores/candidatos'
import { getPartidoImage, getCandidatoImage } from '../utils/assets'
import { filter, map, orderBy, groupBy, sumBy, uniq } from 'lodash'

export default {
  name: 'Embed',
  props: {
    encuestas: Array
  },
  setup() {
    const store = useCandidatosStore()
    return { ...storeToRefs(store), store }
  },
  created() {
    this.store.getAllCandidatos()
  },
  methods: {
    getImageCandidate(c) {
      return getCandidatoImage(c)
    },
    getImagePartido(c) {
      return getPartidoImage(c)
    }
  },
  computed: {
    filteredData() {
      if (this.regionSeleccionada.region != 'NACIONAL' && this.partidoSeleccionado.partido_id == 'TODOS') {
        return this.regionSeleccionada.candidatos
      }
      if (this.regionSeleccionada.region == 'NACIONAL' && this.partidoSeleccionado.partido_id != 'TODOS') {
        return filter(this.todos, c => c.partido_id == this.partidoSeleccionado.partido_id)
      }
      return filter(this.todos, c => c.candidato_id != "")
    },
    lista_candidatos() {
      return orderBy(map(groupBy(this.filteredData, 'candidato_id'), (d, id) => {
        return {
          candidato_id: id,
          region: uniq(map(d, 'region')).join(''),
          candidato: uniq(map(d, 'candidato')).join(''),
          partido_id: uniq(map(d, 'partido_id')).join(''),
          partido: uniq(map(d, 'partido')).join(''),
          color: uniq(map(d, 'color')).join(''),
          votos: parseFloat(uniq(map(d, 'nacional')).join('')),
          validos: parseFloat(uniq(map(d, 'total_departamento')).join('')),
          porcentaje: this.regionSeleccionada.region != 'NACIONAL' ? sumBy(d, 'total_departamento') : parseFloat(uniq(map(d, 'validos_nacional')).join(''))
        }
      }), ['porcentaje'], ['desc'])
    },
    top_candidatos() {
      let filtered = filter(this.todos, c => c.candidato_id != "")
      let candidates = orderBy(map(groupBy(filtered, 'candidato_id'), (d, id) => {
        return {
          candidato_id: id,
          region: uniq(map(d, 'region')).join(''),
          candidato: uniq(map(d, 'candidato')).join(''),
          partido_id: uniq(map(d, 'partido_id')).join(''),
          partido: uniq(map(d, 'partido')).join(''),
          color: uniq(map(d, 'color')).join(''),
          votos: parseFloat(uniq(map(d, 'nacional')).join('')),
          validos: parseFloat(uniq(map(d, 'total_departamento')).join('')),
          porcentaje: parseFloat(uniq(map(d, 'validos_nacional')).join(''))
        }
      }), ['porcentaje'], ['desc'])
      return candidates.slice(0, 6)
    }
  }
}
</script>


