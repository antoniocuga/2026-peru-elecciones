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
          <b-button @click="open=!open" class="btn-warning"> {{ open ? 'Cerrar' : 'Mostrar todos'}}</b-button>
        </div>
      </div>
    </div>
    
    <div class="col-12">

      <div class="row resultado-nacional">

        <div class="col-6 titulo text-left">Elecciones 2016 (primera vuelta)</div>
        <div class="col-6 text-right">
          <b-button @click="openResultados=!openResultados" class="btn"> {{ openResultados ? 'Cerrar' : 'Ver resultados'}}</b-button>
        </div>
        <b-collapse v-model="openResultados" id="resultados2016" class="col-12">
          <b-tabs>
            <b-tab class="" title="Datos de la votacion">
              <div class="row">
                <div class="col-6 text-left">
                  <div>Electores habiles</div>        
                </div>
                <div class="col-6 text-right">
                  <div>22901954</div>
                </div>
              </div>
              <div class="row"><div class="col-6">ciudadanos que no votaron</div><div class="col-6">895785</div></div>
              <div class="row"><div class="col-6">voto en blanco/nulo</div><div class="col-6">votos emitidos</div></div>
  
            </b-tab>
            <b-tab title="Por partidos">
              <div class="row"><div class="col-6">Partido Morado</div><div class="col-6">12354</div></div>
              <div class="row"><div class="col-6">Juntos por el Perú</div><div class="col-6">12354</div></div>
              <div class="row"><div class="col-6">fuerza popular</div><div class="col-6">123654</div></div>
              <div class="row"><div class="col-6">renovacion popular</div><div class="col-6">12354</div></div>
            </b-tab>
          </b-tabs>
        </b-collapse>
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
        open: false,
        openResultados: false
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