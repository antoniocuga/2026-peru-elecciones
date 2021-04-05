<template>
    <div class="col-12 resultados2021">
        <div class="row">
          <div class="col-12 mb-3 pb-3">
            <h3 class="m-0 text-center">Resultados a nivel nacional - <b>conteo ONPE al 61%</b> ultima actualización 00:00</h3>
          </div>
          <div class="col-auto mt-3" :key="c.candidato_id" v-for="(c, ix) in top_candidatos">
            <div>
              <div class="mr-2"><img width="65px" :src="getImageCandidate(c.candidato_id)" /></div>
            </div>
            <div class="d-flex">
              <div class="card-resultado">              
                <div class="candidato-mapa">{{ c.candidato }}</div>
                <div class="partido-mapa"><img width="25px" :src="getImagePartido(c.partido_id)" /> {{ c.partido }}</div>

                <div class="text-center mt-2 mb-2 porcentaje">{{ c.porcentaje }} %</div>
                <div class="diferencia">+ 120,459 diferencia</div>
                <div class="votos-resultado">{{ c.votos }} total de votos</div>
                <div class="puesto" v-if="ix == 0 || ix == 1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                </svg> En segunda vuelta</div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-5 border-top pt-5">
          <div class="col-12 mapa-resultados-wrapper">
              <MapaDepartamentos />
              <candidatosResultados :candidatos="lista_candidatos" />
          </div>
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

        return candidates.slice(0, 6)
      },         
	}
}

</script>


