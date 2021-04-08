
<template>
  <div class="candidato-wrapper">
    <div class="row">
      <div class="col-12 col-md-6 mb-5" :key="eleccion.eleccion" v-for="(eleccion) in candidatos_congreso">
        
        <div class="row">
          <div class="col-12">
            <h3 class="border-bottom pb-2">{{ eleccion.eleccion }}</h3>
          </div>
        </div>

        <div class="row" :key="candidato.candidato_id" v-for="candidato in eleccion.items">
          <div class="col-6">
            <div class="candidate-info historico align-self-center">
              <div class="">
                <img height="40px" width="40px" :src="getImageCandidate(candidato.candidato_id)" />
              </div>
              <div>
                <h4>{{candidato.candidato}}</h4>
                <h5><img width="25px" :src="getImagePartido(candidato.partido_id)" /> {{candidato.partido}}</h5>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="candidate-results">                
              <div class="candidate-bar">
                <div class="tooltip-c">{{ numeral(candidato.total_votos).format('0,0') }} </div>
                <div class="percent" :style="`background-color:${candidato.color}cc; width: ${calcScale(candidato, eleccion.items)}px;`"></div>
              </div>                          
            </div>            
          </div>
        </div>
      </div>


    </div>


  </div>
</template>

<script>

  import numeral from 'numeral'
  import * as d3 from 'd3'
  import { groupBy, map, orderBy, maxBy } from 'lodash'
  
  export default {
    name: 'TopCongreso.vue',
    methods: {
      numeral,
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
      },
      calcScale(candidato, items) {
        
        let w = 150
        let _m = maxBy(items, 'total_votos')
        let myScale = d3.scaleLinear()
          .domain([0, _m.total_votos])
          .range([0, w])

        return myScale(parseFloat(candidato.total_votos))
      }
    },
    computed: {
      votos_congreso() {
        return require('../data/top_congresistas.json')
      },
      candidatos_congreso() {
        return orderBy(map(groupBy(this.votos_congreso, 'eleccion'), (items, eleccion) => {
          return {
            eleccion: eleccion,
            items: items
          }
        }), ['eleccion'], ['desc'])
      }
    }
  }

</script>