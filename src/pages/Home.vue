  <template>

  <div>
      <nav class="navbar navbar-ojo-publico">
          <div class="container text-centewr">
            <a class="navbar-brand" href="https://www.ojo-publico.com/">
              <img src="../assets/logo.png" />
            </a>
          </div>      
      </nav>
  <div class="container">
      <div class="row justify-content-center mb-5 mt-5">
        <div class="col-12 col-md-8 text-center">
          <h3 class="page-section-tag"><a href="https://ojo-publico.com/elecciones-2021" target="_blank">Elecciones 2021</a></h3>
          <h1 class="page-app-title text-center">Pedro Castillo se enfrentará a Keiko Fujimori en segunda vuelta </h1>
        </div>
        <div class="credits col-12 text-center">
          Por <a href="https://ojo-publico.com/autor/ojopublico" target="_blank">OjoPúblico</a>
        </div>
        <div class="col-12 col-md-8 mt-5 text-center">
          <p>El presidente del Bicentenario, además de enfrentar a la pandemia, deberá gobernar durante cinco años con una bancada en el Congreso que necesitará de alianzas que permitan la gobernabilidad y el equilibrio de poderes para evitar lo ocurrido durante el periodo anterior (2016-2021), que acaba con cuatro presidentes: Pedro Pablo Kuczynski, Martín Vizcarra, Manuel Merino y Francisco Sagasti.</p>
        </div>
        <div class="col-12 text-center mt-3 mb-3">
          <SharingOptions/>
        </div>
      </div>

      <div class="row pt-3 mt-5 border-bottom">
        <div class="col-12 col-sm-12 col-md-12 subtitle">
            <h2>Elecciones y conteo bajo pandemia <b-button variant="light" id="popover-target-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
            </b-button>
            <b-popover target="popover-target-1" triggers="hover" placement="bottom">
              <div class="small">*El especial extrae información del sitio web de la ONPE cada 20 minutos. Esto puede generar un desfase breve con respecto a su última actualización. Por dicho motivo, los porcentajes de votación y cantidad de votos pueden aparecer diferentes a las cifras oficiales, temporalmente.</div>
            </b-popover></h2>
            <span class="line"></span>
            <p>La Oficina Nacional de Procesos Electorales (ONPE) enfrentó un gran desafío en la ejecución de las elecciones del Bicentenario. Se espera que el proceso para tener los resultados al 100% demore más de lo normal, debido a las condiciones de bioseguridad que se tomaron para evitar infecciones por la Covid-19</p>
        </div>

        <MapaEleccionesSegunda />
        <!-- Show data in mobile -->
        <div class="tooltip tooltip-data mobile-results"></div>
      </div> 

      <div class="row pt-3 mt-5 border-bottom">
        <div class="col-12 col-sm-12 col-md-12 subtitle">
            <h2>Resultados de primera vuelta <b-button variant="light" id="popover-target-1-primera">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
            </b-button>
            <b-popover target="popover-target-1-primera" triggers="hover" placement="bottom">
              <div class="small">*El especial extrae información del sitio web de la ONPE cada 20 minutos. Esto puede generar un desfase breve con respecto a su última actualización. Por dicho motivo, los porcentajes de votación y cantidad de votos pueden aparecer diferentes a las cifras oficiales, temporalmente.</div>
            </b-popover></h2>
            <span class="line"></span>
            <p>La Oficina Nacional de Procesos Electorales (ONPE) enfrentó un gran desafío en la ejecución de las elecciones del Bicentenario. Se espera que el proceso para tener los resultados al 100% demore más de lo normal, debido a las condiciones de bioseguridad que se tomaron para evitar infecciones por la Covid-19</p>
        </div>

        <MapaElecciones />
        <!-- Show data in mobile -->
        <div class="tooltip tooltip-data mobile-results"></div>
      </div> 


      <div class="row border-bottom justify-content-center pb-5">
        <div class="col-12 mb-3 subtitle mt-5">
          <h2>Congreso fragmentado (2021-2026) <b-button variant="light" id="popover-target-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
          </b-button>
          <b-popover target="popover-target-2" triggers="hover" placement="bottom">
            <div class="small">*El especial extrae información del sitio web de la ONPE cada 20 minutos. Esto puede generar un desfase breve con respecto a su última actualización. Por dicho motivo, los porcentajes de votación y cantidad de votos pueden aparecer diferentes a las cifras oficiales, temporalmente.</div>
          </b-popover></h2>
          <span class="line"></span>
          <p>Diez partidos tendrán representantes en el Parlamento: Peru Libre, Fuerza Popular, Alianza para el Progreso, Renovación Popular, Acción Popular, Avanza País, Somos Perú, Juntos por el Perú, Podemos Perú, Partido Morado. Se requerirá un acuerdo de todas las fuerzas políticas para evitar la inestabilidad de los últimos cinco años.</p>
        </div>
        <div class="col-12">
          <congresoGrafico />
        </div>
      </div>  
      
      <div class="tooltip_congresista"></div>

      <div class="row">
        <div class="col-12 mt-3 col-md-9">
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
          <div>Equipo: Gianfranco Huamán, Gianfranco Rossi y Ernesto Cabral. </div>
          <div>Desarrollo web: Antonio Cucho Gamboa</div>
        </div>        
      </div>  

      <Footer />
    </div>  

  </div>
  </template>
<script>

  import MapaElecciones from '../components/MapaEleciones.vue'
  import MapaEleccionesSegunda from '../components/MapaEleccionesSegunda.vue'
  import SharingOptions from '../components/SharingOptions.vue'      
  import congresoGrafico from '../components/congresoGrafico.vue'
  import Footer from '../components/Footer.vue'
  import SegundaVuelta from '../components/SegundaVuelta.vue'
  import TopCongreso from '../components/TopCongreso.vue'
  import BannerSidebar from '../components/BannerSidebar.vue'
  import Articulos from '../components/Articulos.vue'
  
  import { mapState } from 'vuex'
  import { filter, map, orderBy, groupBy, uniq } from 'lodash'


  export default {
    name: 'Home', 
    components: {
      Articulos,
      MapaElecciones,
      MapaEleccionesSegunda,
      congresoGrafico,
      SharingOptions,
      SegundaVuelta,
      TopCongreso,                
      Footer,
      BannerSidebar
    },
    created () {
      this.$store.dispatch('candidatos/getAllCandidatos')
      this.$store.dispatch('candidatos/getAllCongreso')
    },
    computed: {
      ...mapState({
        candidatos: state => state.candidatos.todos,
        congresistas: state => state.candidatos.congresistas
      }),
      data() {
        return require('../data/departamentos.json')
      },
      filtered() {
        return filter(this.candidatos, c => c.candidato_id != "")
      },
      lista_candidatos() {
        return orderBy(map(groupBy(this.filtered, 'candidato_id'), (d, id) => {
            return {
              candidato_id: id,
              candidato: uniq(map(d, 'candidato')).join(''),
              partido_id: uniq(map(d, 'partido_id')).join(''),
              partido: uniq(map(d, 'partido')).join(''),
              color: uniq(map(d, 'color')).join(''),
              votos: parseFloat(uniq(map(d, 'nacional')).join('')),
              validos: parseFloat(uniq(map(d, 'validos_nacional')).join('')),
              porcentaje: parseFloat(uniq(map(d, 'validos_nacional')).join(''))
            }
          }), ['porcentaje'], ['desc'])
      },         
	}
}
</script>
