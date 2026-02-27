<template>

  <div class="mapa-resultados-container container">
    <div class="row filter-block">
      <div class="col-12 text-right">
        
        <BDropdown :text="partidoSeleccionado.partido" variant="warning" class="d-inline-block m-2 departamento-menu">
          <BDropdownItem :key="p.partido_id" v-for="p in partidos">
            <a @click="show_partido(p)">{{ p.partido }}</a>
          </BDropdownItem>
        </BDropdown>

        <BDropdown :text="regionSeleccionada.departamento" variant="warning" class="d-inline-block m-2 departamento-menu">
          <BDropdownItem :key="dep.region" v-for="dep in departamentos">
            <a @click="show_departamento(dep.region)">{{ dep.departamento }}</a>
          </BDropdownItem>
        </BDropdown>

      </div>
    </div>
    <div class="row">
      <div class="col-12 text-right">
        <svg width="100%" :height="height" class="plan-vector-map" ref="svgmap" id="mapa_segunda">
          <g ref="base"></g>
          <g ref="departamentos"></g>
          <g ref="distritos"></g>
          <g ref="labels"></g>
        </svg>
        <div id="regiones_segunda" class="regiones-extra" :class="{'show': regionSeleccionada.region == 'NACIONAL'}">
          <div><span class="callao-path departamento-path"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-zoom-in" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
            <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
            <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
          </svg></span><span>Callao</span></div>
          <div><span class="lima-path departamento-path"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-zoom-in" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
            <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
            <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
          </svg></span><span>Lima Metropolitana</span></div>
          <div><span class="extranjero-path departamento-path"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-compass" viewBox="0 0 16 16">
            <path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
            <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z"/>
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

  export default {
    name: 'MapaDepartamentosSegunda',
    mixins: [mapaBaseMixin],
    setup() {
      const store = useCandidatosStore()
      const refs = storeToRefs(store)
      return {
        ...refs,
        store,
        candidatos: refs.todosSegunda,
        regionSeleccionada: refs.regionSeleccionadaSegunda,
        partidoSeleccionado: refs.partidoSeleccionadoSegunda,
        distritos: refs.distritosSegunda,
      }
    },
    data() {
      return {
        _mapId: 'mapa_segunda',
        _regionesExtraId: 'regiones_segunda',
        _tooltipId: '#tooltip_segunda',
        _rawDistritosKey: 'distritosSegunda',
        _mobileHeight: 640,
        _desktopHeight: 660,
        _mobileScaleMultiplier: 1.15,
        _tooltipCandidatosCount: 2,
      }
    },
    methods: {
      _fetchDistritos(v) { return this.store.getAllDistritosSegunda(v) },
      _updateRegionSeleccionada(dep) { this.store.updateRegionSeleccionadaSegunda(dep) },
      _updatePartidoSeleccionado(p) { this.store.updatePartidoSeleccionadoSegunda(p) },
      _getDefaultRegionLabel() { return 'EXPLORAR REGIÓN' },
      _getDefaultPartidoLabel() { return 'EXPLORAR POR PARTIDO' },
    },
  }
</script>
