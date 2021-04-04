<template>
  <div class="candidate-results-vivo row pb-5">
    <div class="col-12">
        <h2 class="title-resultados">{{regionSeleccionada.region}} <span>Conteo al 98%</span></h2>
    </div>
    <div class="col-12">
      <div class="row  candidate-info align-self-center mt-2  pb-1 border-bottom" :key="c.candidato_id" v-for="c in candidatos.slice(0,8)">
        <div class="col-2 pr-0 img-candidato">
          <img width="40px" :src="getImageCandidate(c.candidato_id)" />
        </div>
        <div class="col-5 pl-0">
          <h4 class="candidato-mapa m-0">{{ c.candidato }}</h4>                        
          <h4 class="partido-mapa"><img width="25px" class="partido-icon" :src="getImagePartido(c.partido_id)" />{{ c.partido }}</h4>
        </div> 
        <div class="col-2 porcentaje-resultado align-self-center text-center">
          <div>          <span>validos</span>
            <h5>{{c.porcentaje}}%</h5>        </div>               
        </div>
        <div class="col-3 votos-validos align-self-center text-center">
          <span>diferencia</span>
          <h5 class="diferencia">+{{ c.votos }}</h5>
        </div>          
      </div>
    </div>

    <b-collapse id="collapse-1" class="col-12 mt-2">
      <div class="row  candidate-info align-self-center mt-2  pb-1 border-bottom" :key="c.candidato_id" v-for="c in candidatos.slice(8, candidatos.length)">
        <div class="col-2 pr-0 img-candidato">
          <img width="40px" :src="getImageCandidate(c.candidato_id)" />
        </div>
        <div class="col-5 pl-0">
          <h4 class="candidato-mapa m-0">{{ c.candidato }}</h4>                        
          <h4 class="partido-mapa"><img width="25px" class="partido-icon" :src="getImagePartido(c.partido_id)" />{{ c.partido }}</h4>
        </div> 
        <div class="col-2 porcentaje-resultado align-self-center text-center">
          <div>          <span>validos</span>
            <h5>{{c.porcentaje}}%</h5>        </div>               
        </div>
        <div class="col-3 votos-validos align-self-center text-center">
          <span>diferencia</span>
          <h5 class="diferencia">+{{ c.votos }}</h5>
        </div>          
      </div>
    </b-collapse>

    <div class="col-12 mb-5">
      <b-button v-b-toggle.collapse-1 class="btn-dark">Mostrar todos</b-button>
    </div>
  </div>
</template>

<script>

  
  
  import { mapState } from 'vuex'
  
  export default {
    name: 'candidatosResultados.vue',
    props: {
      candidatos: Array
    },
    computed: {
      ...mapState({        
        regionSeleccionada: state => state.candidatos.regionSeleccionada,
      })
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