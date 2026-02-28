<template>
  <div class="">
    <div class="row">
            <div class="col-12 subtitle mt-5">
              <h2>Adiós al ganador contundente en primera vuelta <b-button variant="light" id="popover-target-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
              </b-button>
              <b-popover target="popover-target-3" triggers="hover" placement="bottom">
                <div class="small">*El especial extrae información del sitio web de la ONPE cada 20 minutos. Esto puede generar un desfase breve con respecto a su última actualización. Por dicho motivo, los porcentajes de votación y cantidad de votos pueden aparecer diferentes a las cifras oficiales, temporalmente.</div>
              </b-popover></h2>
              <span class="line"></span>
              <p>En los últimos 20 años, el ganador de la primera vuelta ha sacado amplia ventaja a su rival inmediato. En 2016, Keiko Fujimori superó por 2.8 millones de votos a Pedro Pablo Kuczynski; mientras que Ollanta Humala ganó a Fujimori con 1.1 millones de votos en 2011. En 2006, Humala superó a Alan García por 772 mil votos.</p>
            </div>
            <div class="col-12">
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