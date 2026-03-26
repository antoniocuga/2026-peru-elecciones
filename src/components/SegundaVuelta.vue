
<template>
  <div class="candidato-wrapper resultados2021">
    <div class="row">
        <div class="col-12">
          <div class="row justify-content-center">
            <div class="col-12 col-md-6 mb-3">

            <BTabs>
              <BTab :title="`Elecciones 2026 - resultados en vivo`">

                <div class="card p-3 card-candidate border-top-0">

      
                    <div :class="{'border-bottom': ix==0}"  class="mt-2 pb-2 col-12 col-md-12" :key="candidato.candidato_id" v-for="(candidato, ix) in top_candidatos.slice(0,2)">
                  <div class="row">
                    <div class="col-12 col-md-12">
                      <div class="row justify-content-center">
                        <div class="col-3 col-md-3 col-lg-3 text-center">
                            <div class="">
                              <img  class="rounded-circle border border-3 flex-shrink-0 img-candidato" :style="`border-color: ${candidato.color} !important`" :src="getImageCandidate(candidato.candidato_id)" />
                            </div>
                        </div>
                        <div class="col-5 col-md-5 col-lg-5 p-0 align-self-center">
      
                          
                          <h4 class="candidato-mapa m-0">{{candidato.candidato}}</h4>
                          <h4 class="partido-mapa p-0"><img width="25px" :src="getImagePartido(candidato.partido_id)" /> {{candidato.partido}}</h4>
      
                          <div>
                          <span class="badge text-success m-0 p-0" v-if="ix==0"> Ganando por +{{ numeral(top_candidatos[ix].votos - top_candidatos[ix+1].votos).format('0,0') }} votos</span>
                          </div>
                          
      
                          <div class="candidate-results">   
                                      
                            <div class="candidate-bar d-none">
                              <div class="percent" :style="`background-color:${candidato.color}; width: ${calcScale(candidato,top_candidatos, 320)}px;`"></div>
                            </div>
                          </div>   
      
                          <div>
      
                            
                          </div>
      
                        </div>
                        <div class="col-4 col-md-3 col-lg-4 align-sef-center text-right">
                          <div class="tooltip-c" style="font-size: 1rem; font-weight: 600;">
                          <span class="d-block badge font-weight-light small text-right text-secondary">Validos</span>
                          <span :style="`font-size:1rem; font-weight: 600;`">{{ candidato.validos.toFixed(3)+"%" }}</span> <span :style="`font-weight: 600;`" class="d-block badge text-secondary small text-right d-block">{{ numeral(candidato.votos).format('0,0') }}</span><span class="d-block badge font-weight-light small text-right text-secondary">Votos estimados</span></div>

                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Btab>
              <BTab disabled :title="`Conteo al ${conteo}%`"></BTab>
            </Btabs>

  
            </div>            
            <div class="col-12 col-md-6 mb-3" :key="eleccion.eleccion" v-for="(eleccion) in candidatos_segunda">

            <BTabs>
              <BTab>
              <div class="card card-candidate align-self-center border-top-0 p-3">
              
                <div class="row">

                  <div class="col-12">
                    <div class="mt-2 pb-2" :class="{'border-bottom': iv==0}" :key="candidato.candidato_id" v-for="(candidato, iv) in eleccion.segunda_vuelta">
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
  import * as d3 from 'd3'
  import { groupBy, filter, map, orderBy, maxBy, uniq } from 'lodash'
  import segundaVueltaData from '../data/segunda_vuelta.json'

  export default {
    name: 'SegundaVuelta',
    setup() {
      const store = useCandidatosStore()
      const refs = storeToRefs(store)
      return { ...refs, todosCandidatos: refs.todos }
    },
    methods: {
      numeral,
      getImageCandidate(c) {
        return getCandidatoImage(c)
      },
      getImagePartido(c) {
        return getPartidoImage(c)
      },
      calcScale(candidato, items, w) {
        
        let _m = maxBy(items, 'validos')
        let myScale = d3.scaleLinear()
          .domain([0, _m.validos])
          .range([0, w])

        return myScale(parseFloat(candidato.validos))
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
            items: orderBy(candidatos, 'puesto'),
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