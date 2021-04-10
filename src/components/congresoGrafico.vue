<template>
  <div class="congreso-grafico">
    <div>
      <svg height="400" width="100%">
        <g id="parliament"></g>
      </svg>
    </div>
    <div class="filters">
      <b-dropdown text="Nacional" variant="dark" class="m-2 departamento-menu">
        <b-dropdown-item>
          <a>Nacional</a>
          <a>Lima metropolitana</a>
          <a>Lima Provincias</a>
        </b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>

  import * as d3 from 'd3'
  import * as parliament from 'd3-parliament-chart'

  export default {
    name: 'congresoGrafico.vue',
    mounted() {

      d3.select('g#parliament').call(
        parliament.parliamentChart([], 600).aggregatedData([{ seats: 10, color: 'blue' }, { seats: 30, color: 'green' }, { seats: 10, color: 'black' }, { seats: 50, color: 'red' },  { seats: 5, color: 'pink' },  { seats: 10, color: 'aquamarine' },  { seats: 15, color: 'yellow' }])
        .debug(false)
        .sections(5)
        .sectionGap(10)
        .seatRadius(10)
        .rowHeight(25)
      )
    }
  }

</script>