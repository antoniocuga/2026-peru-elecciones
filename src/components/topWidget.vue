<template>

  <div class="row justify-content-center">
    <div class="col-12 col-sm-12 mb-3" v-if="conteo">
      <h3 class="m-0 text-center">
        <b>Conteo ONPE al {{ conteo.toFixed(1) }}% a nivel nacional</b> (Última actualización: {{ fecha_hora }})
      </h3>
    </div>
    <div class="col-12" v-if="conteo">
      <div class="row justify-content-center">
        <div class="col-auto text-center" :key="c.candidato_id" v-for="(c, ix) in topCandidatos" >
          <div>
            <div class="mr-2"><img width="65px" :src="getImageCandidate(c.candidato_id)" /></div>
          </div>
          <div class="d-flex">
            <div class="card-resultado">              
              <div class="candidato-mapa">{{ c.candidato }}</div>
              <div class="partido-mapa"><img width="25px" :src="getImagePartido(c.partido_id)" /> {{ c.partido }}</div>
      
              <div class="text-center mt-2 mb-2 porcentaje">{{ c.validos.toFixed(1) }} <span>%</span></div>
      
              <div class="puesto" v-if="ix == 0"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
              </svg> Posible paso a segunda vuelta</div>
      
              <div class="peleando" v-if="ix == 1 || ix == 2|| ix == 3"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
              </svg> Empate técnico</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import { filter, map, orderBy, groupBy, uniq } from 'lodash'
  export default {
    name: "topWidget",
    methods: {
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
          return require(`../assets/partidos/blanco-viciado.png`)
        }
      }
    },
    computed: {     
      ...mapState({
        candidatos: state => state.candidatos.todos,
        regionSeleccionada: state => state.candidatos.regionSeleccionada,
        partidoSeleccionado: state => state.candidatos.partidoSeleccionado,
      }),
      conteo() {
        return parseFloat(uniq(map(this.topCandidatos, 'conteo')).join(""))
      },
      fecha_hora() {
        return uniq(map(this.topCandidatos, 'hora')).join("")
      },
      topCandidatos() {
        let filtered = filter(this.candidatos, d => {
          if(d.region == 'total' && d.candidato_id != 'blanco' && d.candidato_id != 'nulos') {
            return d
          }
        })

        let candidates = orderBy(map(groupBy(filtered, 'candidato_id'), (d, id) => {
            return {
              candidato_id: id,
              region: uniq(map(d, 'region')).join(''),
              candidato: uniq(map(d, 'candidato')).join(''),
              partido_id: uniq(map(d, 'partido_id')).join(''),
              partido: uniq(map(d, 'partido')).join(''),
              color: uniq(map(d, 'color')).join(''),
              votos: parseFloat(uniq(map(d, 'total')).join('')),
              validos: parseFloat(uniq(map(d, 'validos')).join('')),
              conteo: parseFloat(uniq(map(d, 'conteo')).join('')),
              hora: uniq(map(d, 'hora')).join('')
            }
        }), ['validos'], ['desc'])

        return candidates.slice(0, 4)
      }, 
    }
  }
  

</script>