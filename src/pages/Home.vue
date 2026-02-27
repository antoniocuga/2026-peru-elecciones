<template>
  <div>
    <nav class="navbar navbar-ojo-publico">
      <div class="container text-center">
        <a class="navbar-brand" href="https://www.ojo-publico.com/">
          <img src="../assets/logo.png" alt="Ojo Público" />
        </a>
      </div>
    </nav>
    <div class="container">
      <div class="row justify-content-center mb-5 mt-5">
        <div class="col-12 col-md-8 text-center">
          <h3 class="page-section-tag"><a href="https://ojo-publico.com/elecciones-2026" target="_blank" rel="noopener">Elecciones 2026</a></h3>
          <h1 class="page-app-title text-center">Resultados ONPE Elecciones 2026</h1>
        </div>
        <div class="credits col-12 text-center">
          Por <a href="https://ojo-publico.com/autor/ojopublico" target="_blank" rel="noopener">OjoPúblico</a>
        </div>
        <div class="col-12 col-md-8 mt-5 text-center">
          <p>Sigue los resultados de la ONPE en tiempo real: primera vuelta, segunda vuelta y conformación del Congreso.</p>
        </div>
        <div class="col-12 text-center mt-3 mb-3">
          <SharingOptions />
        </div>
      </div>

      <div class="row pt-3 mt-5 border-bottom">
        <div class="col-12 col-sm-12 col-md-12 subtitle">
          <h2>Segunda vuelta
            <BButton variant="light" id="popover-target-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
            </BButton>
            <BPopover target="popover-target-1" triggers="hover" placement="bottom">
              <div class="small">*El especial extrae información del sitio web de la ONPE periódicamente. Puede existir un desfase con la última actualización oficial. Consulte onpe.gob.pe para cifras oficiales.</div>
            </BPopover>
          </h2>
          <span class="line"></span>
          <p>La Oficina Nacional de Procesos Electorales (ONPE) brinda la información preliminar de las mesas de votación. El conteo final se completa en los días siguientes.</p>
        </div>
        <MapaEleccionesSegunda />
        <div class="tooltip tooltip-data mobile-results" id="tooltip_primera"></div>
        <div class="tooltip tooltip-data mobile-results" id="tooltip_segunda"></div>
      </div>

      <div class="row pt-3 mt-5 border-bottom">
        <div class="col-12 col-sm-12 col-md-12 subtitle">
          <h2>Resultados de primera vuelta
            <BButton variant="light" id="popover-target-1-primera">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
            </BButton>
            <BPopover target="popover-target-1-primera" triggers="hover" placement="bottom">
              <div class="small">*El especial extrae información del sitio web de la ONPE periódicamente. Los porcentajes pueden variar respecto a las cifras oficiales de forma temporal.</div>
            </BPopover>
          </h2>
          <span class="line"></span>
          <p>Resultados de primera vuelta por departamento y distrito.</p>
        </div>
        <MapaElecciones />
        <div class="tooltip tooltip-data mobile-results"></div>
      </div>

      <div class="row border-bottom justify-content-center pb-5">
        <div class="col-12 mb-3 subtitle mt-5">
          <h2>Congreso (2026-2031)
            <BButton variant="light" id="popover-target-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
            </BButton>
            <BPopover target="popover-target-2" triggers="hover" placement="bottom">
              <div class="small">*El especial extrae información del sitio web de la ONPE periódicamente. Los porcentajes pueden variar respecto a las cifras oficiales de forma temporal.</div>
            </BPopover>
          </h2>
          <span class="line"></span>
          <p>Distribución de escaños por partido y lista de congresistas elegidos.</p>
        </div>
        <div class="col-12">
          <CongresoGrafico />
        </div>
      </div>

      <div class="tooltip_congresista"></div>

      <div class="row">
        <div class="col-12 mt-3 col-md-9">
          <div class="row">
            <div class="col-12 subtitle mt-5">
              <h2>Comparativo primera vuelta
                <BButton variant="light" id="popover-target-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                  </svg>
                </BButton>
                <BPopover target="popover-target-3" triggers="hover" placement="bottom">
                  <div class="small">*El especial extrae información del sitio web de la ONPE periódicamente.</div>
                </BPopover>
              </h2>
              <span class="line"></span>
              <p>Comparativo histórico de resultados de primera vuelta.</p>
            </div>
            <div class="col-12">
              <SegundaVuelta />
            </div>
          </div>
          <div class="row">
            <div class="col-12 mb-3 subtitle mt-3">
              <h2>Parlamentarios más votados
                <BButton variant="light" id="popover-target-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                  </svg>
                </BButton>
                <BPopover target="popover-target-4" triggers="hover" placement="bottom">
                  <div class="small">*El especial extrae información del sitio web de la ONPE periódicamente.</div>
                </BPopover>
              </h2>
              <span class="line"></span>
              <p>Ranking de congresistas más votados por región.</p>
            </div>
            <div class="col-12">
              <TopCongreso />
            </div>
          </div>
        </div>
        <div class="col-12 mt-3 col-md-3">
          <BannerSidebar />
        </div>
      </div>
    </div>

    <div class="container-fluid bg-gray mt-5 pt-3 pb-3">
      <Articulos />
    </div>

    <div class="container pt-5 pb-5 bg-footer">
      <div class="row justify-content-center mt-3">
        <div class="col-12 fuentes text-center mb-5">
          <h4>Créditos:</h4>
          <div>Dirección: Óscar Castilla.</div>
          <div>Equipo: Gianfranco Huamán, Gianfranco Rossi y Ernesto Cabral.</div>
          <div>Desarrollo web: Antonio Cucho Gamboa</div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCandidatosStore } from '../stores/candidatos'
import MapaElecciones from '../components/MapaEleciones.vue'
import MapaEleccionesSegunda from '../components/MapaEleccionesSegunda.vue'
import SharingOptions from '../components/SharingOptions.vue'
import CongresoGrafico from '../components/congresoGrafico.vue'
import Footer from '../components/Footer.vue'
import SegundaVuelta from '../components/SegundaVuelta.vue'
import TopCongreso from '../components/TopCongreso.vue'
import BannerSidebar from '../components/BannerSidebar.vue'
import Articulos from '../components/Articulos.vue'

const store = useCandidatosStore()
const { todos: candidatos, congresistas } = storeToRefs(store)

onMounted(() => {
  store.getAllCandidatos()
  store.getAllCongreso()
})
</script>
