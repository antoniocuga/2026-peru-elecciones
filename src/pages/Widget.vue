<template>
  <div class="container-widget">
    <div class="row">
      <div class="col-12 mb-3 text-center">
        <SharingOptions />
      </div>
      <div class="col-12 periodo-wrapper">
        <div class="encuesta-wrapper">
          <Embed />
        </div>      
      </div>
    </div>
  </div>
</template>
<script>
  
  import SharingOptions from '../components/SharingOptions.vue'
  import Embed from '../components/Embed.vue'

  export default  {
    name: "Widget",
    components: {
      SharingOptions,
      Embed
    }
  }
  
</script>