<template>  
    <div class="row">
        <div class="col-12">
          <ul> 
            <li :key="eleccion.validos" v-for="eleccion in segunda_vuelta">
              {{ eleccion }}
            </li>
          </ul>
        </div>
    </div>
</template>

<script>

  
  
  export default {
    name: 'SegundaVuelta.vue',
    computed: {
      segunda_vuelta() {
        return require('../data/segunda_vuelta.json')
      }
    }
  }

</script>