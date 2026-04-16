<template>
  <template v-for="(c, i) in candidatos" :key="c.candidato_id">
    <div class="col-12 col-md-4 p-1 ej2026-pres-top-card-wrap">
      
        <div
          class="ej2026-embed-card card card-candidate border-1 ej2026-pres-top-card"
          :class="[
            i === 0 ? 'custom-rounded-left  border-right' : i === 2 ? 'custom-rounded-right  border-left' : '',
            { 'home-widget__card--waiting ej2026-pres-top-card--placeholder': isPresidentialPlaceholder(c) },
          ]"
        >
          <div class="card-body d-flex align-items-center justify-content-between p-2 ej2026-pres-card-body">
            <div
              v-if="isPresidentialPlaceholder(c)"
              class="home-widget__avatar-placeholder ej2026-pres-avatar-ph rounded-circle border border-2 flex-shrink-0"
              role="img"
              aria-hidden="true"
            />
            <img
              v-else
              :src="getImageCandidate(c.candidato_id)"
              class="rounded-circle border border-3 flex-shrink-0 img-candidato"
              :style="`border-color: ${c.color} !important;`"
              alt="Foto de candidato a la presidencia del Perú"
            />
            <div class="ms-2 text-dark text-start flex-grow-1 min-w-0 ej2026-pres-copy">
              <p
                class="p-0 candidato-nombre mb-1 ej2026-pres-line"
                :class="{ 'text-light ej2026-pres-line--placeholder': isPresidentialPlaceholder(c) }"
              >{{ c.candidato }}</p>
              <p
                class="p-0 partido-nombre mb-0 ej2026-pres-line"
                :class="{ 'text-light ej2026-pres-line--placeholder': isPresidentialPlaceholder(c) }"
              >
                <img
                  v-if="!isPresidentialPlaceholder(c)"
                  width="20"
                  height="20"
                  class="partido-icon"
                  :src="getImagePartido(c.partido_id)"
                  alt=""
                />
                {{ isPresidentialPlaceholder(c) ? c.partido : capitalizeWords(c.partido) }}
              </p>
              <p
                  v-if="!isPresidentialPlaceholder(c) && leadGap(i) > 0"
                  style="font-size: 10px;"
                  class="m-0 p-0  votos-top d-inline badge badge-light text-dark text-left"
                >
                  Ganando por +{{ numeral(leadGap(i)).format('0,0') }}
                </p>
            </div>
            <div
              class="ms-2 flex-shrink-0 text-light overflow-hidden justify-content-end me-3 ej2026-pres-stats"
              style="min-width: clamp(3.25rem, 18vw, 4.5rem); line-height: 0.5em"
              :class="{ 'ej2026-pres-stats--placeholder': isPresidentialPlaceholder(c) }"
            >
              <div class="d-block text-right align-items-baseline flex-wrap">
                <span
                  class="porcentaje-top d-block ej2026-pres-pct"
                  :style="`font-size: 1.1rem; color: ${isPresidentialPlaceholder(c) ? WIDGET_PLACEHOLDER_COLOR : c.color}`"
                >
                  {{ c.validos.toFixed(2) }}%
                </span>
                <span style="font-size: 0.7rem;" class="votos-top m-1 p-0 d-block">
                  {{ numeral(c.votos).format('0,0') }}
                </span>
                <span>
                  Votos
                </span>
              </div>
            </div>
          </div>
        </div>
      
    </div>
  </template>
</template>

<script>
import numeral from 'numeral'
import { getPartidoImage, getCandidatoImage } from '../../utils/assets'
import { capitalizeWords } from '../../utils/formatText'
import {
  WIDGET_PLACEHOLDER_COLOR,
  isPresidentialPlaceholder as isPresPlaceholder,
} from '../../utils/presidencialWidget'

export default {
  name: 'PresidencialTopThreeCards',
  props: {
    candidatos: { type: Array, required: true },
    /** `home`: placeholders + embed styling; `new`: compact embed without placeholders */
    variant: {
      type: String,
      default: 'home',
      validator: (v) => v === 'home' || v === 'new',
    },
  },
  data() {
    return {
      WIDGET_PLACEHOLDER_COLOR,
    }
  },
  methods: {
    numeral,
    capitalizeWords,
    getImageCandidate(id) {
      return getCandidatoImage(id)
    },
    getImagePartido(id) {
      return getPartidoImage(id)
    },
    isPresidentialPlaceholder(c) {
      return isPresPlaceholder(c)
    },
    votosOf(c) {
      return Number(c?.votos ?? c?.total_votos ?? c?.total ?? 0) || 0
    },
    leadGap(i) {
      if (i < 0 || i > 1) return 0
      const current = this.votosOf(this.candidatos[i])
      const next = this.votosOf(this.candidatos[i + 1])
      return Math.max(0, current - next)
    },
    leadGapLabel(i) {
      return i === 0 ? '2do' : '3ro'
    },
  },
}
</script>

<style scoped>
.home-widget__card--waiting {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15) !important;
}

.home-widget__avatar-placeholder {
  width: 56px;
  height: 56px;
  min-width: 56px;
  background-color: #ADB5BD;
  border-color: rgba(255, 255, 255, 0.35) !important;
}

/* Nombre/partido: ocupa el espacio flexible; en pantallas angostas no forzar 170px fijos */
.ej2026-pres-copy {
  min-width: 0;
  overflow-wrap: break-word;
}

@media (min-width: 576px) {
  .ej2026-pres-copy {
    min-width: min(170px, 42vw);
  }
}

@media (min-width: 768px) {
  .ej2026-pres-copy {
    min-width: 170px;
  }
}
</style>
