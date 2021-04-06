<template>  
    <div class="row">
        <div class="col-4">
          <ul> 
            <h5>Candidato</h5>
            <li :key="eleccion.validos" v-for="eleccion in segunda_vuelta">
              {{eleccion.candidato}} 
            </li>
            
          </ul>
        </div>
        <div class="col-4">
          <ul>
            <h5>Partido</h5>
            <li :key="eleccion.validos" v-for="eleccion in segunda_vuelta">
                {{eleccion.partido}} 
            </li>
          </ul>
        </div>
        <div class="col-4">          
          <ul>
            <h5>Votos validos</h5>
            <li :key="eleccion.validos" v-for="eleccion in segunda_vuelta">
              {{eleccion.total_votos}} 
            </li>
          </ul> 
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