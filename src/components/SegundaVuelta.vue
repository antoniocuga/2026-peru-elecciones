
<template>
  <div class="candidato-wrapper resultados2021">
    <div class="row">

        <div class="col-12">
          
          <div class="row justify-content-center">
            <div class="col-12 mb-3 pb-3 ganadores-segunda">
              <div class="row mt-3">
                <div class="col-12 col-md-8 border-bottom">
                  <h3 class="fw-bold align-self-center"><span>RESULTADOS NACIONALES 2026</span></h3>
                </div>
                
                <div class="col-4 border-bottom">
                  <h3 class="title-resultados text-end"><span class="float-right badge text-bg-dark">Conteo al {{ conteo }}%</span></h3>
                </div>
              </div>

              <div class="p-3 card card-candidate ">
              <div class="row">
                <div class="col-12 col-md-6" :class="{'border-bottom border-lg-none': ix==0}" :key="candidato.candidato_id" v-for="(candidato, ix) in top_candidatos.slice(0,2)">
                  <div class="row justify-content-center mt-3">
                    <div class="col-4 col-md-3">
                      <div class="">
                        <div class="">
                          <img  class="rounded-circle border border-3 flex-shrink-0 img-candidato" :style="`border-color: ${candidato.color} !important`" :src="getImageCandidate(candidato.candidato_id)" />
                        </div>
                      </div>
                    </div>
                    <div class="col-8 col-md-9">

                      <div class="tooltip-c"><span :style="`color: ${candidato.color} !important; font-size:22px; font-weight: 600;`">{{ candidato.validos.toFixed(3)+"%" }}</span> <span class="badge text-secondary">{{ numeral(candidato.votos).format('0,0') }} votos</span> </div>
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
                  </div>
                </div>
              </div>
              </div>

            </div>
          </div>

          <div class="row justify-content-center ">
            <div class="col-12 col-md-6 " :key="eleccion.eleccion" v-for="(eleccion) in candidatos_segunda">
              <div class="card card-candidate align-self-center  p-3 mb-3">
              
                <div class="row">
                  <div class="col-12 mb-2">
                    <h3 class="m-0">{{ eleccion.eleccion }}</h3>
                  </div>
                  <div class="col-12">
                    <div class="mt-2 pb-2" :class="{'border-bottom': iv==0}" :key="candidato.candidato_id" v-for="(candidato, iv) in eleccion.items">
                      <div class="row">
                        <div class="col-3 col-lg-3 p-0">                    
                            <div class="">
                              <img  class="rounded-circle border border-3 flex-shrink-0 img-candidato" :style="candidato.ganador ? `background-color: ${candidato.color} !important` : ''" :src="getImageCandidate(candidato.candidato_id)" />
                            </div>                      
                        </div>
                        <div class="col-5 col-md-6 col-lg-6 p-0 align-self-center">
                          <div class="">
                            
                              <h4 class="candidato-mapa m-0">{{candidato.candidato}}</h4>
                              <h4 class="partido-mapa mt-1 mb-0"><img width="25px" class="partido-icon" :src="getImagePartido(candidato.partido_id)" /> {{candidato.partido}}</h4>
                              <div class="p-0 small badge"><span class=" text-success" v-if="candidato.ganador">✓ Ganador en segunda vuelta</span></div>                      
                            
                          </div>    
                        </div>    


                          <div class="col-4 col-md-2 col-lg-3 p-1 align-self-center text-end">
                          <div class="tooltip-c" :style="`color: ${candidato.color} !important; font-size:22px; font-weight: 600;`">{{ candidato.validos+"%" }} </div>       

                          <span v-if="candidato.diferencia" class="p-0 small badge text-secondary">+{{ numeral(candidato.diferencia).format('0,0') }} votos</span>        
                          </div> 


                      </div>
                    </div>
                
                  </div>
                </div>

              </div>

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
        return orderBy(map(groupBy(this.segunda_vuelta, 'eleccion'), (items, eleccion) => {
          return {
            eleccion: eleccion,
            items: orderBy(items, 'puesto')
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