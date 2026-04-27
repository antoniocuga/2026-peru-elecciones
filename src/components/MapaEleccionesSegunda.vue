<template>
  <div class="resultados2026">
    <div class="row pt-3">
      <div class="col-12 col-sm-12 col-md-6 col-lg-5 d-md-block d-none">
        <candidatosResultadosSegunda :candidatos="filteredData" />
        <ContextoElectoralPanel :contexto="contextoElectoral" />
      </div>
      <div class="col-12 col-sm-12 col-md-6 col-lg-7 mapa-resultados-wrapper">
        <MapaDepartamentosSegunda :lista_candidatos="filteredData" />
      </div>
      <div class="col-12 col-sm-12 d-block d-md-none mapa-resultados-wrapper">
        <candidatosResultadosSegunda :candidatos="filteredData" />
      </div>
    </div>
  </div>
</template>

<script>

import { storeToRefs } from 'pinia'
import { useCandidatosStore } from '../stores/candidatos'
import { getPartidoImage, getCandidatoImage } from '../utils/assets'
import candidatosResultadosSegunda from './candidatosResultadosSegunda.vue'
import MapaDepartamentosSegunda from './MapaDepartamentosSegunda.vue'
import ContextoElectoralPanel from './ContextoElectoralPanel.vue'
import { mergeContextoParticipacionCiudadana } from '../utils/onpeParticipacionCiudadana.js'
import { filter } from 'lodash'

export default {
  name: 'MapaEleccionesSegunda',
  props: {
    encuestas: Array
  },
  components: {
    MapaDepartamentosSegunda,
    candidatosResultadosSegunda,
    ContextoElectoralPanel,
  },
  setup() {
    const store = useCandidatosStore()
    return { ...storeToRefs(store), store }
  },
  created() {
    this.store.getAllCandidatosSegunda()
    this.store.ensureParticipacionCiudadanaTotales()
  },
  methods: {
    toNumber(value) {
      if (value == null || value === '') return null
      if (typeof value === 'number') return Number.isNaN(value) ? null : value
      const parsed = Number(String(value).replace(/%/g, '').replace(',', '.').trim())
      return Number.isNaN(parsed) ? null : parsed
    },
    getImageCandidate(c) {
      return getCandidatoImage(c)
    },
    getImagePartido(c) {
      return getPartidoImage(c)
    }
  },
  computed: {
    contextoElectoral() {
      const rows = Array.isArray(this.filteredData) ? this.filteredData : []
      const byCandidate = (ids) =>
        rows.find((r) => ids.includes(String(r.candidato_id || '').toLowerCase()))

      const blancoRow = byCandidate(['blanco'])
      const nuloRow = byCandidate(['nulo', 'nulos'])

      const blanco = this.toNumber(blancoRow?.validos)
      const nulo = this.toNumber(nuloRow?.validos)
      const blancoNulo = blanco != null && nulo != null ? blanco + nulo : null

      const actasContabilizadas = rows.reduce((max, row) => {
        const v = this.toNumber(row?.actasContabilizadas ?? row?.conteo)
        if (v == null) return max
        return max == null ? v : Math.max(max, v)
      }, null)

      const emitidosFromRows = rows.reduce((acc, row) => {
        const v = this.toNumber(row?.emitidos ?? row?.total_votos ?? row?.votos ?? row?.total)
        return v == null ? acc : acc + v
      }, 0)
      const emitidos = emitidosFromRows > 0 ? emitidosFromRows : null

      const habiles = rows.reduce((max, row) => {
        const v = this.toNumber(row?.habiles)
        if (v == null) return max
        return max == null ? v : Math.max(max, v)
      }, null)

      const participacion =
        emitidos != null && habiles != null && habiles > 0
          ? (emitidos / habiles) * 100
          : null

      const ausentismo =
        participacion != null ? 100 - participacion : null

      const base = {
        participacion,
        ausentismo,
        blanco,
        nulo,
        blancoNulo,
        actasContabilizadas,
        emitidos,
        habiles,
      }
      return mergeContextoParticipacionCiudadana(base, this.participacionCiudadana)
    },
    filteredData() {
      const isRegion = this.regionSeleccionadaSegunda.region != 'NACIONAL'
      const isPartido = this.partidoSeleccionadoSegunda.partido_id != 'TODOS'
      const regionCandidatos = Array.isArray(this.regionSeleccionadaSegunda.candidatos)
        ? this.regionSeleccionadaSegunda.candidatos : []

      if (isRegion && !isPartido) {
        return regionCandidatos
      }
      if (!isRegion && isPartido) {
        return filter(this.todosSegunda, c => c.partido_id == this.partidoSeleccionadoSegunda.partido_id)
      }
      if (isRegion && isPartido) {
        return filter(regionCandidatos, c => c.partido_id == this.partidoSeleccionadoSegunda.partido_id)
      }
      return filter(this.todosSegunda, c => c.candidato_id != "")
    }
  }
}
</script>

