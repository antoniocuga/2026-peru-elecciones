<template>
  <div class="row resultado-nacional">
    <div class="col-6 titulo text-left">Elecciones 2016 (primera vuelta)</div>
    <div class="col-6 text-right">
      <b-button @click="openResultados=!openResultados" class="btn"> {{ openResultados ? 'Cerrar' : 'Ver resultados'}}</b-button>
    </div>
    <b-collapse v-model="openResultados" id="resultados2016" class="col-12">
      <b-tabs>
        <b-tab class="" title="Datos de la votacion">
          <div class="row">
            <div class="col-6 text-left">
              <div>Electores habiles</div>        
            </div>
            <div class="col-6 text-right">
              <div>22901954</div>
            </div>
          </div>
          <div class="row"><div class="col-6">ciudadanos que no votaron</div><div class="col-6">895785</div></div>
          <div class="row"><div class="col-6">voto en blanco/nulo</div><div class="col-6">votos emitidos</div></div>

        </b-tab>
        <b-tab title="Por partidos">
          <div class="row"><div class="col-6">Partido Morado</div><div class="col-6">12354</div></div>
          <div class="row"><div class="col-6">Juntos por el Perú</div><div class="col-6">12354</div></div>
          <div class="row"><div class="col-6">fuerza popular</div><div class="col-6">123654</div></div>
          <div class="row"><div class="col-6">renovacion popular</div><div class="col-6">12354</div></div>
        </b-tab>
      </b-tabs>
    </b-collapse>
  </div>
</template>

<script>

  export default {
    name: "elecciones2016",
    data() {
      return {
        openResultados: false
      }
    }
  }

</script>