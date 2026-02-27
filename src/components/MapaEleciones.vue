<template>
  <div class="col-12 col-sm-12 resultados2021">
      <div class="row pt-3">
        <div class="col-12 col-sm-12 col-md-4 d-md-block d-none mapa-resultados-wrapper">
          <candidatosResultados :candidatos="filteredData" />
        </div>
        <div class="col-12 col-sm-12 col-md-8 mapa-resultados-wrapper">
          <MapaDepartamentos :lista_candidatos="filteredData" />
        </div>
        <div class="col-12 col-sm-12 d-block d-md-none mapa-resultados-wrapper">
          <candidatosResultados :candidatos="filteredData" />
        </div>
      </div>
  </div>    
</template>

<script>

import { storeToRefs } from 'pinia'
import { useCandidatosStore } from '../stores/candidatos'
import { getPartidoImage, getCandidatoImage } from '../utils/assets'
import candidatosResultados from './candidatosResultados.vue'
import MapaDepartamentos from './MapaDepartamentos.vue'
import { filter } from 'lodash'

export default {
  name: 'MapaEleciones',
  props: {
    encuestas: Array
  },
  components: {
    MapaDepartamentos,
    candidatosResultados
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
      const isRegion = this.regionSeleccionada.region != 'NACIONAL'
      const isPartido = this.partidoSeleccionado.partido_id != 'TODOS'
      const regionCandidatos = Array.isArray(this.regionSeleccionada.candidatos)
        ? this.regionSeleccionada.candidatos : []

      if (isRegion && !isPartido) {
        return regionCandidatos
      }
      if (!isRegion && isPartido) {
        return filter(this.todos, c => c.partido_id == this.partidoSeleccionado.partido_id)
      }
      if (isRegion && isPartido) {
        return filter(regionCandidatos, c => c.partido_id == this.partidoSeleccionado.partido_id)
      }
      return filter(this.todos, c => c.candidato_id != "")
    }
  }
}
</script>


