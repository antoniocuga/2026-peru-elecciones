<template>
  <div class="widget-parliament-summary mt-3 px-0 px-sm-1">
    <div class="widget-parliament-row">
      <div class="widget-parliament-label small text-light fw-semibold mb-1">
        Senadores <span class="text-light fw-normal">({{ widgetSenadoTotal }})</span>
      </div>
      <div
        class="stacked-bar"
        :class="{ 'stacked-bar--waiting': !hasRealSenadoData }"
        role="img"
        :aria-label="`Senado: ${widgetSenadoTotal} escaños`"
      >
        <div
          v-for="(p, i) in displaySenadoStackRowsComputed"
          :key="p.partido_id + '-' + i"
          class="stacked-bar__seg"
          :style="stackedSegStyle(p.seats, p.color)"
          tabindex="0"
          @mouseenter="onStackSegEnter($event, p, 'senado')"
          @mousemove="onStackSegMove($event, p, 'senado')"
          @mouseleave="hideStackTooltip"
          @focus="onStackSegFocus($event, p, 'senado')"
          @blur="hideStackTooltip"
        >
          <span class="stacked-bar__num text-light">{{ p.seats }}</span>
        </div>
      </div>
    </div>

    <div class="widget-parliament-row mb-2 mb-md-0">
      <div class="widget-parliament-label small text-light fw-semibold mb-1">
        Diputados <span class="text-light fw-normal">({{ widgetCongresoTotal }})</span>
      </div>
      <div
        class="stacked-bar"
        :class="{ 'stacked-bar--waiting': !hasRealCongresoData }"
        role="img"
        :aria-label="`Congreso: ${widgetCongresoTotal} escaños`"
      >
        <div
          v-for="(p, i) in displayCongresoStackRowsComputed"
          :key="p.partido_id + '-' + i"
          class="stacked-bar__seg"
          :style="stackedSegStyle(p.seats, p.color)"
          tabindex="0"
          @mouseenter="onStackSegEnter($event, p, 'congreso')"
          @mousemove="onStackSegMove($event, p, 'congreso')"
          @mouseleave="hideStackTooltip"
          @focus="onStackSegFocus($event, p, 'congreso')"
          @blur="hideStackTooltip"
        >
          <span class="text-light stacked-bar__num">{{ p.seats }}</span>
        </div>
      </div>
    </div>

    <div class="widget-parliament-cta mt-3 mb-2 text-center">
      <a class="btn btn-light btn-sm" :href="ctaHref">
        <strong>Ver los resultados</strong>
      </a>
    </div>
  </div>
</template>

<script>
import { getPartidoImage } from '../../utils/assets'
import { capitalizeWords, escapeHtml } from '../../utils/formatText'
import {
  CONGRESO_TOOLTIP_ID,
  acquireCongresoBodyTooltip,
  releaseCongresoBodyTooltip,
  clampCongresoTooltipToViewport,
  isParliamentPlaceholderSeat,
  tooltipInformacionNoDisponibleHtml,
} from '../../utils/congresoTooltip'
import {
  WIDGET_SENADO_TOTAL,
  WIDGET_CONGRESO_TOTAL,
  computeCongresoStackRows,
  computeSenadoStackRows,
  displayCongresoStackRows,
  displaySenadoStackRows,
} from '../../utils/presidencialWidget'

const DEFAULT_CTA_HREF =
  'https://dev.ojo-publico.com/6133/elecciones-presidenciales-y-legislativas-peru'

export default {
  name: 'WidgetParliamentSummary',
  props: {
    congresistas: { type: Array, default: () => [] },
    senadores: { type: Array, default: () => [] },
    ctaHref: { type: String, default: DEFAULT_CTA_HREF },
  },
  data() {
    return {
      stackTipKey: '',
    }
  },
  mounted() {
    acquireCongresoBodyTooltip()
  },
  beforeUnmount() {
    this.hideStackTooltip()
    releaseCongresoBodyTooltip()
  },
  methods: {
    getImagePartido(id) {
      return getPartidoImage(id)
    },
    stackedSegStyle(seats, color) {
      return {
        flexGrow: seats,
        flexShrink: 0,
        flexBasis: 0,
        minWidth: 0,
        backgroundColor: color || '#6c757d',
        opacity: 0.7,
      }
    },
    stackSegmentKey(p, chamber) {
      return `${chamber}:${p.partido_id}`
    },
    onStackSegEnter(event, p, chamber) {
      this.stackTipKey = this.stackSegmentKey(p, chamber)
      this.showStackTooltip(p, chamber, event.clientX, event.clientY)
    },
    onStackSegMove(event, p, chamber) {
      if (this.stackTipKey !== this.stackSegmentKey(p, chamber)) return
      const el = document.getElementById(CONGRESO_TOOLTIP_ID)
      if (!el || el.style.visibility !== 'visible') return
      clampCongresoTooltipToViewport(el, event.clientX, event.clientY, 28)
    },
    onStackSegFocus(event, p, chamber) {
      this.stackTipKey = this.stackSegmentKey(p, chamber)
      const r = event.currentTarget.getBoundingClientRect()
      this.showStackTooltip(p, chamber, r.left + r.width / 2, r.top)
    },
    showStackTooltip(p, chamber, clientX, clientY) {
      const el = document.getElementById(CONGRESO_TOOLTIP_ID)
      if (!el) return
      if (isParliamentPlaceholderSeat(p)) {
        el.innerHTML = tooltipInformacionNoDisponibleHtml()
      } else {
        const chamberLabel =
          chamber === 'senado' ? 'Senado' : 'Cámara de diputados'
        const logoSrc = this.getImagePartido(p.partido_id)
        const partyEsc = escapeHtml(capitalizeWords(p.partido))
        const seats = Number(p.seats) || 0
        el.innerHTML = `
        <h5 class="mb-2">${chamberLabel}</h5>
        <h3>${partyEsc}</h3>
        <h4><img width="35" src="${logoSrc}" alt="" /> ${seats} escaños</h4>
      `
      }
      el.style.visibility = 'visible'
      el.style.opacity = '0'
      clampCongresoTooltipToViewport(el, clientX, clientY, 28)
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.2s ease'
        el.style.opacity = '1'
      })
    },
    hideStackTooltip() {
      this.stackTipKey = ''
      const el = document.getElementById(CONGRESO_TOOLTIP_ID)
      if (!el) return
      el.style.transition = 'opacity 0.15s ease'
      el.style.opacity = '0'
      el.style.visibility = 'hidden'
    },
  },
  computed: {
    hasRealCongresoData() {
      return (this.congresistas?.length ?? 0) > 0
    },
    hasRealSenadoData() {
      return (this.senadores?.length ?? 0) > 0
    },
    widgetCongresoTotal() {
      return this.hasRealCongresoData ? this.congresistas.length : WIDGET_CONGRESO_TOTAL
    },
    widgetSenadoTotal() {
      return this.hasRealSenadoData ? this.senadores.length : WIDGET_SENADO_TOTAL
    },
    congresoStackRows() {
      return computeCongresoStackRows(this.congresistas)
    },
    senadoStackRows() {
      return computeSenadoStackRows(this.senadores)
    },
    displayCongresoStackRowsComputed() {
      return displayCongresoStackRows(this.congresoStackRows)
    },
    displaySenadoStackRowsComputed() {
      return displaySenadoStackRows(this.senadoStackRows)
    },
  },
}
</script>

<style scoped>
.stacked-bar--waiting {
  opacity: 0.78;
}

.widget-parliament-row {
  width: 100%;
  max-width: 360px;
}

.widget-parliament-summary {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem 1rem;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
}

@media (max-width: 991.98px) {
  .widget-parliament-row {
    max-width: 100%;
  }

  .widget-parliament-summary {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    max-width: 100%;
    gap: 0.75rem;
  }

  .stacked-bar {
    max-width: 100%;
  }
}

@media (max-width: 575.98px) {
  .widget-parliament-summary {
    margin-top: 0.25rem;
  }

  .widget-parliament-label {
    font-size: 0.75rem !important;
    margin-bottom: 0.35rem !important;
  }
}

.widget-parliament-cta {
  width: 100%;
  margin-left: 0;
}

.widget-parliament-cta .btn {
  width: 100%;
  max-width: 320px;
}

@media (min-width: 768px) {
  .widget-parliament-cta .btn {
    width: auto;
    max-width: none;
  }
}

.stacked-bar {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 350px;
  height: 22px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;
}

.stacked-bar__seg {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: default;
}

.stacked-bar__num {
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.55);
  padding: 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
