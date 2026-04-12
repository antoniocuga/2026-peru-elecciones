<template>
  <div class="">
     <div>
        <div class="">
          <congresoGrafico />
        </div>
      </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useCandidatosStore } from '../stores/candidatos'
import congresoGrafico from '../components/congresoGrafico.vue'

const store = useCandidatosStore()

onMounted(() => {
  store.getAllCandidatos()
  store.getAllCongreso()
  store.getAllSenado()
})
</script>
