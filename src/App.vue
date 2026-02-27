<template>
  <div class="wrapper">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCandidatosStore } from './stores/candidatos'

const store = useCandidatosStore()

onMounted(() => {
  store.getAllCandidatos()
  store.getAllCandidatosSegunda()
})
</script>

<style lang="scss">
@use "assets/styles.scss";
</style>
