
<template>
  <div class="candidato-wrapper resultados2021">

    <div class="row">

      <div class="col-12 col-md-6 col-lg-6 mt-3">
      
        <div class="row">
          <div class="col-12">
            <BTabs >
              <BTab :title="`Senadores 2026`">
                <div class="col-12" :key="eleccion.eleccion" v-for="(eleccion) in candidatos_senado_real">
                  <div class="card card-candidate align-self-center p-2 border-top-0">
                    <div class="border-bottom pt-2 pb-2" :key="candidato.candidato_id" v-for="candidato in eleccion.items">
                      <div class="row">
                        <div class="col-4 col-md-4 col-lg-4 text-center">
                          <img class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                              :style="`background-color: ${candidato.color} !important`" :src="getImageCandidate(candidato.candidato_id)" />
                        </div>
                        <div class="col-5 col-md-5 col-lg-5 p-0 align-self-center">
                          <div class="tooltip-c">
                            <h4 class="candidato-mapa candidato-partido mt-1">{{ candidato.nombre }}</h4>
                            <h4 class="partido-mapa"><img width="25px" class="partido-icon" :src="getImagePartido(candidato.partido_id)" />{{ candidato.partido }}</h4>
                          </div>
                        </div>
                        <div class="col-3 col-md-3 col-lg-3 p-0 align-self-center text-center">
                          <span :style="`font-size: 1rem; font-weight: 600;`">{{ numeral(candidato.voto_preferencial).format('0,0') }}</span>
                          <span class="small badge-secondary d-block fw-light" style="font-size: 10px;">Voto preferencial</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BTab>
              <BTab title="Diputados 2026">
                <div class="col-12" :key="eleccion.eleccion" v-for="(eleccion) in candidatos_congreso_real">
                  <div class="card card-candidate align-self-center border-top-0 p-2">
                    <div class="border-bottom pt-2 pb-2" :key="candidato.candidato_id" v-for="candidato in eleccion.items">
                      <div class="row">
                        <div class="col-12 col-md-4 col-lg-4 text-center">
                          <img class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                              :style="`background-color: ${candidato.color} !important`" :src="getImageCandidate(candidato.candidato_id)" />
                        </div>
                        <div class="col-5 col-md-5 col-lg-5 p-0 align-self-center">
                          <h4 class="candidato-mapa mt-1 candidato-diputado">{{ candidato.nombre }}</h4>
                          <h4 class="partido-mapa"><img width="25px" class="partido-icon" :src="getImagePartido(candidato.partido_id)" />{{ candidato.partido }}</h4>
                        </div>
                        <div class="col-3 col-md-3 col-lg-3 p-0 align-self-center text-center">
                          <span class="congreso-pasado" :style="`font-size:1rem; font-weight: 600;`">{{ numeral(candidato.voto_preferencial).format('0,0') }}</span>
                          <span class="small badge-secondary d-block fw-light" style="font-size: 10px;">Voto preferencial</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BTab>

              <BTab disabled :title="`Conteo al ${ conteo_senado }%`"></BTab>
            </BTabs>
          </div>
        </div>
      
      </div>

      <div class="col-12  mt-3 col-md-6 mb-3":key="eleccion.eleccion" v-for="(eleccion) in candidatos_congreso" >

      <BTabs>
        <BTab :title="`Congreso ${ eleccion.eleccion }`">
          <div class="card card-candidate p-2 border-top-0">

          <div class="border-bottom pb-2 pt-2" :key="candidato.candidato_id" v-for="candidato in eleccion.items">

            <div class="row">
              <div class="col-3 col-md-4 col-lg-3 pr-0 pl-0 text-center">
                <div>
                  <div class="">
                    <img class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                    :style="`background-color: ${candidato.color} !important`" :src="getImageCandidate(candidato.candidato_id)" />
                  </div>
                </div>
              </div>
              
              <div class="col-5 col-md-5 col-lg-5 p-0 align-self-center">
                <div>
                  <div>
                    <div class="tooltip-c">
                      
                    </div>
                    <h4 class="candidato-mapa candidato-partido mt-1">{{ candidato.candidato }}</h4>
                    <h4 class="partido-mapa partido"><img width="25px" class="partido-icon" :src="getImagePartido(candidato.partido_id)" />{{ candidato.partido }}</h4>
                    
                  </div>
                </div>
              </div>
              <div class="col-4 col-md-3 col-lg-3 align-self-center text-end congreso-pasado">
                <span :style="`font-size: 1rem; font-weight: 600;`">{{ numeral(candidato.total_votos).format('0,0') }}</span>
                <span class="small badge-secondary d-block fw-light" style="font-size: 10px;">Voto preferencial</span>
              </div>
            </div>

          </div>

        </div>
        </Btab>
      </Btabs>
      
        
        
      </div>


    </div>


  </div>
</template>

<script>
  import { storeToRefs } from 'pinia'
  import { useCandidatosStore } from '../stores/candidatos'
  import { getPartidoImage, getCandidatoImage } from '../utils/assets'
  import numeral from 'numeral'
  import * as d3 from 'd3'
  import { groupBy, map, orderBy, maxBy, uniq } from 'lodash'
  import votosCongresoData from '../data/top_congresistas.json'

  export default {
    name: 'TopCongreso',
    setup() {
      const store = useCandidatosStore()
      return { ...storeToRefs(store), store }
    },
    methods: {
      numeral,
      getImageCandidate(c) {
        return getCandidatoImage(c)
      },
      getImagePartido(c) {
        return getPartidoImage(c)
      },
      calcScale(candidato, items, field) {
        let w = 150
        let _m = maxBy(items, field)
        let myScale = d3.scaleLinear()
          .domain([0, _m[field]])
          .range([0, w])

        return myScale(parseFloat(candidato[field]))
      }
    },
    computed: {
      conteo() {
        return parseFloat(uniq(map(this.congresistas_parse, 'conteo_general')).join(""))
      },
      conteo_senado() {
        if (!this.senadores || this.senadores.length === 0) return '—'
        return this.senadores[0]?.conteo_general ?? '—'
      },
      fecha_hora() {
        return uniq(map(this.congresistas_parse, 'hora')).join("")
      },
      congresistas_parse() {
        return orderBy(this.congresistas, ['voto_preferencial'], ['desc'])
      },
      votos_congreso() {
        return votosCongresoData
      },
      candidatos_congreso_real() {
        return orderBy(map(groupBy(this.congresistas_parse.slice(0, 5), 'eleccion'), (items, eleccion) => {
          return {
            eleccion: eleccion,
            items: items
          }
        }), ['eleccion'], ['desc'])
      },
      candidatos_senado_real() {
        if (!this.senadores || this.senadores.length === 0) return []
        const nacional = this.senadores.filter(s => s.senado_tipo === 'nacional')
        const top = orderBy(nacional, ['voto_preferencial'], ['desc']).slice(0, 5)
        return [{ eleccion: '2026', items: top }]
      },
      candidatos_congreso() {
        return orderBy(map(groupBy(this.votos_congreso, 'eleccion'), (items, eleccion) => {
          return {
            eleccion: eleccion,
            items: items
          }
        }), ['eleccion'], ['desc'])
      }
    }
  }

</script>