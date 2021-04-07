<template>

  <div class="mapa-resultados-container">
    <div class="row filter-block">
      <div class="col-12 text-right">
        
        <b-dropdown :text="partidoSeleccionado.partido_id" variant="outline-dark" class="m-2 departamento-menu">
          <b-dropdown-item :key="p.partido_id" v-for="p in partidos">
            <a @click="show_partido(p.partido_id)">{{ p.partido_id }}</a>
          </b-dropdown-item>
        </b-dropdown>

        <b-dropdown :text="regionSeleccionada.region" variant="outline-dark" class="m-2 departamento-menu">
          <b-dropdown-item :key="dep.region" v-for="dep in departamentos">
            <a @click="show_departamento(dep.region)">{{ dep.region }}</a>
          </b-dropdown-item>
        </b-dropdown>

      </div>
    </div>
    <div class="row">
      <div class="col-12 text-right">
        <svg width="100%" :height="height" class="plan-vector-map" ref="svgmap">
          <g ref="base"></g>
          <g ref="departamentos"></g>
          <g ref="distritos"></g>
          <g ref="labels"></g>
        </svg>
        <button type="button" @click="resetPartidos()" class="btn-back btn active btn-secondary" v-if="partidoSeleccionado.partido_id!='SELECCIONAR PARTIDO'">Ver todos los partidos</button>
        <button type="button" @click="resetPresidente()" class="btn-back btn active btn-secondary" v-if="zoomed==true"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bar-chart-fill" viewBox="0 0 16 16">
          <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z"/>
        </svg> Todos los resultados</button>
      </div>
    </div>
    
  </div>
</template>

<script>

  import { geoMercator } from 'd3-geo'
  import numeral from 'numeral'
  import { mapState, mapActions } from 'vuex'
  import * as d3 from 'd3'
  import { feature } from 'topojson'
  import { find, filter, map, maxBy, minBy, orderBy, sumBy, groupBy, uniq } from 'lodash'  

  export default {
    name: "MapaDepartamentos",
    data() {
      return {
        openMenu: false,
        width: 720,
        height: 720,
        center: [],
        scale: 1500,
        distance: 0,
        bounds: [],
        center_device: [],
        zoomed: false
      }
    },
    mounted() {
      this.renderMapa()
    },
    props: {
      lista_candidatos: Array
    },
    watch: {
      candidatos() {
        this.renderMapa()
      },
      partidoSeleccionado(v) {
        console.log(v)
        let max = maxBy(this.departamentos, 'total_departamento')
        let min = minBy(this.departamentos, 'total_departamento')

        let color = d3.scaleLinear().domain([min.total_departamento, max.total_departamento]).range(["#eaeaea", `${max.winner.color}ab`])

        let base = d3.select(this.$refs['svgmap'])
        
        if(v.partido_id != 'SELECCIONAR PARTIDO') {

          base.selectAll('path.departamento-path')        
          .attr("style", (f) => {
            let dep = find(this.departamentos, d => d.region == f.properties.dep_id)
            if(dep)
              return `fill: ${color(dep.winner.total_departamento)}`
          })
          


        } else {
          console.log('todos')
          base.selectAll('path.departamento-path')
          .attr("style", (f) => {
            let dep = find(this.departamentos, d => d.region == f.properties.dep_id)
            if(dep)
              return `fill: ${dep.winner.color}ab;`
          })
        }

      },
      regionSeleccionada(v) {
        this.transitionPath()

        if(v.region !='NACIONAL') {
          this.getAllDistritos(v)

          d3.selectAll('path.departamento-path').classed('inactive', true)
          d3.select(`path.${v.region}-path`).classed('inactive', true)

          d3.selectAll('text.departamento-label').classed('active', false)
          d3.select(`text.${v.region}-label`).classed('active', true)
        }
      }
    },
    computed: {
      ...mapState({
        candidatos: state => state.candidatos.todos,
        regionSeleccionada: state => state.candidatos.regionSeleccionada,
        partidoSeleccionado: state => state.candidatos.partidoSeleccionado,
        distritos: state => state.candidatos.distritos,
      }),
      partidos() {
        return orderBy(map(groupBy(this.candidatos, 'partido_id'), (item, partido_id) => {
          return {
            partido_id: partido_id,
            departamentos: groupBy(item, 'region')
          }
        }), ['departamento'])
      },
      distritos_parse() {
        return orderBy(map(groupBy(this.distritos, 'ubigeo'), (item, ubigeo) => {
          return {
            ubigeo: ubigeo,
            distrito: uniq(map(item, 'distrito')).join(''),
            provincia: uniq(map(item, 'provincia')).join(''),
            departamento: uniq(map(item, 'departamento')).join(''),
            total_departamento: sumBy(map(item, 'total_votos')),
            candidatos: orderBy(item, ['total_votos'], ['desc']),
            winner: maxBy(item, 'total_votos')
          }
        }), ['departamento'])
      },
      departamentos() {
        let filtered = filter(this.candidatos, c => c.candidato_id != '')
        return orderBy(map(groupBy(filtered, 'region'), (item, region) => {
          return {
            region: region,
            departamento: uniq(map(item, 'region')).join(''),
            total_departamento: parseFloat(sumBy(map(item, 'total_departamento'))),
            candidatos: orderBy(item, ['total_departamento'], ['desc']),
            geodata: require(`../data/mapas/${region}.json`),
            winner: maxBy(item, 'total_departamento')
          }
        }), ['departamento'])
      },
      projection () {
        return geoMercator()
          .translate([this.width/2, this.height/2])
          .scale(this.scale)
      },
      path () {
        return d3.geoPath().projection(this.projection)
      },
      perugeo() {
        return require(`../data/mapas/perugeo.json`)
      },
      tooltip() {
        return d3.select("div.tooltip")
      }
    },
    methods: {
      ...mapActions('candidatos', [
        'updateRegionSeleccionada',
        'updatePartidoSeleccionado',
        'getAllDistritos'
      ]),
      resetPartidos() {
        console.log("reset partidos")
        this.updatePartidoSeleccionado({partido_id: 'SELECCIONAR PARTIDO'})
      },
      resetPresidente() {
        this.updateRegionSeleccionada({region:'NACIONAL'})
        this.zoomed = false
      },
      openDepartamentos() {
        this.openMenu = !this.openMenu        
      },
      show_partido(partido_id) {
        this.updateRegionSeleccionada({region: 'NACIONAL'})
        this.updatePartidoSeleccionado({partido_id: partido_id})
      },
      show_departamento(id) {
        let dep = find(this.departamentos, d => d.region == id)
        this.updateRegionSeleccionada(dep)
      },
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
          return require(`../assets/candidatos/otros.png`)
        }
      },
      transitionPath() {
        let base = d3.select(this.$refs['svgmap'])
        let center, scale
        
        if(this.regionSeleccionada.region != 'NACIONAL') {
          let dep = find(this.perugeo.features, d => d.properties.dep_id == this.regionSeleccionada.region)
          center = dep.properties.center
          scale = dep.properties.scale
        } else if(this.regionSeleccionada.region == 'NACIONAL') {
          center = d3.geoCentroid(this.perugeo)
          scale = this.width / this.distance / Math.sqrt(1)
        }

        const r = d3.interpolate(this.center, center)
        const s = d3.interpolate(this.scale, scale)

        base.selectAll('path.departamento-path')
          .transition()
          .duration(1000)
          .attrTween('d', (d) => {
            return (t) => {
              this.projection
                .scale(s(Math.pow(t,2)))                    
                .center(r(Math.pow(t,0.33)))
                .translate(this.center_device)                    
                
                this.path.projection(this.projection)

              return this.path(d)
            }
          })
          .on('start', () => {
            base
              .selectAll('text.departamento-label')
              .classed('inactive', true)

            base.selectAll('path.distrito-path').remove()
            
            d3.select(".candidate-results-vivo").style("opacity", 0)
            d3.select(".candidate-results-vivo").classed("active", false)
          })
          .on('end', () => {
            this.scale = scale
            this.center = center
            if(this.regionSeleccionada.region != 'NACIONAL') {
              this.renderLabels()
              this.render_distritos()
              d3.select(".candidate-results-vivo").style("opacity", 1)
              d3.select(".candidate-results-vivo").classed("active", true)
              this.zoomed = true
            } else if(this.regionSeleccionada.region == 'NACIONAL') {
              base.selectAll('path.departamento-path').classed('inactive', false)
              d3.select(".candidate-results-vivo").style("opacity", 1)
              d3.select(".candidate-results-vivo").classed("active", true)
            }
          })
      },
      renderMapa() {


        let base = d3.select(this.$refs['base'])

        this.bounds = d3.geoBounds(this.perugeo)
        
        this.center = d3.geoCentroid(this.perugeo)

        // Compute the angular distance between bound corners
        this.distance = d3.geoDistance(this.bounds[0], this.bounds[1])

        if(window.innerWidth < 719) {
          this.width = 360
          this.height = 450
          this.center_device =  [this.width/2.2, this.height / 2]
          this.scale = this.width * 1.4 / this.distance / Math.sqrt(1)
        } else if(window.innerWidth > 720) {
          this.width = 720
          this.height = 720
          this.center_device =  [this.width/.99, this.height / 2.2]
          this.scale = this.width / this.distance / Math.sqrt(1)
        }

        this.projection
          .translate(this.center_device)
          .center(this.center)
          .scale(this.scale)
        
        base.selectAll('path.departamento-path').remove()

        base.selectAll('path.departamento-path')
          .data(this.perugeo.features)
          .enter()
          .append('path')
          .attr('d',this.path)

          .attr('class', d => {
            return `departamento-path ${d.properties.dep_id}-path`
          })
          .attr('id', d => {
            return `${d.properties.dep_id}`
          })
          .attr("style", (f) => {
            let dep = find(this.departamentos, d => d.region == f.properties.dep_id)
            if(dep)
              return `fill: ${dep.winner.color}ab;`
          })
          .on("click", (event, f) => {
            
            let dep = find(this.departamentos, d => d.region == f.properties.dep_id)   

            if(window.innerWidth > 798 && this.zoomed == false) {
              this.updateRegionSeleccionada(dep)
            }
            
          })
          .on("mouseover", (event, f) => {
            if(window.innerWidth > 798 && this.zoomed == false) {
              let dep = find(this.departamentos, d => d.region == f.properties.dep_id)
              let table = this.load_tooltip(dep, f)
              this.tooltip.html(`${table}`)	 
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px")
            
              this.tooltip.transition()
                .duration(500)	
                .style("opacity", 0)
              
              this.tooltip.transition()
                .duration(200)	
                .style("opacity", 1)
            }
          })
          .on("mouseout", () => {
            if(window.innerWidth > 798) {
              this.tooltip.transition()
                .duration(500)	
                .style("opacity", 0)
            }
          })

          let labelsGroup = d3.select(this.$refs['labels'])
          labelsGroup
              .selectAll('text')
              .data(this.perugeo.features)
              .enter()
              .append('text')
              .attr('class', d => {
                return `departamento-label inactive ${d.properties.dep_id}-label`
              })
              .text(d => {
                return d.properties.NOMBDEP
              })
      },
      renderLabels() {
        let base = d3.select(this.$refs['labels'])

        base
          .selectAll('text.departamento-label')
          .attr('transform', d => {
            const translate = this.projection(d.properties.center)
            if(!isNaN(translate[0]))
              return `translate(${translate})`
          })
          .classed('inactive', false)
      },
      render_distritos() {

        let base = d3.select(this.$refs['base'])

        let features_distrito = feature(this.regionSeleccionada.geodata, this.regionSeleccionada.geodata.objects[this.regionSeleccionada.region])

        base.selectAll('path.distrito-path').remove()

        base.selectAll('path.distrito-path')
          .data(features_distrito.features)
          .enter()
          .append('path')
          .attr('d',this.path)
          .attr('class', 'distrito-path')
          .attr("style", (f) => {
            let dep = find(this.distritos_parse, d => d.ubigeo == f.properties.IDDIST)
            if(dep)
              return `fill: ${dep.winner.color}ab;`
          })
          .on("mouseover", (event, f) => {
            if(window.innerWidth > 798) {
              console.log(f)
              let dep = find(this.distritos, d => d.ubigeo == f.properties.ubigeo)
              let table = this.load_tooltip(dep, f)
              this.tooltip.html(`${table}`)	 
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px")
            
              this.tooltip.transition()
                .duration(500)	
                .style("opacity", 0)
              
              this.tooltip.transition()
                .duration(200)	
                .style("opacity", 1)
            }
          })
          .on("mouseout", () => {
            if(window.innerWidth > 798) {
              this.tooltip.transition()
                .duration(500)	
                .style("opacity", 0)
            }
          })
      },
      load_tooltip(dep, f) {

        let candidatos = ``
        let name = f.properties.NOMBDEP

        let table = ``

        if(dep && this.zoomed==false) {
          table = `
            <div class="row border-bottom pb-2 mb-2">
              <div class="col-6 depa"><b>${name}</b></div>
              <div class="col-6 text-right">Conteo al 67%</div>
            </div>`


          let list = orderBy(dep.candidatos, ['total_departamento'],['desc'])

          let solo_cuatro = list.slice(0, 4)

          map(solo_cuatro, dp => {
            candidatos += `
            <div class="tooltip-content row mt-2 pb-1 border-bottom">
                <div class="col-2">
                  <div><img width="40px" src="${this.getImageCandidate(dp.candidato_id)}" /></div>
                  
                </div>
                <div class="col-6 pr-0">
                  <div class="candidato-mapa"><b>${dp.candidato}</b></div>
                  <div class="partido-mapa"><img width="25px" src="${this.getImagePartido(dp.partido_id)}" />${dp.partido}</div>
                  
                </div>
                <div class="pl-0 col-4 text-right">
                  <div class="candidato-mapa"><b>${dp.total_departamento}%</b></div>
                  <div class="partido-mapa">+${ numeral(dp.nacional).format('0,0') }</div>
                </div>
              </div>`
          })

          table += `<div>${candidatos}</div>`
        } else if(this.zoomed == true) {
          let distrito = f
          
          let dep = find(this.distritos_parse, d => d.ubigeo == f.properties.IDDIST)

          table = `
            <div class="row border-bottom pb-2 mb-2">
              <div class="col-7 depa"><b>${distrito.properties.DISTRITO}</b></div>
              <div class="col-5 text-right">Conteo al 67%</div>
            </div>`
          let only_four = dep.candidatos.slice(0, 4)

          map(only_four, dp => {
            if(dp.candidato_id) {
              candidatos += `
                <div class="tooltip-content row mt-2 pb-1 border-bottom">
                    <div class="col-2">
                      <div><img width="40px" src="${this.getImageCandidate(dp.candidato_id)}" /></div>
                      
                    </div>
                    <div class="col-6 pr-0">
                      <div class="candidato-mapa"><b>${dp.candidato}</b></div>
                      <div class="partido-mapa"><img width="25px" src="${this.getImagePartido(dp.partido_id)}" />${dp.partido}</div>
                      
                    </div>
                    <div class="pl-0 col-4 text-right">
                      <div class="candidato-mapa"><b>${dp.total_departamento}%</b></div>
                      <div class="partido-mapa">+${ numeral(dp.nacional).format('0,0') }</div>
                    </div>
                  </div>`
            }
          })

          table += `<div>${candidatos}</div>`
        }

        return table
      }
    }
  }

</script>
