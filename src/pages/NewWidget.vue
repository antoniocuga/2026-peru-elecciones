<template>
  <div class="elecciones-embed-widget ej2026-embed-scope">
    <div class="container py-2 pb-0">
      <div class="row justify-content-center">
        <div class="col-12">
          <div class="pb-1">
            <p class="small text-light mt-0 mb-0 text-center" style="font-size: 0.75rem; opacity: 0.9">
              Conteo al {{ (Number(conteo) || 0) }}%. <span v-if="Number(conteo) > 0">Última actualización: {{ fechaHora }}</span>
            </p>
          </div>
        </div>
        <PresidencialTopTwoCards variant="home" :candidatos="displayTopCandidatos" />
        <div class="col-12">
          <div class="text-right text-white mt-2 small">Fuente: ONPE</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useCandidatosStore } from '../stores/candidatos'
import PresidencialTopTwoCards from '../components/widget/PresidencialTopTwoCards.vue'
import {
  computeTopCandidatos,
  computeConteoFromTop,
  computeFechaHoraFromTop,
  displayTopCandidatosWithPlaceholders,
} from '../utils/presidencialWidget'

export default {
  name: 'NewWidget',
  components: {
    PresidencialTopTwoCards,
  },
  setup() {
    const store = useCandidatosStore()
    const refs = storeToRefs(store)
    return { ...refs, store, candidatos: refs.todosSegunda }
  },
  mounted() {
    this.store.getAllCandidatosSegunda()
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
