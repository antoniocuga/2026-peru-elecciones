<template>
  <div class="">
    <div class="row justify-content-center">
      <div class="col-12 col-md-12 col-lg-12">
        <SegundaVuelta/>
      </div>
    </div>
  </div>
</template>
<script setup>  
import { onMounted } from 'vue'
import { useCandidatosStore } from '../stores/candidatos'
import SegundaVuelta from '../components/SegundaVuelta.vue';

const store = useCandidatosStore()

onMounted(() => {
  store.getAllCandidatos()
  store.getAllCongreso()
}) 
  
</script>