<template>
  <div class="row candidato-wrapper">

    <div class="col-12">
      <h2 class="text-center">Conoce la evolución de la intención de voto de los candidatos presidenciales por encuestadora</h2>
      <p></p>
    </div>

    <div class="col-12">
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a class="nav-item nav-link active" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        </svg> Por candidatos</a>
      </div>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
          <div class="row">
            <div class="col-6">
              <div id="#my_dataviz">
                <svg height="350" width="100%" ref="dataviz">
                  <g ref="g"></g>
                </svg>
              </div>
            </div>
            <div class="col-6">
              <div class="row">
                <div class="col-12 border-bottom flex-row" :key="c.id" v-for="c in candidatos">
                  <div class="candidate-info align-self-center">
                    <div class="img-candidato">
                      <img :src="getImageCandidate(c.id)" /> 
                    </div>
                    <div class="img-partidos">
                      <h4 class="align-self-center">{{c.nombre}}</h4>                      
                      <h5 class="align-self-center"><img class="partido-icon" :src="getImagePartido(c.partido_id)" />{{c.partido}}</h5>  
                    </div>
                  </div>
                  <div class="candidate-results flex-row">
                    <div :key="k" v-for="k in c.items">
                      {{ k.mes }}
                      {{ k.porcentaje }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>          
        </div>
      </div>
    </div>

  </div>
</template>

<style>
  .line {
    fill: none;
    stroke-width: 0.5;
    stroke-opacity: 1;
  }
</style>

<script>

  import { filter, groupBy, map, uniq } from 'lodash'
  import * as d3 from 'd3'
 

  export default {
    name: "Candidato",
    props: {
      encuestas: Array
    },
    mounted() {

      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = this.$refs['dataviz'].clientWidth - margin.left - margin.right,
          height = 350 - margin.top - margin.bottom;

      var svg = d3.select(this.$refs['g'])
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Scale the range of the data
        var x = d3.scalePoint()
          .range([0, width])
          .domain(['Noviembre 2020', 'Diciembre 2020', 'Enero 2021']);
        
        var y = d3.scaleLinear()
          .range([height, 0])
          .domain([0, 35]);
      
        // define the 2nd line
        var valueline2 = d3.line()
          .x(function(d) { return x(d.mes); })
          .y(function(d) { return y(d.porcentaje); });

        // format the data
        this.candidatos.forEach((candidato) => {

        // Add the valueline2 path.
        svg.append("path")
            .data([candidato.items])
            .attr("class", "line")
            .style("fill", "transparent")
            .style("stroke", candidato.color)
            .attr("d", valueline2);
        });

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

    },
    computed: {
      candidatos() {
        let data = filter(this.encuestas, ['encuestadora', 'ipsos'])
        return map(groupBy(data, 'candidato'), (item,candidato) => {
          return {
            id: uniq(map(item, 'candidato_id')).join(""),
            partido_id: uniq(map(item, 'partido_id')).join(""),
            partido: uniq(map(item, 'partido')).join(""),
            color: uniq(map(item, 'color')).join(""),
            nombre: candidato,
            items: item
          }
        })
      }
    },
    methods: {
      getImageCandidate(c) {
        return require(`../assets/candidatos/${c}.png`)
      },
      getImagePartido(c) {
        return require(`../assets/partidos/${c}.png`)
      }
    }
  }
</script>