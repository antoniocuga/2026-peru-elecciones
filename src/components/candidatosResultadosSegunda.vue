<template>
  <div class="pb-3 active">
    <div>
      <div class="row filter-region-primera d-block d-md-none mb-3">
        <div class="col-12 d-flex flex-wrap align-items-center">
          <button
            @click="resetMapa()"
            class="btn btn-light btn-sm mr-2 mb-2"
            v-if="regionSeleccionadaSegunda.region !='NACIONAL'"
          ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
          </svg></button>
        <DropdownBs4
          :text="regionSeleccionadaSegunda.departamento"
          variant="light"
          :wrapperClass="['d-inline-block', 'mb-2', 'mr-2', 'departamento-menu', 'flex-grow-1']"
        >
          <template #default="{ close }">
            <button
              type="button"
              class="dropdown-item"
              :key="dep.region"
              v-for="dep in departamentos"
              @click="close(); show_departamento(dep)"
            >
              {{ dep.departamento }}
            </button>
          </template>
        </DropdownBs4>
        <DropdownBs4
          v-if="regionSeleccionadaSegunda.region !='NACIONAL'"
          :text="distritoSeleccionado.distrito"
          variant="light"
          :wrapperClass="['d-inline-block', 'mb-2', 'departamento-menu', 'flex-grow-1']"
        >
          <template #default="{ close }">
            <button
              type="button"
              class="dropdown-item"
              :key="dep.ubigeo"
              v-for="dep in distritos"
              @click="close(); selectDistrito(dep)"
            >
              {{ dep.distrito }}
            </button>
          </template>
        </DropdownBs4>
        </div>
      </div>
      <BTabs>
        <BTab :title="`Resulados nacionales`">
          <template #title>
            <span class="title-resultados align-self-center" v-if="regionSeleccionadaSegunda.region !='NACIONAL' && distritoSeleccionado.distrito =='Seleccionar distrito'"><span>{{regionSeleccionadaSegunda.region}}</span></span>
            <span class="title-resultados align-self-center" v-if="regionSeleccionadaSegunda.region =='NACIONAL'"><span>RESULTADOS</span></span>
            <span class="distrito-resultados align-self-center" v-if="distritoSeleccionado.distrito !='Seleccionar distrito'"><span>{{ distritoSeleccionado.distrito }}</span></span>
          </template>
          <div class="bg-white" :key="regionSeleccionadaSegunda.region">
            <div class="row candidates-list" v-if="lista_candidatos_view.length">
              <div class="col-12">
                <div class="card card-candidate align-self-center">
                  <div class="border-bottom mt-2 p-2" :key="c.candidato_id" v-for="c in lista_candidatos_view">
                    <div class="row">
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
                        <h4 class="mt-1">
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
                          <span style="font-size: 0.8rem;" class="align-self-end text-right">
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
          </div>
        </BTab>
        <BTab disabled :title="`Al ${conteo} % de los votos válidos`"></BTab>
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
  import DropdownBs4 from './DropdownBs4.vue'
  const PLACEHOLDER_PREFIX = 'placeholder-candidato-segunda-'
  const PLACEHOLDER_COLOR = '#ADB5BD'

  export default {
    name: 'candidatosResultadosSegunda',
    props: {
      candidatos: Array
    },
    components: {
      DropdownBs4,
    },
    setup() {
      const store = useCandidatosStore()
      const refs = storeToRefs(store)
      return {
        ...refs,
        store,
        todosCandidatos: refs.todosSegunda,
        todosDistritos: refs.distritosSegunda,
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
        return parseFloat(uniq(map(this.lista_candidatos, 'conteo')).join("")) || 0
      },
      lista_candidatos_view() {
        if (this.lista_candidatos && this.lista_candidatos.length) {
          return this.lista_candidatos.slice(0, 2)
        }
        return Array.from({ length: 2 }, (_, i) => ({
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
        if(this.regionSeleccionadaSegunda.region == 'NACIONAL' && this.distritoSeleccionado.distrito == 'Seleccionar distrito') {
          data_block = filter(this.todosCandidatos, ['region', 'total'])
        }
        else if(this.regionSeleccionadaSegunda.region != 'NACIONAL' && this.distritoSeleccionado.distrito == 'Seleccionar distrito') {
          data_block = filter(this.todosCandidatos, ['region', this.regionSeleccionadaSegunda.region])
        }
        else if(this.regionSeleccionadaSegunda.region != 'NACIONAL' && this.distritoSeleccionado.distrito != 'Seleccionar distrito') {
          data_block = filter(this.todosDistritos, d => d.region == this.regionSeleccionadaSegunda.region && d.ubigeo_inei == this.distritoSeleccionado.ubigeo)
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
      regionSeleccionadaSegunda() {
        this.open = false
      }
    },
    methods: {
      numeral,
      isPlaceholderCandidate(c) {
        return String(c?.candidato_id || '').startsWith(PLACEHOLDER_PREFIX)
      },
      resetMapa() {
        this.store.updateRegionSeleccionadaSegunda({ region: 'NACIONAL', departamento: 'Explorar región' })
        this.distritoSeleccionado = { distrito: "Seleccionar distrito" }
      },
      show_departamento(departamento) {
        let dep = find(this.departamentos_list, d => d.region == departamento.region)
        this.store.updateRegionSeleccionadaSegunda(dep)
        this.distritoSeleccionado = { distrito: "Seleccionar distrito" }
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
        const list = this.lista_candidatos_view || []
        const idx = list.findIndex((x) => x.candidato_id === c?.candidato_id)
        if (idx < 0 || idx > 0) return 0
        const current = this.votoBaseForGap(list[idx])
        const next = this.votoBaseForGap(list[idx + 1])
        return Math.max(0, current - next)
      },
    }
  }
</script>