<template>
  <div class="">
    <div class="row">
      <div class="col-12 col-md-8">            
          <TopCongreso/>
      </div>
      <div class="col-4">            
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
import TopCongreso from '../components/TopCongreso.vue';

const store = useCandidatosStore()

onMounted(() => {
  store.getAllCandidatos()
  store.getAllCongreso()
  store.getAllSenado()
}) 
  
  
</script>