<template>
  <div class="">
    <div class="row">
      <div class="col-12">            
          <TopCongreso/>
      </div>
    </div>
  </div>
</template>
<script setup>   
import { onMounted } from 'vue'
import { useCandidatosStore } from '../stores/candidatos'
import TopCongreso from '../components/TopCongreso.vue';

const store = useCandidatosStore()

onMounted(() => {
  store.getAllCandidatos()
  store.getAllCongreso()
}) 
  
  
</script>