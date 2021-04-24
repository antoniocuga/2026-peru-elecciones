<template>
  <div class="row congreso-grafico">
    <div class="col-5 d-none d-md-block">
      <b-tabs content-class="mt-3">
        <!-- This tabs content will always be mounted -->
        <b-tab title="Partidos">     
          <div class="list-resultados-partidos">
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
        </b-tab>
        <b-tab title="Lista de congresistas" class="list-resultados-partidos" lazy>
 
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

            <b-collapse v-model="open" id="collapse-1" class="col-12">
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
            </b-collapse>
        
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
            
        </b-tab>
      </b-tabs>
    </div>

    <div class="col-12 col-md-7 text-center">
      <div class="congreso-sticky">
        <div class="filters-congreso mb-3 text-center">
          <b-dropdown :text="`${depObject.region} (${depObject.seats})`" variant="warning" class="m-2 departamento-menu">
            <b-dropdown-item @click="reset_congreso()">
              NACIONAL (130)
            </b-dropdown-item>
            <b-dropdown-item @click="show_departamentos(d)" :key="d.region" v-for="d in departamentos">
              {{ d.region}} ({{ d.seats }})
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <svg class="svg-congreso">
          <g id="parliament"></g>
        </svg>
        <div class="col-12 mb-2" v-if="departamentos_conteo > 0">
          <h2 class="title-resultados"><b>Conteo ONPE al {{ departamentos_conteo.toFixed(2) }}% en la región {{depSelected}}</b></h2> <h2 class="title-resultados">Última actualización: {{ departamentos_hora }}</h2>
        </div>
      </div>
    </div>

    <div class="col-12 mt-3 d-block d-md-none">
      <b-tabs content-class="mt-3">
        <!-- This tabs content will always be mounted -->
        <b-tab title="Partidos">     
          <div class="list-resultados-partidos">


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
        </b-tab>
        <b-tab title="Lista de congresistas" class="list-resultados-partidos" lazy>
 
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

          <b-collapse v-model="open" id="collapse-1" class="col-12">
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
          </b-collapse>
      
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
          

        </b-tab>
      </b-tabs>
    </div>


    <div class="col-12 mt-3 resultados2021">      
          
    </div>

    
  </div>
</template>

<script>
  import numeral from 'numeral'
  import { mapState } from 'vuex'
  import * as d3 from 'd3'
  import * as parliament from 'd3-parliament-chart'
  import { filter, groupBy, map, orderBy, uniq, sum } from 'lodash'

  export default {
    name: 'congresoGrafico.vue',
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
      ...mapState({
        congresistas: state => state.candidatos.congresistas
      }),
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
    watch: {
      congresistas() {
        this.renderCongreso()
      }
    },
    mounted() {
      this.renderCongreso()
    },
    methods: {
      numeral,
      getImagePartido(c) {
        try {
          return require(`../assets/partidos/${c}.png`) 
        } catch (error) {
          return require(`../assets/partidos/blanco-viciado.png`)
        }
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