<template>
  <div class="row congreso-grafico">    
    <div class="col-12 col-md-6 col-lg-5 order-md-0 order-1">       
      <BTabs content-class="mt-3">
        <BTab title="Diputados por partido">     
          <div class="list-resultados-partidos">
            <div class="row pb-3">
              <div class="col-12" :key="c.candidato_id" v-for="c in congresistas_partido">
                <div @mouseover="show_partidos(c)" @mouseout="reset_congreso()" class="row candidate-info align-self-center pt-2 pb-2 item-partido">
                  <div class="col-auto pr-1 img-candidato">
                    <img width="65px" :src="getImagePartido(c.partido_id)" />              
                  </div>
                  <div class="col-7 pl-0 pr-md-0 align-self-center">              
                    <h4 class="candidato-mapa m-md-0">{{c.partido}}</h4>
                    <div class="total-votos">Total de votos: {{numeral(c.total_votos_partido).format('0,0')}}</div>
                  </div> 
                  <div class="col-auto align-self-center text-center pr-0">              
                      <h5 class="elegidos d-flex align-self-center">{{ c.seats }}</h5>
                  </div>
                </div>
              </div>
        
            </div>

            <div class="row">
              <div class="col-12">
                Fuente: Elaboración propia en base a información de la ONPE.
              </div>
            </div>
          </div>  
        </BTab>        
        <BTab title="Senados por partidos" class="list-resultados-partidos" lazy>
          <div class="list-resultados-partidos">
            <div class="row pb-3" v-if="senadores_partido.length">
              <div class="col-12" :key="'s-' + c.partido_id" v-for="c in senadores_partido">
                <div class="row candidate-info align-self-center pt-2 pb-2 item-partido">
                  <div class="col-auto pr-1 img-candidato">
                    <img width="65px" :src="getImagePartido(c.partido_id)" />
                  </div>
                  <div class="col-7 pl-0 pr-md-0 align-self-center">
                    <h4 class="candidato-mapa m-md-0">{{ c.partido }}</h4>
                    <div class="total-votos">Total de votos: {{ numeral(c.total_votos_partido).format('0,0') }}</div>
                  </div>
                  <div class="col-auto align-self-center text-center pr-0">
                    <h5 class="elegidos d-flex align-self-center">{{ c.seats }}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" v-else>
              <div class="col-12 text-center py-3 text-muted">Cargando datos de senado...</div>
            </div>
            <div class="row">
              <div class="col-12">
                Fuente: Elaboración propia en base a información de la ONPE.
              </div>
            </div>
          </div>
        </BTab>
      </BTabs>
    </div>

    <div class="col-12 col-md-6 col-lg-7 text-center">
      <div class="congreso-sticky">
        <div class="filters-congreso mb-3 text-center">
          <BDropdown :text="`${depObject.region} (${depObject.seats})`" variant="warning" class="m-2 departamento-menu">
            <BDropdownItem @click="reset_congreso()">
              NACIONAL (130)
            </BDropdownItem>
            <BDropdownItem @click="show_departamentos(d)" :key="d.region" v-for="d in departamentos">
              {{ d.region}} ({{ d.seats }})
            </BDropdownItem>
          </BDropdown>
        </div>
        <svg class="svg-congreso">
          <g id="parliament"></g>
        </svg>
        <div class="col-12 mb-2" v-if="departamentos_conteo > 0">
          <h2 class="title-resultados"><b>Conteo ONPE al {{ departamentos_conteo }}% en la región {{depSelected}}</b></h2> <h2 class="title-resultados">Última actualización: {{ departamentos_hora }}</h2>
        </div>
      </div>
    </div>


    <div class="col-12 mt-3 resultados2021">      
          
    </div>

    
  </div>
</template>

<script>
  import numeral from 'numeral'
  import { storeToRefs } from 'pinia'
  import { useCandidatosStore } from '../stores/candidatos'
  import { getPartidoImage } from '../utils/assets'
  import * as d3 from 'd3'
  import * as parliament from 'd3-parliament-chart'
  import { filter, groupBy, map, orderBy, uniq, sum } from 'lodash'
  import CongresoLista from './CongresoLista.vue'

  export default {
    name: 'congresoGrafico.vue',
    components: { CongresoLista },
    setup() {
      const store = useCandidatosStore()
      return { ...storeToRefs(store), store }
    },
    data() {
      return {
        depSelected: 'NACIONAL (130)',
        depObject: {
          region: "NACIONAL",
          seats: 130
        }
      }
    },
    computed: {
      departamentos_conteo() {
        if(this.depSelected != "NACIONAL (130)")
          return parseFloat(uniq(map(filter(this.departamentos, ['region', this.depSelected]), 'conteo')).join(""))

        return 0
      },
      departamentos_hora() {
        return uniq(map(filter(this.departamentos, ['region', this.depSelected]), 'hora')).join("")
      },
      departamentos() {
        return orderBy(map(groupBy(this.congresistas, 'region'), (items, r) => {
          return {
            region: r,
            departamento: uniq(map(items, 'departamento')).join(""),
            hora: uniq(map(items, 'hora')).join(""),
            conteo: uniq(map(items, 'conteo')).join(""),
            seats: items.length,
            congresistas: items
          }
        }), ['region'], ['asc'])
      },
      congresistas_parse() {
        return orderBy(this.congresistas, ['partido_id'], ['desc'])
      },
      congresistas_partido() {
        return orderBy(map(groupBy(this.congresistas, 'partido_id'), (items, p) => {
          let total_partido = sum(uniq(map(items, 'total_votos_partido'))) + sum(uniq(map(items, 'voto_fantasma'))) 
          return {
            partido_id: p,
            partido: uniq(map(items, 'partido')).join(""),
            total_votos_partido: total_partido,
            seats: items.length,
            congresistas: items, 
            color: uniq(map(items, 'color')).join("")
          }
        }), ['seats'], ['desc'])
      },
      senadores_partido() {
        if (!this.senadores || !this.senadores.length) return []
        return orderBy(map(groupBy(this.senadores, 'partido_id'), (items, p) => {
          const total_partido = sum(uniq(map(items, 'total_votos_partido'))) + sum(uniq(map(items, 'voto_fantasma')))
          return {
            partido_id: p,
            partido: uniq(map(items, 'partido')).join(''),
            total_votos_partido: total_partido,
            seats: items.length,
            color: uniq(map(items, 'color')).join('')
          }
        }), ['seats'], ['desc'])
      }
    },
    watch: {
      congresistas() {
        this.renderCongreso()
      }
    },
    mounted() {
      this.renderCongreso()
    },
    methods: {
      numeral,
      getImagePartido(c) {
        return getPartidoImage(c)
      },
      show_partidos(c) {
        this.depObject = {
          region: "NACIONAL",
          seats: 130
        }
        d3.selectAll("circle").classed("active", false)
        d3.selectAll(`circle.${c.partido_id}`).classed("active", true)
      },
      show_departamentos(d) {
        this.depSelected = d.region
        let _r = d.region.replace(" ","-").replace(" ","-").toLowerCase()
        this.depObject=d
        d3.selectAll("circle").classed("active", false)
        d3.selectAll(`circle.${_r}`).classed("active", true)
      },
      reset_congreso() {
        this.depSelected = "NACIONAL (130)"
        this.depObject = {
          region: "NACIONAL",
          seats: 130
        }
        d3.selectAll("circle").classed("active", true)
      },
      show_congresista(event, d) {

        let tooltip = d3.select(".tooltip_congresista")
        let table = `<h5 class="mb-2">${d.region}</h5>`
        table += `<h3>${d.nombre}</h3>`
        table += `<h4><img width="35px" src="${this.getImagePartido(d.partido_id)}" /> ${d.partido} - Nro. ${d.nro}</h4>`
        table += `<h4>Voto preferencial del candidato: <span class="text-success">${numeral(d.voto_preferencial).format('0,0')}</span></h4>`
        table += `<h4>Total de votos de la agrupación en ${d.region}: <span class="text-success">${numeral(d.total_votos_partido).format('0,0')}</span></h4>`

        tooltip.html(`${table}`)	 
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px")
        
        tooltip.transition()
          .duration(200)	
          .style("opacity", 1)
          .style("visibility", "visible")

      },
      renderCongreso() {
        let ancho = 600,
        radius=10,
        gap=10,
        h = 25

        if(window.innerWidth < 620) {
          ancho = window.innerWidth - 100
          radius= 5
          gap = 5
          h = 15
        }
        d3.select('g#parliament').call(
          parliament.parliamentChart(this.congresistas_parse, ancho)
          .debug(false)
          .sections(3)
          .sectionGap(gap)
          .seatRadius(radius)
          .rowHeight(h)
        )

        d3.selectAll('circle')
          .attr("class", d => {
            let _r =  d.region.replace(" ","-").replace(" ","-").toLowerCase()
            return `active ${_r} ${d.partido_id}`
          })
        
        d3.selectAll('circle.active')
          .on("mouseover", (e, d) => {
            let _r =  d.region.replace(" ","-").replace(" ","-").toLowerCase()
            if(this.depSelected == "NACIONAL (130)")
              this.show_congresista(e, d)
            
            if(this.depSelected !="NACIONAL (130)" && d.region == this.depSelected)
              this.show_congresista(e, d, _r)
          })
          .on("mouseout", () => {
            let tooltip = d3.select(".tooltip_congresista")
              tooltip.transition()
                .duration(150)	
                .style("opacity", 0)
                .style("visibility", "hidden")
          })
      }
    }
  }

</script>