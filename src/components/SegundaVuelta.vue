<template>  
    <div class="row">
        <div class="col-12">           

          <ul> 
            <li :key="eleccion.validos" v-for="eleccion in segunda_vuelta">
              {{segunda_vuelta}}

            </li>
          </ul>
            


        </div>
        
    </div>
    

</template>

<script>

  
  
  export default {
    name: 'SegundaVuelta.vue',
    data() {
        return require('../data/segunda_vuelta.json')
      },
      
    
  }

</script>