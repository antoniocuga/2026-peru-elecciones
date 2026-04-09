<template>
  <div class="row congreso-grafico">    
    <div class="col-12 col-sm-12 col-md-6 col-lg-5 order-md-0 order-1">       
      <BTabs>
        <BTab>
          <template #title>
            <span class="d-inline-flex align-items-center gap-1">
              Diputados por partido
            </span>
          </template>
          <div class="list-resultados-partidos p-3">
            <div class="row pb-3">
              <div class="col-12" :key="c.partido_id" v-for="c in congresistasPartidoForList">
                <div @mouseover="show_partidos(c)" @mouseout="reset_congreso()" class="row candidate-info align-self-center pt-2 pb-2 item-partido">
                  <div class="col-auto pr-1 img-candidato">
                    <div
                      v-if="isCongresoPartyListPlaceholder(c)"
                      class="congreso-grafico__party-placeholder rounded-circle border border-3"
                      role="img"
                      aria-hidden="true"
                    />
                    <img v-else width="65px" :src="getImagePartido(c.partido_id)" />
                  </div>
                  <div class="col-7 pl-0 pr-md-0 align-self-center" v-if="c.total_votos_partido >  0">              
                    <h4 class="candidato-mapa m-md-0">{{ capitalizeWords(c.partido) }}</h4>
                    <div class="text-secondary small light">Votos válidos: {{numeral(c.total_votos_partido).format('0,0')}}</div>
                  </div> 
                  <div v-else class="col-7 pl-0 pr-md-0 align-self-center">              
                    <div class="text-secondary small light">Información no disponible</div>
                  </div> 
                  <div class="col-auto align-self-center text-center pr-0">              
                      <h5 class="elegidos d-flex align-self-center">{{ c.seats }}</h5>
                  </div>
                </div>
              </div>
        
            </div>

          </div> 
        </BTab>        
        <BTab class="list-resultados-partidos" lazy>
          <template #title>
            <span class="d-inline-flex align-items-center gap-1">
              Senados por partidos
            </span>
          </template>
          <div class="list-resultados-partidos p-3">
            <div class="row pb-3">
              <div class="col-12" :key="'s-' + c.partido_id" v-for="c in senadoresPartidoForList">
                <div @mouseover="show_partidos(c)" @mouseout="reset_congreso()" class="row candidate-info align-self-center pt-2 pb-2 item-partido">
                  <div class="col-auto pr-1 img-candidato">
                    <div
                      v-if="isCongresoPartyListPlaceholder(c)"
                      class="congreso-grafico__party-placeholder rounded-circle border border-3"
                      role="img"
                      aria-hidden="true"
                    />
                    <img v-else width="65px" :src="getImagePartido(c.partido_id)" />
                  </div>
                  <div class="col-7 pl-0 pr-md-0 align-self-center" v-if="c.total_votos_partido >  0">              
                    <h4 class="candidato-mapa m-md-0">{{ capitalizeWords(c.partido) }}</h4>
                    <div class="text-secondary small light">Votos válidos: {{numeral(c.total_votos_partido).format('0,0')}}</div>
                  </div> 
                  <div v-else class="col-7 pl-0 pr-md-0 align-self-center">              
                    <div class="text-secondary small light">Información no disponible</div>
                   </div> 
                  <div class="col-auto align-self-center text-center pr-0">
                    <h5 class="elegidos d-flex align-self-center">{{ c.seats }}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BTab>
      </BTabs>
    </div>

    <div class="col-12 col-sm-12 col-md-6 col-lg-7 text-center">
      <div>

      <div class="congreso-sticky border-bottom pb-3">
        <!-- Mobile &lt; md: two stacked semicircles -->
        <div class="d-md-none">
          <div class="col-12 mb-2">
            <h5>{{ headingSenadoSeats }} senadores</h5>
          </div>
          <svg
            class="svg-congreso"
            ref="svgSenadoMobile"
            :viewBox="`0 0 ${svgSizeSenadoMobile.width} ${svgSizeSenadoMobile.height}`"
            preserveAspectRatio="xMidYMid meet"
          >
            <g id="parliament-senado-mobile"></g>
          </svg>
          <div class="col-12 mb-2 mt-3">
            <h5>{{ headingCongresoSeats }} congresistas</h5>
          </div>
          <svg
            class="svg-congreso"
            ref="svgCongresoMobile"
            :viewBox="`0 0 ${svgSizeCongresoMobile.width} ${svgSizeCongresoMobile.height}`"
            preserveAspectRatio="xMidYMid meet"
          >
            <g id="parliament-congreso-mobile"></g>
          </svg>
        </div>
        <!-- md+: nested semicircles in one SVG -->
        <div class="d-none d-md-block">
          <div class="col-12 mb-2">
            <h5>{{ headingSenadoSeats }} senadores</h5>
          </div>
          <svg
            class="svg-congreso"
            ref="svgCongresoDesktop"
            :viewBox="`0 0 ${svgSize.width} ${svgSize.height}`"
            preserveAspectRatio="xMidYMid meet"
          >
            <g id="parliament-senado"></g>
            <g id="parliament-congreso"></g>
            <g id="parliament-labels"></g>
          </svg>
          <div class="col-12 mb-2">
            <h5>{{ headingCongresoSeats }} congresistas</h5>
          </div>
        </div>
      </div>
      </div>
      <div class="filters-congreso mb-3 text-center">
        <span class="medium">Mostrar resultados por</span>
        <DropdownBs4
          :text="formatRegionLabel(depObject.region)"
          variant="link-dark"
          :wrapperClass="['d-inline-block', 'm-2', 'departamento-menu']"
        >
          <template #default="{ close }">
            <button type="button" class="dropdown-item" @click="close(); reset_congreso()">
              Todas las regiones
            </button>
            <button
              type="button"
              class="dropdown-item"
              :key="d.region"
              v-for="d in departamentos"
              @click="close(); show_departamentos(d)"
            >
              {{ formatRegionLabel(d.region) }}
            </button>
          </template>
        </DropdownBs4>
      </div>
      <div class="col-12 mb-2" v-if="departamentos_conteo > 0">
        <h2 class="title-resultados"><b>Conteo ONPE al {{ departamentos_conteo }}% en la región {{ formatRegionLabel(depSelected) }}</b></h2> <h2 class="title-resultados">Última actualización: {{ departamentos_hora }}</h2>
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
  import CongresoLista from './CongresoLista.vue'
  import DropdownBs4 from './DropdownBs4.vue'
  import {
    acquireCongresoBodyTooltip,
    releaseCongresoBodyTooltip,
    CONGRESO_TOOLTIP_ID,
    clampCongresoTooltipToViewport,
    PARLIAMENT_PLACEHOLDER_PARTIDO_ID,
    isParliamentPlaceholderSeat,
    tooltipInformacionNoDisponibleHtml,
  } from '../utils/congresoTooltip'
  import {
    resolveCongresoChartLayout,
    resolveSplitSenadoSvgLayout,
    resolveSplitCongresoSvgLayout,
  } from '../utils/congresoChartLayout'

  /** Match Bootstrap `md` — below this, senado + congreso render as two SVGs */
  const PARLIAMENT_SPLIT_MAX_WIDTH_PX = 840

  const REGION_NACIONAL = 'TODAS LAS REGIONES'

  const CONGRESO_TOTAL_SEATS = 130
  const SENADO_TOTAL_SEATS = 60
  const PLACEHOLDER_LIST_ROWS = 5
  /** Neutral seats when JSON / API has not loaded yet */
  const EMPTY_PARLIAMENT_COLOR = '#ADB5BD'

  function makePlaceholderCongresoSeats() {
    return Array.from({ length: CONGRESO_TOTAL_SEATS }, (_, i) => ({
      region: REGION_NACIONAL,
      departamento: '',
      nombre: 'Sin resultados',
      candidato_id: `placeholder-congreso-${i}`,
      partido: '—',
      partido_id: PARLIAMENT_PLACEHOLDER_PARTIDO_ID,
      nro: 1,
      color: EMPTY_PARLIAMENT_COLOR,
      total_votos_partido: 0,
      hora: '—',
      conteo: 0,
      voto_preferencial: 0,
      voto_fantasma: 0,
      conteo_general: 0,
    }))
  }

  function makePlaceholderSenadoSeats() {
    return Array.from({ length: SENADO_TOTAL_SEATS }, (_, i) => ({
      senado_tipo: 'nacional',
      region: 'NACIONAL',
      nombre: 'Sin resultados',
      candidato_id: `placeholder-senado-${i}`,
      partido: '—',
      partido_id: PARLIAMENT_PLACEHOLDER_PARTIDO_ID,
      nro: 1,
      color: EMPTY_PARLIAMENT_COLOR,
      total_votos_partido: 0,
      hora: '—',
      conteo: 0,
      voto_preferencial: 0,
      voto_fantasma: 0,
      conteo_general: 0,
    }))
  }

  export default {
    name: 'congresoGrafico.vue',
    components: { CongresoLista, DropdownBs4 },
    setup() {
      const store = useCandidatosStore()
      return { ...storeToRefs(store), store }
    },
    data() {
      return {
        depSelected: REGION_NACIONAL,
        depObject: {
          region: REGION_NACIONAL,
          seats: 130
        },
        svgSize: { width: 600, height: 300 },
        svgSizeSenadoMobile: { width: 320, height: 200 },
        svgSizeCongresoMobile: { width: 320, height: 220 },
        tabTooltipSenado:
          '',
      }
    },
    computed: {
      headingCongresoSeats() {
        if (this.depSelected === REGION_NACIONAL) {
          return this.congresistas?.length ? this.congresistas.length : CONGRESO_TOTAL_SEATS
        }
        const row = this.departamentos.find((d) => d.region === this.depSelected)
        return row ? row.seats : this.depObject.seats
      },
      /**
       * Senado: 60 a nivel nacional (como el gráfico). Por región, cantidad de senadores
       * en los datos con esa región.
       */
      headingSenadoSeats() {
        return SENADO_TOTAL_SEATS
      },
      departamentos_conteo() {
        if (this.depSelected !== REGION_NACIONAL)
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
      congresistasPartidoForList() {
        if (this.congresistas_partido.length) return this.congresistas_partido
        return Array.from({ length: PLACEHOLDER_LIST_ROWS }, (_, i) => ({
          partido_id: `${PARLIAMENT_PLACEHOLDER_PARTIDO_ID}-${i + 1}`,
          partido: '',
          total_votos_partido: 0,
          seats: 0,
          congresistas: [],
          color: EMPTY_PARLIAMENT_COLOR,
        }))
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
        }), ['partido', 'partido_id'], ['asc', 'asc'])
      },
      senadoresPartidoForList() {
        if (this.senadores_partido.length) return this.senadores_partido
        return Array.from({ length: PLACEHOLDER_LIST_ROWS }, (_, i) => ({
          partido_id: `${PARLIAMENT_PLACEHOLDER_PARTIDO_ID}-s-${i + 1}`,
          partido: '',
          total_votos_partido: 0,
          seats: 0,
          color: EMPTY_PARLIAMENT_COLOR,
        }))
      },
      /** Por partido (nombre + partido_id). Dentro del partido: voto preferencial y candidato_id — sin usar senado_tipo (ordenar por candidato_id mezcla nacional/regional por el prefijo en el id). */
      senadores_parse_60() {
        if (!this.senadores || !this.senadores.length) return []
        const grouped = groupBy(this.senadores, 'partido_id')
        const byParty = orderBy(
          map(grouped, (items, partido_id) => ({
            partido_id,
            partido: uniq(map(items, 'partido')).join(''),
            items: orderBy(items, ['voto_preferencial', 'candidato_id'], ['desc', 'asc']),
          })),
          ['partido', 'partido_id'],
          ['asc', 'asc']
        )
        const all = byParty.flatMap((g) => g.items)
        const n = all.length
        if (n >= SENADO_TOTAL_SEATS) return all.slice(0, SENADO_TOTAL_SEATS)
        const repeated = []
        for (let i = 0; i < SENADO_TOTAL_SEATS; i++) {
          repeated.push({ ...all[i % n], _idx: i })
        }
        return repeated
      },
      /** Semicircles: real data or gray placeholders (130 / 60 curules). */
      congresistasForChart() {
        if (this.congresistas?.length) return this.congresistas_parse
        return makePlaceholderCongresoSeats()
      },
      senadoresForChart() {
        if (this.senadores?.length) return this.senadores_parse_60
        return makePlaceholderSenadoSeats()
      },
    },
    watch: {
      congresistas() {
        this.renderCongreso()
      },
      senadores() {
        this.renderCongreso()
      }
    },
    mounted() {
      acquireCongresoBodyTooltip()
      this._onResizeParliament = () => this.renderCongreso()
      window.addEventListener('resize', this._onResizeParliament, { passive: true })
      this.renderCongreso()
    },
    beforeUnmount() {
      if (this._onResizeParliament) {
        window.removeEventListener('resize', this._onResizeParliament)
      }
      releaseCongresoBodyTooltip()
    },
    methods: {
      numeral,
      capitalizeWords,
      isParliamentPlaceholderSeat(d) {
        return isParliamentPlaceholderSeat(d)
      },
      /** List rows use partido_id `sin-resultados` or `sin-resultados-*`, not seat objects */
      isCongresoPartyListPlaceholder(c) {
        const id = c?.partido_id
        if (typeof id !== 'string') return false
        return id === PARLIAMENT_PLACEHOLDER_PARTIDO_ID || id.startsWith(`${PARLIAMENT_PLACEHOLDER_PARTIDO_ID}-`)
      },
      formatRegionLabel(region) {
        if (!region) return ''
        if (region === REGION_NACIONAL) return 'Todas las regiones'
        return capitalizeWords(String(region).replace(/-/g, ' ').toLowerCase())
      },
      getImagePartido(c) {
        return getPartidoImage(c)
      },
      isSplitParliamentCharts() {
        return typeof window !== 'undefined' && window.innerWidth < PARLIAMENT_SPLIT_MAX_WIDTH_PX
      },
      show_partidos(c) {
        this.depObject = {
          region: REGION_NACIONAL,
          seats: this.congresistas?.length || CONGRESO_TOTAL_SEATS,
        }
        d3.selectAll('.svg-congreso circle').classed('active', false)
        d3.selectAll(`.svg-congreso circle.${c.partido_id}`).classed('active', true)
      },
      show_departamentos(d) {
        this.depSelected = d.region
        let _r = d.region.replace(" ","-").replace(" ","-").toLowerCase()
        this.depObject=d
        d3.selectAll('.svg-congreso circle').classed('active', false)
        d3.selectAll(`.svg-congreso circle.${_r}`).classed('active', true)
      },
      reset_congreso() {
        this.depSelected = REGION_NACIONAL
        this.depObject = {
          region: REGION_NACIONAL,
          seats: this.congresistas?.length || CONGRESO_TOTAL_SEATS,
        }
        d3.selectAll('.svg-congreso circle').classed('active', true)
      },
      show_congresista(event, d) {
        const tooltip = d3.select(`#${CONGRESO_TOOLTIP_ID}`)
        let table = ''
        if (isParliamentPlaceholderSeat(d)) {
          table = tooltipInformacionNoDisponibleHtml()
        } else if (d.senado_tipo) {
          table = `<h5 class="mb-2 border-bottom pb-2">Senado (${this.formatRegionLabel(d.region || REGION_NACIONAL)})</h5>`
          table += `<h3>${d.nombre}</h3>`
          table += `<h4><img width="35px" src="${this.getImagePartido(d.partido_id)}" /> ${d.partido}</h4>`
          table += `<h4>Voto preferencial: <span class="text-success">${numeral(d.voto_preferencial).format('0,0')}</span></h4>`
        } else {
          table = `<h5 class="mb-2 border-bottom pb-2">${this.formatRegionLabel(d.region || REGION_NACIONAL)}</h5>`
          table += `<h3>${d.nombre}</h3>`
          table += `<h4 class="text-light"><img width="35px" src="${this.getImagePartido(d.partido_id)}" /> ${d.partido} - Nro. ${d.nro}</h4>`
          table += `<h4>Voto preferencial del candidato: <span class="text-success">${numeral(d.voto_preferencial).format('0,0')}</span></h4>`
          table += `<h4>Votos válidos de la agrupación: <span class="text-success">${numeral(d.total_votos_partido).format('0,0')}</span></h4>`
        }
        tooltip.interrupt()
        tooltip.html(table)
          .style('pointer-events', 'none')
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
        const split = this.isSplitParliamentCharts()

        const clearDesktop = () => {
          const root = this.$refs.svgCongresoDesktop
          if (!root) return
          d3.select(root).select('#parliament-senado').selectAll('*').remove()
          d3.select(root).select('#parliament-congreso').selectAll('*').remove()
        }
        const clearMobile = () => {
          const rs = this.$refs.svgSenadoMobile
          const rc = this.$refs.svgCongresoMobile
          if (rs) d3.select(rs).select('#parliament-senado-mobile').selectAll('*').remove()
          if (rc) d3.select(rc).select('#parliament-congreso-mobile').selectAll('*').remove()
        }

        if (split) {
          clearDesktop()
          const elS = this.$refs.svgSenadoMobile
          const elC = this.$refs.svgCongresoMobile
          if (!elS || !elC) return

          const wS =
            elS.getBoundingClientRect
              ? elS.getBoundingClientRect().width || null
              : null
          const wC =
            elC.getBoundingClientRect
              ? elC.getBoundingClientRect().width || null
              : null
          const LS = resolveSplitSenadoSvgLayout(wS ?? undefined)
          const LC = resolveSplitCongresoSvgLayout(wC ?? wS ?? undefined)
          this.svgSizeSenadoMobile = { ...LS.svg }
          this.svgSizeCongresoMobile = { ...LC.svg }

          const gSenadoM = d3.select(elS).select('#parliament-senado-mobile')
          gSenadoM.selectAll('*').remove()
          gSenadoM.call(
            parliament
              .parliamentChart(this.senadoresForChart, LS.ring.chartWidth)
              .debug(false)
              .sections(LS.ring.sections)
              .sectionGap(LS.ring.sectionGap)
              .seatRadius(LS.ring.seatRadius)
              .rowHeight(LS.ring.rowHeight)
          )

          const gCongresoM = d3.select(elC).select('#parliament-congreso-mobile')
          gCongresoM.selectAll('*').remove()
          gCongresoM.call(
            parliament
              .parliamentChart(this.congresistasForChart, LC.ring.chartWidth)
              .debug(false)
              .sections(LC.ring.sections)
              .sectionGap(LC.ring.sectionGap)
              .seatRadius(LC.ring.seatRadius)
              .rowHeight(LC.ring.rowHeight)
          )
        } else {
          clearMobile()
          const el = this.$refs.svgCongresoDesktop
          if (!el) return
          const measured =
            el && el.getBoundingClientRect
              ? el.getBoundingClientRect().width || null
              : null
          const L = resolveCongresoChartLayout(measured ?? undefined)
          this.svgSize = { width: L.svg.width, height: L.svg.height }

          const gSenado = d3.select(el).select('#parliament-senado')
          gSenado.selectAll('*').remove()
          gSenado.call(
            parliament
              .parliamentChart(this.senadoresForChart, L.senado.chartWidth)
              .debug(false)
              .sections(L.senado.sections)
              .sectionGap(L.senado.sectionGap)
              .seatRadius(L.senado.seatRadius)
              .rowHeight(L.senado.rowHeight)
          )

          const gCongreso = d3.select(el).select('#parliament-congreso')
          gCongreso
            .attr(
              'transform',
              `translate(${L.congreso.translate.x}, ${L.congreso.translate.y})`
            )
          gCongreso.selectAll('*').remove()
          gCongreso.call(
            parliament
              .parliamentChart(this.congresistasForChart, L.congreso.chartWidth)
              .debug(false)
              .sections(L.congreso.sections)
              .sectionGap(L.congreso.sectionGap)
              .seatRadius(L.congreso.seatRadius)
              .rowHeight(L.congreso.rowHeight)
          )
        }

        // Classes and events for all circles (senado + congreso)
        d3.selectAll('.svg-congreso circle')
          .attr("class", function (d) {
            if (d.senado_tipo) {
              return `active seat-senado ${d.partido_id}`
            }
            const _r = (d.region || '').replace(/\s/g, '-').toLowerCase()
            return `active seat-congreso ${_r} ${d.partido_id}`
          })

        d3.selectAll('.svg-congreso circle.active')
          .on("mouseover", (e, d) => {
            if (d.senado_tipo) {
              this.show_congresista(e, d)
              return
            }
            const _r = (d.region || '').replace(/\s/g, '-').toLowerCase()
            if (this.depSelected === REGION_NACIONAL)
              this.show_congresista(e, d)
            else if (d.region === this.depSelected)
              this.show_congresista(e, d)
          })
          .on('mouseout', () => {
            d3.select(`#${CONGRESO_TOOLTIP_ID}`)
              .interrupt()
              .transition()
              .duration(70)
              .style('opacity', 0)
              .on('end', function () {
                this.style.visibility = 'hidden'
              })
          })
      }
    }
  }

</script>

<style scoped>
.congreso-grafico__party-placeholder {
  width: 65px;
  height: 65px;
  min-width: 65px;
  min-height: 65px;
  max-width: 65px;
  max-height: 65px;
  box-sizing: border-box;
  flex-shrink: 0;
  background-color: #adb5bd;
  border-color: #adb5bd !important;
}
</style>
