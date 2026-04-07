<template>

  <div class="mapa-resultados-container">    
    <div class="row">
      <div class="col-12 text-right">
        <div class="filter-block">
          <DropdownBs4
            :text="partidoSeleccionado.partido"
            variant="secondary"
            :wrapperClass="['d-inline-block', 'm-2', 'departamento-menu']"
          >
            <template #default="{ close }">
              <button
                type="button"
                class="dropdown-item"
                :key="p.partido_id"
                v-for="p in partidos"
                @click="close(); show_partido(p)"
              >
                {{ p.partido }}
              </button>
            </template>
          </DropdownBs4>
      
          <DropdownBs4
            :text="regionSeleccionada.departamento"
            variant="secondary"
            :wrapperClass="['d-inline-block', 'm-2', 'departamento-menu']"
          >
            <template #default="{ close }">
              <button
                type="button"
                class="dropdown-item"
                :key="dep.region"
                v-for="dep in departamentos"
                @click="close(); show_departamento(dep.region)"
              >
                {{ dep.departamento }}
              </button>
            </template>
          </DropdownBs4>

        </div>
        <svg width="100%" :height="height" class="plan-vector-map" ref="svgmap" id="mapa_primera">
          <g ref="base"></g>
          <g ref="departamentos"></g>
          <g ref="distritos"></g>
          <g ref="labels"></g>
        </svg>
        <div id="primera_extra" class="regiones-extra" :class="{'show': regionSeleccionada.region == 'NACIONAL'}">
          <div><span class="callao-path departamento-path"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-zoom-in" viewBox="0 -3 16 26">
            <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
            <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
            <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
          </svg></span><span>Callao</span></div>
          <div><span class="lima-path departamento-path"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-zoom-in" viewBox="0 -3 16 26">
            <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
            <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
            <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
          </svg></span><span>Lima Metropolitana</span></div>
          <div><span class="extranjero-path departamento-path"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-globe-americas" viewBox="0 -3 16 26">
  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z"/>
</svg></span><span>Extranjero</span></div>
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
  import { storeToRefs } from 'pinia'
  import { useCandidatosStore } from '../stores/candidatos'
  import { mapaBaseMixin } from '../mixins/mapaBaseMixin'
  import DropdownBs4 from './DropdownBs4.vue'

  export default {
    name: 'MapaDepartamentos',
    components: { DropdownBs4 },
    mixins: [mapaBaseMixin],
    setup() {
      const store = useCandidatosStore()
      const refs = storeToRefs(store)
      return {
        ...refs,
        store,
        candidatos: refs.todos,
        distritos: refs.distritos,
      }
    },
    data() {
      return {
        _mapId: 'mapa_primera',
        _regionesExtraId: 'primera_extra',
        _tooltipId: '#tooltip_primera',
        _rawDistritosKey: 'distritos',
        _mobileHeight: 640,
        _desktopHeight: 720,
        _mobileScaleMultiplier: 1.45,
        _tooltipCandidatosCount: 4,
      }
    },
    methods: {
      _fetchDistritos(v) { return this.store.getAllDistritos(v) },
      _updateRegionSeleccionada(dep) { this.store.updateRegionSeleccionada(dep) },
      _updatePartidoSeleccionado(p) { this.store.updatePartidoSeleccionado(p) },
      _getDefaultRegionLabel() { return 'VER REGIÓN' },
      _getDefaultPartidoLabel() { return 'VER POR PARTIDO' },
    },
  }
</script>
