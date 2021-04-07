
<template>
  <div class="candidato-wrapper">
    <div class="row">
      <div class="col-12 mt-3 border-bottom">
        <h3>Comgresistas mas votados en las últimas elecciones.</h3>        
      </div>
    </div>

    <div class="row">
      <div class="col-12" :key="eleccion" v-for="(items, eleccion) in candidatos_congreso">
        
        <div class="row">
          <div class="col-12">
            <h3>{{ eleccion }}</h3>
          </div>
          <div class="col-6 flex-row" :key="candidato.candidato_id" v-for="candidato in items">

            <div class="candidate-info historico align-self-center">
              <div class="">
                <h4>{{candidato.candidato}}</h4>
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

  import { groupBy } from 'lodash'
  
  export default {
    name: 'TopCongreso.vue',
    computed: {
      votos_congreso() {
        return require('../data/top_congresistas.json')
      },
      candidatos_congreso() {
        return groupBy(this.votos_congreso, 'eleccion')
      }
    }
  }

</script>