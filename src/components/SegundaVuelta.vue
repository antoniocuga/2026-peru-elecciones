
<template>
  <div class="candidato-wrapper resultados2026">
    <div class="row">
        <div class="col-12">
          <div class="row justify-content-center">

            <div class="col-12 col-md-6 mb-3" :key="eleccion.eleccion" v-for="(eleccion) in candidatos_segunda">

            <BTabs>
              <BTab>
                <template #title>
                  <span class="d-inline-flex align-items-center flex-wrap gap-1">
                    <span>Primera vuelta {{ eleccion.eleccion }}</span>
                    <!-- span (not <button>): tab title lives inside <button.nav-link> — nested buttons are invalid -->
                    <span
                      v-if="segundaVueltaNotaText(eleccion)"
                      tabindex="0"
                      class="text-secondary ms-1 align-middle lh-1 d-inline-flex"
                      style="cursor: help;"
                      :title="segundaVueltaNotaText(eleccion)"
                      :aria-label="segundaVueltaNotaAria(eleccion)"
                      @click.stop
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                      </svg>
                    </span>
                  </span>
                </template>

                <div class="card card-candidate align-self-center border-top-0 p-3">
                
                  <div class="row">

                    <div class="col-12">
                      <div class="mt-2 pb-2" :class="{'border-bottom': iv==0}" :key="candidato.candidato_id" v-for="(candidato, iv) in eleccion.items">
                        <div class="row">
                          <div class="col-3 col-md-4 col-lg-3 pr-0 pl-0 text-center">                    
                              <div class="">
                                <img  class="rounded-circle border border-3 flex-shrink-0 img-candidato" :style="candidato.ganador ? `background-color: ${candidato.color} !important` : ''" :src="getImageCandidate(candidato.candidato_id)" />
                              </div>                      
                          </div>
                          <div class="col-5 col-md-5 col-lg-5 p-0 align-self-center">
                            <div class="">
                                <h4 class="candidato-mapa m-0">{{candidato.candidato}}</h4>
                                <h4 class="partido-mapa mt-1 mb-0"><img width="25px" class="partido-icon" :src="getImagePartido(candidato.partido_id)" /> {{candidato.partido}}</h4>
                                
                            </div>    
                          </div>    


                            <div class="col-4 col-md-3 col-lg-4 align-self-center text-right congreso-pasado">
                            <div class="tooltip-c" :style="`font-size:1rem; font-weight: 600;`">
                            <span class="text-secondary text-right font-weight-light d-block badge">Validos</span>
                            <span style="font-size: 1rem; font-weight: 600;">
                              {{ candidato.validos+"%" }}
                            </span>
                            </div>       

                            <span v-if="candidato.diferencia" class="d-block p-0 small badge text-right text-secondary">
                            
                            <span :style="`font-weight: 600; font-size: 0.7rem; `" class="d-block badge text-secondary small text-right d-block">+{{ numeral(candidato.diferencia).format('0,0') }} </span>    
                            <span class="mt-1 font-weight-light d-block">Diferencia</span></span>        
                            </div> 


                        </div>
                      </div>
                  
                    </div>
                  </div>
                </div>
              </Btab>
              <BTab :title="`Segunda vuelta ${eleccion.eleccion}`" v-if="segundaVueltaHasCandidatos(eleccion)"> 
                <div class="card card-candidate align-self-center border-top-0 p-3">
                
                  <div class="row">

                    <div class="col-12">
                      <div class="mt-2 pb-2" :class="{'border-bottom': iv==0}" :key="candidato.candidato_id" v-for="(candidato, iv) in eleccion.segunda_vuelta">
                        <div class="row" v-if="!candidato.nota">
                          <div class="col-3 col-md-4 col-lg-3 pr-0 pl-0 text-center">                    
                              <div class="">
                                <img  class="rounded-circle border border-3 flex-shrink-0 img-candidato" :style="candidato.ganador ? `background-color: ${candidato.color} !important` : ''" :src="getImageCandidate(candidato.candidato_id)" />
                              </div>                      
                          </div>
                          <div class="col-5 col-md-5 col-lg-5 p-0 align-self-center">
                            <div class="">
                                <h4 class="candidato-mapa m-0">{{candidato.candidato}}</h4>
                                <h4 class="partido-mapa mt-1 mb-0"><img width="25px" class="partido-icon" :src="getImagePartido(candidato.partido_id)" /> {{candidato.partido}}</h4>
                                <div class="p-0 small badge"><span class=" text-success" v-if="candidato.ganador">✓ Ganador en segunda vuelta</span></div>                      
                            </div>    
                          </div>    
                          <div class="col-4 col-md-3 col-lg-4 align-self-center text-right congreso-pasado">
                            <div class="tooltip-c" :style="`font-size:1rem; font-weight: 600;`">
                            <span class="text-secondary text-right font-weight-light d-block badge">Validos</span>
                            <span style="font-size: 1rem; font-weight: 600;">
                              {{ candidato.validos+"%" }}
                            </span>
                            </div>       

                            <span v-if="candidato.diferencia" class="d-block p-0 small badge text-right text-secondary">
                            
                            <span :style="`font-weight: 600; font-size: 0.7rem; `" class="d-block badge text-secondary small text-right d-block">+{{ numeral(candidato.diferencia).format('0,0') }} </span>    
                            <span class="mt-1 font-weight-light d-block">Diferencia</span></span>        
                          </div> 
                        </div>
                        <div class=" background-light text-small small">
                        <div class="nota" v-if="candidato.nota">
                        {{ candidato.nota }}
                        </div>
                        </div>
                      </div>
                  
                    </div>
                  </div>
                </div>
              </Btab>
              
            </Btabs>
          

            </div>
          </div>
        </div>



    </div>


  </div>
</template>

<script>
  import { storeToRefs } from 'pinia'
  import { useCandidatosStore } from '../stores/candidatos'
  import { getPartidoImage, getCandidatoImage } from '../utils/assets'
  import numeral from 'numeral'
  import { groupBy, filter, map, orderBy, uniq } from 'lodash'
  import segundaVueltaData from '../data/segunda_vuelta.json'
  import SegundaVueltaLiveCard from './SegundaVueltaLiveCard.vue'

  export default {
    name: 'SegundaVuelta',
    components: {
      SegundaVueltaLiveCard,
    },
    setup() {
      const store = useCandidatosStore()
      const refs = storeToRefs(store)
      return { ...refs, todosCandidatos: refs.todos }
    },
    methods: {
      numeral,
      /** Nota may live on any `segunda_vuelta` row (e.g. a stub row with only `nota`, not necessarily [0]). */
      segundaVueltaNotaText(eleccion) {
        const rows = eleccion?.segunda_vuelta
        if (!Array.isArray(rows)) return ''
        const row = rows.find((r) => r != null && typeof r.nota === 'string' && String(r.nota).trim())
        return row ? String(row.nota).trim() : ''
      },
      segundaVueltaNotaAria(eleccion) {
        return this.segundaVueltaNotaText(eleccion) ? 'Información sobre la segunda vuelta' : 'Información'
      },
      segundaVueltaHasCandidatos(eleccion) {
        const rows = eleccion?.segunda_vuelta
        if (!Array.isArray(rows)) return false
        return rows.some((r) => r && (r.candidato_id || r.candidato))
      },
      getImageCandidate(c) {
        return getCandidatoImage(c)
      },
      getImagePartido(c) {
        return getPartidoImage(c)
      }
    },
    computed: {
      segunda_vuelta() {
        return segundaVueltaData
      },
      candidatos_segunda() {
        return orderBy(map(groupBy(this.segunda_vuelta, 'eleccion'), (candidatos, eleccion) => {
          return {
            eleccion: eleccion,
            items: orderBy(candidatos.filter(d => d.eleccion_tipo=='Primera vuelta'), 'puesto'),
            segunda_vuelta: orderBy(candidatos.filter(d => d.eleccion_tipo=='Segunda Vuelta'), 'puesto')
          }
        }), ['eleccion'], ['desc'])
      },
      conteo() {
        return parseFloat(uniq(map(this.top_candidatos, 'conteo')).join(""))
      },
      fecha_hora() {
        return uniq(map(this.top_candidatos, 'hora')).join("")
      },
      top_candidatos() {
        return orderBy(map(groupBy(filter(this.todosCandidatos, ['region', 'total']), 'candidato_id'), (d, id) => {
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
    }
  }

</script>