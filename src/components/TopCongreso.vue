
<template>
  <div class="candidato-wrapper">
    <div class="row">
      <div class="col-12" :key="eleccion.eleccion" v-for="(eleccion) in candidatos_congreso">
        
        <div class="row">
          <div class="col-12">
            <h3>{{ eleccion.eleccion }}</h3>
          </div>
          <div class="col-6 flex-row" :key="candidato.candidato_id" v-for="candidato in eleccion.items">

            <div class="candidate-info historico align-self-center">
              <div class="">
                <h4><img width="40px" :src="getImageCandidate(candidato.candidato_id)" /> {{candidato.candidato}}</h4>
                <h5>{{candidato.partido}}</h5>
              </div>
            </div>

            <div class="candidate-results flex-row">                
              <div class="candidate-bar">
                <div class="tooltip-c">{{candidato.total_votos}}</div>                 
              </div>
              <div class="tooltip-c"><span>{{candidato.validos}}</span></div>                            
            </div>            
          </div>

          </div>
        </div>


    </div>


  </div>
</template>

<script>

  import { groupBy, map, orderBy } from 'lodash'
  
  export default {
    name: 'TopCongreso.vue',
    methods: {
      getImageCandidate(c) {
        try {
          return require(`../assets/candidatos/${c}.png`) 
        } catch (error) {
          return require(`../assets/candidatos/blanco-viciado.png`)
        }
      },
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