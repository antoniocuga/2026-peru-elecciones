
<template>
  <div class="candidato-wrapper">
    <div class="row">

        <div class="col-12">
          <div class="row justify-content-center">
            <div class="col-12 col-md-9 pb-3 ganadores-segunda">
              <div class="row mt-3">
                <div class="col-12 border-bottom">
                  <h3 class="">2021</h3>
                  <span class="small">
                    Conteo <b>ONPE al {{ conteo }}% a nivel nacional</b> (Última actualización: {{ fecha_hora }})
                  </span>
                </div>
              </div>
              <div class="row justify-content-center mt-3" :key="candidato.candidato_id" v-for="(candidato, ix) in top_candidatos.slice(0,2)">
                <div class="col-12 col-md-3">
                  <div class="candidate-info segunda historico align-self-center">
                    <div class="">
                      <img height="40px" width="40px" :src="getImageCandidate(candidato.candidato_id)" />
                    </div>
                    <div>
                      <h4>{{candidato.candidato}}</h4>
                      <h5><img width="25px" :src="getImagePartido(candidato.partido_id)" /> {{candidato.partido}}</h5>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="candidate-results">                
                    <div class="candidate-bar">
                      <div class="tooltip-c">{{ candidato.validos.toFixed(3)+"%" }} </div>
                      <div class="percent" :style="`background-color:${candidato.color}; width: ${calcScale(candidato,top_candidatos, 320)}px;`"></div>
                      <div class="tooltip-c"><span>Total de votos: {{ numeral(candidato.votos).format('0,0') }}</span></div>
                      <div class="tooltip-c"><span class="badge text-success" v-if="ix==0"> Ganando por +{{ numeral(top_candidatos[ix].votos - top_candidatos[ix+1].votos).format('0,0') }} votos</span> </div>
                    </div>
                  </div>            
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="col-12 col-md-6 mb-3 mt-3" :key="eleccion.eleccion" v-for="(eleccion) in candidatos_segunda">
          
          <div class="row">
            <div class="col-12">
              <h3 class="border-bottom">{{ eleccion.eleccion }}</h3>
            </div>
            <div class="col-12">
              <div class="row" :key="candidato.candidato_id" v-for="candidato in eleccion.items">
                <div class="col-7 pr-0">
                  <div class="candidate-info historico align-self-center">
                    <div class="">
                      <img height="40px" width="40px" :src="getImageCandidate(candidato.candidato_id)" />
                    </div>
                    <div>
                      <h4>{{candidato.candidato}}</h4>
                      <h5><img width="25px" :src="getImagePartido(candidato.partido_id)" /> {{candidato.partido}}</h5>
                      <div class="tooltip-c"><span class="badge text-success" v-if="candidato.ganador">Ganador en segunda vuelta</span></div>
                    </div>
                  </div>
                </div>
                <div class="col-5 pl-0">
                  <div class="candidate-results">                
                    <div class="candidate-bar">
                      <div class="tooltip-c">{{ candidato.validos+"%" }} <span v-if="candidato.diferencia" class="badge text-success">+{{ numeral(candidato.diferencia).format('0,0') }}</span> </div>                    
                      <div class="percent" :style="`background-color:${candidato.color}; width: ${calcScale(candidato, eleccion.items, 150)}px;`"></div>
                      <div class="tooltip-c"><span>Total de votos: {{ numeral(candidato.total_votos).format('0,0') }}</span></div>
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
  import { mapState } from 'vuex'
  import numeral from 'numeral'
  import * as d3 from 'd3'
  import { groupBy, filter, map, orderBy, maxBy, uniq } from 'lodash'
  
  export default {
    name: 'SegundaVuelta.vue',
    methods: {
      numeral,
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
      ...mapState({
        todosCandidatos: state => state.candidatos.todos,
      }),
      segunda_vuelta() {
        return require('../data/segunda_vuelta.json')
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