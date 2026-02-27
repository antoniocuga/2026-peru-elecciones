<template>

  <div class="row justify-content-center">
    <div class="col-12 col-sm-12 mb-3" v-if="conteo">
      <h3 class="m-0 text-center">
        <b>Conteo ONPE al {{ conteo }}% a nivel nacional de actas procesadas / {{contabilizadas}}% de actas contabilizadas </b> <br>Última actualización: {{ fecha_hora }}
      </h3>
    </div>
    <div class="col-12" v-if="conteo">
      <div class="row justify-content-center widget-segunda-top">
        <div class="col-6 text-center">
          
          <div class="row">

            <div class="col-12 col-md-6">
              <div class="mr-2"><img width="125px" :src="getImageCandidate(topCandidatos[0].candidato_id)" /></div>
              <div class="candidato-mapa">{{ topCandidatos[0].candidato }}</div>
              <div class="partido-mapa"><img width="25px" :src="getImagePartido(topCandidatos[0].partido_id)" /> {{ topCandidatos[0].partido }}</div>
            </div>

            <div class="col-12 col-md-6 d-flex align-self-center  text-center">
              <div class="card-resultado">                              
                <div class="text-center mt-2 mb-2 porcentaje text-center">{{ topCandidatos[0].validos.toFixed(2) }} <span>%</span></div>
                <div class="text-center mt-2 mb-2 votos-total text-center">{{ numeral(topCandidatos[0].votos).format('0,0') }} votos</div>
                <div class="text-center mt-2 mb-2 votos-validos text-center">+{{ numeral(topCandidatos[0].votos - topCandidatos[1].votos).format('0,0') }}</div>                
              </div>
            </div>            

          </div>

        </div>
        <div class="col-6 text-center">
          
          <div class="row">
            
            <div class="col-12 col-md-6  align-self-center d-none d-md-flex text-center">
              <div class="card-resultado">
                <div class="text-center mt-2 mb-2 porcentaje text-center">{{ topCandidatos[1].validos.toFixed(2) }} <span>%</span></div>
                <div class="text-center mt-2 mb-2 votos-total text-center">{{ numeral(topCandidatos[1].votos).format('0,0') }} votos</div>
                <div class="text-center mt-2 mb-2 votos-validos text-center">  <span></span> </div>                
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="mr-2"><img width="125px" :src="getImageCandidate(topCandidatos[1].candidato_id)" /></div>
              <div class="candidato-mapa">{{ topCandidatos[1].candidato }}</div>
              <div class="partido-mapa"><img width="25px" :src="getImagePartido(topCandidatos[1].partido_id)" /> {{ topCandidatos[1].partido }}</div>              
            </div>

            <div class="col-12 col-md-6 d-flex align-self-center d-block d-md-none text-center">
              <div class="card-resultado">
                <div class="text-center mt-2 mb-2 porcentaje text-center">{{ topCandidatos[1].validos.toFixed(2) }} <span>%</span></div>
                <div class="text-center mt-2 mb-2 votos-total text-center">{{ numeral(topCandidatos[1].votos).format('0,0') }} votos</div>
                <div class="text-center mt-2 mb-2 votos-validos text-center">  <span></span> </div>        
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import numeral from 'numeral'
  import { storeToRefs } from 'pinia'
  import { useCandidatosStore } from '../stores/candidatos'
  import { getPartidoImage, getCandidatoImage } from '../utils/assets'
  import { filter, map, orderBy, groupBy, uniq } from 'lodash'

  export default {
    name: "topWidget",
    setup() {
      const store = useCandidatosStore()
      const refs = storeToRefs(store)
      return {
        ...refs,
        candidatos: refs.todosSegunda,
        regionSeleccionada: refs.regionSeleccionadaSegunda,
        partidoSeleccionado: refs.partidoSeleccionadoSegunda,
      }
    },
    methods: {
      numeral,
      getImageCandidate(c) {
        return getCandidatoImage(c)
      },
      getImagePartido(c) {
        return getPartidoImage(c)
      }
    },
    computed: {
      conteo() {
        return parseFloat(uniq(map(this.topCandidatos, 'conteo')).join(""))
      },
      contabilizadas() {
        return parseFloat(uniq(map(this.topCandidatos, 'contabilizadas')).join(""))
      },
      fecha_hora() {
        return uniq(map(this.topCandidatos, 'hora')).join("")
      },
      topCandidatos() {
        let filtered = filter(this.candidatos, d => {
          if(d.region == 'total' && d.candidato_id != 'blanco' && d.candidato_id != 'nulos') {
            return d
          }
        })

        let candidates = orderBy(map(groupBy(filtered, 'candidato_id'), (d, id) => {
            return {
              candidato_id: id,
              region: uniq(map(d, 'region')).join(''),
              candidato: uniq(map(d, 'candidato')).join(''),
              partido_id: uniq(map(d, 'partido_id')).join(''),
              partido: uniq(map(d, 'partido')).join(''),
              color: uniq(map(d, 'color')).join(''),
              votos: parseFloat(uniq(map(d, 'total')).join('')),
              validos: parseFloat(uniq(map(d, 'validos')).join('')),
              conteo: parseFloat(uniq(map(d, 'conteo')).join('')),
              contabilizadas: parseFloat(uniq(map(d, 'contabilizadas')).join('')),
              hora: uniq(map(d, 'hora')).join('')
            }
        }), ['validos'], ['desc'])

        return candidates.slice(0, 2)
      }, 
    }
  }
  

</script>