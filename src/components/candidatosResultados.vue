<template>
  <div class="candidate-results-vivo  pb-3 active">
    <div>
      <!-- Mobile: región y distrito bajo el mapa (MapaEleciones coloca el mapa arriba en < md) -->
      <div class="row filter-region-primera d-block d-md-none mb-3">
        <div class="col-12 d-flex flex-wrap align-items-center">
          <button
            v-if="regionSeleccionada.region != 'NACIONAL'"
            type="button"
            class="btn btn-light btn-sm mr-2 mb-2"
            @click="resetMapa()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg>
          </button>
          <DropdownBs4
            :text="capitalizeWords(regionSeleccionada.departamento)"
            variant="light"
            :wrapperClass="['d-inline-block', 'mb-2', 'mr-2', 'departamento-menu', 'flex-grow-1']"
          >
            <template #default="{ close }">
              <button
                type="button"
                class="dropdown-item"
                :key="dep.region"
                v-for="dep in departamentos_list"
                @click="close(); show_departamento(dep)"
              >
                {{ capitalizeWords(dep.departamento) }}
              </button>
            </template>
          </DropdownBs4>
          <DropdownBs4
            v-if="regionSeleccionada.region != 'NACIONAL'"
            :text="distritoSeleccionado.distrito"
            variant="light"
            :wrapperClass="['d-inline-block', 'mb-2', 'departamento-menu', 'flex-grow-1']"
          >
            <template #default="{ close }">
              <button
                type="button"
                class="dropdown-item"
                :key="d.ubigeo"
                v-for="d in distritos"
                @click="close(); selectDistrito(d)"
              >
                {{ d.distrito }}
              </button>
            </template>
          </DropdownBs4>
        </div>
      </div>

      <BTabs>
        <BTab :title="`Resulados nacionales`">
          <template #title>
             <span class="title-resultados align-self-center" v-if="regionSeleccionada.region !='NACIONAL' && distritoSeleccionado.distrito =='Seleccionar distrito'"><span>{{regionSeleccionada.region}}</span></span>

              <span class="title-resultados align-self-center" v-if="regionSeleccionada.region =='NACIONAL'"><span>RESULTADOS</span></span>
              <span class="distrito-resultados align-self-center" v-if="distritoSeleccionado.distrito !='Seleccionar distrito'"><span>{{ distritoSeleccionado.distrito }}</span></span>
          </template>
          
          <div class=" bg-white " :key="regionSeleccionada.region">
          <div class="row" :key="regionSeleccionada.region">

            <div class="col-12">
              
              <div class="card card-candidate align-self-center">
                <div class="border-bottom mt-2 p-2" :key="c.candidato_id" v-for="c in displayCandidatosForView.slice(0,6)">
                  <div class="row ">
                    <div class="col-4 col-md-3 col-lg-3 text-center">
                        <div
                          v-if="isPlaceholderCandidate(c)"
                          class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                          style="width:56px; height:56px; min-width:56px; background:#ADB5BD; border-color: #ADB5BD !important;"
                          role="img"
                          aria-hidden="true"
                        />
                        <img
                          v-else
                          class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                          :style="`border-color: ${c.color} !important`"
                          :src="getImageCandidate(c.candidato_id)"
                        />
                    </div>
                    <div class="col-4 col-md-4 col-lg-5 p-0 align-self-center">
                      <h4 class="candidato-mapa mt-1">{{ c.candidato }}</h4>
                      <h4 class="partido-mapa mt-1">
                        <img v-if="!isPlaceholderCandidate(c)" width="25px" class="partido-icon mr-2" :src="getImagePartido(c.partido_id)" />
                        {{ c.partido || '\u00A0' }}
                      </h4>
                      <h4 class=" mt-1">
                         <span
                          class="d-inline badge badge-light text-right diferencia text-dark"
                          v-if="leadGapForCandidate(c) > 0"
                        >
                          Ganando por +{{ numeral(leadGapForCandidate(c)).format('0,0') }}
                        </span>
                      </h4>
                    </div> 
                    
                    <div class="col-4 col-md-4 col-lg-4 align-self-center text-right">
                      <div>

                      <span class="text-right" :style="`font-size:1rem; font-weight: 600;`">{{ Number(c.validos || 0).toFixed(2) }}%</span>

                      <span style="font-size: 0.8rem;"  class="align-self-end text-right">
                        <span style="font-size: 0.8rem;" class="d-block text-right text-secondary" v-if="distritoSeleccionado.distrito =='Seleccionar distrito'">
                          {{ numeral(c.votos || 0).format('0,0') }}
                        </span>
                        <span class="d-block text-right text-small badge font-weight-light text-secondary" v-if="distritoSeleccionado.distrito =='Seleccionar distrito'">
                          Votos
                        </span>
                        <span class="d-block text-right diferencia" v-if="distritoSeleccionado.distrito !='Seleccionar distrito'">{{ numeral(c.total_votos || 0).format('0,0') }} votos</span>
                       
                      </span>   
                      
                      </div>
                    </div> 
                  </div> 
                </div>
              </div>
              </div>
            </div>
            
            <BCollapse v-model="open" id="collapse-1" class="col-12">

              <div class="card card-candidate align-self-center mt-2 " :key="c.candidato_id" v-for="c in displayCandidatosForView.slice(6, displayCandidatosForView.length)">
                <div class="row border-bottom">
                  <div class="col-4 col-md-3 col-lg-3 text-center">
                      <div
                        v-if="isPlaceholderCandidate(c)"
                        class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                        style="width:56px; height:56px; min-width:56px; background:#ADB5BD; border-color: #ADB5BD !important;"
                        role="img"
                        aria-hidden="true"
                      />
                      <img
                        v-else
                        class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                        :style="`border-color: ${c.color} !important`"
                        :src="getImageCandidate(c.candidato_id)"
                      />
                  </div>
                  <div class="col-5 col-md-4 col-lg-5 p-0 align-self-center">
                    <h4 class="candidato-mapa mt-1">{{ c.candidato }}</h4>
                    <h4 class="partido-mapa mt-1">
                      <img v-if="!isPlaceholderCandidate(c)" width="25px" class="partido-icon mr-2" :src="getImagePartido(c.partido_id)" />
                      {{ c.partido || '\u00A0' }}
                    </h4>
                  </div> 
                  
                  <div class="col-3 col-md-4 col-lg-4  align-self-center text-right">
                    <div>
                      <span class="d-block text-right small badge font-weight-light text-secondary" v-if="distritoSeleccionado.distrito =='Seleccionar distrito'">
                          Validos
                        </span>
                    <span class="text-right" :style="`font-size:0.8rem; font-weight: 600;`">{{ Number(c.validos || 0).toFixed(2) }}%</span>

                    <span class="align-self-end text-right">
                        <span style="font-size: 0.8rem;" class="text-bold d-block text-right text-secondary" v-if="distritoSeleccionado.distrito =='Seleccionar distrito'">
                          {{ numeral(c.votos || 0).format('0,0') }}
                        </span>
                        <span class="d-block text-right small badge font-weight-light text-secondary" v-if="distritoSeleccionado.distrito =='Seleccionar distrito'">
                          Votos válidos
                        </span>
                        <span class="d-block text-right diferencia" v-if="distritoSeleccionado.distrito !='Seleccionar distrito'">{{ numeral(c.total_votos || 0).format('0,0') }} votos</span>
                        <span
                          class="d-block text-right diferencia text-secondary"
                          v-if="distritoSeleccionado.distrito !='Seleccionar distrito' && leadGapForCandidate(c) > 0"
                        >
                          +{{ numeral(leadGapForCandidate(c)).format('0,0') }} vs {{ leadGapLabelForCandidate(c) }}
                        </span>
                      </span>    
                    
                    </div>
                  </div> 
                </div> 
              </div>
              
              
            </BCollapse>
        
            <div class="col-12 mt-3 button-more pl-0 pr-0">
              <a v-if="open==false && displayCandidatosForView.length > 6" @click="open=!open" class="d-block btn btn-light text-center">Ver todos los candidatos
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-down" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
                </svg>
              </a>
              <a v-if="open==true && displayCandidatosForView.length > 6" @click="open=!open" class="d-block btn btn-light text-center">Cerrar
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-up" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"/>
                </svg>
              </a>
            </div>
          </div>

        </BTab>
        <BTab disabled :title="`Al ${conteo} % de los votos válidos`">
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
  import { capitalizeWords } from '../utils/formatText'
  import DropdownBs4 from './DropdownBs4.vue'
  const PLACEHOLDER_PREFIX = 'placeholder-candidato-'
  const PLACEHOLDER_COLOR = '#ADB5BD'

  export default {
    name: 'candidatosResultados',
    components: { DropdownBs4 },
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
        let filtered = filter(this.todosCandidatos, c => c.candidato_id != '' && c.region != 'total')
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
      displayCandidatosForView() {
        if (this.displayCandidatos && this.displayCandidatos.length) return this.displayCandidatos
        return Array.from({ length: 6 }, (_, i) => ({
          candidato_id: `${PLACEHOLDER_PREFIX}${i + 1}`,
          candidato: '',
          partido_id: 'sin-resultados',
          partido: 'Información no disponible',
          color: PLACEHOLDER_COLOR,
          votos: 0,
          total_votos: 0,
          validos: 0,
          conteo: 0,
          hora: '',
        }))
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
      },
      'regionSeleccionada.region'() {
        this.distritoSeleccionado = { distrito: 'Seleccionar distrito' }
      },
    },
    methods: {
      capitalizeWords,
      numeral,
      isPlaceholderCandidate(c) {
        return String(c?.candidato_id || '').startsWith(PLACEHOLDER_PREFIX)
      },
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
        this.store.updateRegionSeleccionada({
          region: 'NACIONAL',
          departamento: 'Explorar región',
        })
        this.distritoSeleccionado = {
          distrito: 'Seleccionar distrito',
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
      },
      votoBaseForGap(c) {
        if (!c) return 0
        const current = this.distritoSeleccionado.distrito != 'Seleccionar distrito'
          ? (c.total_votos ?? c.votos ?? 0)
          : (c.votos ?? c.total_votos ?? 0)
        return Number(current) || 0
      },
      leadGapForCandidate(c) {
        const list = this.displayCandidatosForView || []
        const idx = list.findIndex((x) => x.candidato_id === c?.candidato_id)
        if (idx < 0 || idx > 1) return 0
        const current = this.votoBaseForGap(list[idx])
        const next = this.votoBaseForGap(list[idx + 1])
        return Math.max(0, current - next)
      },
      leadGapLabelForCandidate(c) {
        const list = this.displayCandidatosForView || []
        const idx = list.findIndex((x) => x.candidato_id === c?.candidato_id)
        if (idx === 0) return '2do'
        if (idx === 1) return '3ro'
        return ''
      }
    }
  }
</script>