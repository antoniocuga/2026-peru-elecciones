<template>
  <div class="row congreso-grafico">
    <div class="col-12 text-center">
      <svg height="320px" width="640px">
        <g id="parliament"></g>
      </svg>
    </div>
    <div class="filters col-12 text-center">
      <b-dropdown text="Nacional" variant="dark" class="m-2 departamento-menu">
        <b-dropdown-item @click="show_departamentos(d)" :key="d.region" v-for="d in departamentos">
          {{ d.departamento}}
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="col-12 resultados2021">
      <div class="mapa-resultados-wrapper">
          <PartidosResultados :candidatos="congresistas_partido" />
      </div>          
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import * as d3 from 'd3'
  import * as parliament from 'd3-parliament-chart'
  import { groupBy, map, orderBy, uniq } from 'lodash'
  import PartidosResultados from '../components/PartidosResultados.vue'

  export default {
    name: 'congresoGrafico.vue',
    components: {
      PartidosResultados
    },
    computed: {
      ...mapState({
        congresistas: state => state.candidatos.congresistas
      }),
      departamentos() {
        return map(groupBy(this.congresistas, 'region'), (items, r) => {
          return {
            region: r,
            departamento: uniq(map(items, 'departamento')).join(""),
            seats: items.length,
            congresistas: items
          }
        })
      },
      congresistas_partido() {
        return orderBy(map(groupBy(this.congresistas, 'partido_id'), (items, p) => {
          return {
            partido_id: p,
            partido: uniq(map(items, 'partido')).join(""),
            seats: items.length,
            congresistas: items, 
            color: uniq(map(items, 'color')).join("")
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
      getImagePartido(c) {
        try {
          return require(`../assets/partidos/${c}.png`) 
        } catch (error) {
          return require(`../assets/partidos/blanco-viciado.png`)
        }
      },
      show_departamentos(d) {
        d3.selectAll("circle").classed("inactive", true)
        
        d3.selectAll(`circle.${d.region}`).classed("inactive", false)
      },
      show_congresista(event, d) {

        let tooltip = d3.select(".tooltip_congresista")
        let table = `${d.nombre} (${d.nro})`
        table += `<br />`
        table += `<img width="25px" src="${this.getImagePartido(d.partido_id)}" /> ${d.partido}`
        table += `<br />`
        table += `${d.departamento}`

        tooltip.html(`${table}`)	 
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px")
      
        tooltip.transition()
          .duration(500)	
          .style("opacity", 0)
        
        tooltip.transition()
          .duration(200)	
          .style("opacity", 1)

      },
      renderCongreso() {
        d3.select('g#parliament').call(
          parliament.parliamentChart(this.congresistas, 600)
          .debug(false)
          .sections(5)
          .sectionGap(10)
          .seatRadius(10)
          .rowHeight(25)
        )

        d3.selectAll('circle')
          .attr("class", d => {
            return d.region
          })
          .on("mouseover", (e, d) => {
            this.show_congresista(e, d)
          })
      }
    }
  }

</script>