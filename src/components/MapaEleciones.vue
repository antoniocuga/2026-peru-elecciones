<template>
  <div class="col-12 col-sm-12 resultados2021">
      <div class="top-candidates pb-3 pt-3">
        <topWidget />
      </div>
      <div class="row pt-3">
        <div class="col-12 col-sm-12 mapa-resultados-wrapper">
          <MapaDepartamentos :lista_candidatos="filteredData" />
          <candidatosResultados :candidatos="lista_candidatos" />  
        </div>
      </div>
  </div>    
</template>

<script>

import { mapState } from 'vuex'
import topWidget from '../components/topWidget.vue'
import candidatosResultados from '../components/candidatosResultados.vue'
import MapaDepartamentos from '../components/MapaDepartamentos.vue'
import { filter, map, orderBy, groupBy, sumBy, uniq } from 'lodash'

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
      return require(`../assets/candidatos/${c}.png`)
    },
    getImagePartido(c) {
      return require(`../assets/partidos/${c}.png`)
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
    }        
  }
}

</script>


