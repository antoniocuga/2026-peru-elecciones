<template>
    <div class="container">
        <div class="row">
          <div class="col-12">
            Nacional
          </div>
          <div class="col-3" :key="c.candidato_id" v-for="c in top_candidatos">
            <div class="porcentaje-resultado"><b>{{ c.porcentaje }} %</b></div>
            <div>
              <img width="45px" :src="getImageCandidate(c.candidato_id)" /> <span class="mr-1 candidato-mapa">{{ c.candidato }}</span></div>
          </div>
        </div>
        <div class="row mt-5 border-top pt-5">
          <div class="col-12 mapa-resultados-wrapper">
            <div>
              <MapaDepartamentos />
              <candidatosResultados :candidatos="lista_candidatos" />
            </div>
          </div>
          <!-- Show data in mobile -->
          <div class="tooltip tooltip-data mobile-results"></div>
        </div>
    </div>    
</template>

<script>

import { mapState } from 'vuex'
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
      candidatosResultados
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
      }),
      data() {
        return require('../data/departamentos.json')
      },
      lista_candidatos() {
        let filtered = filter(this.candidatos, c => c.candidato_id != "")

        if(this.regionSeleccionada.region != 'NACIONAL') {          
          filtered = this.regionSeleccionada.candidatos
        }

        return orderBy(map(groupBy(filtered, 'candidato_id'), (d, id) => {
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
        let filtered = filter(this.candidatos, c => c.candidato_id != "")

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

        return candidates.slice(0, 4)
      },         
	}
}

</script>


