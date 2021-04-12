<template>
  <div class="row congreso-grafico">
    <div class="col-12 mb-2">
      <h2 class="title-resultados"><b>Conteo ONPE al 10% a nivel nacional</b> (Última actualización: 12:00 p.m. del 12 de abril)</h2>
    </div>
    <div class="filters-congreso col-12 mb-3 text-center">
      <b-dropdown :text="depSelected" variant="warning" class="m-2 departamento-menu">
        <b-dropdown-item @click="reset_congreso()">
          NACIONAL
        </b-dropdown-item>
        <b-dropdown-item @click="show_departamentos(d)" :key="d.region" v-for="d in departamentos">
          {{ d.departamento}}
        </b-dropdown-item>
      </b-dropdown>
    </div>

    <div class="col-12 text-center">
      <svg class="svg-congreso">
        <g id="parliament"></g>
      </svg>
    </div>

    <div class="col-12 mt-3 resultados2021">      
      <div class="list-resultados-partidos">
        <div class="row pb-3 justify-content-center">
          <div class="col-12 col-md-10 mr-md-5"><h2 class="text-center title-partidos-curules">Total de curules por partidos</h2></div>
          <div class="col-12 col-md-5 mr-md-5" :key="c.candidato_id" v-for="c in congresistas_partido">
            <div @mouseover="show_partidos(c)" @mouseout="reset_congreso()" class="row candidate-info align-self-center pt-2 pb-2 item-partido">
              <div class="col-auto pr-1 img-candidato">
                <img width="65px" :src="getImagePartido(c.partido_id)" />              
              </div>
              <div class="col-7 pl-0 pr-md-0 align-self-center">              
                <h4 class="candidato-mapa m-md-0">{{c.partido}}</h4>
                <div class="total-votos">Total de votos: 1,545,224</div>
              </div> 
              <div class="col-auto align-self-center text-center pr-0">              
                  <h5 class="elegidos d-flex align-self-center">{{ c.seats }}</h5>
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
  import * as d3 from 'd3'
  import * as parliament from 'd3-parliament-chart'
  import { groupBy, map, orderBy, uniq } from 'lodash'

  export default {
    name: 'congresoGrafico.vue',
    data() {
      return {
        depSelected: 'NACIONAL'
      }
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
      show_partidos(c) {
        d3.selectAll("circle").classed("active", false)
        d3.selectAll(`circle.${c.partido_id}`).classed("active", true)
      },
      show_departamentos(d) {
        this.depSelected = d.departamento
        d3.selectAll("circle").classed("active", false)
        d3.selectAll(`circle.${d.region}`).classed("active", true)
      },
      reset_congreso() {
        this.depSelected = "NACIONAL"
        d3.selectAll("circle").classed("active", true)
      },
      show_congresista(event, d) {

        let tooltip = d3.select(".tooltip_congresista")
        let table = `<h3>Nro. ${d.nro} - ${d.nombre}</h3>`
        table += `<h4><img width="25px" src="${this.getImagePartido(d.partido_id)}" /> ${d.partido}</h4>`
        table += `<h5>Región: ${d.departamento}</h5>`

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
          parliament.parliamentChart(this.congresistas, ancho)
          .debug(false)
          .sections(5)
          .sectionGap(gap)
          .seatRadius(radius)
          .rowHeight(h)
        )

        d3.selectAll('circle')
          .attr("class", d => {
            return `active ${d.region} ${d.partido_id}`
          })
        
        d3.selectAll('circle.active')
          .on("mouseover", (e, d) => {
            if(this.depSelected == "NACIONAL")
              this.show_congresista(e, d)
            
            if(this.depSelected !="NACIONAL" && d.departamento == this.depSelected)
              this.show_congresista(e, d)
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