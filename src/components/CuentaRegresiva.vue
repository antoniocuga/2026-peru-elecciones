<template>
   <div class="container">       
        <div class="row">
            <div class="col-12 text-center">
                
                <h1 class="cuenta-regresiva">Faltan {{ days }} {{ hours }}:{{ minutes }}:{{ seconds }}</h1>
            </div>
    </div>  
    </div>      
</template>

<script>


export default {
    name:'CuentaRegresiva',
    props: {
        data: {
            type: String
        }

    },
    data (){
        return{
            now: 0,
            count: 0,
        }   
    },
    methods: {
        
    },
    computed: {
    
        seconds(){
            return ('59')
        },
        minutes(){
            return ('59')
        },
        hours(){
            return ('00')
        },
        days(){
            return ('11') 
        }
    }
}
</script>
