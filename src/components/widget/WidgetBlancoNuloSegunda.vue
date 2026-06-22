<template>
  <div class="widget-blanco-nulo row justify-content-center p-3 mt-1">
    <div class="col-3 col-md-2 p-0 small mb-1 text-center">
      <span>Votos emitidos</span>
      <div class="large">{{ formatVotos(datos.emitidos?.votos) }}</div>
      <div></div>
    </div>
    <div class="col-3 col-md-2 small p-0 mb-1 align-self-center text-center">
      <span>Válidos</span>
      <div class="large">
        <template v-if="datos.validos">
          <div v-if="datos.validos.votos != null">{{ formatVotos(datos.validos.votos) }}</div>
          <div v-if="datos.validos.pct != null" class="widget-votos-pct">{{ formatPct(datos.validos.pct) }}</div>
        </template>
        <div v-else>—</div>
      </div>
    </div>
    <div class="col-3 col-md-2 small p-0 mb-1 align-self-center text-center">
      <span>En blanco</span>
      <div class="large">
        <template v-if="datos.blanco">
          <div v-if="datos.blanco.votos != null">{{ formatVotos(datos.blanco.votos) }}</div>
          <div v-if="datos.blanco.pct != null" class="widget-votos-pct">{{ formatPct(datos.blanco.pct) }}</div>
        </template>
        <div v-else>—</div>
      </div>
    </div>
    <div class="col-3 col-md-2 small p-0 mb-1 align-self-center text-center">
      <span>Nulos</span>
      <div class="large">
        <template v-if="datos.nulo">
          <div v-if="datos.nulo.votos != null">{{ formatVotos(datos.nulo.votos) }}</div>
          <div v-if="datos.nulo.pct != null" class="widget-votos-pct">{{ formatPct(datos.nulo.pct) }}</div>
        </template>
        <div v-else>—</div>
      </div>
    </div>
    <div class="col-12 col-md-4 small mb-1 align-self-center text-center mt-2 mt-md-0">
      <a href="https://ojo-publico.com/6202/resultados-presidenciales-elecciones-2026-onpe?ref=home" class="btn btn-light text-dark small bold">Ver resultados</a>
    </div>
  </div>
</template>

<script>
import { formatValidosPct, formatVotos } from '../../utils/formatText'

export default {
  name: 'WidgetBlancoNuloSegunda',
  props: {
    datos: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    formatVotos,
    formatPct(value) {
      return formatValidosPct(value)
    },
  },
}
</script>

<style lang="scss">
.widget-blanco-nulo {
  font-size: 12px;
  border-radius: 45px;
  max-width: 820px;
  margin: 0 auto;
  background-color: #293c48 !important;
  color: #e3e3e3;

  @media (max-width: 768px) {
    border-radius: 0;
  }
}

.widget-blanco-nulo .large {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}

.widget-blanco-nulo .widget-votos-pct {
  font-size: 12px;
  font-weight: 400;
  opacity: 0.95;
}
</style>
