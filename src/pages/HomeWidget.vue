<template>
  <div class="elecciones-embed-widget ej2026-embed-scope container pb-3 pt-3 mb-3">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12">
          <div class="p-0">
            <p class="small text-light mt-0 mb-0 text-center" style="font-size: 0.75rem; opacity: 0.9">
              Conteo al {{ (Number(conteo) || 0) }}%. Última actualización: {{ fechaHora }}
            </p>
          </div>
        </div>
        <PresidencialTopTwoCards variant="home" :candidatos="displayTopCandidatos" />
        <div class="col-12 col-md-9 p-0">
          <WidgetBlancoNuloSegunda :datos="blancoNulo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useCandidatosStore } from '../stores/candidatos'
import PresidencialTopTwoCards from '../components/widget/PresidencialTopTwoCards.vue'
import WidgetBlancoNuloSegunda from '../components/widget/WidgetBlancoNuloSegunda.vue'
import {
  computeTopCandidatos,
  computeConteoFromTop,
  computeFechaHoraFromTop,
  displayTopCandidatosWithPlaceholders,
} from '../utils/presidencialWidget'
import { computeBlancoNuloSegunda } from '../utils/segundaVotosEspeciales'

export default {
  name: 'HomeWidget',
  components: {
    PresidencialTopTwoCards,
    WidgetBlancoNuloSegunda,
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
    blancoNulo() {
      return computeBlancoNuloSegunda(this.candidatos)
    },
  },
}
</script>
