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
        <div class="col-12 text-center">
            <h1 class="page-app-title text-center">Resultados Elecciones 2021</h1>
        </div>            
      </div>
      <div class="credits col-12 text-center">
        Por <a href="https://ojo-publico.com/autor/ojopublico" target="_blank">OjoPúblico</a>
      </div>
      <div class="row ">
          <div class="col-12 text-center mt-3 mb-3">
              <SharingOptions/>
          </div>
      </div>
      <div class="row ">
          <div class="col-12 text-center mt-3">
              <CuentaRegresiva/>
          </div>
      </div>
      <div class="row pt3 mt-5">
              <div class="col-12 col-md-12 mb-3 subtitle border-bottom">
                  <h2>Revisa el conteo final de los votos a nivel nacional.</h2>
                  <span class="line"></span>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga odio eaque libero labore aperiam provident, maxime repudiandae ipsum voluptatem corporis expedita dignissimos ad facilis, ipsa magni facere itaque officiis iste.
                  </p>
              </div>

              <MapaElecciones />             

              <div class="row pt-3 mt-5">
                <div class="col-12 mb-3 subtitle mt-5 border-bottom">
                  <h2>Votos de congresistas por departamento.</h2>
                  <span class="line"></span>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga odio eaque libero labore aperiam provident, maxime repudiandae ipsum voluptatem corporis expedita dignissimos ad facilis, ipsa magni facere itaque officiis iste.
                  </p>
                  </div>
              </div>                         
                    
      </div>    
      <div class="row pt-3 mt-5 border-bottom">
        <div class="col-4">
          <PartidosResultados :candidatos="lista_candidatos" />
        </div>
        <div class="col-8">
          <h1 class="text-center">Lista de congresistas electos por cada region</h1>

        </div>

      </div>

      <Footer/>        
  </div>        
  </div>
  </template>
<script>

  import CuentaRegresiva from '../components/CuentaRegresiva.vue'
  import MapaElecciones from '../components/MapaEleciones.vue'
  import SharingOptions from '../components/SharingOptions.vue'      
  import PartidosResultados from '../components/PartidosResultados.vue'
  import Footer from '../components/Footer.vue'

  import { mapState } from 'vuex'
  import { filter, map, orderBy, groupBy, uniq } from 'lodash'


  export default {
    name: 'Home', 
    components: {
      CuentaRegresiva,
      MapaElecciones,
      SharingOptions,
      PartidosResultados,                 
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
