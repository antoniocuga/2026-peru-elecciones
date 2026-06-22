<template>
  <div class="col-12 ej2026-pres-pair p-0">
    <div class="row g-2 g-md-0 justify-content-center ej2026-pres-pair__row">
      <div
        v-for="(c, i) in displayCandidatos"
        :key="c.candidato_id"
        class="col-12 col-md-6 col-lg-5 ej2026-pres-top-card-wrap p-0"
      >
        <article
          class="ej2026-embed-card card card-candidate border-1 ej2026-pres-top-card h-100"
          :class="[
            i === 0 ? 'custom-rounded-left border-right' : 'custom-rounded-right border-left',
            { 'home-widget__card--waiting ej2026-pres-top-card--placeholder': isPresidentialPlaceholder(c) },
          ]"
        >
          <div class="ej2026-pres-card-inner">
            <header class="ej2026-pres-header">
              <div class="ej2026-pres-identity">
                <div
                  v-if="isPresidentialPlaceholder(c)"
                  class="home-widget__avatar-placeholder ej2026-pres-avatar-ph rounded-circle border border-2"
                  role="img"
                  aria-hidden="true"
                />
                <img
                  v-else
                  :src="getImageCandidate(c.candidato_id)"
                  class="rounded-circle border border-3 img-candidato ej2026-pres-avatar"
                  :style="`border-color: ${c.color} !important;`"
                  alt="Foto de candidato a la presidencia del Perú"
                />
                <div class="ej2026-pres-identity__text">
                  <p
                    class="p-0 candidato-nombre mb-0 ej2026-pres-line ej2026-pres-name"
                    :class="{ 'text-light ej2026-pres-line--placeholder': isPresidentialPlaceholder(c) }"
                  >
                    {{ c.candidato }}
                  </p>
                  <p
                    class="p-0 partido-nombre mb-0 ej2026-pres-line ej2026-pres-party"
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
                </div>
              </div>

              <div
                class="ej2026-pres-main-stat"
                :class="{ 'ej2026-pres-stats--placeholder': isPresidentialPlaceholder(c) }"
              >
                <span
                  class="porcentaje-top ej2026-pres-pct"
                  :style="`color: ${isPresidentialPlaceholder(c) ? WIDGET_PLACEHOLDER_COLOR : c.color}`"
                >
                  {{ formatValidosPct(c.validos) }}
                </span>
                <span class="ej2026-pres-votes text-secondary">
                  {{ numeral(c.votos).format('0,0') }} votos
                </span>
              </div>
            </header>

            <div
              v-if="!isPresidentialPlaceholder(c) && leadBreakdowns[i]?.length"
              class="ej2026-pres-breakdown"
              role="group"
              :aria-label="`Diferencia de votos de ${c.candidato}`"
            >
              <div
                v-for="row in leadBreakdowns[i]"
                :key="`${c.candidato_id}-${row.key}`"
                class="ej2026-pres-breakdown__cell"
              >
                <span class="ej2026-pres-breakdown__label">{{ row.label }}</span>
                <span
                  class="ej2026-pres-breakdown__value"
                  :class="row.toneClass"
                >
                  <span class="ej2026-pres-lead-arrow" aria-hidden="true">{{ row.arrow }}</span>
                  <span class="ej2026-pres-breakdown__gap">{{ row.sign }}{{ numeral(row.absGap).format('0,0') }}</span>
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import { getPartidoImage, getCandidatoImage } from '../../utils/assets'
import { capitalizeWords, formatValidosPct } from '../../utils/formatText'
import {
  WIDGET_PLACEHOLDER_COLOR,
  WIDGET_PRES_TOP_COUNT,
  isPresidentialPlaceholder as isPresPlaceholder,
  computePresCandidateBreakdown,
  mergeExtranjeroIntoCandidatos,
} from '../../utils/presidencialWidget'

const LEAD_SCOPE_LABELS = {
  total: 'Total',
  nacional: 'Nacional',
  extranjero: 'Extranjero',
}

export default {
  name: 'PresidencialTopTwoCards',
  props: {
    candidatos: { type: Array, required: true },
    candidatosFull: { type: Array, default: () => [] },
    extranjeroRows: { type: Array, default: () => [] },
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
  computed: {
    displayCandidatos() {
      return (this.candidatos || []).slice(0, WIDGET_PRES_TOP_COUNT)
    },
    candidatosSource() {
      const base = (this.candidatosFull?.length ? this.candidatosFull : this.candidatos) || []
      return mergeExtranjeroIntoCandidatos(base, this.extranjeroRows)
    },
    leadBreakdowns() {
      return this.displayCandidatos.map((c, i) => this.buildLeadBreakdownRows(c.candidato_id, i))
    },
  },
  methods: {
    numeral,
    capitalizeWords,
    formatValidosPct,
    opponentFor(index) {
      const top = this.displayCandidatos
      if (top.length < 2) return null
      return top[index === 0 ? 1 : 0]
    },
    buildLeadBreakdownRows(candidatoId, index) {
      const opponent = this.opponentFor(index)
      if (!candidatoId || !opponent || this.isPresidentialPlaceholder({ candidato_id: candidatoId })) {
        return []
      }
      const b = computePresCandidateBreakdown(
        this.candidatosSource,
        candidatoId,
        opponent.candidato_id,
      )
      if (!b) return []
      return ['total', 'nacional', 'extranjero'].map((key) => ({
        key,
        label: LEAD_SCOPE_LABELS[key],
        ...this.formatLeadScope(b[key]),
      }))
    },
    getImageCandidate(id) {
      return getCandidatoImage(id)
    },
    getImagePartido(id) {
      return getPartidoImage(id)
    },
    isPresidentialPlaceholder(c) {
      return isPresPlaceholder(c)
    },
    formatLeadScope(scope) {
      const diff = Number(scope?.diff) || 0
      const tied = diff === 0
      const winning = diff > 0
      return {
        absGap: Math.abs(diff),
        sign: diff >= 0 ? '+' : '−',
        arrow: tied ? '−' : (winning ? '↑' : '↓'),
        toneClass: tied ? 'is-tied' : (winning ? 'is-ahead' : 'is-behind'),
        tied,
      }
    },
  },
}
</script>

<style scoped>
.ej2026-pres-pair__row {
  margin-left: 0;
  margin-right: 0;
}

.ej2026-pres-card-inner {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0.65rem 0.75rem;
}

.ej2026-pres-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-width: 0;
}

.ej2026-pres-identity {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
  flex: 1 1 auto;
}

.ej2026-pres-identity__text {
  min-width: 0;
}

.ej2026-pres-name {
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.ej2026-pres-party {
  margin-top: 0.15rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.ej2026-pres-main-stat {
  flex: 0 0 auto;
  text-align: right;
  line-height: 1.15;
}

.ej2026-pres-pct {
  display: block;
  font-size: clamp(1.05rem, 3.8vw, 1.35rem);
  font-weight: 700;
  white-space: nowrap;
}

.ej2026-pres-votes {
  display: block;
  margin-top: 0.15rem;
  font-size: 0.68rem;
  white-space: nowrap;
}

.ej2026-pres-breakdown {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 0.45rem 0.35rem;
  width: 100%;
}

.ej2026-pres-top-card {
  overflow: hidden;
}

.ej2026-pres-breakdown__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.2rem;
  min-width: 0;
  text-align: center;
}

.ej2026-pres-breakdown__cell:not(:last-child) {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  padding-right: 0.25rem;
}

.ej2026-pres-breakdown__label {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #6c757d;
  line-height: 1.1;
}

.ej2026-pres-breakdown__value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  min-height: 1.35rem;
  padding: 0.1rem 0.35rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.ej2026-pres-breakdown__value.is-ahead {
  color: #1e7e34;
  background: rgba(40, 167, 69, 0.12);
  border: 1px solid rgba(40, 167, 69, 0.28);
}

.ej2026-pres-breakdown__value.is-behind {
  color: #c82333;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.28);
}

.ej2026-pres-breakdown__value.is-tied {
  color: #6c757d;
  background: rgba(108, 117, 125, 0.1);
  border: 1px solid rgba(108, 117, 125, 0.22);
}

.ej2026-pres-lead-arrow {
  font-weight: 700;
}

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

@media (max-width: 575.98px) {
  .ej2026-pres-card-inner {
    padding: 0.6rem;
    gap: 0.55rem;
  }

  .ej2026-pres-header {
    align-items: flex-start;
  }

  .ej2026-pres-main-stat {
    padding-top: 0.1rem;
  }

  .ej2026-pres-breakdown__label {
    font-size: 0.58rem;
  }

  .ej2026-pres-breakdown__value {
    font-size: 0.66rem;
    padding: 0.08rem 0.28rem;
  }
}

@media (min-width: 768px) {
  .ej2026-pres-card-inner {
    padding: 0.75rem 0.85rem;
  }

  .ej2026-pres-breakdown__label {
    font-size: 0.65rem;
  }

  .ej2026-pres-breakdown__value {
    font-size: 0.75rem;
  }
}
</style>
