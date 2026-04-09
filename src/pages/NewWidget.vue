<template>
  <div class="elecciones-embed-widget">
    <div class="container py-2 pb-0" v-if="topCandidatos.length">
      <div class="row">
        <div class="col-12">
          <div class="pb-1">
            <p class="small text-light mt-0 mb-0 text-center" style="font-size: 0.75rem; opacity: 0.9">
              Conteo al {{ conteo }}%. Última actualización: {{ fechaHora }}
            </p>
          </div>
        </div>
        <PresidencialTopThreeCards variant="new" :candidatos="topCandidatos" />
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
import PresidencialTopThreeCards from '../components/widget/PresidencialTopThreeCards.vue'
import {
  computeTopCandidatos,
  computeConteoFromTop,
  computeFechaHoraFromTop,
} from '../utils/presidencialWidget'

export default {
  name: 'NewWidget',
  components: {
    PresidencialTopThreeCards,
  },
  setup() {
    const store = useCandidatosStore()
    const refs = storeToRefs(store)
    return { ...refs, store, candidatos: refs.todos }
  },
  mounted() {
    this.store.getAllCandidatos()
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
  },
}
</script>
