<template>
  <div class="row resultado-nacional">
    <div class="col-8 mt-3 mb-3titulo text-left">
      <div>Elecciones 2016 (<b>{{eleccion_region.departamento}}</b>)</div>
      <div class=""><h2 v-if="eleccion_region">RESULTADOS NACIONALES</h2></div>
    </div>
    <div class="col-4 text-right">
      <b-button @click="openResultados=!openResultados" class="btn"> {{ openResultados ? 'Cerrar' : 'Ver resultados'}}</b-button>
    </div>
    <b-collapse v-model="openResultados" id="resultados2016" class="col-12">
      <b-tabs>
        <b-tab class="" title="Datos de la votacion">
          <div class="row mt-3 mb-3">
            <div class="col-8 datos-eleccion text-left">
              <div>Electores habiles </div>  
            </div>
            <div class="col-4 text-right">
              <div><span v-if="eleccion_region">{{eleccion_region.eleccion2016.habiles}}</span></div>
            </div>
          </div>        
          <div class="row mb-3">
            <div class="col-8 datos-eleccion text-left">
              <div>Voto en blanco/nulo</div>
            </div>
            <div class="col-4 text-right">
              <div><span v-if="eleccion_region">{{eleccion_region.eleccion2016.blanco_nulo}}</span></div>
            </div>
          </div>        
          <div class="row mb-3">
            <div class="col-8 datos-eleccion text-left">
              <div>Ciudadanos que no votaron</div>
            </div>
            <div class="col-4 text-right">
              <div><span v-if="eleccion_region">{{eleccion_region.eleccion2016.no_votaron}}</span></div>              
            </div>
          </div>        
          <div class="row mb-3">
            <div class="col-8 datos-eleccion text-left">
              <div>Votos emitidos</div>        
            </div>
            <div class="col-4 text-right">
              <div><span v-if="eleccion_region">{{eleccion_region.eleccion2016.emitidos}}</span></div>
            </div>
          </div>        

        </b-tab>
        <b-tab title="Por partidos">
          <div class="row" :key="partido.partido_id" v-for="partido in eleccion_region.eleccion2016.partidos">
            <img width="25px" :src="getImagePartido(partido.partido_id)" />
            <div class="col-8 datos-eleccion">{{ partido.partido }}</div>
            <div class="text-right col-4"><span>{{partido.total_votos}}</span></div>
          </div>
        </b-tab>
      </b-tabs>
    </b-collapse>
  </div>
</template>

<script>
  
  import { mapState } from 'vuex'
  import { find } from 'lodash'

  export default {
    name: "elecciones2016",
    data() {
      return {
        openResultados: false
      }
    },    
    computed: {
      ...mapState({        
        regionSeleccionada: state => state.candidatos.regionSeleccionada,
      }),
      elecciones_2016() {
        return require('../data/departamentos.json')
      },
      eleccion_region() {
        if(this.elecciones_2016) {
          let departamento = find(this.elecciones_2016, ['departamento', this.regionSeleccionada.region])
          console.log(departamento)
          return departamento  
        }

        return false        
      }
    },
    methods: {
        
      getImagePartido(partido) {
        try {
          return require(`../assets/partidos/${partido}.png`) 
        } catch (error) {
          return require(`../assets/partidos/blanco-viciado.png`)
        }
      },
    }
  }

</script>