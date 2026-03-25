<template>
  <div class="candidate-results-vivo row pb-3 active">
    <div class="col-12">      

      <BTabs>
        <BTab :title="`Resulados nacionales`">
          <template #title>
             <span class="title-resultados align-self-center" v-if="regionSeleccionada.region !='NACIONAL'"><span>{{regionSeleccionada.region}}</span></span>

              <span class="title-resultados align-self-center" v-if="regionSeleccionada.region =='NACIONAL'"><span>RESULTADOS NACIONALES</span></span>
              <span class="distrito-resultados align-self-center" v-if="distritoSeleccionado.distrito !='Seleccionar distrito'"><span>{{ distritoSeleccionado.distrito }}</span></span>
          </template>
          
          <div class=" bg-white " v-if="displayCandidatos.length" :key="regionSeleccionada.region">
          <div class="row" v-if="displayCandidatos.length" :key="regionSeleccionada.region">

            <div class="col-12">
              
              <div class="card card-candidate align-self-center">
                <div class="border-bottom mt-2 p-2" :key="c.candidato_id" v-for="c in displayCandidatos.slice(0,6)">
                  <div class="row ">
                    <div class="col-4 col-md-3 col-lg-3 text-center">
                        <img class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                        :style="`border-color: ${c.color} !important`" :src="getImageCandidate(c.candidato_id)" />
                    </div>
                    <div class="col-5 col-md-4 col-lg-5 p-0 align-self-center">
                      <h4 class="candidato-mapa mt-1">{{ c.candidato }}</h4>
                      <h4 class="partido-mapa mt-1"><img width="25px" class="partido-icon pr-2" :src="getImagePartido(c.partido_id)" />{{ c.partido }}</h4>
                    </div> 
                    
                    <div class="col-3 col-md-4 col-lg-4 align-self-center text-right">
                      <div>
                      
                      <span class="d-block text-right small badge font-weight-light text-secondary" v-if="distritoSeleccionado.distrito =='Seleccionar distrito'">
                          Validos
                        </span>
                      <span class="text-right" :style="`font-size:1rem; font-weight: 600;`">{{c.validos.toFixed(2)}}%</span>

                      <span class="align-self-end text-right">
                        <span style="font-size: 1rem;" class="d-block text-right text-secondary" v-if="distritoSeleccionado.distrito =='Seleccionar distrito'">
                          {{ numeral(c.votos).format('0,0') }}
                        </span>
                        <span class="d-block text-right small badge font-weight-light text-secondary" v-if="distritoSeleccionado.distrito =='Seleccionar distrito'">
                          Votos estimados
                        </span>
                        <span class="d-block text-right diferencia" v-if="distritoSeleccionado.distrito !='Seleccionar distrito'">{{ numeral(c.total_votos).format('0,0') }} votos</span>
                      </span>   
                      
                      </div>
                    </div> 
                  </div> 
                </div>
              </div>
              </div>
            </div>
            
            <BCollapse v-model="open" id="collapse-1" class="col-12">

            <div class="card card-candidate align-self-center mt-2 p-2" :key="c.candidato_id" v-for="c in displayCandidatos.slice(6, displayCandidatos.length)">
                <div class="row">
                  <div class="col-4 col-md-4 col-lg-3 pr-0 pl-0 text-center">
                      <img class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                      :style="`border-color: ${c.color} !important`" :src="getImageCandidate(c.candidato_id)" />
                  </div>
                  <div class="col-5 col-md-6 col-lg-5 p-0 align-self-center">
                    <h4 class="candidato-mapa mt-1">{{ c.candidato }}</h4>
                    <h4 class="partido-mapa mt-1"><img width="25px" class="partido-icon pr-2" :src="getImagePartido(c.partido_id)" />{{ c.partido }}</h4>
                  </div> 
                  
                  <div class="col-3 col-md-2 col-lg-3 p-0  align-self-center text-center">
                    <div>
                    <span :style="`font-size: 1rem; font-weight: 600;`">{{c.validos.toFixed(2)}}%</span>

                    <span class=" align-self-center text-center">
                      <span class="text-center diferencia" v-if="distritoSeleccionado.distrito =='Seleccionar distrito'">
                        Votos: {{ numeral(c.votos).format('0,0') }}
                      </span>
                      <span class="text-center diferencia" v-if="distritoSeleccionado.distrito !='Seleccionar distrito'">{{ numeral(c.total_votos).format('0,0') }} votos</span>
                    </span>   
                    
                    </div>
                  </div> 
                </div> 
              </div>
              
              
            </BCollapse>
        
            <div class="col-12 mt-3 button-more pl-0 pr-0">
              <a v-if="open==false" @click="open=!open" class="d-block btn btn-light text-center">Ver todos los resultados
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-down" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
                </svg>
              </a>
              <a v-if="open==true" @click="open=!open" class="d-block btn btn-light text-center">Cerrar
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-up" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"/>
                </svg>
              </a>
            </div>
          </div>

        </BTab>
        <BTab disabled :title="`Conteo al ${conteo} %`">
        </BTab>
      </BTabs>

    </div>  
    
  </div>
  
</template>

<script>
  import numeral from 'numeral'
  import { find, filter, map, orderBy, groupBy, uniq, sumBy, maxBy } from 'lodash'  
  import { storeToRefs } from 'pinia'
  import { useCandidatosStore } from '../stores/candidatos'
  import { getPartidoImage, getCandidatoImage } from '../utils/assets'
  import { getMapaData, getPerugeo } from '../utils/mapas'

  export default {
    name: 'candidatosResultados',
    props: {
      candidatos: Array
    },    
    setup() {
      const store = useCandidatosStore()
      const refs = storeToRefs(store)
      return {
        ...refs,
        store,
        todosCandidatos: refs.todos,
        todosDistritos: refs.distritos,
      }
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
      perugeo() {
        return getPerugeo()
      },
      departamentos_list() {
        if (!this.perugeo || !this.perugeo.features) return []
        let filtered = filter(this.todosCandidatos, c => c.candidato_id != '' && c.region != 'total' && c.region != 'extranjero')
        return orderBy(map(groupBy(filtered, 'region'), (item, region) => {
          let dep = find(this.perugeo.features, d => d.properties.dep_id == region)
          let _r = region.replace(" ","-")
          return {
            region: region,
            departamento: region != 'extranjero' && dep ? dep.properties.NOMBDEP : 'EXTRANJERO',
            total_departamento: parseFloat(sumBy(map(item, 'total'))),
            candidatos: orderBy(item, ['validos'], ['desc']),
            geodata: getMapaData(_r),
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
        return parseFloat(uniq(map(this.displayCandidatos, 'conteo')).join("")) || 0
      },
      // Prefer parent's candidatos prop when showing a region so results update after map click
      displayCandidatos() {
        const isRegionView = this.regionSeleccionada.region != 'NACIONAL' && this.distritoSeleccionado.distrito == 'Seleccionar distrito'
        if (isRegionView && this.candidatos && this.candidatos.length) {
          return this.normalizeCandidatosList(this.candidatos)
        }
        return this.lista_candidatos
      },
      lista_candidatos() {
        let data_block = []

        if(this.regionSeleccionada.region == 'NACIONAL' && this.distritoSeleccionado.distrito == 'Seleccionar distrito') {
          data_block = filter(this.todosCandidatos, ['region', 'total'])
        }
        else if(this.regionSeleccionada.region != 'NACIONAL' && this.distritoSeleccionado.distrito == 'Seleccionar distrito') {
          data_block = filter(this.todosCandidatos, ['region', this.regionSeleccionada.region])
        }
        else if(this.regionSeleccionada.region != 'NACIONAL' && this.distritoSeleccionado.distrito != 'Seleccionar distrito') {
          data_block = filter(this.todosDistritos, d => d.region == this.regionSeleccionada.region && d.ubigeo_inei == this.distritoSeleccionado.ubigeo)
        }

        if (!data_block || data_block.length === 0) return []

        return orderBy(map(groupBy(data_block, 'candidato_id'), (d, id) => {
          return {
            candidato_id: id,
            region: uniq(map(d, 'region')).join(''),
            candidato: uniq(map(d, 'candidato')).join(''),
            partido_id: uniq(map(d, 'partido_id')).join(''),
            partido: uniq(map(d, 'partido')).join(''),
            color: uniq(map(d, 'color')).join(''),
            votos: parseFloat(uniq(map(d, 'total')).join('')) || 0,
            total_votos: parseFloat(uniq(map(d, 'total_votos')).join('')) || parseFloat(uniq(map(d, 'total')).join('')) || 0,
            validos: parseFloat(uniq(map(d, 'validos')).join('')) || 0,
            conteo: parseFloat(uniq(map(d, 'conteo')).join('')) || 0,
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
      numeral,
      normalizeCandidatosList(items) {
        if (!items || !items.length) return []
        return orderBy(map(groupBy(items, 'candidato_id'), (d, id) => {
          return {
            candidato_id: id,
            region: uniq(map(d, 'region')).join(''),
            candidato: uniq(map(d, 'candidato')).join(''),
            partido_id: uniq(map(d, 'partido_id')).join(''),
            partido: uniq(map(d, 'partido')).join(''),
            color: uniq(map(d, 'color')).join(''),
            votos: parseFloat(uniq(map(d, 'total')).join('')) || 0,
            total_votos: parseFloat(uniq(map(d, 'total_votos')).join('')) || parseFloat(uniq(map(d, 'total')).join('')) || 0,
            validos: parseFloat(uniq(map(d, 'validos')).join('')) || 0,
            conteo: parseFloat(uniq(map(d, 'conteo')).join('')) || 0,
            hora: uniq(map(d, 'hora')).join('')
          }
        }), ['validos'], ['desc'])
      },
      resetMapa() {
        this.store.updateRegionSeleccionada({region:'NACIONAL', departamento:'VER REGIÓN'})
        this.distritoSeleccionado = {
          distrito: "Seleccionar distrito"
        }
      },
      show_departamento(departamento) {
        let dep = find(this.departamentos_list, d => d.region == departamento.region)
        this.store.updateRegionSeleccionada(dep)
        this.distritoSeleccionado = {
          distrito: "Seleccionar distrito"
        }
      },
      selectDistrito(d) {
        this.distritoSeleccionado = d
      },
      getImageCandidate(c) {
        return getCandidatoImage(c)
      },
      getImagePartido(c) {
        return getPartidoImage(c)
      }
    }
  }
</script>