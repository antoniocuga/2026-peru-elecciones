<template>
  <div class="">
    <div class="row">
            <div class="col-12 mb-3 subtitle mt-3">
              <h2>Parlamentarios más votados en dos décadas <b-button variant="light" id="popover-target-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
              </b-button>
              <b-popover target="popover-target-4" triggers="hover" placement="bottom">
                <div class="small">*El especial extrae información del sitio web de la ONPE cada 20 minutos. Esto puede generar un desfase breve con respecto a su última actualización. Por dicho motivo, los porcentajes de votación y cantidad de votos pueden aparecer diferentes a las cifras oficiales, temporalmente.</div>
              </b-popover></h2>          
              <span class="line"></span>
              <p>Dos hijos del condenado expresidente Alberto Fujimori han sido los congresistas más votados en las últimas elecciones: Keiko en el 2006 y Kenji Fujimori en 2011 y en 2016. El exgeneral del Ejército, Daniel Urresti, tomó la posta en los comicios legislativos extraordinarios del 2020.</p>
            </div>
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