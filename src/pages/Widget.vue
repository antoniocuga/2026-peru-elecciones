<template>
  <div class="container-widget">
    <div class="row">
      <div class="col-12 text-center">
        <SharingOptions />
      </div>
      <div class="col-12 periodo-wrapper">
        <div class="encuesta-wrapper">
        </div>      
      </div>
    </div>
  </div>
</template>
<script>
  
  import SharingOptions from '../components/SharingOptions.vue'

  export default  {
    name: "Widget",
    components: {
      SharingOptions
    }
  }
  
</script>