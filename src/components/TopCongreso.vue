
<template>
  <div class="candidato-wrapper resultados2026">

    <div class="row">

      <div class="col-12 col-md-6 col-lg-6 mt-3">
      
        <div class="row">
          <div class="col-12">
            <BTabs v-model="topParlamentoTabIndex">
              <BTab :title="`Senadores 2026`">
                <div :key="eleccion.eleccion" v-for="(eleccion) in candidatos_senado_real_view">
                  <div class="card card-candidate align-self-center p-2 border-top-0">
                    <div class="border-bottom pt-2 pb-2" :key="candidato.candidato_id" v-for="candidato in eleccion.items">
                      <div class="row">
                        <div class="col-4 col-md-3 col-lg-3 text-center">
                          <div
                            v-if="isPlaceholderCandidate(candidato)"
                            class="top-congreso__avatar-placeholder rounded-circle border border-3 flex-shrink-0 d-block mx-auto"
                          >
                            <span class="visually-hidden"></span>
                          </div>
                          <img class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                              v-else
                              :style="`border-color: ${candidato.color} !important`" :src="getImageCandidate(candidato.candidato_id, candidato.nombre)" />
                        </div>
                        <div class="col-4 col-md-4 col-lg-5 p-0 align-self-center">
                          <div class="tooltip-c">
                            <h4 class="candidato-mapa candidato-partido mt-1">{{ formatNombreTitulo(candidato.nombre) }}</h4>
                            <h4 class="partido-mapa"><img v-if="!isPlaceholderCandidate(candidato)" width="25px" class="partido-icon" :src="getImagePartido(candidato.partido_id)" />{{ candidato.partido }}</h4>
                          </div>
                        </div>
                        <div class="col-4 col-md-4 col-lg-4 align-self-center text-right">
                          <span :style="`display:block; font-size: 1rem; font-weight: 600; text-align: right;`">{{ numeral(candidato.voto_preferencial || 0).format('0,0') }}</span>
                          <span class="small text-secondary d-block font-weight-light text-right" style="font-size: 10px;">Voto preferencial</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BTab>
              <BTab title="Diputados 2026">
                <div :key="eleccion.eleccion" v-for="(eleccion) in candidatos_congreso_real_view">
                  <div class="card card-candidate align-self-center border-top-0 p-2">
                    <div class="border-bottom pt-2 pb-2" :key="candidato.candidato_id" v-for="candidato in eleccion.items">
                      <div class="row">
                        <div class="col-4 col-md-3 col-lg-3 text-center">
                          <div
                            v-if="isPlaceholderCandidate(candidato)"
                            class="top-congreso__avatar-placeholder rounded-circle border border-3 flex-shrink-0 d-block mx-auto"
                          >
                            <span class="visually-hidden">Foto no disponible</span>
                          </div>
                          <img class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                              v-else
                              :style="`border-color: ${candidato.color} !important`" :src="getImageCandidate(candidato.candidato_id,candidato.nombre)" />
                        </div>
                        <div class="col-4 col-md-4 col-lg-5 p-0 align-self-center">
                          <h4 class="candidato-mapa mt-1 candidato-diputado">{{ formatNombreTitulo(candidato.nombre) }}</h4>
                          <h4 class="partido-mapa"><img v-if="!isPlaceholderCandidate(candidato)" width="25px" class="partido-icon" :src="getImagePartido(candidato.partido_id)" />{{ candidato.partido }}</h4>
                        </div>
                        <div class="col-4 col-md-4 col-lg-4 align-self-center text-right">
                          <span class="congreso-pasado text-right d-block" :style="`font-size:1rem; font-weight: 600;`">{{ numeral(candidato.voto_preferencial || 0).format('0,0') }}</span>
                          <span class="small text-secondary d-block font-weight-light text-right" style="font-size: 10px;">Voto preferencial</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BTab>

              <BTab disabled :title="tituloConteoParlamento"></BTab>
            </BTabs>
          </div>
        </div>
      
      </div>

      

      <div class="col-12  mt-3 col-md-6 mb-3">
        <BTabs>
          <BTab :title="`Congreso ${ eleccion.eleccion }`" :key="eleccion.eleccion" v-for="(eleccion) in candidatos_congreso" >
            <div class="card card-candidate p-2 border-top-0">

              <div class="border-bottom pb-2 pt-2" :key="candidato.candidato_id" v-for="candidato in eleccion.items">

                <div class="row">
                  <div class="col-4 col-md-3 col-lg-3 text-center">
                    <div>
                      <div class="">
                        <img class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                        :style="`border-color: ${candidato.color} !important`" :src="getImageCandidate(candidato.candidato_id, candidato.candidato)" />
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-4 col-md-4 col-lg-5 p-0 align-self-center">
                    <div>
                      <div>
                        <div class="tooltip-c">
                          
                        </div>
                        <h4 class="candidato-mapa candidato-partido mt-1">{{ candidato.candidato }}</h4>
                        <h4 class="partido-mapa partido"><img width="25px" class="partido-icon" :src="getImagePartido(candidato.partido_id)" />{{ candidato.partido }}</h4>
                        
                      </div>
                    </div>
                  </div>
                  <div class="col-4 col-md-4 col-lg-4 align-self-center text-right">
                    <span :style="`font-size: 1rem; font-weight: 600;`">{{ numeral(candidato.total_votos).format('0,0') }}</span>
                    <span class="small badge text-secondary d-block font-weight-light text-right" style="font-size: 10px;">Voto preferencial</span>
                  </div>
                </div>

              </div>
            </div>
          </BTab>
        </BTabs>
      </div>


    </div>


  </div>
</template>

<script>
  import { storeToRefs } from 'pinia'
  import { useCandidatosStore } from '../stores/candidatos'
  import { getPartidoImage, getCandidatoImage } from '../utils/assets'
  import numeral from 'numeral'
  import * as d3 from 'd3'
  import { groupBy, map, orderBy, maxBy, uniq } from 'lodash'
  import votosCongresoData from '../data/top_congresistas.json'
  const PLACEHOLDER_PREFIX = 'placeholder-top-'
  const PLACEHOLDER_COLOR = '#ADB5BD'

  export default {
    name: 'TopCongreso',
    setup() {
      const store = useCandidatosStore()
      return { ...storeToRefs(store), store }
    },
    data() {
      return {
        /** 0 = Senadores, 1 = Diputados (tercer tab solo conteo, disabled). */
        topParlamentoTabIndex: 0,
      }
    },
    methods: {
      numeral,
      getImageCandidate(id, nombre) {
        return getCandidatoImage(id, nombre)
      },
      getImagePartido(c) {
        return getPartidoImage(c)
      },
      calcScale(candidato, items, field) {
        let w = 150
        let _m = maxBy(items, field)
        let myScale = d3.scaleLinear()
          .domain([0, _m[field]])
          .range([0, w])

        return myScale(parseFloat(candidato[field]))
      },
      isPlaceholderCandidate(candidato) {
        return String(candidato?.candidato_id || '').startsWith(PLACEHOLDER_PREFIX)
      },
      /** ONPE suele mandar nombres en mayúsculas → título por palabra (y por segmento con guion). */
      formatNombreTitulo(nombre) {
        if (nombre == null) return ''
        const s = String(nombre).trim()
        if (!s) return ''
        return s
          .toLowerCase()
          .split(/\s+/)
          .map((tok) =>
            tok
              .split('-')
              .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
              .join('-'),
          )
          .join(' ')
      },
      _parseConteoNum(row) {
        if (!row || typeof row !== 'object') return null
        const n = row.conteo
        if (typeof n === 'number' && !Number.isNaN(n)) return n
        const g = row.conteo_general
        if (g == null || String(g).trim() === '') return null
        const p = parseFloat(
          String(g)
            .replace(/%/g, '')
            .replace(/\s/g, '')
            .replace(',', '.')
            .trim(),
        )
        return Number.isNaN(p) ? null : p
      },
      _fmtPct(n) {
        const r = Math.round(n * 100) / 100
        return Number.isInteger(r) ? String(r) : r.toFixed(2)
      },
      pctLabelFromRows(rows, rowFilter) {
        const list = Array.isArray(rows) ? (rowFilter ? rows.filter(rowFilter) : rows) : []
        const nums = []
        for (const r of list) {
          const v = this._parseConteoNum(r)
          if (v != null) nums.push(v)
        }
        if (!nums.length) return null
        const rounded = nums.map((x) => Math.round(x * 100) / 100)
        const uniq = [...new Set(rounded)]
        if (uniq.length === 1) return this._fmtPct(uniq[0])
        const lo = Math.min(...uniq)
        const hi = Math.max(...uniq)
        return `${this._fmtPct(lo)}–${this._fmtPct(hi)}`
      },
    },
    computed: {
      conteo() {
        const label = this.pctLabelFromRows(this.congresistas, null)
        if (!label) return 0
        const first = String(label).split('–')[0]
        return parseFloat(first.replace(',', '.')) || 0
      },
      conteoSenadoNacionalLabel() {
        return (
          this.pctLabelFromRows(this.senadores, (s) => s.senado_tipo === 'nacional') ?? '0'
        )
      },
      conteoDiputadosLabel() {
        return this.pctLabelFromRows(this.congresistas, null) ?? '0'
      },
      /** Mismo criterio que resultados presidenciales nacionales (`region === 'total'` en resultados_total). */
      conteoPresidencialLabel() {
        const rows = (this.todos || []).filter(
          (r) => r && r.region === 'total' && String(r.candidato_id || '').trim() !== '',
        )
        return this.pctLabelFromRows(rows, null) ?? '0'
      },
      tituloConteoParlamento() {
        const idx = this.topParlamentoTabIndex
        let specific = '0'
        if (idx === 0) specific = this.conteoSenadoNacionalLabel
        else if (idx === 1) specific = this.conteoDiputadosLabel
        const fallback = this.conteoPresidencialLabel
        const label = specific !== '0' ? specific : (fallback !== '0' ? fallback : '0')
        if (label === '0') return 'Conteo —'
        return `Conteo al ${label}%`
      },
      fecha_hora() {
        return uniq(map(this.congresistas_parse, 'hora')).join("")
      },
      congresistas_parse() {
        return orderBy(this.congresistas, ['voto_preferencial'], ['desc'])
      },
      votos_congreso() {
        return votosCongresoData
      },
      candidatos_congreso_real() {
        return orderBy(map(groupBy(this.congresistas_parse.slice(0, 5), 'eleccion'), (items, eleccion) => {
          return {
            eleccion: eleccion,
            items: items
          }
        }), ['eleccion'], ['desc'])
      },
      candidatos_senado_real() {
        if (!this.senadores || this.senadores.length === 0) return []
        const nacional = this.senadores.filter(s => s.senado_tipo === 'nacional')
        const top = orderBy(nacional, ['voto_preferencial'], ['desc']).slice(0, 5)
        if (!top.length) return []
        return [{ eleccion: '2026', items: top }]
      },
      candidatos_senado_real_view() {
        const real = this.candidatos_senado_real
        if (real.length && real.some((g) => (g.items?.length ?? 0) > 0)) return real
        return [{
          eleccion: '2026',
          items: Array.from({ length: 5 }, (_, i) => ({
            candidato_id: `${PLACEHOLDER_PREFIX}senado-${i + 1}`,
            nombre: '',
            partido_id: 'sin-resultados',
            partido: 'Información no disponible',
            color: PLACEHOLDER_COLOR,
            voto_preferencial: 0,
          })),
        }]
      },
      candidatos_congreso_real_view() {
        const real = this.candidatos_congreso_real
        if (real.length && real.some((g) => (g.items?.length ?? 0) > 0)) return real
        return [{
          eleccion: '2026',
          items: Array.from({ length: 5 }, (_, i) => ({
            candidato_id: `${PLACEHOLDER_PREFIX}congreso-${i + 1}`,
            nombre: 'Resultados pendientes',
            partido_id: 'sin-resultados',
            partido: 'Información no disponible',
            color: PLACEHOLDER_COLOR,
            voto_preferencial: 0,
          })),
        }]
      },
      candidatos_congreso() {
        return orderBy(map(groupBy(this.votos_congreso, 'eleccion'), (items, eleccion) => {
          return {
            eleccion: eleccion,
            items: items
          }
        }), ['eleccion'], ['desc'])
      }
    }
  }

</script>

<style scoped>
/* Not :empty — host themes often hide div:empty; inner span breaks that. Match .card-candidate img.img-candidato (75px). */
.top-congreso__avatar-placeholder {
  width: 75px;
  height: 75px;
  min-width: 75px;
  min-height: 75px;
  max-width: 75px;
  max-height: 75px;
  box-sizing: border-box;
  flex-shrink: 0;
  background-color: #adb5bd !important;
  border-color: #adb5bd !important;
}
</style>
