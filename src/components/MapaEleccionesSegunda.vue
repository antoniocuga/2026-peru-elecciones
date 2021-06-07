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

import { mapState } from 'vuex'
import topWidget from '../components/topWidget.vue'
import candidatosResultadosSegunda from '../components/candidatosResultadosSegunda.vue'
import MapaDepartamentosSegunda from '../components/MapaDepartamentosSegunda.vue'
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
  created () {
    this.$store.dispatch('candidatos/getAllCandidatosSegunda')
  },
  methods: {
    getImageCandidate(c) {
      try {
        return require(`../assets/candidatos/${c}.png`)
      } catch (error) {
        return require(`../assets/candidatos/blanco-viciado.png`)
      }
    },
    getImagePartido(c) {
      try {
        return require(`../assets/partidos/${c}.png`) 
      } catch (error) {
        return require(`../assets/partidos/blanco-viciado.png`)
      }
    }
  },
  computed: {
    ...mapState({
      candidatos: state => state.candidatos.todosSegunda,
      regionSeleccionadaSegunda: state => state.candidatos.regionSeleccionadaSegunda,
      partidoSeleccionado: state => state.candidatos.partidoSeleccionado,
    }),
    data() {
      return require('../data/departamentos.json')
    },
    filteredData() {

      if(this.regionSeleccionadaSegunda.region != 'NACIONAL' && this.partidoSeleccionado.partido_id == 'TODOS') {

        return this.regionSeleccionadaSegunda.candidatos
      }

      if(this.regionSeleccionadaSegunda.region == 'NACIONAL' && this.partidoSeleccionado.partido_id != 'TODOS') {

        return filter(this.candidatos, c => c.partido_id == this.partidoSeleccionado.partido_id)
      }

      return filter(this.candidatos, c => c.candidato_id != "")
    }     
  }
}

</script>


