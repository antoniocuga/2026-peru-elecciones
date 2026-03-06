<template>
  <div class="">
     <div class="row border-bottom justify-content-center pb-5">
        <div class="col-md-12">
          <SenadoGrafico />
        </div>
      </div>  
      <div class="tooltip_congresista tooltip_senado"></div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useCandidatosStore } from '../stores/candidatos'
import SenadoGrafico from '../components/SenadoGrafico.vue';

const store = useCandidatosStore()

onMounted(() => {
  store.getAllCandidatos()
  store.getAllSenado()
})
</script>
