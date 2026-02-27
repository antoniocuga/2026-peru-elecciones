<template>
  <div class="row resultado-nacional">
    <div class="col-10 titulo pr-0">
      <div class="pt-3 pb-3 pr-0 pl-2">

        <h3 v-if="eleccion_region && eleccion_region.departamento == 'NACIONAL'">NACIONAL</h3>
        <h3 v-if="eleccion_region && regionSeleccionada">{{ regionSeleccionada.departamento }}</h3>
        <h2 @click="openResultados=!openResultados" v-if="eleccion_region">Resultados de elecciones 2016 (Primera vuelta)</h2>
      </div>
    </div>
    <div class="col-2 pl-0 text-right align-self-center">
      <a @click="openResultados=!openResultados" class="btn" v-if="openResultados==false"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-down" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
      </svg></a>
      <a @click="openResultados=!openResultados" class="btn" v-if="openResultados==true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-up" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"/>
      </svg></a>
    </div>
    <BCollapse v-model="openResultados" id="resultados2016" class="col-12">
      <BTabs>
        <BTab class="" title="Datos de la votacion">
          <div class="row mt-3 mb-3">
            <div class="col-8 datos-eleccion text-left">
              <div>Electores habiles </div>  
            </div>
            <div class="col-4 text-right">
              <div><span v-if="eleccion_region">{{numeral(eleccion_region.eleccion2016.habiles).format('0,0')}}</span></div>
            </div>
          </div>        
          <div class="row mb-3">
            <div class="col-8 datos-eleccion text-left">
              <div>Voto en blanco/nulo</div>
            </div>
            <div class="col-4 text-right">
              <div><span v-if="eleccion_region">{{numeral(eleccion_region.eleccion2016.blanco_nulo).format('0,0')}}</span></div>
            </div>
          </div>        
          <div class="row mb-3">
            <div class="col-8 datos-eleccion text-left">
              <div>Ciudadanos que no votaron</div>
            </div>
            <div class="col-4 text-right">
              <div><span v-if="eleccion_region">{{numeral(eleccion_region.eleccion2016.no_votaron).format('0,0')}}</span></div>              
            </div>
          </div>        
          <div class="row mb-3">
            <div class="col-8 datos-eleccion text-left">
              <div>Votos emitidos</div>        
            </div>
            <div class="col-4 text-right">
              <div><span v-if="eleccion_region">{{numeral(eleccion_region.eleccion2016.emitidos).format('0,0')}}</span></div>
            </div>
          </div>        

        </BTab>
        <BTab title="Por partidos">
          <template v-if="eleccion_region && eleccion_region.eleccion2016">
            <div class="row mb-2 mt-2" :key="partido.partido_id" v-for="partido in eleccion_region.eleccion2016.partidos">
              <div class="col-8 datos-eleccion"><img width="25px" :src="getImagePartido(partido.partido_id)" /> {{ partido.partido }}</div>
              <div class="text-right col-4"><span>{{numeral(partido.total_votos).format('0,0')}}</span></div>
            </div>
          </template>
        </BTab>
      </BTabs>
    </BCollapse>
  </div>
</template>

<script>
  import numeral from 'numeral'
  import { storeToRefs } from 'pinia'
  import { useCandidatosStore } from '../stores/candidatos'
  import { getPartidoImage } from '../utils/assets'
  import { find } from 'lodash'
  import departamentosPrimeraVuelta from '../data/departamentos_primera_vuelta.json'

  export default {
    name: "elecciones2016",
    data() {
      return {
        openResultados: false
      }
    },
    setup() {
      const store = useCandidatosStore()
      return { ...storeToRefs(store), store }
    },
    computed: {
      elecciones_2016() {
        return departamentosPrimeraVuelta
      },
      eleccion_region() {
        if (this.elecciones_2016 && this.regionSeleccionada) {
          return find(this.elecciones_2016, ['departamento', this.regionSeleccionada.region])
        }
        return false
      }
    },
    methods: {
      numeral,
      getImagePartido(partido) {
        return getPartidoImage(partido)
      },
    }
  }
</script>