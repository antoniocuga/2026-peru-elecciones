<template>
  <div class="container py-3 pb-0" style="background-color:#506573;">
    <div class="container" v-if="topCandidatos.length">
      <div class="row">
        <div class="col-12">
          <div class="pb-1">
            <p class="small text-light mb-0 text-center" style="font-size:0.75rem; opacity:0.8;">
              Última actualización: {{ fechaHora }}
            </p>
          </div>
        </div>
        <PresidencialTopThreeCards variant="new" :candidatos="topCandidatos" />
        <div class="col-12">
          <div class="text-right text-white mt-2 small text-light">Fuente:ONPE</div>
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
