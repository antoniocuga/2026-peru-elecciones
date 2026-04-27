<template>
  <div class="mapa">
    <MapaEleccionesSegunda />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCandidatosStore } from '../stores/candidatos'
import MapaEleccionesSegunda from '../components/MapaEleccionesSegunda.vue'

const store = useCandidatosStore()

onMounted(() => {
  store.getAllCandidatosSegunda()
})
</script>
