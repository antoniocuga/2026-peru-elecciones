<template>

  <div class="mapa-resultados-container">
    <div class="row">
      <div class="col-12 text-right">
        <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
          <button type="button" class="btn btn-secondary">PRESIDENTE</button>
          <button type="button" class="btn btn-secondary">CONGRESO</button>
          <div class="btn-group" role="group">
            <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown
            </button>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
              <a class="dropdown-item" href="#">Dropdown link</a>
              <a class="dropdown-item" href="#">Dropdown link</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 text-right">
        <svg width="100%" height="720px" class="plan-vector-map">
          <g ref="base"></g>
          <g ref="departamentos"></g>
        </svg>
        <div class="btn btn-dark d-block d-md-none" @click="openDepartamentos()">Seleccionar departamentos</div>
        <div class="lista-departamentos" :class="{'active': openMenu}">
          <div><div class="btn btn-dark d-inline d-md-none" @click="openDepartamentos()">X</div></div>
          <ul>
            <li :key="dep.region" v-for="dep in departamentos">
              <a @click="show_departamento(dep.region)">{{ dep.region }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>

  import numeral from 'numeral'
  import { mapState, mapActions } from 'vuex'
  import * as d3 from 'd3'
  //import { feature } from 'topojson'
  import { find, filter, map, maxBy, orderBy, groupBy, uniq } from 'lodash'  

  export default {
    name: "MapaDepartamentos",
    data() {
      return {
        openMenu: false,
        width: 820,
        height: 720
      }
    },
    mounted() {
      this.renderMapa()
    },
    created () {
      this.$store.dispatch('candidatos/getAllCandidatos')
    },
    watch: {
      candidatos() {
        this.renderMapa()
      }
    },
    computed: {
      ...mapState({
        candidatos: state => state.candidatos.todos,
        regionSeleccionada: state => state.candidatos.regionSeleccionada,
      }),
      departamentos() {
        
        let filtered = filter(this.candidatos, c => c.candidato_id != "")

        return orderBy(map(groupBy(filtered, 'region'), (item, region) => {
                    
          return {
            region: region,
            departamento: uniq(map(item, 'region')).join(''),
            candidatos: orderBy(item, ['total_departamento'], ['desc']),
            geodata: require(`../data/mapas/${region}.json`),
            winner: maxBy(item, 'total_departamento')
          }

        }), ['departamento'])
      },
      projection () {
        return d3.geoMercator()
          .translate([this.width/2, this.height/2])
          .scale(1500)
      },
      path () {
        return d3.geoPath().projection(this.projection)
      },
      peru() {
        return require(`../data/mapas/peru.json`)
      },
      tooltip() {
        return d3.select("div.tooltip")
      }
    },
    methods: {
      ...mapActions('candidatos', [
        'updateRegionSeleccionada'
      ]),
      openDepartamentos() {
        this.openMenu = !this.openMenu
      },
      show_departamento(id) {
        
        let dep = find(this.departamentos, d => d.region == id)

        this.updateRegionSeleccionada(dep)

        let f = find(this.peru.features, _f => {
          if(_f.properties.dep_id == id)
            return _f
        })

        if(window.innerWidth < 798) {
          let table = this.load_tooltip(dep, f)
          this.tooltip.html(`${table}`)
            .style("left", "0px")
            .style("top", "0px")
          
          this.tooltip.transition()
            .duration(500)	
            .style("opacity", 0)
          
          this.tooltip.transition()
            .duration(200)	
            .style("opacity", .9)
        }

        if(window.innerWidth > 798) {
          this.tooltip 
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px")
        
          this.tooltip.transition()
            .duration(500)	
            .style("opacity", 0)
          
          this.tooltip.transition()
            .duration(200)	
            .style("opacity", .9)
        }
        
        this.openDepartamentos()
      },
      getImageCandidate(c) {
        return require(`../assets/candidatos/${c}.png`)
      },
      getImagePartido(c) {
        return require(`../assets/partidos/${c}.png`)
      },
      renderMapa() {

        let base = d3.select(this.$refs['base'])

        let bounds = d3.geoBounds(this.peru),
            center = d3.geoCentroid(this.peru)

        // Compute the angular distance between bound corners
        let distance = d3.geoDistance(bounds[0], bounds[1]),
            scale = this.width / distance / Math.sqrt(1)


        let center_device =  this.width / 1.2

        this.projection
          .translate([center_device, this.height/2])
          .center(center)
          .scale(scale)

        base.selectAll('path.departamento-path').remove()

        base.selectAll('path.departamento-path')
          .data(this.peru.features)
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

            if(window.innerWidth < 798) {
              let table = this.load_tooltip(dep, f)
              this.tooltip.html(`${table}`)
                .style("left", "0px")
                .style("top", "0px")
              
              this.tooltip.transition()
                .duration(500)	
                .style("opacity", 0)
              
              this.tooltip.transition()
                .duration(200)	
                .style("opacity", .9)
            }

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
      },
      load_tooltip(dep, f) {

        let table = `
        <div class="row border-bottom pb-2 mb-2">
          <div class="col-6 depa">${f.properties.NOMBDEP}</div>
          <div class="col-6 text-right">${f.properties.NOMBDEP}</div>
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
                <div class="candidato-mapa">${dp.candidato}</div>
                <div class="partido-mapa"><img width="25px" src="${this.getImagePartido(dp.partido_id)}" />${dp.partido}</div>
                
              </div>
              <div class="pl-0 col-4 text-right">
                <div class="candidato-mapa">${dp.total_departamento}%</div>
                <div class="partido-mapa">${ numeral(dp.nacional).format('0,0') } Votos</div>
              </div>
            </div>`
        })

        table += `<div>${candidatos}</div>`

        return table
      }
    }
  }

</script>
