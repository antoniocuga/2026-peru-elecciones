<template>
  <div class="congreso-lista-widget">
    <CongresoLista />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCandidatosStore } from '../stores/candidatos'
import CongresoLista from '../components/CongresoLista.vue'

const store = useCandidatosStore()

onMounted(() => {
  store.getAllCongreso()
})
</script>
