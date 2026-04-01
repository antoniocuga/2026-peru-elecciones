<template>
  <div class="container pb-3 pt-3 mb-3" style="background-color:#dce8ec;">
    <div class="container" v-if="topCandidatos.length">

      <div class="row">
        <div class="col-12">
        <div class="widget-parliament-label small text-dark fw-semibold mb-1">
              Resultados presidenciales
          </div>
        </div>  
        <div class="col-12 col-md-4 p-1" v-for="(c, i) in topCandidatos" :key="c.candidato_id">
          <div class="card card-candidate border-1"
               :class="i === 0 ? 'custom-rounded-left  border-right' : i === 2 ? 'custom-rounded-right  border-left' : ''"
               >
            <div class="card-body d-flex align-items-center justify-content-between p-2">
              <img :src="getImageCandidate(c.candidato_id)"
                   class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                   :style="`border-color: ${c.color} !important;`"
                   width="60" height="60" alt="" />
              <div class="ml-2 text-dark text-left overflow-hidden">
                <p class="p-0 candidato-nombre mb-0">{{ c.candidato }}</p>
                <p class="p-0 partido-nombre mb-0">
                  <img width="20" height="20" class="partido-icon" :src="getImagePartido(c.partido_id)" alt="" />
                  {{ c.partido }}
                </p>
                <div class="segunda-vuelta-badge m-0 p-0 mt-2" v-if="i === 0 || i === 1">
                  ✓ Segunda vuelta
                </div>
              </div>
              <div style="min-width: 70px;" class="ml-2 text-dark overflow-hidden justify-content-end mr-3">
                <div class="d-block text-right align-items-baseline flex-wrap">
                  <span class="porcentaje-top d-block" :style="`color: ${c.color}`">
                    {{ c.validos.toFixed(1) }}%
                  </span>
                  <span style="font-size: 0.8rem;" class="votos-top ml-1 d-block">
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

        <div class="col-12" v-if="congresoStackTotal > 0 || senadoStackTotal > 0">
          <div class="widget-parliament-summary mt-3 px-1">

            <div v-if="senadoStackTotal > 0" class="widget-parliament-row ">
              <div class="widget-parliament-label small text-dark fw-semibold mb-1">
              Cámara de senadores <span class="text-muted fw-normal">({{ senadoStackTotal }})</span>
              </div>
              <div
                class="stacked-bar"
                role="img"
                :aria-label="`Senado: ${senadoStackTotal} escaños por partido`"
              >
                <div
                  v-for="(p, i) in senadoStackRows"
                  :key="p.partido_id"
                  class="stacked-bar__seg"
                  :class="{
                    'stacked-bar__seg--first': i === 0,
                    'stacked-bar__seg--last': i === senadoStackRows.length - 1,
                  }"
                  :style="stackedSegStyle(p.seats, p.color)"
                  tabindex="0"
                >
                  <span class="stacked-bar__num">{{ p.seats }}</span>
                  <div class="stack-tip" role="tooltip">
                    <img
                      class="stack-tip__logo"
                      :src="getImagePartido(p.partido_id)"
                      width="28"
                      height="28"
                      alt=""
                    />
                    <div class="stack-tip__body">
                      <span class="stack-tip__party">{{ p.partido }}</span>
                      <span class="stack-tip__seats">{{ p.seats }} escaños</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="congresoStackTotal > 0" class="  widget-parliament-row mb-2">
              <div class="widget-parliament-label small text-dark fw-semibold mb-1">
                Cámara de diputados <span class="text-muted fw-normal">({{ congresoStackTotal }})</span>
              </div>
              <div
                class="stacked-bar"
                role="img"
                :aria-label="`Congreso: ${congresoStackTotal} escaños por partido`"
              >
                <div
                  v-for="(p, i) in congresoStackRows"
                  :key="p.partido_id"
                  class="stacked-bar__seg"
                  :class="{
                    'stacked-bar__seg--first': i === 0,
                    'stacked-bar__seg--last': i === congresoStackRows.length - 1,
                  }"
                  :style="stackedSegStyle(p.seats, p.color)"
                  tabindex="0"
                >
                  <span class="stacked-bar__num">{{ p.seats }}</span>
                  <div class="stack-tip" role="tooltip">
                    <img
                      class="stack-tip__logo"
                      :src="getImagePartido(p.partido_id)"
                      width="28"
                      height="28"
                      alt=""
                    />
                    <div class="stack-tip__body">
                      <span class="stack-tip__party">{{ p.partido }}</span>
                      <span class="stack-tip__seats">{{ p.seats }} escaños</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="ml-5 mt-3 mb-2">
          <div class="small mb-0 pb-0 text-center">
            <a class="btn btn-light" href="https://dev.ojo-publico.com/6133/elecciones-presidenciales-y-legislativas-peru"><strong>Ver todos los resultados</strong></a>
          </div>
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
import { filter, map, orderBy, groupBy, uniq } from 'lodash'

export default {
  name: 'HomeWidget',
  setup() {
    const store = useCandidatosStore()
    const refs = storeToRefs(store)
    return { ...refs, store, candidatos: refs.todos }
  },
  mounted() {
    this.store.getAllCandidatos()
    this.store.getAllCongreso()
    this.store.getAllSenado()
  },
  methods: {
    numeral,
    getImageCandidate(id) {
      return getCandidatoImage(id)
    },
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
        opacity: 0.7
      }
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

.widget-parliament-row {
  width: 100%;
  max-width: 360px;
}

.widget-parliament-summary {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .widget-parliament-summary {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }
}



.stacked-bar {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 350px;
  height: 22px;
  border-radius: 6px;
  overflow: visible;
  border: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
}

.stacked-bar__seg {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: default;
}

.stacked-bar__seg--first {
  border-radius: 5px 0 0 5px;
}

.stacked-bar__seg--last {
  border-radius: 0 5px 5px 0;
}

/* Same visual language as #tooltip-congresista.tooltip_congresista */
.stack-tip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: min(320px, 85vw);
  padding: 10px 15px;
  font-family: 'Nunito Sans', sans-serif;
  color: #000;
  background: rgba(255, 255, 255, 0.932);
  box-shadow: 0px 0px 2px #0000005c;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 1080;
  transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
  text-align: left;
}

.stack-tip__logo {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  object-fit: contain;
  border-radius: 2px;
}

.stack-tip__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.stack-tip__party {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.25;
  word-wrap: break-word;
}

.stack-tip__seats {
  font-size: 13px;
  font-weight: 400;
  color: #333;
}

.stacked-bar__seg:hover .stack-tip,
.stacked-bar__seg:focus-visible .stack-tip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
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
