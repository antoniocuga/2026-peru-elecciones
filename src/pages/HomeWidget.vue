<template>
  <div class="container pb-3 pt-3 mb-3" style="background-color:#506573;">
    <div class="container">

      <div class="row">
        <div class="col-12 col-md-4 p-1" v-for="(c, i) in displayTopCandidatos" :key="c.candidato_id">
          <div class="card card-candidate border-1"
               :class="[
                 i === 0 ? 'custom-rounded-left  border-right' : i === 2 ? 'custom-rounded-right  border-left' : '',
                 { 'home-widget__card--waiting': isPresidentialPlaceholder(c) },
               ]"
               >
            <div class="card-body d-flex align-items-center justify-content-between p-2">
              <div
                v-if="isPresidentialPlaceholder(c)"
                class="home-widget__avatar-placeholder rounded-circle border border-2 flex-shrink-0"
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
              <div   class="ml-2 text-dark text-left overflow-hidden">
                <p class="p-0 candidato-nombre mb-0" :class="{ 'text-light': isPresidentialPlaceholder(c) }">{{ c.candidato }}</p>
                <p class="p-0 partido-nombre mb-0" :class="{ 'text-light': isPresidentialPlaceholder(c) }">
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
              <div style="min-width: 50px;" class="ml-2 text-light overflow-hidden justify-content-end mr-3">
                <div class="d-block text-right align-items-baseline flex-wrap">
                  <span class="porcentaje-top d-block" :style="`color: ${isPresidentialPlaceholder(c) ? WIDGET_PLACEHOLDER_COLOR : c.color}`">
                    {{ c.validos.toFixed(1) }}%
                  </span>
                  <span style="font-size: 0.6rem;" class="votos-top ml-1 d-block">
                    {{ numeral(c.votos).format('0,0') }} 
                  </span>
                  <span style="font-size: 0.6rem;" class="votos-top ml-1 d-block text-small small">
                    votos
                  </span>
                </div>
              </div>
            </div>
          </div>
         
        </div>

        <div class="col-12">
          <div class="widget-parliament-summary mt-3 px-0 px-sm-1">

            <div class="widget-parliament-row">
              <div class="widget-parliament-label small text-light fw-semibold mb-1">
              Cámara de senadores <span class="text-light fw-normal">({{ widgetSenadoTotal }})</span>
              </div>
              <div
                class="stacked-bar"
                :class="{ 'stacked-bar--waiting': !hasRealSenadoData }"
                role="img"
                :aria-label="`Senado: ${widgetSenadoTotal} escaños`"
              >
                <div
                  v-for="(p, i) in displaySenadoStackRows"
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
                Cámara de diputados <span class="text-light fw-normal">({{ widgetCongresoTotal }})</span>
              </div>
              <div
                class="stacked-bar"
                :class="{ 'stacked-bar--waiting': !hasRealCongresoData }"
                role="img"
                :aria-label="`Congreso: ${widgetCongresoTotal} escaños`"
              >
                <div
                  v-for="(p, i) in displayCongresoStackRows"
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
              <a
                class="btn btn-light btn-sm"
                href="https://dev.ojo-publico.com/6133/elecciones-presidenciales-y-legislativas-peru"
              >
                <strong>Ver todos los resultados</strong>
              </a>
            </div>

          </div>
        </div>

        
        
      </div>

     

    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import { storeToRefs } from 'pinia'
import { useCandidatosStore } from '../stores/candidatos'
import { getPartidoImage, getCandidatoImage } from '../utils/assets'
import { capitalizeWords } from '../utils/formatText'
import {
  CONGRESO_TOOLTIP_ID,
  acquireCongresoBodyTooltip,
  releaseCongresoBodyTooltip,
  clampCongresoTooltipToViewport,
  PARLIAMENT_PLACEHOLDER_PARTIDO_ID,
  isParliamentPlaceholderSeat,
  tooltipInformacionNoDisponibleHtml,
} from '../utils/congresoTooltip'
import { filter, map, orderBy, groupBy, uniq } from 'lodash'

const WIDGET_PLACEHOLDER_COLOR = '#ADB5BD'
const WIDGET_PRES_PLACEHOLDER_PREFIX = 'widget-pres-placeholder-'
const WIDGET_SENADO_TOTAL = 60
const WIDGET_CONGRESO_TOTAL = 130

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default {
  name: 'HomeWidget',
  setup() {
    const store = useCandidatosStore()
    const refs = storeToRefs(store)
    return { ...refs, store, candidatos: refs.todos }
  },
  data() {
    return {
      stackTipKey: '',
      WIDGET_PLACEHOLDER_COLOR,
    }
  },
  mounted() {
    acquireCongresoBodyTooltip()
    this.store.getAllCandidatos()
    this.store.getAllCongreso()
    this.store.getAllSenado()
  },
  beforeUnmount() {
    this.hideStackTooltip()
    releaseCongresoBodyTooltip()
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
      const id = c?.candidato_id
      return typeof id === 'string' && id.startsWith(WIDGET_PRES_PLACEHOLDER_PREFIX)
    },
    stackedSegStyle(seats, color) {
      return {
        flexGrow: seats,
        flexShrink: 0,
        flexBasis: 0,
        minWidth: 0,
        backgroundColor: color || '#6c757d',
        opacity: 0.7
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
    conteo() {
      return parseFloat(uniq(map(this.topCandidatos, 'conteo')).join('')) || 0
    },
    fechaHora() {
      return uniq(map(this.topCandidatos, 'hora')).join('')
    },
    topCandidatos() {
      const filtered = filter(this.candidatos, d =>
        d.region === 'total' &&
        d.candidato_id !== 'blanco' &&
        d.candidato_id !== 'nulos'
      )
      return orderBy(
        map(groupBy(filtered, 'candidato_id'), (d, id) => ({
          candidato_id: id,
          candidato:  uniq(map(d, 'candidato')).join(''),
          partido_id: uniq(map(d, 'partido_id')).join(''),
          partido:    uniq(map(d, 'partido')).join(''),
          color:      uniq(map(d, 'color')).join(''),
          votos:      parseFloat(uniq(map(d, 'total')).join('')) || 0,
          validos:    parseFloat(uniq(map(d, 'validos')).join('')) || 0,
          conteo:     parseFloat(uniq(map(d, 'conteo')).join('')) || 0,
          hora:       uniq(map(d, 'hora')).join(''),
        })),
        ['validos'], ['desc']
      ).slice(0, 3)
    },

    displayTopCandidatos() {
      if (this.topCandidatos.length) return this.topCandidatos
      return [0, 1, 2].map((i) => ({
        candidato_id: `${WIDGET_PRES_PLACEHOLDER_PREFIX}${i}`,
        candidato: '',
        partido_id: PARLIAMENT_PLACEHOLDER_PARTIDO_ID,
        partido: 'Información no disponible',
        color: WIDGET_PLACEHOLDER_COLOR,
        votos: 0,
        validos: 0,
        conteo: 0,
        hora: '',
      }))
    },
    hasRealCongresoData() {
      return (this.congresistas?.length ?? 0) > 0
    },
    hasRealSenadoData() {
      return (this.senadores?.length ?? 0) > 0
    },
    widgetCongresoTotal() {
      return this.hasRealCongresoData ? this.congresoStackTotal : WIDGET_CONGRESO_TOTAL
    },
    widgetSenadoTotal() {
      return this.hasRealSenadoData ? this.senadoStackTotal : WIDGET_SENADO_TOTAL
    },
    displayCongresoStackRows() {
      if (this.congresoStackRows.length) return this.congresoStackRows
      return [
        {
          partido_id: PARLIAMENT_PLACEHOLDER_PARTIDO_ID,
          partido: '—',
          seats: WIDGET_CONGRESO_TOTAL,
          color: WIDGET_PLACEHOLDER_COLOR,
        },
      ]
    },
    displaySenadoStackRows() {
      if (this.senadoStackRows.length) return this.senadoStackRows
      return [
        {
          partido_id: PARLIAMENT_PLACEHOLDER_PARTIDO_ID,
          partido: '—',
          seats: WIDGET_SENADO_TOTAL,
          color: WIDGET_PLACEHOLDER_COLOR,
        },
      ]
    },
    congresoStackRows() {
      if (!this.congresistas?.length) return []
      return orderBy(
        map(groupBy(this.congresistas, 'partido_id'), (items, p) => ({
          partido_id: p,
          partido: uniq(map(items, 'partido')).join(''),
          seats: items.length,
          color: uniq(map(items, 'color')).join('') || '#6c757d',
        })),
        ['seats'],
        ['desc']
      )
    },
    congresoStackTotal() {
      return this.congresistas?.length ?? 0
    },
    senadoStackRows() {
      if (!this.senadores?.length) return []
      return orderBy(
        map(groupBy(this.senadores, 'partido_id'), (items, p) => ({
          partido_id: p,
          partido: uniq(map(items, 'partido')).join(''),
          seats: items.length,
          color: uniq(map(items, 'color')).join('') || '#6c757d',
        })),
        ['seats'],
        ['desc']
      )
    },
    senadoStackTotal() {
      return this.senadores?.length ?? 0
    },
  },
}
</script>

<style scoped>

.home-widget__card--waiting {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15) !important;
}

.stacked-bar--waiting {
  opacity: 0.78;
}

/* Same footprint as .img-candidato in this widget (~56px) */
.home-widget__avatar-placeholder {
  width: 56px;
  height: 56px;
  min-width: 56px;
  background-color: #ADB5BD;
  border-color: rgba(255, 255, 255, 0.35) !important;
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
