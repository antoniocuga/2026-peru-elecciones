<template>
  <div class="row congreso-grafico">
    <div class="col-12 pt-2">
      <div class="partidos-embed-list-top">
        <div class="item-partido-embed-top" :key="c.candidato_id" v-for="c in congresistas_partido">
          <img :src="getImagePartido(c.partido_id)" />
          <h5 class="elegidos d-flex align-self-center">{{ c.seats }}</h5>
        </div>
      </div>
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

  export default {
    name: 'congresoTopWidget',
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
        },
        open: false
      }
    },
    computed: {
      candidatos_congreso_real() {

        if(this.depObject.region != 'NACIONAL') {
          let filtered = filter(this.congresistas_parse, ['region', this.depObject.region])
          return orderBy(filtered, ['voto_preferencial'], ['desc'])
        }

        return orderBy(this.congresistas_parse, ['voto_preferencial'], ['desc']).slice(0, 10)
      },
      candidatos_congreso_real_all() {

        if(this.depObject.region != 'NACIONAL') {
          let filtered = filter(this.congresistas_parse, ['region', this.depObject.region])
          return orderBy(filtered, ['voto_preferencial'], ['desc'])
        }

        return orderBy(this.congresistas_parse, ['voto_preferencial'], ['desc']).slice(10, this.congresistas_parse.length)
      },
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
          return {
            partido_id: p,
            partido: uniq(map(items, 'partido')).join(""),
            total_votos_partido: sum(uniq(map(items, 'total_votos_partido'))),
            seats: items.length,
            congresistas: items, 
            color: uniq(map(items, 'color')).join("")
          }
        }), ['seats'], ['desc'])
      }
    },
    methods: {
      numeral,
      getImagePartido(c) {
        return getPartidoImage(c)
      },
      show_partidos(c) {
        this.open=false
        this.depObject = {
          region: "NACIONAL",
          seats: 130
        }
        d3.selectAll("circle").classed("active", false)
        d3.selectAll(`circle.${c.partido_id}`).classed("active", true)
      },
      show_departamentos(d) {
        this.open=false
        this.depSelected = d.region
        let _r = d.region.replace(" ","-").replace(" ","-").toLowerCase()
        this.depObject=d
        d3.selectAll("circle").classed("active", false)
        d3.selectAll(`circle.${_r}`).classed("active", true)
      },
      reset_congreso() {
        this.open=false
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
        let ancho = 400,
        radius=6,
        gap=5,
        h = 15

        if(window.innerWidth < 620) {
          ancho = window.innerWidth - 100
          radius= 5
          gap = 5
          h = 15
        }
        d3.select('g#parliament-embed').call(
          parliament.parliamentChart(this.congresistas_parse, ancho)
          .debug(false)
          .sections(5)
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