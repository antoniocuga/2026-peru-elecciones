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

      <div class="row p-3">

        <div class="col-12 titulo">Elecciones 2016</div>
        <div class="col-12">RESULTADOS NACIONALES</div>
      
        <b-tabs class="col-12">
          <b-tab class="" title="primera vuelta">
            <div class="row">
              <div class="col-6 text-left">
                <div>Electores habiles</div>
                <div>ciudadanos que no votaron</div>
                <div>voto en blanco/nulo</div>
                <div>votos emitidos</div>               
                            
              </div>
              <div class="col-6 text-right">
                <div>22901954</div>               
                <div>895785</div>
                <div>12354</div>
                <div>123654</div>
                <div>7485962</div>
                <div>1259845</div>

              </div>
              <div class="row">
          
                <div class="col-6 text-left">                  
                  <h2>PARTIDOS</h2>
                 
                  <div>Partido Morado</div>
                  <div>Juntos por el Perú</div>
                  <div>fuerza popular</div>
                  <div>renovacion popular</div>
                  

                </div>
              <div class="col-6 text-right">
                <h3>VOTOS A NIVEL NACIONAL</h3>
                <div>12589632</div>
                <div>1025985</div>
                <div>12589544</div>
                <div>2598555</div>
              </div>

        </div>
            </div>
          </b-tab>
          <b-tab title="segunda vuelta">
            <div class="row">
              <div class="col-6 text-left">
                <div>Electores habiles</div>
                <div>ciudadanos que no votaron</div>
                <div>voto en blanco/nulo</div>
                <div>votos emitidos</div>
              
                
                
              </div>
              <div class="col-6 text-right">
                <div>22901954</div>               
                <div>895785</div>
                <div>12354</div>
                <div>123654</div>
                <div>7485962</div>
                <div>1259845</div>                
              </div>

              <div class="row">
          
                <div class="col-6 text-left">                  
                  <h2>PARTIDOS</h2>
                 
                  <div>Partido Morado</div>
                  <div>Juntos por el Perú</div>
                  <div>fuerza popular</div>
                  <div>renovacion popular</div>
                  

                </div>
                  <div class="col-6 text-right">
                    <h3>VOTOS A NIVEL NACIONAL</h3>
                    <div>12589632</div>
                    <div>1025985</div>
                    <div>12589544</div>
                    <div>2598555</div>
                  </div>

              </div>
              
            </div>
          </b-tab>
        </b-tabs>
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