<template>  
    <div class="row">
        <div class="col-12">           

          <ul> 
            <li :key="segunda_vuelta" v-for="segunda_vuelta">
              {{elecion}}

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