<template>
  <div class="">
        <div class="mapa">
          <MapaEleciones/>
        </div>
  </div>
</template>
<script setup>

import { onMounted } from 'vue'
import { useCandidatosStore } from '../stores/candidatos'  
import MapaEleciones from '../components/MapaEleciones.vue';

const store = useCandidatosStore()

onMounted(() => {
  store.getAllCandidatos()
  store.getAllCongreso()
}) 

  
  
</script>