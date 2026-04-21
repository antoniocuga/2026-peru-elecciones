<template>
  <div class="row congreso-grafico">
    <div class="col-12 text-center">
      <div class="congreso-sticky">
        <svg class="svg-congreso-embed">
          <g id="parliament-embed"></g>
        </svg>
        <div class="col-12 mb-2" v-if="departamentos_conteo > 0">
          <h2 class="title-resultados"><b>Conteo ONPE al {{ departamentos_conteo }}% en la región {{depSelected}}</b></h2> <h2 class="title-resultados">Última actualización: {{ departamentos_hora }}</h2>
        </div>
      </div>
    </div>
    <div class="col-12 pt-2">
      <div class="partidos-embed-list">
        <div class="item-partido-embed" :key="c.candidato_id" v-for="c in congresistas_partido">
          <img width="65px" :src="getImagePartido(c.partido_id)" />
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
  import { capitalizeWords } from '../utils/formatText'
  import * as d3 from 'd3'
  import * as parliament from 'd3-parliament-chart'
  import { filter, groupBy, map, orderBy, uniq, sum } from 'lodash'
  import {
    acquireCongresoBodyTooltip,
    releaseCongresoBodyTooltip,
    CONGRESO_TOOLTIP_ID,
    clampCongresoTooltipToViewport,
    isParliamentPlaceholderSeat,
    seatVotoPreferencial,
    tooltipInformacionNoDisponibleHtml,
  } from '../utils/congresoTooltip'
  import { joinHoras, maxConteo } from '../utils/conteoAggregate'

  export default {
    name: 'congresoGraficoEmbed',
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
        if (this.depSelected !== 'NACIONAL (130)') {
          const row = this.departamentos.find((d) => d.region === this.depSelected)
          return row ? Number(row.conteo) || 0 : 0
        }
        return 0
      },
      departamentos_hora() {
        if (this.depSelected !== 'NACIONAL (130)') {
          const row = this.departamentos.find((d) => d.region === this.depSelected)
          return row ? row.hora : ''
        }
        return ''
      },
      departamentos() {
        return orderBy(map(groupBy(this.congresistas, 'region'), (items, r) => {
          return {
            region: r,
            departamento: uniq(map(items, 'departamento')).join(""),
            hora: joinHoras(items),
            conteo: maxConteo(items),
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
          const nacionalLista = items
            .map((i) => Number(i?.total_votos_nacional_lista))
            .find((x) => Number.isFinite(x) && x > 0)
          const total_votos_partido =
            nacionalLista != null && nacionalLista > 0
              ? nacionalLista
              : sum(uniq(map(items, 'total_votos_partido')))
          return {
            partido_id: p,
            partido: uniq(map(items, 'partido')).join(""),
            total_votos_partido,
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
      acquireCongresoBodyTooltip()
      this.renderCongreso()
    },
    beforeUnmount() {
      releaseCongresoBodyTooltip()
    },
    methods: {
      numeral,
      regionTooltipLabel(region) {
        if (region == null || region === '') return ''
        return capitalizeWords(String(region).replace(/-/g, ' ').toLowerCase())
      },
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
        const tooltip = d3.select(`#${CONGRESO_TOOLTIP_ID}`)
        let table = ''
        if (isParliamentPlaceholderSeat(d)) {
          table = tooltipInformacionNoDisponibleHtml()
        } else {
          const reg = this.regionTooltipLabel(d.region)
          table = `<h5 class="mb-2">${reg}</h5>`
          table += `<h3>${d.nombre}</h3>`
          table += `<h4><img width="35px" src="${this.getImagePartido(d.partido_id)}" /> ${d.partido} - Nro. ${d.nro}</h4>`
          table += `<h4>Voto preferencial del candidato: <span class="text-success">${numeral(seatVotoPreferencial(d)).format('0,0')}</span></h4>`
          table += `<h4>Total de votos de la agrupación en ${reg}: <span class="text-success">${numeral(d.total_votos_partido).format('0,0')}</span></h4>`
        }

        tooltip.html(table)
          .style('visibility', 'visible')
          .style('opacity', 0)
        const node = tooltip.node()
        if (node) {
          clampCongresoTooltipToViewport(node, event.clientX, event.clientY, 28)
        }
        tooltip.transition()
          .duration(200)
          .style('opacity', 1)
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
            
            if (this.depSelected !== 'NACIONAL (130)' && d.region === this.depSelected)
              this.show_congresista(e, d)
          })
          .on('mouseout', () => {
            d3.select(`#${CONGRESO_TOOLTIP_ID}`)
              .transition()
              .duration(150)
              .style('opacity', 0)
              .style('visibility', 'hidden')
          })
      }
    }
  }

</script>