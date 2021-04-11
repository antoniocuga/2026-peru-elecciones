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
          <div class="row candidate-info align-self-center mt-2 pb-1" :key="c.candidato_id" v-for="c in lista_candidatos.slice(0,6)">
            <div class="col-2 pr-0 img-candidato">
              <img width="40px" :src="getImageCandidate(c.candidato_id)" />
            </div>
            <div class="col-5 pl-0">
              <h4 class="candidato-mapa m-0">{{ c.candidato }}</h4>
              <h4 class="partido-mapa"><img width="25px" class="partido-icon" :src="getImagePartido(c.partido_id)" />{{ c.partido }}</h4>
            </div> 
            <div class="col-2 porcentaje-resultado align-self-center text-center">
              <div>{{c.validos}}%</div>               
            </div>
            <div class="col-3 votos-validos align-self-center text-center">
              <div class="text-center diferencia">+{{ c.votos }}</div>
            </div>          
          </div>
        </div>
        <b-collapse v-model="open" id="collapse-1" class="col-12">
          <div class="row candidate-info align-self-center mt-2 pb-1" :key="c.candidato_id" v-for="c in lista_candidatos.slice(6, candidatos.length)">
            <div class="col-2 pr-0 img-candidato">
              <img width="40px" :src="getImageCandidate(c.candidato_id)" />
            </div>
            <div class="col-5 pl-0">
              <h4 class="candidato-mapa m-0">{{ c.candidato }}</h4>                        
              <h4 class="partido-mapa"><img width="25px" class="partido-icon" :src="getImagePartido(c.partido_id)" />{{ c.partido }}</h4>
            </div> 
            <div class="col-2 porcentaje-resultado align-self-center text-center">
              <div>{{c.validos}}%</div>               
            </div>
            <div class="col-3 votos-validos align-self-center text-center">
              <div class="text-center diferencia">+{{ c.votos }}</div>
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
  import { filter, map, orderBy, groupBy, uniq } from 'lodash'
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
      }),
      lista_candidatos() {
        
        let data_block

        if(this.regionSeleccionada.region == 'NACIONAL')
          data_block = filter(this.candidatos, ['region', 'total'])
        else if(this.regionSeleccionada.region != 'NACIONAL')
          data_block = filter(this.candidatos, ['region', this.regionSeleccionada.region])


        return orderBy(map(groupBy(data_block, 'candidato_id'), (d, id) => {
          return {
            candidato_id: id,
            region: uniq(map(d, 'region')).join(''),
            candidato: uniq(map(d, 'candidato')).join(''),
            partido_id: uniq(map(d, 'partido_id')).join(''),
            partido: uniq(map(d, 'partido')).join(''),
            color: uniq(map(d, 'color')).join(''),
            votos: parseFloat(uniq(map(d, 'total')).join('')),
            validos: parseFloat(uniq(map(d, 'validos')).join('')),
            conteo: parseFloat(uniq(map(d, 'conteo')).join(''))
          }
        }), ['validos'], ['desc'])
      }   
    },
    watch: {
      regionSeleccionada() {
        this.open = false
      }
    },
    methods: {
      getImageCandidate(c) {
        try {
          return require(`../assets/candidatos/${c}.png`)
        } catch (error) {
          return require(`../assets/candidatos/blanco-viciado.png`)
        }
      },
      getImagePartido(c) {
        try {
          return require(`../assets/partidos/${c}.png`) 
        } catch (error) {
          return require(`../assets/partidos/blanco-viciado.png`)
        }
      }
    }
  }

</script>