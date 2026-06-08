<template>
  <div>
    <div class="p-3 border rounded bg-light small">
      <div class="font-weight-bold mb-2">Participación ciudadana</div>

      <div class="d-flex justify-content-between">
        <span>Electores hábiles</span>
        <span style="font-size:14px;font-weight: 600;">{{ formatVotos(contexto.habiles) }}</span>
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
        <span>Votos emitidos</span>
        <span style="font-size:14px;font-weight: 600;">{{ formatVotos(contexto.emitidos) }}</span>
      </div>

      <div class="d-flex justify-content-between border-top pt-2">
        <span>Votos válidos</span>
        <span style="font-size:14px;font-weight: 600;">{{ formatValidosLine() }}</span>
      </div>

      <div class="d-flex justify-content-between border-top pt-2">
        <span>Votos en blanco</span>
        <span style="font-size:14px;font-weight: 600;">{{ formatBlancoNuloLine(contexto.blancoVotos, contexto.blanco) }}</span>
      </div>

      <div class="d-flex justify-content-between border-top pt-2">
        <span>Votos nulos</span>
        <span style="font-size:14px;font-weight: 600;">{{ formatBlancoNuloLine(contexto.nuloVotos, contexto.nulo) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatValidosPct, formatVotos, formatVotosConPct } from '../utils/formatText'

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
      const { blanco, nulo, validosVotos, emitidos } = this.contexto
      if (validosVotos != null && emitidos > 0) {
        return Math.round((validosVotos / emitidos) * 100000) / 1000
      }
      if (blanco == null || nulo == null) return null
      return Math.max(0, Math.round((100 - blanco - nulo) * 1000) / 1000)
    },
  },
  methods: {
    formatVotos,
    formatPct(value) {
      return formatValidosPct(value)
    },
    formatValidosLine() {
      return formatVotosConPct(this.contexto.validosVotos, this.validosPct)
    },
    formatBlancoNuloLine(votos, pct) {
      return formatVotosConPct(votos, pct)
    },
  },
}
</script>
