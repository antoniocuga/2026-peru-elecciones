<template>

  <div class="mapa-resultados-container">
    <div class="row filter-block">
      <div class="col-12 text-right">
        
        <b-dropdown :text="partidoSeleccionado.partido" variant="warning" class="d-inline-block m-2 departamento-menu">
          <b-dropdown-item :key="p.partido_id" v-for="p in partidos">
            <a @click="show_partido(p)">{{ p.partido }}</a>
          </b-dropdown-item>
        </b-dropdown>

        <b-dropdown :text="regionSeleccionada.departamento" variant="warning" class="d-inline-block m-2 departamento-menu">
          <b-dropdown-item :key="dep.region" v-for="dep in departamentos">
            <a @click="show_departamento(dep.region)">{{ dep.departamento }}</a>
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
        <div class="regiones-extra" :class="{'show': regionSeleccionada.region == 'NACIONAL'}">
          <div><span class="callao-path departamento-path"></span><span>Callao</span></div>
          <div><span class="lima-path departamento-path"></span><span>Lima Metropolitana</span></div>
          <div><span class="extranjero-path departamento-path"></span><span>Extranjero</span></div>
        </div>

        <div class="legend-party" v-if="partidoSeleccionado.color">
          <div><span class="min-legend">{{ legendaValues.min }}%</span><span class="max-legend">{{ legendaValues.max }}%</span></div>
          <div class="percent" :style="`height: 15px; width:100%;background: linear-gradient(90deg,#eaeaea, ${partidoSeleccionado.color}ab);`">
          </div>
        </div>

        <button type="button" @click="resetPartidos()" class="btn-back btn active btn-secondary" v-if="partidoSeleccionado.partido_id!='TODOS'"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg> volver</button>
        <button type="button" @click="resetPresidente()" class="btn-back btn active btn-secondary" v-if="zoomed==true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg> volver</button>
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
        zoomed: false,
        legendaValues: {}
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
      distritos() {
        if(this.zoomed == true)
          this.render_distritos()
      },
      partidoSeleccionado(v) {
        this.zoomed = false
        let base = d3.select(this.$refs['svgmap'])

        if(v.partido_id != 'TODOS') {

          let max = maxBy(this.departamentos_parse, 'total_departamento').total_departamento
          let min = minBy(this.departamentos_parse, 'total_departamento').total_departamento

          let color = d3.scaleLinear().domain([min, max]).range(["#eaeaea", `${v.color}ab`])

          this.legendaValues.max = max.toFixed(1)
          this.legendaValues.min = min.toFixed(1)

          base.selectAll('path.departamento-path')        
          .attr("style", (f) => {            
            let dep = find(this.departamentos_parse, d => d.region == f.properties.dep_id)

            if(dep) { 
              return `fill: ${color(dep.winner.validos)}`
            }
          })

          d3.selectAll('span.departamento-path')
          .attr("style", (f) => {
            let dep = find(this.departamentos_parse, d => d.region == f)
            if(dep) { 
              return `background: ${color(dep.winner.validos)}`
            }
          })
          
        } else {

          base.selectAll('path.departamento-path')
            .attr("style", (f) => {
              let dep = find(this.departamentos, d => d.region == f.properties.dep_id)
              if(dep)
                return `fill: ${dep.winner.color}ab;`
            })

          d3.selectAll('span.departamento-path')
            .attr("style", (f) => {            
              let dep = find(this.departamentos, d => d.region == f)
              if(dep) { 
                return `background: ${dep.winner.color}ab;`
              }
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
        } else {

          if(this.partidoSeleccionado.partido_id != 'TODOS') {
            this.zoomed = false
            let max = maxBy(this.departamentos_parse, 'total_departamento').total_departamento
            let min = minBy(this.departamentos_parse, 'total_departamento').total_departamento
            this.legendaValues.max = max.toFixed(1)
            this.legendaValues.min = min.toFixed(1)
          }
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
            partido: uniq(map(item, 'partido')).join(""),
            color: uniq(map(item, 'color')).join(""),
            departamentos: groupBy(item, 'region')
          }
        }), ['departamento'])
      },
      distritos_parse() {
        let filtered = this.distritos
        if(this.partidoSeleccionado.partido_id != 'TODOS' && this.regionSeleccionada.region == 'NACIONAL') {
          filtered = filter(this.distritos, ['partido_id', this.partidoSeleccionado.partido_id])
        }
        else if(this.regionSeleccionada.region != 'NACIONAL' && this.partidoSeleccionado.partido_id == 'TODOS') {
          filtered = filter(this.distritos, ['departamento_id', this.regionSeleccionada.region])

        }        
        else if(this.regionSeleccionada.region != 'NACIONAL' && this.partidoSeleccionado.partido_id != 'TODOS') {
          filtered = filter(this.distritos, d => {
            let _r = (d.region).replace(" ","-").replace(" ","-")
            if(_r == this.regionSeleccionada.region && d.partido_id == this.partidoSeleccionado.partido_id) {
              return d
            }
          })
        }
        
        return orderBy(map(groupBy(filtered, 'ubigeo_inei'), (item, ubigeo_inei) => {
          return {
            ubigeo: ubigeo_inei,
            region: this.regionSeleccionada.region,
            distrito: uniq(map(item, 'distrito')).join(''),
            provincia: uniq(map(item, 'provincia')).join(''),
            departamento: this.regionSeleccionada.departamento,
            conteo: parseFloat(uniq(map(item, 'conteo')).join("")),
            validos: parseFloat(uniq(map(item, 'validos')).join("")),
            total: sumBy(map(item, 'total')),
            candidatos: orderBy(item, ['validos'], ['desc']),
            winner: maxBy(item, 'validos')
          }
        }), ['departamento'])

      },
      departamentos_parse() {
        let filtered = filter(this.lista_candidatos, c => c.partido_id == this.partidoSeleccionado.partido_id)

        return orderBy(map(groupBy(filtered, 'region'), (item, region) => {
          let _r = region.replace(" ","-").replace(" ","-")
          return {
            region: _r,
            departamento: uniq(map(item, 'region')).join(''),
            total_departamento: maxBy(item, 'validos').validos,
            candidatos: orderBy(item, ['validos'], ['desc']),
            geodata: region != 'total' ? require(`../data/mapas/${_r}.json`) : {},
            winner: maxBy(item, 'validos')
          }
        }), ['departamento'])
      },
      departamentos() {
        let filtered = filter(this.candidatos, c => c.candidato_id != '' && c.region != 'total')

        return orderBy(map(groupBy(filtered, 'region'), (item, region) => {
          
          //let dep = find(this.perugeo.features, d => d.properties.dep_id == region)
          let _r = region.replace(" ","-").replace(" ","-")
          return {
            region: _r,
            departamento: region != 'extranjero' ? uniq(map(item, 'departamento')).join("") : 'EXTRANJERO',
            total_departamento: parseFloat(sumBy(map(item, 'total'))),
            candidatos: orderBy(item, ['validos'], ['desc']),
            geodata: require(`../data/mapas/${_r}.json`),
            winner: maxBy(item, 'validos')
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
        this.zoomed = false
        this.updatePartidoSeleccionado({
          partido_id: "TODOS",
          partido: "VER POR PARTIDO",
        })
      },
      resetPresidente() {
        this.zoomed = false
        this.updateRegionSeleccionada({region:'NACIONAL', departamento:'VER REGIÓN'})
      },
      openDepartamentos() {
        this.openMenu = !this.openMenu        
      },
      show_partido(partido) {
        this.updateRegionSeleccionada({region:'NACIONAL', departamento:'VER REGIÓN'})
        this.updatePartidoSeleccionado(partido)
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
          // scale = dep.properties.scale
          
          scale = dep.properties.scale //(this.height*1.85) / distance / Math.sqrt(2);

        } else if(this.regionSeleccionada.region == 'NACIONAL') {
          center = d3.geoCentroid(this.perugeo)

          if(window.innerWidth < 993) {
            scale = this.width * 1.65 / this.distance / Math.sqrt(1)
          } else {
            scale = this.width / this.distance / Math.sqrt(1)
          }
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
              this.zoomed == false
              base.selectAll('path.departamento-path').classed('inactive', false)
              d3.select(".candidate-results-vivo").style("opacity", 1)
              d3.select(".candidate-results-vivo").classed("active", true)

              if(this.partidoSeleccionado.partido_id == "TODOS") {
                d3.selectAll('span.departamento-path')
                  .attr("style", (f) => {
                    let dep = find(this.departamentos, d => d.region == f)
                    if(dep) { 
                      return `background: ${dep.winner.color}ab;`
                    }
                  })
              }

            }
          })
      },
      renderMapa() {


        let base = d3.select(this.$refs['base'])

        this.bounds = d3.geoBounds(this.perugeo)
        
        this.center = d3.geoCentroid(this.perugeo)

        // Compute the angular distance between bound corners
        this.distance = d3.geoDistance(this.bounds[0], this.bounds[1])

        if(window.innerWidth < 993) {
          this.width = window.innerWidth > 500 ? window.innerWidth / 1.7 : window.innerWidth
          this.height = 720
          this.center_device =  [this.width/1.9, this.height / 2]
          this.scale = this.width * 1.45 / this.distance / Math.sqrt(1)
          
        } else if(window.innerWidth > 720) {
          this.width = 720
          this.height = 720
          this.center_device =  [this.width/2.2, this.height / 2.2]
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

                if(this.partidoSeleccionado.partido_id != 'TODOS') {
                  dep = find(this.departamentos_parse, d => d.region == f.properties.dep_id)
                }

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

          d3.selectAll('span.departamento-path')
            .data(['callao', 'lima', 'extranjero'])
            .attr("style", (f) => {
              let dep = find(this.departamentos, d => d.region == f)
              if(dep)
                return `background-color: ${dep.winner.color}ab;`
            })
            .on("click", (event, f) => {
              let dep = find(this.departamentos, d => d.region == f)   
              if(window.innerWidth > 798 && this.zoomed == false) {
                this.updateRegionSeleccionada(dep)
              }
            })
            .on("mouseover", (event, f) => {

              if(window.innerWidth > 798 && this.zoomed == false) {
                let dep = find(this.departamentos, d => d.region == f)

                if(this.partidoSeleccionado.partido_id != 'TODOS') {
                  dep = find(this.departamentos_parse, d => d.region == f)
                }

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
        let color

        if(this.partidoSeleccionado.partido_id != 'TODOS') {
          let max = maxBy(this.distritos_parse, 'validos')
          let min = minBy(this.distritos_parse, 'validos')

          color = d3.scaleLinear().domain([min.validos, max.validos]).range(["#eaeaea", `${max.winner.color}ab`])
      
          this.legendaValues.max = max.validos.toFixed(1)
          this.legendaValues.min = min.validos.toFixed(1)
        }
        
        let features_distrito = feature(this.regionSeleccionada.geodata, this.regionSeleccionada.geodata.objects[this.regionSeleccionada.region])

        base.selectAll('path.distrito-path').remove()

        base.selectAll('path.distrito-path')
          .data(features_distrito.features)
          .enter()
          .append('path')
          .attr('d',this.path)
          .attr('class', d => {
            return `distrito-path ${d.properties.IDDIST}-path`
          })
          .attr("style", (f) => {
            let dep = find(this.distritos_parse, d => d.ubigeo == f.properties.IDDIST)

            if(dep && this.partidoSeleccionado.partido_id != 'TODOS') {
              if(dep.winner)
                return `fill: ${color(dep.winner.validos)};`
            } else if(dep && dep.winner && dep.conteo > 0) {
              return `fill: ${dep.winner.color}ab;`
            } else {
              return `fill: #eaeaea;`
            }
          })
          .on("mouseover", (event, f) => {
            if(window.innerWidth > 798) {
              let dep = find(this.distritos_parse, d => d.ubigeo == f.properties.IDDIST)

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
        let distrito = f
        let table = ``
        let conteo = parseFloat(uniq(map(dep.candidatos, 'conteo')).join("")).toFixed(1)
        if(dep && this.zoomed==false) {
          table = `
            <div class="row border-bottom pb-2 mb-2">
              <div class="col-6 depa"><b>${f.properties.NAME_1}</b></div>
              <div class="col-6 text-right"><span class="badge badge-secondary">Conteo ONPE al ${conteo}%</span></div>
            </div>`
          
          if(dep.candidatos) {
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
                    <div class="candidato-mapa"><b>${dp.validos.toFixed(1)}%</b></div>
                    <div class="partido-mapa text-success">${ numeral(dp.total).format('0,0') } votos</div>
                  </div>
                </div>`
            })

          } else {
            candidatos = `No disponible`
          }


          table += `<div>${candidatos}</div>`
        }
        else if(this.zoomed == true && dep) {
          
          let dep = find(this.distritos_parse, d => d.ubigeo == f.properties.IDDIST)

          table = `
            <div class="row border-bottom pb-2 mb-2">
              <div class="col-7 depa"><b>${distrito.properties.DISTRITO}</b> - ${distrito.properties.PROVINCIA}</div>
              <div class="col-5 text-right"><span class="badge badge-secondary">Conteo ONPE al ${dep.conteo.toFixed(1) }%</span></div>
            </div>`
          let only_four = orderBy(dep.candidatos, ['validos'], ['desc']).slice(0, 4)


          if(dep.conteo > 0) {
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
                      <div class="candidato-mapa"><b>${dp.validos.toFixed(1)}%</b></div>
                      <div class="partido-mapa text-success">${ numeral(dp.total_votos).format('0,0') } votos</div>
                    </div>
                  </div>`
              }
            })
          } else {
            candidatos +=`Información sin procesar`
          }

          table += `<div>${candidatos}</div>`
        } else {
          table = `
            <div class="row border-bottom pb-2 mb-2">
              <div class="col-12 depa"><b>${distrito.properties.DISTRITO}</b></div>
              <div class="col-12">
                Información no disponible
              </div>
            </div>`
        }

        return table
      }
    }
  }

</script>
