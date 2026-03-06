<template>
  <div class="senado-widget-wrapper">
     <div class="row border-bottom justify-content-center pb-5">
        <div class="col-md-12">
          <SenadoGrafico />
        </div>
      </div>
      <div ref="tooltipEl" class="tooltip_congresista tooltip_senado" aria-hidden="true"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, provide } from 'vue'
import { useCandidatosStore } from '../stores/candidatos'
import SenadoGrafico from '../components/SenadoGrafico.vue'

const store = useCandidatosStore()
const tooltipEl = ref(null)
provide('senadoTooltipRef', tooltipEl)

onMounted(() => {
  store.getAllCandidatos()
  store.getAllSenado()
})
</script>
