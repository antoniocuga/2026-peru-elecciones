<template>
  <div>
    <div class="mt-3 p-3 border rounded bg-light small">
      <div class="font-weight-bold mb-2">Participación ciudadana</div>

     
      <div class="d-flex justify-content-between">
        <span>Electores hábiles</span>
        <span style="font-size:16px;font-weight: 600;">{{ formatNumber(contexto.habiles) }}</span>
      </div>

      <div class="d-flex justify-content-between border-top pt-2">
        <span>Participación</span>
        <span style="font-size:16px;font-weight: 600;">{{ formatPct(contexto.participacion) }}</span>
      </div>

      <div class="d-flex justify-content-between border-top pt-2">
        <span>Ausentismo</span>
        <span style="font-size:16px;font-weight: 600;">{{ formatPct(contexto.ausentismo) }}</span>
      </div>


    </div>
    <div class="p-3 border rounded bg-light small ">
     <div class="d-flex justify-content-between pb-2">
        <span>Total votos emitidos</span>
        <span style="font-size:16px;font-weight: 600;">{{ formatNumber(contexto.blanco) }}</span>
      </div>
      <div class="d-flex justify-content-between pb-2">
        <span>Votos validos</span>
        <span style="font-size:16px;font-weight: 600;">{{ formatPct(contexto.blanco) }}</span>
      </div>
      <div class="d-flex justify-content-between pb-2">
        <span>Votos en blanco</span>
        <span style="font-size:16px;font-weight: 600;">{{ formatPct(contexto.blanco) }}</span>
      </div>
      <div class="d-flex justify-content-between border-top pt-2">
        <span>Votos nulo</span>
        <span  style="font-size:16px;font-weight: 600;">{{ formatPct(contexto.nulo) }}</span>
      </div>
    </div>

    
  </div>
</template>

<script>
export default {
  name: 'ContextoElectoralPanel',
  props: {
    contexto: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    formatPct(value) {
      if (value == null) return '—'
      return `${Number(value).toFixed(2)}%`
    },
    formatNumber(value) {
      if (value == null) return '—'
      return new Intl.NumberFormat('es-PE').format(Math.round(Number(value)))
    },
  },
}
</script>
