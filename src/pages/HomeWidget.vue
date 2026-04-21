<template>
  <div class="elecciones-embed-widget ej2026-embed-scope container pb-3 pt-3 mb-3">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="p-0">
            <p class="small text-light mt-0 mb-0 text-center" style="font-size: 0.75rem; opacity: 0.9">
              Conteo al {{ (Number(conteo) || 0).toFixed(3) }}%. Última actualización: {{ fechaHora }}
            </p>
          </div>
        </div>
        <PresidencialTopThreeCards variant="home" :candidatos="displayTopCandidatos" />
        <div class="col-12">
          <WidgetParliamentSummary :congresistas="congresistas" :senadores="senadores" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useCandidatosStore } from '../stores/candidatos'
import PresidencialTopThreeCards from '../components/widget/PresidencialTopThreeCards.vue'
import WidgetParliamentSummary from '../components/widget/WidgetParliamentSummary.vue'
import {
  computeTopCandidatos,
  computeConteoFromTop,
  computeFechaHoraFromTop,
  displayTopCandidatosWithPlaceholders,
} from '../utils/presidencialWidget'

export default {
  name: 'HomeWidget',
  components: {
    PresidencialTopThreeCards,
    WidgetParliamentSummary,
  },
  setup() {
    const store = useCandidatosStore()
    const refs = storeToRefs(store)
    return { ...refs, store, candidatos: refs.todos }
  },
  mounted() {
    this.store.getAllCandidatos()
    this.store.getAllCongreso()
    this.store.getAllSenado()
  },
  computed: {
    conteo() {
      return computeConteoFromTop(this.topCandidatos)
    },
    fechaHora() {
      return computeFechaHoraFromTop(this.topCandidatos)
    },
    topCandidatos() {
      return computeTopCandidatos(this.candidatos)
    },
    displayTopCandidatos() {
      return displayTopCandidatosWithPlaceholders(this.topCandidatos)
    },
  },
}
</script>
