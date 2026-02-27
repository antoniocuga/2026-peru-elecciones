<template>
  <div class="container-widget resultados2021">
    <div class="row">
      <div class="col-12 mb-3 text-center">
        <SharingOptions />
      </div>
      <div class="col-12 top-candidates pt-3 pb-3">
        <div class="encuesta-wrapper">
          <TopWidget />
        </div>
      </div>
      <div class="col-12 top-candidates pt-3 pb-3">
        <div class="encuesta-wrapper text-center">
          <a target="_blank" rel="noopener" href="https://ojo-publico.com/especiales/resultados-onpe-elecciones-2026/" class="btn btn-danger">Ver todos los resultados</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCandidatosStore } from '../stores/candidatos'
import SharingOptions from '../components/SharingOptions.vue'
import TopWidget from '../components/topWidget.vue'

const store = useCandidatosStore()

onMounted(() => {
  store.getAllCandidatos()
  store.getAllCongreso()
})
</script>
