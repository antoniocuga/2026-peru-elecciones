<template>
  <div class="">
     <div class="row border-bottom justify-content-center pb-5">
        <div class="col-md-12">
          <congresoGrafico />
        </div>
      </div>  
      <div class="tooltip_congresista"></div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useCandidatosStore } from '../stores/candidatos'
import congresoGrafico from '../components/congresoGrafico.vue';

const store = useCandidatosStore()

onMounted(() => {
  store.getAllCandidatos()
  store.getAllCongreso()
})
</script>
