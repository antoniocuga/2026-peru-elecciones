<template>
  <div class="row congreso-grafico">    
    <div class="col-12 col-md-6 col-lg-5 order-md-0 order-1">       
      <BTabs>
        <BTab title="Diputados por partido">     
          <div class="list-resultados-partidos p-3">
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
          <div class="list-resultados-partidos p-3">
            <div class="row pb-3" v-if="senadores_partido.length">
              <div class="col-12" :key="'s-' + c.partido_id" v-for="c in senadores_partido">
                <div @mouseover="show_partidos(c)" @mouseout="reset_congreso()" class="row candidate-info align-self-center pt-2 pb-2 item-partido">
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
          <BDropdown :text="`${depObject.region} (${depObject.seats})`" variant="secondary" class="m-2 departamento-menu">
            <BDropdownItem @click="reset_congreso()">
              NACIONAL (130)
            </BDropdownItem>
            <BDropdownItem @click="show_departamentos(d)" :key="d.region" v-for="d in departamentos">
              {{ d.region}} ({{ d.seats }})
            </BDropdownItem>
          </BDropdown>
        </div>
        <div class="col-12 mb-2" v-if="departamentos_conteo == 0">
          <h5>60 senadores</h5>
        </div>
        <svg class="svg-congreso" ref="svgCongreso" :viewBox="`0 0 ${svgSize.width} ${svgSize.height}`" preserveAspectRatio="xMidYMid meet">
          <g id="parliament-senado"></g>
          <g id="parliament-congreso"></g>
          <g id="parliament-labels"></g>
        </svg>
        <div class="col-12 mb-2" v-if="departamentos_conteo == 0">
          <h5>130 congresistas</h5>
        </div>
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
  import {
    acquireCongresoBodyTooltip,
    releaseCongresoBodyTooltip,
    CONGRESO_TOOLTIP_ID,
  } from '../utils/congresoTooltip'

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
        },
        svgSize: { width: 600, height: 300 }
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
      },
      senadores_parse_60() {
        if (!this.senadores || !this.senadores.length) return []
        const all = orderBy(
          [...this.senadores],
          ['partido_id', 'voto_preferencial'],
          ['asc', 'desc']
        )
        const n = all.length
        if (n >= 60) return all.slice(0, 60)
        const repeated = []
        for (let i = 0; i < 60; i++) {
          repeated.push({ ...all[i % n], _idx: i })
        }
        return repeated
      }
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
      this.renderCongreso()
    },
    beforeUnmount() {
      releaseCongresoBodyTooltip()
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
        const tooltip = d3.select(`#${CONGRESO_TOOLTIP_ID}`)
        let table = ''
        if (d.senado_tipo) {
          table = `<h5 class="mb-2">Senado (${d.region || 'NACIONAL'})</h5>`
          table += `<h3>${d.nombre}</h3>`
          table += `<h4><img width="35px" src="${this.getImagePartido(d.partido_id)}" /> ${d.partido}</h4>`
          table += `<h4>Voto preferencial: <span class="text-success">${numeral(d.voto_preferencial).format('0,0')}</span></h4>`
        } else {
          table = `<h5 class="mb-2">${d.region}</h5>`
          table += `<h3>${d.nombre}</h3>`
          table += `<h4><img width="35px" src="${this.getImagePartido(d.partido_id)}" /> ${d.partido} - Nro. ${d.nro}</h4>`
          table += `<h4>Voto preferencial del candidato: <span class="text-success">${numeral(d.voto_preferencial).format('0,0')}</span></h4>`
          table += `<h4>Total de votos de la agrupación en ${d.region}: <span class="text-success">${numeral(d.total_votos_partido).format('0,0')}</span></h4>`
        }
        tooltip.html(table)
          .style('left', `${event.clientX}px`)
          .style('top', `${event.clientY - 28}px`)
        tooltip.transition()
          .duration(200)
          .style('opacity', 1)
          .style('visibility', 'visible')
      },
      renderCongreso() {
        const el = this.$refs.svgCongreso
        const maxW = 640
        const minW = 320
        let ancho = el && el.getBoundingClientRect
          ? Math.min(maxW, Math.max(minW, el.getBoundingClientRect().width || 600))
          : 600
        const isMobile = ancho < 420
        const height = isMobile ? ancho * 0.65 : ancho / 2
        this.svgSize = { width: ancho, height }

        let gap = 5
        let h = isMobile ? 10 : 15

        const innerFactor = isMobile ? 0.82 : 0.72
        const innerAncho = Math.round(ancho * innerFactor)
        const offset = (ancho - innerAncho) / 2

        // Outer ring: 60 senadores (senado) — responsive seat size
        const radiusSenado = Math.max(6, Math.min(13, ancho * (isMobile ? 0.02 : 0.018)))
        const rowHeightSenado = radiusSenado * (isMobile ? 2.0 : 2.3)
        const gapSenado = gap + 14
        const gSenado = d3.select('g#parliament-senado')
        gSenado.selectAll('*').remove()
        gSenado.call(
          parliament.parliamentChart(this.senadores_parse_60, ancho)
            .debug(false)
            .sections(3)
            .sectionGap(gapSenado)
            .seatRadius(radiusSenado)
            .rowHeight(rowHeightSenado)
        )

        // Inner ring: 130 congresistas; position inside the outer semicircle
        // Congreso proportions: ~60% of Senado seat sizing (with a minimum radial gap)
        const MIN_RADIAL_GAP = 2
        const rawInnerRadius = radiusSenado * 0.8
        const radiusCongreso = Math.max(
          4,
          Math.min(9, rawInnerRadius, radiusSenado - MIN_RADIAL_GAP)
        )
        const rowHeightCongreso = Math.max(10, rowHeightSenado * 0.8)
        const gCongreso = d3.select('g#parliament-congreso')
          .attr('transform', `translate(${offset}, ${offset})`)
        gCongreso.selectAll('*').remove()
        gCongreso.call(
          parliament.parliamentChart(this.congresistas_parse, innerAncho)
            .debug(false)
            .sections(3)
            .sectionGap(gap)
            .seatRadius(radiusCongreso)
            .rowHeight(rowHeightCongreso)
        )

        

        // Classes and events for all circles (senado + congreso)
        d3.selectAll('.svg-congreso circle')
          .attr("class", function (d) {
            if (d.senado_tipo) {
              return `active seat-senado ${(d.region || '').toString().replace(/\s/g, '-').toLowerCase()} ${d.partido_id}`
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
            if (this.depSelected === "NACIONAL (130)")
              this.show_congresista(e, d)
            else if (d.region === this.depSelected)
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