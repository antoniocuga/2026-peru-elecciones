<template>
  <div class="container-widget resultados2021">
    <div class="row">
      <div class="col-12 mb-3 text-center">
        <SharingOptions />
      </div>
      <div class="col-12 top-candidates pt-3 pb-3">
        <div class="encuesta-wrapper ">
          <topWidget />
        </div>      
      </div>
      <div class="col-12 top-candidates pt-3 pb-3">
        <div class="encuesta-wrapper text-center">
          <a  target="_parent" href="https://ojo-publico.com/especiales/resultados-onpe-elecciones-2021/" class="btn btn-danger">Ver todos los resultados</a>
        </div>      
      </div>
    </div>
  </div>
</template>
<script>
  
  import SharingOptions from '../components/SharingOptions.vue'
  import topWidget from '../components/topWidget.vue'

  export default  {
    name: "Widget",
    components: {
      SharingOptions,
      topWidget
    },
    created () {
      this.$store.dispatch('candidatos/getAllCandidatos')
    }
  }
  
</script>