
<template>
  <div class="candidato-wrapper">
    <div class="row">
      <div class="col-12 col-md-6 mb-3" :key="eleccion.eleccion" v-for="(eleccion) in candidatos_congreso_real">
        
        <div class="row">
          <div class="col-12">
            <h3 class="border-bottom pb-2">2021
            <span class="small float-right text-dark">Conteo ONPE al {{ conteo  }}%</span></h3>
          </div>
        </div>

        <div class="row" :key="candidato.candidato_id" v-for="candidato in eleccion.items">
          <div class="col-6">
            <div class="candidate-info historico align-self-center">
              <div class="">
                <img height="40px" width="40px" :src="getImageCandidate(candidato.candidato_id)" />
              </div>
              <div>
                <h4>{{candidato.nombre}}</h4>
                <h5><img width="25px" :src="getImagePartido(candidato.partido_id)" /> {{candidato.partido}}</h5>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="candidate-results">                
              <div class="candidate-bar">
                <div class="tooltip-c">{{ numeral(candidato.voto_preferencial).format('0,0') }} votos</div>
                <div class="percent" :style="`background-color:${candidato.color}cc; width: ${calcScale(candidato, eleccion.items, 'voto_preferencial')}px;`"></div>
              </div>                          
            </div>            
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 mb-3" :key="eleccion.eleccion" v-for="(eleccion) in candidatos_congreso">
        
        <div class="row">
          <div class="col-12">
            <h3 class="border-bottom pb-2">{{ eleccion.eleccion }}</h3>
          </div>
        </div>

        <div class="row" :key="candidato.candidato_id" v-for="candidato in eleccion.items">
          <div class="col-6">
            <div class="candidate-info historico align-self-center">
              <div class="">
                <img height="40px" width="40px" :src="getImageCandidate(candidato.candidato_id)" />
              </div>
              <div>
                <h4>{{candidato.candidato}}</h4>
                <h5><img width="25px" :src="getImagePartido(candidato.partido_id)" /> {{candidato.partido}}</h5>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="candidate-results">                
              <div class="candidate-bar">
                <div class="tooltip-c">{{ numeral(candidato.total_votos).format('0,0') }} votos</div>
                <div class="percent" :style="`background-color:${candidato.color}cc; width: ${calcScale(candidato, eleccion.items, 'total_votos')}px;`"></div>
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