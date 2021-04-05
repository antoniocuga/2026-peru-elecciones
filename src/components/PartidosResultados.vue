<template>
  
    <div class="row candidate-results-vivo pb-3">
      <div class="col-12"><h2 class="title-resultados"><span>Conteo al 91%</span></h2>
      </div>            
      <div class="col-12  ">
        <div class="row candidate-info align-self-center mt-2 pb-1 border-bottom" :key="c.candidato_id" v-for="c in candidatos.slice(0,8)">
            <div class="col-3 pr-0 img-candidato">
              <img width="65px" :src="getImagePartido(c.partido_id)" />              
            </div>
            <div class="col-5 pl-0">              
              <h4 class="candidato-mapa m-0">{{c.partido}}</h4>               
            </div> 
            <div class="col-4 votos-validos align-self-center text-center">              
                <span>congresistas</span><h5 class="diferencia">{{ c.votos }}</h5>                              
            </div>
        </div>  
      </div>
      <div class="col-12">
        <b-button @click="open=!open" class="btn-dark">Mostrar todos</b-button>
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
        return require(`../assets/partidos/${c}.png`)
      }
    }
  }

</script>