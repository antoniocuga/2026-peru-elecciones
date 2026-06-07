<template>
  <div>
    <div class="p-3 border rounded bg-light small">
      <div class="font-weight-bold mb-2">Participación ciudadana</div>

      <div class="d-flex justify-content-between">
        <span>Electores hábiles</span>
        <span style="font-size:14px;font-weight: 600;">{{ formatNumber(contexto.habiles) }}</span>
      </div>

      <div class="d-flex justify-content-between border-top pt-2">
        <span>Participación</span>
        <span style="font-size:14px;font-weight: 600;">{{ formatPct(contexto.participacion) }}</span>
      </div>

      <div class="d-flex justify-content-between border-top pt-2">
        <span>Ausentismo</span>
        <span style="font-size:14px;font-weight: 600;">{{ formatPct(contexto.ausentismo) }}</span>
      </div>
    </div>

    <div class="p-3 border rounded bg-light small mt-3">
      <div class="font-weight-bold mb-2">Cantidad de votos</div>

      <div class="d-flex justify-content-between border-top pt-2">
        <span>Total votos emitidos</span>
        <span style="font-size:14px;font-weight: 600;">{{ formatNumber(contexto.emitidos) }}</span>
      </div>

      <div class="d-flex justify-content-between border-top pt-2">
        <span>Votos válidos</span>
        <span style="font-size:14px;font-weight: 600;">{{ formatPct(validosPct) }}</span>
      </div>

      <div class="d-flex justify-content-between border-top pt-2">
        <span>Votos en blanco</span>
        <span style="font-size:14px;font-weight: 600;">{{ formatPct(contexto.blanco) }}</span>
      </div>

      <div class="d-flex justify-content-between border-top pt-2">
        <span>Votos nulos</span>
        <span style="font-size:14px;font-weight: 600;">{{ formatPct(contexto.nulo) }}</span>
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
  computed: {
    validosPct() {
      if (this.contexto.validos != null) return this.contexto.validos
      const { blanco, nulo } = this.contexto
      if (blanco == null || nulo == null) return null
      return Math.max(0, 100 - blanco - nulo)
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
