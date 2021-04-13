<template>
  <div class="candidate-results-vivo row pb-3 active">
    <div class="col-12">
      <div class="row filter-region d-block d-md-none">
        <div class="col-12">
          <button @click="resetMapa()"  class="btn btn-light" v-if="regionSeleccionada.region !='NACIONAL'"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
          </svg></button>
          <b-dropdown :text="regionSeleccionada.departamento" variant="warning" class="d-inline-block m-2 departamento-menu">
            <b-dropdown-item @click="show_departamento(dep)" :key="dep.region" v-for="dep in departamentos">
              <a >{{ dep.departamento }}</a>
            </b-dropdown-item>
          </b-dropdown>
          <b-dropdown :text="distritoSeleccionado.distrito" variant="warning" class="d-inline-block m-2 departamento-menu" v-if="regionSeleccionada.region !='NACIONAL'">
            <b-dropdown-item @click="selectDistrito(dep)" :key="dep.ubigeo" v-for="dep in distritos">
              <a>{{ dep.distrito }}</a>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>

      <div class="row candidates-list" v-if="conteo">
        <div class="col-12 pt-3 pb-3">
          <h2 class="title-resultados align-self-center" v-if="regionSeleccionada.region !='NACIONAL'"><span>{{regionSeleccionada.region}}</span> <span class="p-2 badge badge-light">Conteo al {{conteo.toFixed(1)}}%</span></h2>
          <h2 class="title-resultados align-self-center" v-if="regionSeleccionada.region =='NACIONAL'"><span>RESULTADOS NACIONALES</span><span class="p-2 badge badge-light">Conteo al {{conteo.toFixed(1)}}%</span></h2>
          <h2 class="distrito-resultados align-self-center" v-if="distritoSeleccionado.distrito !='Seleccionar distrito'"><span>{{ distritoSeleccionado.distrito }}</span></h2>
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
              <span class="diferencia badge">Votos</span>
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
              <div>{{c.validos.toFixed(1)}}%</div>               
            </div>
            <div class="col-3 votos-validos align-self-center text-center">
              <div class="text-center diferencia" v-if="distritoSeleccionado.distrito =='Seleccionar distrito'">{{ numeral(c.votos).format('0,0') }}</div>
              <div class="text-center diferencia" v-if="distritoSeleccionado.distrito !='Seleccionar distrito'">{{ numeral(c.total_votos).format('0,0') }}</div>
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
              <div>{{c.validos.toFixed(1)}}%</div>               
            </div>
            <div class="col-3 votos-validos align-self-center text-center">
              <div class="text-center diferencia" v-if="distritoSeleccionado.distrito =='Seleccionar distrito'">{{ numeral(c.votos).format('0,0') }}</div>
              <div class="text-center diferencia" v-if="distritoSeleccionado.distrito !='Seleccionar distrito'">{{ numeral(c.total_votos).format('0,0') }}</div>
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
    
    <div class="col-12 mt-5">

      <elecciones2016 v-if="regionSeleccionada" />

    </div>
  </div>
  
</template>

<script>
  import numeral from 'numeral'
  import { find, filter, map, orderBy, groupBy, uniq, sumBy, maxBy } from 'lodash'
  import elecciones2016 from './elecciones2016.vue'
  import { mapState, mapActions } from 'vuex'
  
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
        open: false,
        distritoSeleccionado: {
          distrito: "Seleccionar distrito"
        }
      }
    },
    computed: {
      ...mapState({        
        regionSeleccionada: state => state.candidatos.regionSeleccionada,
        todosCandidatos: state => state.candidatos.todos,
        todosDistritos: state => state.candidatos.distritos
      }),
      perugeo() {
        return require(`../data/mapas/perugeo.json`)
      },
      departamentos_list() {
        let filtered = filter(this.todosCandidatos, c => c.candidato_id != '' && c.region != 'total' && c.region != 'extranjero')
        return orderBy(map(groupBy(filtered, 'region'), (item, region) => {
          let dep = find(this.perugeo.features, d => d.properties.dep_id == region)
          let _r = region.replace(" ","-")
          return {
            region: region,
            departamento: region != 'extranjero' ? dep.properties.NOMBDEP : 'EXTRANJERO',
            total_departamento: parseFloat(sumBy(map(item, 'total'))),
            candidatos: orderBy(item, ['validos'], ['desc']),
            geodata: require(`../data/mapas/${_r}.json`),
            winner: maxBy(item, 'validos')
          }
        }), ['departamento'])
      },
      departamentos() {
        let filtered = filter(this.todosCandidatos, c => c.candidato_id != '' && c.region != 'total')
        return orderBy(map(groupBy(filtered, 'region'), (item, region) => {
          let _r = region.replace(" ","-").replace(" ","-")
          return {
            region: _r,
            departamento: region.toUpperCase()
          }
        }), ['departamento'])
      },
      distritos() {
        return orderBy(map(groupBy(this.todosDistritos, 'ubigeo_inei'), (item, ubigeo) => {
          return {
            ubigeo: ubigeo,
            distrito: uniq(map(item, 'distrito')).join("") + ' (' + uniq(map(item, 'provincia')).join("") +')'
          }
        }), ['distrito'])
      },
      conteo() {
        return parseFloat(uniq(map(this.lista_candidatos, 'conteo')).join(""))
      },
      lista_candidatos() {
        
        let data_block

        if(this.regionSeleccionada.region == 'NACIONAL' && this.distritoSeleccionado.distrito == 'Seleccionar distrito') {
          data_block = filter(this.todosCandidatos, ['region', 'total'])
        }
        else if(this.regionSeleccionada.region != 'NACIONAL' && this.distritoSeleccionado.distrito == 'Seleccionar distrito') {
          data_block = filter(this.todosCandidatos, ['region', this.regionSeleccionada.region])
        }
        else if(this.regionSeleccionada.region != 'NACIONAL' && this.distritoSeleccionado.distrito != 'Seleccionar distrito') {

          data_block = filter(this.todosDistritos, d => {
            if(d.region == this.regionSeleccionada.region && d.ubigeo_inei == this.distritoSeleccionado.ubigeo) {
              return d
            }
          })
        }

        return orderBy(map(groupBy(data_block, 'candidato_id'), (d, id) => {
          return {
            candidato_id: id,
            region: uniq(map(d, 'region')).join(''),
            candidato: uniq(map(d, 'candidato')).join(''),
            partido_id: uniq(map(d, 'partido_id')).join(''),
            partido: uniq(map(d, 'partido')).join(''),
            color: uniq(map(d, 'color')).join(''),
            votos: parseFloat(uniq(map(d, 'total')).join('')),
            total_votos: parseFloat(uniq(map(d, 'total_votos')).join('')),
            validos: parseFloat(uniq(map(d, 'validos')).join('')),
            conteo: parseFloat(uniq(map(d, 'conteo')).join('')),
            hora: uniq(map(d, 'hora')).join('')
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
      ...mapActions('candidatos', [
        'updateRegionSeleccionada'
      ]),
      numeral,
      resetMapa() {
        this.updateRegionSeleccionada({region:'NACIONAL', departamento:'VER REGIÓN'})
        this.distritoSeleccionado = {
          distrito: "Seleccionar distrito"
        }
      },
      show_departamento(departamento) {
        let dep = find(this.departamentos_list, d => d.region == departamento.region)
        this.updateRegionSeleccionada(dep)
        this.distritoSeleccionado = {
          distrito: "Seleccionar distrito"
        }
      },
      selectDistrito(d) {
        this.distritoSeleccionado = d
      },
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