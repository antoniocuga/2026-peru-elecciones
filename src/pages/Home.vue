  <template>

  <div>
      <nav class="navbar navbar-ojo-publico">
          <div class="container">
            <a class="navbar-brand" href="https://www.ojo-publico.com/">
              <img src="../assets/logo.png" />
            </a>
          </div>      
      </nav>
  <div class="container">
      <div class="row justify-content-center mb-5 mt-5">
        <div class="col-8 text-center">
          <h1 class="page-app-title text-center">Candidatos Lescano, Fujimori, Forsyth y Mendoza pelean 
              pase a la segunda vuelta con estrecho margen</h1>
        </div>
        <div class="credits col-12 text-center">
          Por <a href="https://ojo-publico.com/autor/ojopublico" target="_blank">OjoPúblico</a>
        </div>
        <div class="col-8 mt-5 text-center">
          <p>El presidente del Bicentenario, además de enfrentar a la pandemia, deberá gobernar durante cinco años con una bancada en el Congreso que necesitará de alianzas que permitan la gobernabilidad y el equilibrio de poderes para evitar lo ocurrido durante el periodo anterior (2016-2021), que acaba con cuatro presidentes: Pedro Pablo Kuczynski, Martín Vizcarra, Manuel Merino y Francisco Sagasti.</p>
        </div>
        <div class="col-12 text-center mt-3 mb-3">
          <SharingOptions/>
        </div>
      </div>

      <div class="row pt3 mt-5">
        <div class="col-12 col-md-12 mb-3 subtitle border-bottom">
            <h2>Elecciones y conteo bajo pandemia</h2>
            <span class="line"></span>
            <p>La Oficina Nacional de Procesos Electorales (ONPE) enfrentó un gran desafío en la ejecución de las elecciones del Bicentenario. Se espera que el proceso para tener los resultados al 100% demore más de lo normal debido a las condiciones de bioseguridad que se tomarán para evitar infecciones por la Covid-19</p>
        </div>

        <MapaElecciones />
        <!-- Show data in mobile -->
        <div class="tooltip tooltip-data mobile-results"></div>
      </div> 


      <div class="row pt-3 mt-5 border-bottom">
        <div class="col-12 mb-3 subtitle mt-5 border-bottom">
          <h2>Congreso fragmentado (2021-2026)</h2>
          <span class="line"></span>
          <p>Siete partidos tendrán representantes en el Parlamento: Acción Popular, Fuerza Popular, Víctoria Nacional, Juntos por el Perú, Renovación Popular, Avanza País y el Frente Popular Agrícola FIA del Perú (Frepap). Se requerirá un acuerdo de todas las fuerzas políticas para evitar la inestabilidad de los últimos cinco años.</p>
        </div>

        <div class="col-5 resultados2021">
          
          <div class="mapa-resultados-wrapper">
              <PartidosResultados :candidatos="lista_candidatos" />
          </div>          
        </div>
        <div class="col-7">
          <congresoGrafico />
        </div>
      </div>    

      <div class="row">
        <div class="col-12 mb-3 subtitle mt-5 border-bottom">
          <h2>Adiós al ganador contundente en primera vuelta</h2>
          <span class="line"></span>
          <p>En los últimos 20 años, el ganador de la primera vuelta ha sacado amplia ventaja a su rival inmediato. En 2016, Keiko Fujimori superó por 2.8 millones de votos a Pedro Pablo Kuczynski; mientras que Ollanta Humala ganó a Fujimori con 1.1 millones de votos en 2011. En 2006, Humala superó a Alan García por 772 mil votos.</p>
        </div>
        <div class="col-12">
          <SegundaVuelta/>

        </div>
      </div>
      <div class="row">
        <div class="col-12 mb-3 subtitle mt-5 border-bottom">
          <h2>Parlamentarios más votados en dos décadas</h2>          
          <span class="line"></span>
          <p>Dos hijos del condenado expresidente Alberto Fujimori han sido los congresistas más votados en las últimas elecciones: Keiko en el 2006 y Kenji Fujimori en 2011 y en 2016. El exgeneral del Ejército, Daniel Urresti, tomó la posta en los comicios legislativos extraordinarios del 2020.</p>
        </div>
        <div class="col-12">            
            <TopCongreso/>
        </div>
      </div>

      <Footer/>        
  </div>        
  </div>
  </template>
<script>

  import MapaElecciones from '../components/MapaEleciones.vue'
  import SharingOptions from '../components/SharingOptions.vue'      
  import congresoGrafico from '../components/congresoGrafico.vue'
  import PartidosResultados from '../components/PartidosResultados.vue'
  import Footer from '../components/Footer.vue'
  import SegundaVuelta from '../components/SegundaVuelta.vue'
  import TopCongreso from '../components/TopCongreso.vue'
  
  import { mapState } from 'vuex'
  import { filter, map, orderBy, groupBy, uniq } from 'lodash'


  export default {
    name: 'Home', 
    components: {
      MapaElecciones,
      congresoGrafico,
      SharingOptions,
      PartidosResultados,
      SegundaVuelta,
      TopCongreso,                
      Footer
    },
    created () {
      this.$store.dispatch('candidatos/getAllCandidatos')
    },
    computed: {
      ...mapState({
        candidatos: state => state.candidatos.todos
      }),
      data() {
        return require('../data/departamentos.json')
      },
      lista_candidatos() {
        let filtered = filter(this.candidatos, c => c.candidato_id != "")

        return orderBy(map(groupBy(filtered, 'candidato_id'), (d, id) => {
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
