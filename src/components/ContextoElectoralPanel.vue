<template>
  <div class="mt-3 p-3 border rounded bg-light small">
    <div class="font-weight-bold mb-2">Datos sobre la segunda vuelta</div>

    <div class="d-flex justify-content-between">
      <span>Participación</span>
      <span>{{ formatPct(contexto.participacion) }}</span>
    </div>
    <div class="d-flex justify-content-between">
      <span>Ausentismo</span>
      <span>{{ formatPct(contexto.ausentismo) }}</span>
    </div>
    <div class="d-flex justify-content-between">
      <span>Blanco</span>
      <span>{{ formatPct(contexto.blanco) }}</span>
    </div>
    <div class="d-flex justify-content-between">
      <span>Nulo</span>
      <span>{{ formatPct(contexto.nulo) }}</span>
    </div>
    <div class="d-flex justify-content-between">
      <span>Blanco + Nulo</span>
      <span>{{ formatPct(contexto.blancoNulo) }}</span>
    </div>

    <hr class="my-2" />

    <div class="d-flex justify-content-between">
      <span>Actas contabilizadas</span>
      <span>{{ formatPct(contexto.actasContabilizadas) }}</span>
    </div>
    <div class="d-flex justify-content-between">
      <span>Votos emitidos</span>
      <span>{{ formatNumber(contexto.emitidos) }}</span>
    </div>
    <div class="d-flex justify-content-between">
      <span>Electores hábiles</span>
      <span>{{ formatNumber(contexto.habiles) }}</span>
    </div>

    <div class="text-muted mt-2">
      *Porcentaje de candidatos calculado sobre votos válidos.
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
