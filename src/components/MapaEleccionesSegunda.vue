<template>
  <div class="col-12 col-sm-12 resultados2021">
    <div class="top-candidates pb-3 pt-3">
      <topWidget />
    </div>
    <div class="row pt-3">
      <div class="col-12 col-sm-12 col-md-4 d-md-block d-none mapa-resultados-wrapper">
        <candidatosResultadosSegunda :candidatos="filteredData" />
      </div>
      <div class="col-12 col-sm-12 col-md-8 mapa-resultados-wrapper">
        <MapaDepartamentosSegunda :lista_candidatos="filteredData" />
      </div>
      <div class="col-12 col-sm-12 d-block d-md-none mapa-resultados-wrapper">
        <candidatosResultadosSegunda :candidatos="filteredData" />
      </div>
    </div>
  </div>    
</template>

<script>

import { storeToRefs } from 'pinia'
import { useCandidatosStore } from '../stores/candidatos'
import { getPartidoImage, getCandidatoImage } from '../utils/assets'
import topWidget from './topWidget.vue'
import candidatosResultadosSegunda from './candidatosResultadosSegunda.vue'
import MapaDepartamentosSegunda from './MapaDepartamentosSegunda.vue'
import { filter } from 'lodash'

export default {
  name: 'MapaEleccionesSegunda',
  props: {
    encuestas: Array
  },
  components: {
    MapaDepartamentosSegunda,
    candidatosResultadosSegunda,
    topWidget
  },
  setup() {
    const store = useCandidatosStore()
    return { ...storeToRefs(store), store }
  },
  created() {
    this.store.getAllCandidatosSegunda()
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
      const isRegion = this.regionSeleccionadaSegunda.region != 'NACIONAL'
      const isPartido = this.partidoSeleccionadoSegunda.partido_id != 'TODOS'
      const regionCandidatos = Array.isArray(this.regionSeleccionadaSegunda.candidatos)
        ? this.regionSeleccionadaSegunda.candidatos : []

      if (isRegion && !isPartido) {
        return regionCandidatos
      }
      if (!isRegion && isPartido) {
        return filter(this.todosSegunda, c => c.partido_id == this.partidoSeleccionadoSegunda.partido_id)
      }
      if (isRegion && isPartido) {
        return filter(regionCandidatos, c => c.partido_id == this.partidoSeleccionadoSegunda.partido_id)
      }
      return filter(this.todosSegunda, c => c.candidato_id != "")
    }
  }
}
</script>


