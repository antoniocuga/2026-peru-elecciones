<template>
  <div class="row resultado-nacional">
    <div class="col-8 titulo text-left">
      <div>Resultados Elecciones 2016 (<b>{{eleccion_region.departamento}}</b>)</div>
      <div><span v-if="eleccion_region">primera vuelta</span></div>
    </div>
    <div class="col-4 text-right">
      <b-button @click="openResultados=!openResultados" class="btn"> {{ openResultados ? 'Cerrar' : 'Ver resultados'}}</b-button>
    </div>
    <b-collapse v-model="openResultados" id="resultados2016" class="col-12">
      <b-tabs>
        <b-tab class="" title="Datos de la votacion">
          <div class="row">
            <div class="col-6 text-left">
              <div>Electores habiles <span v-if="eleccion_region">{{eleccion_region.eleccion2016.habiles}}</span></div>        
            </div>
            <div class="col-6 text-right">
              <div>22901954</div>
            </div>
          </div>
          <div class="row"><div class="col-6">ciudadanos que no votaron <span v-if="eleccion_region">{{eleccion_region.eleccion2016.no_votaron}}</span></div><div class="col-6">895785</div></div>
          <div class="row"><div class="col-6">voto en blanco/nulo</div><div class="col-6">votos emitidos <span v-if="eleccion_region">{{eleccion_region.eleccion2016.emitidos}}</span></div></div>

        </b-tab>
        <b-tab title="Por partidos">
          <div class="row" :key="partido.partido_id" v-for="partido in eleccion_region.eleccion2016.partidos">
            <div class="col-8">{{ partido.partido }}</div><div class="text-right col-4">{{partido.total_votos}}</div>
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
    }
  }

</script>