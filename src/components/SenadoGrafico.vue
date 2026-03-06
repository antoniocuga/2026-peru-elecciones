<template>
  <div class="row congreso-grafico">
    <div v-if="!senadores.length" class="col-12 text-center py-5 text-muted">
      Cargando datos del Senado...
    </div>
    <template v-else>
    <div class="col-5 d-none d-md-block">
      <BTabs content-class="mt-3">
        <BTab title="Partidos">     
          <div class="list-resultados-partidos">
            <div class="row pb-3">
              <div class="col-12" :key="c.partido_id" v-for="c in congresistas_partido">
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
        <BTab title="Lista de senadores" class="list-resultados-partidos" lazy>
 
            <div class="row item-partido pb-2 pt-2" :key="candidato.candidato_id" v-for="candidato in candidatos_congreso_real">
              <div class="col-auto pr-1 img-candidato">
                <img width="65px" :src="getImagePartido(candidato.partido_id)" />              
              </div>
              <div class="col-7 pl-0 pr-md-0 align-self-center">              
                <div class="candidato-mapa m-md-0"><b>{{candidato.nombre}}</b></div>
                <div class="total-votos">Región: {{ candidato.region }}</div>
              </div>
              <div class="col-auto align-self-center text-center pr-0">              
                <div class=" text-success d-flex align-self-center">{{numeral(candidato.voto_preferencial).format('0,0')}}</div>
              </div>
            </div>

            <BCollapse v-model="open" id="collapse-1" class="col-12">
              <div class="row item-partido pb-2 pt-2" :key="candidato.candidato_id" v-for="candidato in candidatos_congreso_real_all">
                <div class="col-auto pr-1 img-candidato">
                  <img width="65px" :src="getImagePartido(candidato.partido_id)" />              
                </div>
                <div class="col-7 pl-0 pr-md-0 align-self-center">              
                  <div class="candidato-mapa m-md-0"><b>{{candidato.nombre}}</b></div>
                  <div class="total-votos">Región: {{ candidato.region }}</div>
                </div>
                <div class="col-auto align-self-center text-center pr-0">              
                  <div class=" text-success d-flex align-self-center">{{numeral(candidato.voto_preferencial).format('0,0')}}</div>
                </div>
              </div>
            </BCollapse>
        
            <div class="col-12 mt-3 button-more pl-0 pr-0" v-if="depObject.region == 'NACIONAL'">
              <a v-if="open==false" @click="open=!open" class="d-block btn-light text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-down" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
                </svg>
              </a>
              <a v-if="open==true" @click="open=!open" class="d-block btn-light text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-up" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"/>
                </svg>
              </a>
            </div>
            
        </BTab>
      </BTabs>
    </div>

    <div class="col-12 col-md-7 text-center">
      <div class="congreso-sticky">
        <div class="filters-congreso mb-3 text-center">
          <BDropdown :text="`${depObject.region} (${depObject.seats})`" variant="warning" class="m-2 departamento-menu">
            <BDropdownItem @click="reset_congreso()">
              NACIONAL ({{ listSource.length }})
            </BDropdownItem>
            <BDropdownItem @click="show_departamentos(d)" :key="d.region" v-for="d in departamentos">
              {{ d.region}} ({{ d.seats }})
            </BDropdownItem>
          </BDropdown>
        </div>
        <svg class="svg-congreso svg-sunburst" viewBox="0 0 640 360" ref="svgSunburst">
          <g ref="sunburst"></g>
        </svg>
        <div class="col-12 mb-2" v-if="departamentos_conteo > 0">
          <h2 class="title-resultados"><b>Conteo ONPE al {{ departamentos_conteo }}% en la región {{depSelected}}</b></h2> <h2 class="title-resultados">Última actualización: {{ departamentos_hora }}</h2>
        </div>
      </div>
    </div>

    <div class="col-12 mt-3 d-block d-md-none">
      <BTabs content-class="mt-3">
        <BTab title="Partidos">     
          <div class="list-resultados-partidos">


            <div class="row pb-3 partidos-embed-list">
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
        <BTab title="Lista de senadores" class="list-resultados-partidos" lazy>
 
          <div class="row pb-2 pt-2">
            <div class="col-2 pr-1">             
            </div>
            <div class="col-6 pl-0 pr-md-0 align-self-center">              
              <div class="candidato-mapa m-md-0"></div>
            </div>
            <div class="col-4 text-right pr-0 small text-success">              
              Voto preferencial
            </div>
          </div>

          <div class="row item-partido pb-2 pt-2" :key="candidato.candidato_id" v-for="candidato in candidatos_congreso_real">
            <div class="col-auto pr-1 img-candidato">
              <img width="65px" :src="getImagePartido(candidato.partido_id)" />              
            </div>
            <div class="col-7 pl-0 pr-md-0 align-self-center">              
              <div class="candidato-mapa m-md-0"><b>{{candidato.nombre}}</b></div>
              <div class="total-votos">Región: {{ candidato.region }}</div>
            </div>
            <div class="col-2 align-self-center text-right pr-0">              
              <div class=" text-success d-flex align-self-center">{{numeral(candidato.voto_preferencial).format('0,0')}}</div>
            </div>
          </div>

          <BCollapse v-model="open" id="collapse-1" class="col-12">
            <div class="row item-partido pb-2 pt-2" :key="candidato.candidato_id" v-for="candidato in candidatos_congreso_real_all">
              <div class="col-auto pr-1 img-candidato">
                <img width="65px" :src="getImagePartido(candidato.partido_id)" />              
              </div>
              <div class="col-7 pl-0 pr-md-0 align-self-center">              
                <div class="candidato-mapa m-md-0"><b>{{candidato.nombre}}</b></div>
                <div class="total-votos">Región: {{ candidato.region }}</div>
              </div>
              <div class="col-2 align-self-center text-right pr-0">              
                <div class=" text-success d-flex align-self-center">{{numeral(candidato.voto_preferencial).format('0,0')}}</div>
              </div>
            </div>
          </BCollapse>
      
          <div class="col-12 mt-3 button-more pl-0 pr-0" v-if="depObject.region == 'NACIONAL'">
            <a v-if="open==false" @click="open=!open" class="d-block btn-light text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-down" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
              </svg>
            </a>
            <a v-if="open==true" @click="open=!open" class="d-block btn-light text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-up" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"/>
              </svg>
            </a>
          </div>
          

        </BTab>
      </BTabs>
    </div>


    <div class="col-12 mt-3 resultados2021">      
          
    </div>
    </template>
  </div>
</template>

<script>
  import numeral from 'numeral'
  import { storeToRefs } from 'pinia'
  import { useCandidatosStore } from '../stores/candidatos'
  import { getPartidoImage } from '../utils/assets'
  import * as d3 from 'd3'
  import { filter, groupBy, map, orderBy, uniq, sum } from 'lodash'

  export default {
    name: 'SenadoGrafico',
    setup() {
      const store = useCandidatosStore()
      return { ...storeToRefs(store), store }
    },
    data() {
      return {
        depSelected: 'SENADORES (60)',
        depObject: {
          region: "NACIONAL",
          seats: 60
        },
        open: false,
        highlightedPartido: null // when hovering party in list
      }
    },
    computed: {
      listSource() {
        return Array.isArray(this.senadores) ? this.senadores : []
      },
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
        if(this.depSelected != "NACIONAL (130)" && this.depSelected != "NACIONAL (60)")
          return parseFloat(uniq(map(filter(this.departamentos, ['region', this.depSelected]), 'conteo')).join(""))

        return 0
      },
      departamentos_hora() {
        return uniq(map(filter(this.departamentos, ['region', this.depSelected]), 'hora')).join("")
      },
      departamentos() {
        return orderBy(map(groupBy(this.listSource, 'region'), (items, r) => {
          return {
            region: r,
            departamento: uniq(map(items, 'departamento')).join("") || r,
            hora: uniq(map(items, 'hora')).join(""),
            conteo: uniq(map(items, 'conteo')).join(""),
            seats: items.length,
            congresistas: items
          }
        }), ['region'], ['asc'])
      },
      congresistas_parse() {
        return orderBy(this.listSource, ['partido_id'], ['desc'])
      },
      congresistas_partido() {
        return orderBy(map(groupBy(this.listSource, 'partido_id'), (items, p) => {
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
      }
    },
    watch: {
      senadores(val) {
        if (val && val.length > 0) {
          this.depSelected = `NACIONAL (${val.length})`
          this.depObject = { region: 'NACIONAL', seats: val.length }
        }
        this.$nextTick(() => this.renderSunburst())
      },
      depObject() {
        this.$nextTick(() => this.updateSunburstHighlight())
      },
      highlightedPartido() {
        this.$nextTick(() => this.updateSunburstHighlight())
      }
    },
    mounted() {
      this.$nextTick(() => this.renderSunburst())
    },
    methods: {
      numeral,
      getImagePartido(c) {
        return getPartidoImage(c)
      },
      _chartRoot() {
        const g = this.$refs.sunburst
        return g ? d3.select(g) : null
      },
      /** Build hierarchy: Senado → Nacional | Regional → by partido → senators (same as sunburt.html) */
      buildSunburstHierarchy() {
        const data = this.listSource
        if (!data || data.length === 0) return null
        const root = {
          name: 'Senado',
          children: [
            { name: 'Nacional', tipo: 'nacional', children: [] },
            { name: 'Regional', tipo: 'regional', children: [] }
          ]
        }
        const groupBy = (arr, key) =>
          Array.from(d3.group(arr, d => d[key]), ([k, v]) => ({ key: k, values: v }))
        const nacionales = data.filter(d => d.senado_tipo === 'nacional')
        const regionales = data.filter(d => d.senado_tipo === 'regional')
        root.children[0].children = groupBy(nacionales, 'partido').map(p => ({
          name: p.key,
          tipo: 'nacional',
          children: p.values
        }))
        root.children[1].children = groupBy(regionales, 'partido').map(p => ({
          name: p.key,
          tipo: 'regional',
          children: p.values
        }))
        return root
      },
      nodeColor(d) {
        const obj = d.data
        if (!d.children && obj.color) return obj.color
        if (obj.children && obj.children[0] && obj.children[0].color)
          return obj.children[0].color
        if (obj.name === 'Nacional') return '#e0f3ff'
        if (obj.name === 'Regional') return '#ffe9e0'
        return '#ddd'
      },
      /** True if this node (or any descendant) belongs to selected region / party filter */
      isNodeHighlighted(node) {
        const region = this.depObject?.region
        const party = this.highlightedPartido
        if (!node.regions) return true
        const inRegion = !region || region === 'NACIONAL' || node.regions.has(region)
        const inParty = !party || node.partidos?.has(party)
        return inRegion && inParty
      },
      updateSunburstHighlight() {
        const root = this._chartRoot()
        if (!root) return
        root.selectAll('path.arc-senado')
          .attr('opacity', d => this.isNodeHighlighted(d) ? 1 : 0.2)
          .attr('stroke-width', d => this.isNodeHighlighted(d) ? 2 : 1)
      },
      show_partidos(c) {
        this.open = false
        this.depObject = { region: 'NACIONAL', seats: this.listSource.length }
        this.highlightedPartido = c?.partido_id ?? null
        this.updateSunburstHighlight()
      },
      show_departamentos(d) {
        this.open = false
        this.depSelected = d.region
        this.depObject = d
        this.highlightedPartido = null
        this.updateSunburstHighlight()
      },
      reset_congreso() {
        this.open = false
        const total = this.listSource.length
        this.depSelected = `NACIONAL (${total})`
        this.depObject = { region: 'NACIONAL', seats: total }
        this.highlightedPartido = null
        this.updateSunburstHighlight()
      },
      showSunburstTooltip(event, d) {
        const tooltip = d3.select('.tooltip_senado')
        const dd = d.data
        let html = ''
        // Leaf = candidate (same tooltip as congresoGrafico: name, party, logo, votos)
        if (!d.children || d.children.length === 0) {
          const region = dd.region != null ? dd.region : ''
          const nombre = dd.nombre != null ? dd.nombre : ''
          const partidoId = dd.partido_id != null ? dd.partido_id : ''
          const partido = dd.partido != null ? dd.partido : ''
          const nro = dd.nro != null ? dd.nro : ''
          const preferencial = numeral(dd.voto_preferencial != null ? dd.voto_preferencial : 0).format('0,0')
          const totalPartido = numeral(dd.total_votos_partido != null ? dd.total_votos_partido : 0).format('0,0')
          html = `<h5 class="mb-2">${region}</h5>`
          html += `<h3>${nombre}</h3>`
          html += `<h4><img width="35px" src="${this.getImagePartido(partidoId)}" /> ${partido} - Nro. ${nro}</h4>`
          html += `<h4>Voto preferencial del candidato: <span class="text-success">${preferencial}</span></h4>`
          html += `<h4>Total de votos de la agrupación en ${region}: <span class="text-success">${totalPartido}</span></h4>`
        } else if (d.children && d.children.length) {
          const n = d.value ?? d.children.length
          html = `<strong>${dd.name || 'Grupo'}</strong><br>${n} senador${n !== 1 ? 'es' : ''}`
        } else {
          html = `<strong>${dd.name || ''}</strong>`
          if (dd.tipo) html += `<br>Tipo: ${dd.tipo}<br>Región: ${dd.region || '-'}<br>Partido: ${dd.partido || '-'}`
        }
        tooltip.html(html)
          .style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 28) + 'px')
        tooltip.transition().duration(200).style('opacity', 1).style('visibility', 'visible')
      },
      hideSunburstTooltip() {
        d3.select('.tooltip_senado')
          .transition().duration(150).style('opacity', 0).style('visibility', 'hidden')
      },
      renderSunburst() {
        const g = this.$refs.sunburst
        if (!g) return
        const rootSel = d3.select(g)
        const data = this.listSource
        if (!data || data.length === 0) {
          rootSel.selectAll('*').remove()
          return
        }

        const hierarchyRoot = this.buildSunburstHierarchy()
        if (!hierarchyRoot) return

        const width = 640
        const height = 360
        const radius = Math.min(width, height * 2) / 2 - 10

        rootSel.selectAll('*').remove()
        const g2 = rootSel.append('g').attr('transform', `translate(${width / 2},${height})`)

        const partition = d3.partition().size([Math.PI, radius])
        const rootNode = d3.hierarchy(hierarchyRoot)
          .sum(d => d.children ? 0 : 1)
          .sort((a, b) => d3.ascending(a.data.name, b.data.name))
        partition(rootNode)

        rootNode.descendants().forEach(d => {
          const scale = d3.scaleLinear().domain([0, Math.PI]).range([-Math.PI / 2, Math.PI / 2])
          d.x0s = scale(d.x0)
          d.x1s = scale(d.x1)
        })

        rootNode.each(node => {
          if (node.children) {
            node.regions = new Set(node.children.flatMap(c => c.regions ? [...c.regions] : []))
            node.partidos = new Set(node.children.flatMap(c => c.partidos ? [...c.partidos] : []))
          } else {
            node.regions = new Set([node.data.region].filter(Boolean))
            node.partidos = new Set([node.data.partido_id].filter(Boolean))
          }
        })

        const arc = d3.arc()
          .startAngle(d => d.x0s)
          .endAngle(d => d.x1s)
          .innerRadius(d => d.y0)
          .outerRadius(d => d.y1)

        g2.selectAll('path')
          .data(rootNode.descendants().filter(d => d.depth > 0))
          .join('path')
          .attr('class', 'arc-senado')
          .attr('d', arc)
          .attr('fill', d => this.nodeColor(d))
          .attr('stroke', '#fff')
          .attr('stroke-width', 1)
          .style('cursor', 'pointer')
          .on('mousemove', (event, d) => this.showSunburstTooltip(event, d))
          .on('mouseout', () => this.hideSunburstTooltip())

        g2.append('g').attr('pointer-events', 'none')
          .selectAll('text')
          .data(rootNode.descendants().filter(d => d.depth === 1))
          .join('text')
          .attr('class', 'label label-sunburst-senado')
          .attr('transform', d => {
            const angle = (d.x0s + d.x1s) / 2
            const r = (d.y0 + d.y1) / 2
            const x = Math.cos(angle) * (r + 20)
            const y = Math.sin(angle) * (r + 20)
            return `translate(${x},${y})`
          })
          .attr('text-anchor', 'middle')
          .attr('font-size', '11px')
          .attr('fill', '#333')
          .text(d => d.data.name)

        this.$nextTick(() => this.updateSunburstHighlight())
      }
    }
  }

</script>

<style scoped>
.svg-sunburst {
  display: block;
  max-width: 640px;
  height: 360px;
  margin: 0 auto;
}
.svg-sunburst :deep(.arc-senado) {
  cursor: pointer;
  transition: opacity 0.15s ease, stroke-width 0.15s ease;
}
.svg-sunburst :deep(.arc-senado:hover) {
  stroke-width: 2;
  stroke: #333;
}
.svg-sunburst :deep(.label-sunburst-senado) {
  pointer-events: none;
}
</style>