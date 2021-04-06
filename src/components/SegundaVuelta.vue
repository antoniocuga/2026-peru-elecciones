
<template>
  <div class="candidato-wrapper">
    <div class="row">
      <div class="col-12 mt-3 border-bottom">
        <h3>Segunda Vuelta</h3>        
      </div>

      <div class="col-12 pb-1 pt-1" >
        <div class="row">
          <div class="col-12 flex-row border-bottom" :key="eleccion.validos" v-for="eleccion in segunda_vuelta">
            <div class="candidate-info historico align-self-center">
              <div class="">
                <h4>{{eleccion.eleccion}}</h4><span>{{eleccion.puesto}}</span>
              </div>
              <div class="">
                <h4>{{eleccion.candidato}}</h4>
                <h5>{{eleccion.partido}}</h5>
              </div>
            </div>

            <div class="candidate-results flex-row">                
              <div class="candidate-bar">
                <div class="tooltip-c">{{eleccion.total_votos}}</div>                 
              </div>
              <div class="tooltip-c"><span>{{eleccion.validos}} %</span></div>                            
            </div>            
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>

  
  
  export default {
    name: 'SegundaVuelta.vue',
    computed: {
      segunda_vuelta() {
        return require('../data/segunda_vuelta.json')
      }
    }
  }

</script>