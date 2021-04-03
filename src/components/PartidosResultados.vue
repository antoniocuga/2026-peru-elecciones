<template>
  <div class="candidato-wrapper">
    <div class="candidate-results-vivo row">
            <div class="row mb-3">
                  <div class="col-6"><h6>Partido</h6></div>
                  <div class="col-6"><h6>Congresistas</h6></div>
                  
            </div>
      <div class="col-12  border-bottom" :key="c.candidato_id" v-for="c in candidatos">
        <div class="candidate-info align-self-center">
            <div class="img-candidato">
              <img width="65px" :src="getImagePartido(c.partido_id)" />
              
            </div>
            <div class="img-partidos">              
              <h4 class="">{{c.partido}}</h4>               
            </div> 
            <div class="candidate-percent align-self-center">
              <div>
                <h5 class="percent">{{ c.votos }}</h5>                
              </div>            
            </div>
        </div>  
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'PartidosResultados.vue',
    props: {
      candidatos: Array
    },
    methods: {
      getImageCandidate(c) {
        return require(`../assets/candidatos/${c}.png`)
      },
      getImagePartido(c) {
        return require(`../assets/partidos/${c}.png`)
      }
    }
  }

</script>