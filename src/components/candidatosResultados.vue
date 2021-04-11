<template>
  <div class="candidate-results-vivo row pb-3 active">
    <div class="col-12 ">
      <div class="row candidates-list">
        <div class="col-12 pt-3 pb-3">

          <h2 class="title-resultados align-self-center" v-if="regionSeleccionada.region !='NACIONAL'"><span>{{regionSeleccionada.region}}</span> <span class="p-2 badge badge-light">Conteo al 98%</span></h2>

          <h2 class="title-resultados align-self-center" v-if="regionSeleccionada.region =='NACIONAL'"><span>RESULTADOS NACIONALES</span><span class="p-2 badge badge-light">Conteo al 98%</span></h2>

        </div>
        <div class="col-12">
          <div class="row candidate-info align-self-center mt-2 pb-1">
            <div class="col-2 pr-0 img-candidato">
            </div>
            <div class="col-5 pl-0"></div> 
            <div class="col-2 porcentaje-resultado align-self-center text-center">
              <div><span class="validos badge">% validos</span></div>
            </div>
            <div class="col-3 votos-validos align-self-center text-center">
              <span class="diferencia badge">diferencia</span>
            </div>          
          </div>
          <div class="row candidate-info align-self-center mt-2 pb-1" :key="c.candidato_id" v-for="c in candidatos.slice(0,6)">
            <div class="col-2 pr-0 img-candidato">
              <img width="40px" :src="getImageCandidate(c.candidato_id)" />
            </div>
            <div class="col-5 pl-0">
              <h4 class="candidato-mapa m-0">{{ c.candidato }}</h4>                        
              <h4 class="partido-mapa"><img width="25px" class="partido-icon" :src="getImagePartido(c.partido_id)" />{{ c.partido }}</h4>
            </div> 
            <div class="col-2 porcentaje-resultado align-self-center text-center">
              <div>{{c.porcentaje}}%</div>               
            </div>
            <div class="col-3 votos-validos align-self-center text-center">
              <div class="text-center diferencia">+{{ c.votos }}</div>
            </div>          
          </div>
        </div>
        <b-collapse v-model="open" id="collapse-1" class="col-12">
          <div class="row candidate-info align-self-center mt-2 pb-1" :key="c.candidato_id" v-for="c in candidatos.slice(6, candidatos.length)">
            <div class="col-2 pr-0 img-candidato">
              <img width="40px" :src="getImageCandidate(c.candidato_id)" />
            </div>
            <div class="col-5 pl-0">
              <h4 class="candidato-mapa m-0">{{ c.candidato }}</h4>                        
              <h4 class="partido-mapa"><img width="25px" class="partido-icon" :src="getImagePartido(c.partido_id)" />{{ c.partido }}</h4>
            </div> 
            <div class="col-2 porcentaje-resultado align-self-center text-center">
              <div>
                <h5>{{c.porcentaje}}%</h5>        </div>               
            </div>
            <div class="col-3 votos-validos align-self-center text-center">
              <span>diferencia</span>
              <h5 class="diferencia">+{{ c.votos }}</h5>
            </div>          
          </div>
        </b-collapse>
    
        <div class="col-12 mt-3 button-more pl-0 pr-0">
          <a v-if="open==false" @click="open=!open" class="d-block btn-light text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
            </svg>
          </a>
          <a v-if="open==true" @click="open=!open" class="d-block btn-light text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-up" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
    
    <div class="col-12">

      <elecciones2016 v-if="regionSeleccionada" />

    </div>
  </div>
  
</template>

<script>

  import elecciones2016 from './elecciones2016.vue'
  import { mapState } from 'vuex'
  
  export default {
    name: 'candidatosResultados.vue',
    props: {
      candidatos: Array
    },
    components: {
      elecciones2016
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