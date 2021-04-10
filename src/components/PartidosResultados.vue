<template>
  
    <div class="row pb-3">
      <div class="col-12">
        <h2 class="title-resultados"><span>Conteo al 91%</span></h2>
      </div>

      <div class="col-6" :key="c.candidato_id" v-for="c in candidatos">
        <div class="row candidate-info align-self-center mt-2 pb-1">
          <div class="col-auto img-candidato">
            <img width="65px" :src="getImagePartido(c.partido_id)" />              
          </div>
          <div class="col-6 pl-0">              
            <h4 class="candidato-mapa m-0">{{c.partido}}</h4>               
          </div> 
          <div class="col-auto votos-validos align-self-center text-center">              
              <span>congresistas</span><h5 class="diferencia">{{ c.seats }}</h5>                              
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
    data() {
      return {
        open: false
      }
    },
    methods: {
      getImageCandidate(c) {
        return require(`../assets/candidatos/${c}.png`)
      },
      getImagePartido(c) {
        try {
          return require(`../assets/partidos/${c}.png`) 
        } catch (error) {
          return require(`../assets/partidos/blanco-viciado.png`)
        }
      },
    }
  }

</script>