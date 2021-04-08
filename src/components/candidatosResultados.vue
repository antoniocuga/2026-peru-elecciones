<template>
  <div class="candidate-results-vivo row pb-3 active">
    <div class="col-12 candidates-list">
      <div class="row">
        <div class="col-12 align-self-center">
          <h2 class="title-resultados">{{regionSeleccionada.region}} <span>Conteo al 98%</span></h2>
        </div>
        <div class="col-12">
          <div class="row candidate-info align-self-center mt-2  pb-1 border-bottom" :key="c.candidato_id" v-for="c in candidatos.slice(0,6)">
            <div class="col-2 pr-0 img-candidato">
              <img width="40px" :src="getImageCandidate(c.candidato_id)" />
            </div>
            <div class="col-5 pl-0">
              <h4 class="candidato-mapa m-0">{{ c.candidato }}</h4>                        
              <h4 class="partido-mapa"><img width="25px" class="partido-icon" :src="getImagePartido(c.partido_id)" />{{ c.partido }}</h4>
            </div> 
            <div class="col-2 porcentaje-resultado align-self-center text-center">
              <div>          <span>validos</span>
                <h5><b>{{c.porcentaje}}%</b></h5></div>               
            </div>
            <div class="col-3 votos-validos align-self-center text-center">
              <span>diferencia</span>
              <h5 class="diferencia">+{{ c.votos }}</h5>
            </div>          
          </div>
        </div>
        <b-collapse v-model="open" id="collapse-1" class="col-12">
          <div class="row  candidate-info align-self-center mt-2  pb-1 border-bottom" :key="c.candidato_id" v-for="c in candidatos.slice(6, candidatos.length)">
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
    
        <div class="col-12 mt-3 button-more">
          <b-button @click="open=!open" class="btn-dark"> {{ open ? 'Cerrar' : 'Mostrar todos'}}</b-button>
        </div>
      </div>
    </div>

    <div class="col-12 resultado-nacional">
      <div class="row">
        <div class="ml-3"><h2>RESULTADOS NACIONALES</h2></div>
        <div class="col-12 titulo">Elecciones 2016</div>
            <b-tabs>
              <b-tab title="primera vuelta">

              </b-tab>
              <b-tab title="segunda vuelta">

              </b-tab>
            </b-tabs>

      </div>
      <div class="row  border-bottom">
        <div class="col-6">
          <h6>Partido</h6>
          
        </div>
        <div class="col-6">
          <h5>1593578</h5>

        </div>
      </div>
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
    data() {
      return {
        open: false
      }
    },
    computed: {
      ...mapState({        
        regionSeleccionada: state => state.candidatos.regionSeleccionada,
      })
    },
    watch: {
      regionSeleccionada() {
        this.open = false
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