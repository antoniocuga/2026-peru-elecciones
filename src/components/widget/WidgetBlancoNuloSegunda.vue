<template>
  <div class="widget-blanco-nulo row justify-content-center p-3 mt-1">
    <div class="col-6 col-md-2 p-0 small mb-1 align-self-center text-center">
      <span>Votos emitidos</span>
      <div>
        <span class="large">{{ formatVotos(datos.emitidos?.votos) }}</span>
      </div>
    </div>
    <div class="col-6 col-md-2 small p-0 mb-1 align-self-center text-center">
      <span>Válidos</span>
      <div>
        <span class="large">{{ formatPct(datos.validos?.pct) }}</span>
      </div>
    </div>
    <div class="col-6 col-md-2 small p-0 mb-1 align-self-center text-center">
      <span>En blanco</span>
      <div>
        <span class="large">{{ formatPct(datos.blanco?.pct) }}</span>
      </div>
    </div>
    <div class="col-6 col-md-2 small p-0 mb-1 align-self-center text-center">
      <span>Nulos</span>
      <div>
        <span class="large">{{ formatPct(datos.nulo?.pct) }}</span>
      </div>
    </div>
    <div class="col-12 col-md-4 small mb-1 align-self-center text-center mt-2 mt-md-0">
      <a href="https://ojo-publico.com/6202/resultados-presidenciales-elecciones-2026-onpe?ref=home" class="btn btn-light text-dark small bold">Ver resultados</a>
    </div>
  </div>
</template>

<script>
import { formatValidosPct } from '../../utils/formatText'

export default {
  name: 'WidgetBlancoNuloSegunda',
  props: {
    datos: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    formatPct(value) {
      return formatValidosPct(value)
    },
    formatVotos(value) {
      if (value == null) return '—'
      return new Intl.NumberFormat('es-PE').format(value)
    },
  },
}
</script>

<style lang="scss">
.widget-blanco-nulo {
  border-radius: 45px;
  max-width: 820px;
  margin: 0 auto;
  background-color: #293c48 !important;
  color: #fff;

  @media (max-width: 768px) {
    border-radius: 0;
  }
}

.widget-blanco-nulo .large {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}
</style>
