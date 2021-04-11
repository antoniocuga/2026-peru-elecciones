<template>
  <div class="col-12 col-sm-12 resultados2021">
      <div class="top-candidates pb-3 pt-3">
        <topWidget />
      </div>
      <div class="row pt-3">
        <div class="col-12 col-sm-12 mapa-resultados-wrapper">
          <MapaDepartamentos :lista_candidatos="filteredData" />
          <candidatosResultados :candidatos="filteredData" />  
        </div>
      </div>
  </div>    
</template>

<script>

import { mapState } from 'vuex'
import topWidget from '../components/topWidget.vue'
import candidatosResultados from '../components/candidatosResultados.vue'
import MapaDepartamentos from '../components/MapaDepartamentos.vue'
import { filter } from 'lodash'

export default {
  name: 'MapaEleciones',
  props: {
    encuestas: Array
  },
  components: {
    MapaDepartamentos,
    candidatosResultados,
    topWidget
  },
  created () {
    this.$store.dispatch('candidatos/getAllCandidatos')
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
      candidatos: state => state.candidatos.todos,
      regionSeleccionada: state => state.candidatos.regionSeleccionada,
      partidoSeleccionado: state => state.candidatos.partidoSeleccionado,
    }),
    data() {
      return require('../data/departamentos.json')
    },
    filteredData() {

      if(this.regionSeleccionada.region != 'NACIONAL' && this.partidoSeleccionado.partido_id == 'TODOS') {

        return this.regionSeleccionada.candidatos
      }

      if(this.regionSeleccionada.region == 'NACIONAL' && this.partidoSeleccionado.partido_id != 'TODOS') {

        return filter(this.candidatos, c => c.partido_id == this.partidoSeleccionado.partido_id)
      }

      return filter(this.candidatos, c => c.candidato_id != "")
    }     
  }
}

</script>


