<template>

  <div class="mapa-resultados-container">
    <div class="row">
      <div class="col-12 text-right">
        
        <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
          <button type="button" @click="resetPresidente()" class="btn active btn-secondary" v-if="partidoSeleccionado.partido_id!='SELECCIONAR PARTIDO'">Ver todos los partidos</button>
        </div>

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

        <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
          <button type="button" @click="resetPresidente()" class="btn active btn-secondary" v-if="zoomed==true">Volver a los resultados nacionales</button>
        </div>

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
  import { find,  map, maxBy, minBy, orderBy, sumBy, groupBy, uniq } from 'lodash'  

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
      lista_candidatos(v) {
        console.log(v)
      },
      candidatos() {
        this.renderMapa()
      },
      partidoSeleccionado(v) {
        console.log(v)
        let max = maxBy(this.departamentos, 'total_departamento')
        let min = minBy(this.departamentos, 'total_departamento')
        console.log(max)
        let color = d3.scaleLinear().domain([min.total_departamento, max.total_departamento]).range(["#eaeaea", `${max.winner.color}ab`])

        let base = d3.select(this.$refs['svgmap'])

        base.selectAll('path.departamento-path')        
          .attr("style", (f) => {
            let dep = find(this.departamentos, d => d.region == f.properties.dep_id)
            if(dep)
              return `fill: ${color(dep.winner.total_departamento)}`
          })
      },
      regionSeleccionada(v) {
        this.transitionPath()

        if(v.region !='NACIONAL') {
          d3.selectAll('path.departamento-path').classed('inactive', true)
          d3.select(`path.${v.region}-path`).classed('inactive', false)

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
      }),
      partidos() {
        return orderBy(map(groupBy(this.candidatos, 'partido_id'), (item, partido_id) => {
          return {
            partido_id: partido_id,
            departamentos: groupBy(item, 'region')
          }
        }), ['departamento'])
      },
      departamentos() {
        return orderBy(map(groupBy(this.lista_candidatos, 'region'), (item, region) => {
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
      peru() {
        return require(`../data/mapas/peru.topo.json`)
      },
      peruTopojson() {
        return feature(this.peru, this.peru.objects.data)
      },
      tooltip() {
        return d3.select("div.tooltip")
      }
    },
    methods: {
      ...mapActions('candidatos', [
        'updateRegionSeleccionada',
        'updatePartidoSeleccionado',
      ]),
      resetPresidente() {
        this.updateRegionSeleccionada({region:'NACIONAL'})
        this.updatePartidoSeleccionado({partido_id: 'SELECCIONAR PARTIDO'})
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
        return require(`../assets/candidatos/${c}.png`)
      },
      getImagePartido(c) {
        return require(`../assets/partidos/${c}.png`)
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
          })
          .on('end', () => {
            this.scale = scale
            this.center = center
            if(this.regionSeleccionada.region != 'NACIONAL') {
              this.renderLabels()
              this.render_distritos()
              this.zoomed = true
            } else if(this.regionSeleccionada.region == 'NACIONAL') {
              base.selectAll('path.departamento-path').classed('inactive', false)
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

            if(window.innerWidth > 798) {
              this.updateRegionSeleccionada(dep)
            }
            
          })
          .on("mouseover", (event, f) => {
            if(window.innerWidth > 798) {
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

        console.log(features_distrito)

        base.selectAll('path.distrito-path').remove()

        base.selectAll('path.distrito-path')
          .data(features_distrito.features)
          .enter()
          .append('path')
          .attr('d',this.path)
          .attr('class', 'distrito-path')
          .on("mouseover", (event, f) => {
            if(window.innerWidth > 798) {
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
      },
      load_tooltip(dep, f) {

        let table = `
        <div class="row border-bottom pb-2 mb-2">
          <div class="col-6 depa"><b>${f.properties.NOMBDEP}</b></div>
          <div class="col-6 text-right">Conteo al 67%</div>
        </div>`

        let candidatos = ``
        
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
            if (this.zoomed==false) 

            

        table += `<div>${candidatos}</div>`

        return table
      }
    }
  }

</script>
