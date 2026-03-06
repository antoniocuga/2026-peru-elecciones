<template>
  <div class="">
    <div class="row">
      <div class="col-8">
        <SegundaVuelta/>
      </div>

      <div class="col-md-4">
            
        <div class="footer__subscribe">
          <a href="/suscripcion-boletin?utm_source=footer_op" title="Suscríbase a nuestro boletín">
              <img alt="Suscripción a boletín" src="https://ojo-publico.com/sites/default/files/2025-02/boletin-footer-op.gif"/>
          </a>
        </div>

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