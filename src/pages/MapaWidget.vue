<template>
  <div class="">
    <div class="row">
      <div class="col-md-12">
        <div class="mapa">
          <MapaEleciones/>
        </div>
      </div>
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