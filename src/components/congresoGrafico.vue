<template>
  <div class="row congreso-grafico">    
    <div class="col-12 col-sm-12 col-md-6 col-lg-5 order-md-0 order-1">       
      <BTabs v-model="partidoListTabIndex">
        <BTab>
          <template #title>
            <span class="d-inline-flex align-items-center gap-1">
              Diputados por partido
            </span>
          </template>
          <div class="list-resultados-partidos p-3">
            <div class="row pb-3">

              <div class="col-12" :key="c.partido_id" v-for="c in congresistasPartidoForList">
                <div @mouseover="show_partidos(c)" @mouseout="reset_congreso()" class="row candidate-info align-self-center pt-2 pb-2 item-partido">
                  <div class="col-auto pr-1 congreso-grafico__partido-col">
                    <div
                      v-if="isCongresoPartyListPlaceholder(c)"
                      class="congreso-grafico__party-placeholder border border-3"
                      role="img"
                      aria-hidden="true"
                    />
                    <img
                      v-else
                      class="congreso-grafico__partido-img"
                      width="65"
                      height="65"
                      alt=""
                      :src="getImagePartido(c.partido_id)"
                      @error="onPartidoListImgError(c, $event)"
                    />
                  </div>
                  <div class="col-7 pl-0 pr-md-0 align-self-center" v-if="c.total_votos_partido >  0">              
                    <h4 class="candidato-mapa m-md-0">{{ capitalizeWords(c.partido) }}</h4>
                    <div class="text-secondary small light">Votos válidos: {{numeral(c.total_votos_partido).format('0,0')}}</div>
                  </div> 
                  <div v-else class="col-7 pl-0 pr-md-0 align-self-center text-center">              
                    <div style="font-size: 10px;" class="text-secondary small partido-mapa light">INFORMACIÓN NO DISPONIBLE</div>
                  </div> 
                  <div class="col-auto align-self-center text-center pr-0">              
                      <h5 class="elegidos d-flex align-self-center">{{ c.seats }}</h5>
                  </div>
                </div>
              </div>
        
            </div>

          </div> 
        </BTab>        
        <BTab class="list-resultados-partidos" lazy>
          <template #title>
            <span class="d-inline-flex align-items-center gap-1">
              Senadores por partido
            </span>
          </template>
          <div class="list-resultados-partidos p-3">
            <div class="row pb-3">
              <div class="col-12" :key="'s-' + c.partido_id" v-for="c in senadoresPartidoForList">
                <div @mouseover="show_partidos(c)" @mouseout="reset_congreso()" class="row candidate-info align-self-center pt-2 pb-2 item-partido">
                  <div class="col-auto pr-1 congreso-grafico__partido-col">
                    <div
                      v-if="isCongresoPartyListPlaceholder(c)"
                      class="congreso-grafico__party-placeholder border border-3"
                      role="img"
                      aria-hidden="true"
                    />
                    <img
                      v-else
                      class="congreso-grafico__partido-img"
                      width="65"
                      height="65"
                      alt=""
                      :src="getImagePartido(c.partido_id)"
                      @error="onPartidoListImgError(c, $event)"
                    />
                  </div>
                  <div
                    class="col-7 pl-0 pr-md-0 align-self-center"
                    v-if="c.total_votos_nacional_lista > 0 || c.total_votos_regional_lista > 0"
                  >
                    <h4 class="candidato-mapa m-md-0">{{ capitalizeWords(c.partido) }}</h4>
                    <template
                      v-if="
                        c.total_votos_nacional_lista > 0 &&
                        c.total_votos_regional_lista > 0 &&
                        !c.senado_votos_misma_base
                      "
                    >
                      <div class="text-secondary small light">
                        Nacional: {{ numeral(c.total_votos_nacional_lista).format('0,0') }} 
                      </div>
                      <div class="text-secondary small light">
                        Regional: {{ numeral(c.total_votos_regional_lista).format('0,0') }}
                      </div>
                    </template>
                    <div v-else class="text-secondary small light">
                      Votos válidos:
                      {{
                        numeral(
                          Math.max(c.total_votos_nacional_lista, c.total_votos_regional_lista),
                        ).format('0,0')
                      }}
                    </div>
                  </div>
                  <div v-else class="col-7 pl-0 pr-md-0 align-self-center">              
                    <div class="text-secondary small light">Información no disponible</div>
                   </div> 
                  <div class="col-auto align-self-center text-center pr-0">
                    <h5 class="elegidos d-flex align-self-center">{{ c.seats }}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BTab>
        <BTab disabled :title="tituloConteoParlamento"></BTab>
      </BTabs>
    </div>

    <div class="col-12 col-sm-12 col-md-6 col-lg-7 text-center">
      <div>

      <div class="congreso-sticky border-bottom pb-3">
        <!-- Mobile &lt; md: two stacked semicircles -->
        <div class="d-md-none">
          <div class="col-12 mb-2">
            <h5>{{ headingSenadoSeats }} senadores</h5>
          </div>
          <svg
            class="svg-congreso"
            ref="svgSenadoMobile"
            :viewBox="`0 0 ${svgSizeSenadoMobile.width} ${svgSizeSenadoMobile.height}`"
            preserveAspectRatio="xMidYMid meet"
          >
            <g id="parliament-senado-mobile"></g>
          </svg>
          <div class="col-12 mb-2 mt-3">
            <h5>{{ headingCongresoSeats }} diputados</h5>
          </div>
          <svg
            class="svg-congreso"
            ref="svgCongresoMobile"
            :viewBox="`0 0 ${svgSizeCongresoMobile.width} ${svgSizeCongresoMobile.height}`"
            preserveAspectRatio="xMidYMid meet"
          >
            <g id="parliament-congreso-mobile"></g>
          </svg>
        </div>
        <!-- md+: nested semicircles in one SVG -->
        <div class="d-none d-md-block">
          <div class="col-12 mb-2">
            <h5>{{ headingSenadoSeats }} senadores</h5>
          </div>
          <svg
            class="svg-congreso"
            ref="svgCongresoDesktop"
            :viewBox="`0 0 ${svgSize.width} ${svgSize.height}`"
            preserveAspectRatio="xMidYMid meet"
          >
            <g id="parliament-senado"></g>
            <g id="parliament-congreso"></g>
            <g id="parliament-labels"></g>
          </svg>
          <div class="col-12 mb-2">
            <h5>{{ headingCongresoSeats }} diputados</h5>
          </div>
        </div>
      </div>
      </div>
      <div class="filters-congreso mb-3 text-center">
        <span class="medium">Mostrar resultados por</span>
        <DropdownBs4
          :text="formatRegionLabel(depObject.region)"
          variant="link-dark"
          :wrapperClass="['d-inline-block', 'm-2', 'departamento-menu']"
        >
          <template #default="{ close }">
            <button type="button" class="dropdown-item" @click="close(); reset_congreso()">
              Todas las regiones
            </button>
            <button
              type="button"
              class="dropdown-item"
              :key="d.region"
              v-for="d in departamentos"
              @click="close(); show_departamentos(d)"
            >
              {{ formatRegionLabel(d.region) }}
            </button>
          </template>
        </DropdownBs4>
      </div>
      <div class="col-12 mb-2" v-if="departamentos_conteo > 0">
        <h2 class="title-resultados"><b>Conteo ONPE al {{ departamentos_conteo }}% en la región {{ formatRegionLabel(depSelected) }}</b></h2> <h2 class="title-resultados">Última actualización: {{ departamentos_hora }}</h2>
      </div>
    </div>

    
  </div>
</template>

<script>
  import numeral from 'numeral'
  import api from '../api/api'
  import { storeToRefs } from 'pinia'
  import { useCandidatosStore } from '../stores/candidatos'
  import { getPartidoImage, getPartidoFallbackImageDataUrl } from '../utils/assets'
  import { capitalizeWords } from '../utils/formatText'
  import * as d3 from 'd3'
  import * as parliament from 'd3-parliament-chart'
  import { filter, groupBy, map, orderBy, uniq, sum } from 'lodash'
  import CongresoLista from './CongresoLista.vue'
  import DropdownBs4 from './DropdownBs4.vue'
  import {
    acquireCongresoBodyTooltip,
    releaseCongresoBodyTooltip,
    CONGRESO_TOOLTIP_ID,
    clampCongresoTooltipToViewport,
    PARLIAMENT_PLACEHOLDER_PARTIDO_ID,
    isParliamentPlaceholderSeat,
    tooltipInformacionNoDisponibleHtml,
  } from '../utils/congresoTooltip'
  import {
    resolveCongresoChartLayout,
    resolveSplitSenadoSvgLayout,
    resolveSplitCongresoSvgLayout,
  } from '../utils/congresoChartLayout'
  import { joinHoras, maxConteo } from '../utils/conteoAggregate'
  import { senadoListaTotalsByTipo } from '../utils/senadoVotes'

  /** Match Bootstrap `md` — below this, senado + congreso render as two SVGs */
  const PARLIAMENT_SPLIT_MAX_WIDTH_PX = 840

  const REGION_NACIONAL = 'TODAS LAS REGIONES'
  const DIPUTADOS_ONPE_REGION_CODE = {
    amazonas: '1',
    ancash: '2',
    apurimac: '3',
    arequipa: '4',
    ayacucho: '5',
    cajamarca: '6',
    callao: '7',
    cusco: '8',
    huancavelica: '9',
    huanuco: '10',
    ica: '11',
    junin: '12',
    'la-libertad': '13',
    lambayeque: '14',
    lima: '15',
    'lima-provincias': '16',
    loreto: '17',
    'madre-de-dios': '18',
    moquegua: '19',
    pasco: '20',
    piura: '21',
    puno: '22',
    'san-martin': '23',
    tacna: '24',
    tumbes: '25',
    ucayali: '26',
    extranjero: '27',
  }

  const CONGRESO_TOTAL_SEATS = 130
  const SENADO_TOTAL_SEATS = 60
  const PLACEHOLDER_LIST_ROWS = 5
  /** Neutral seats when JSON / API has not loaded yet */
  const EMPTY_PARLIAMENT_COLOR = '#ADB5BD'

  function makePlaceholderCongresoSeats() {
    return Array.from({ length: CONGRESO_TOTAL_SEATS }, (_, i) => ({
      region: REGION_NACIONAL,
      departamento: '',
      nombre: 'Sin resultados',
      candidato_id: `placeholder-congreso-${i}`,
      partido: '—',
      partido_id: PARLIAMENT_PLACEHOLDER_PARTIDO_ID,
      nro: 1,
      color: EMPTY_PARLIAMENT_COLOR,
      total_votos_partido: 0,
      hora: '—',
      conteo: 0,
      voto_preferencial: 0,
      voto_fantasma: 0,
      conteo_general: 0,
    }))
  }

  function makePlaceholderSenadoSeats() {
    return Array.from({ length: SENADO_TOTAL_SEATS }, (_, i) => ({
      senado_tipo: 'nacional',
      region: 'NACIONAL',
      nombre: 'Sin resultados',
      candidato_id: `placeholder-senado-${i}`,
      partido: '—',
      partido_id: PARLIAMENT_PLACEHOLDER_PARTIDO_ID,
      nro: 1,
      color: EMPTY_PARLIAMENT_COLOR,
      total_votos_partido: 0,
      hora: '—',
      conteo: 0,
      voto_preferencial: 0,
      voto_fantasma: 0,
      conteo_general: 0,
    }))
  }

  export default {
    name: 'congresoGrafico.vue',
    components: { CongresoLista, DropdownBs4 },
    setup() {
      const store = useCandidatosStore()
      return { ...storeToRefs(store), store }
    },
    data() {
      return {
        depSelected: REGION_NACIONAL,
        depObject: {
          region: REGION_NACIONAL,
          seats: 130
        },
        svgSize: { width: 600, height: 300 },
        svgSizeSenadoMobile: { width: 320, height: 200 },
        svgSizeCongresoMobile: { width: 320, height: 220 },
        tabTooltipSenado:
          '',
        /** 0 = Diputados por partido, 1 = Senadores por partido (tab conteo disabled). */
        partidoListTabIndex: 0,
        /** Cache ONPE por región slug -> { byNormName: { [norm]: totalVotosValidos } } */
        diputadosOnpeByRegion: {},
        /** Local summary JSON: region -> partido_id -> total_votos_validos */
        diputadosSummaryByRegion: {},
      }
    },
    computed: {
      conteoSenadoNacionalLabel() {
        return (
          this.pctLabelFromRows(this.senadores, (s) => s.senado_tipo === 'nacional') ?? '0'
        )
      },
      conteoDiputadosLabel() {
        return this.pctLabelFromRows(this.congresistas, null) ?? '0'
      },
      conteoPresidencialLabel() {
        const rows = (this.todos || []).filter(
          (r) => r && r.region === 'total' && String(r.candidato_id || '').trim() !== '',
        )
        return this.pctLabelFromRows(rows, null) ?? '0'
      },
      tituloConteoParlamento() {
        const idx = this.partidoListTabIndex
        let specific = '0'
        if (idx === 0) specific = this.conteoDiputadosLabel
        else if (idx === 1) specific = this.conteoSenadoNacionalLabel
        const fallback = this.conteoPresidencialLabel
        const label = specific !== '0' ? specific : (fallback !== '0' ? fallback : '0')
        if (label === '0') return 'Conteo —'
        return `Conteo al ${label}%`
      },
      headingCongresoSeats() {
        if (this.depSelected === REGION_NACIONAL) {
          return this.congresistas?.length ? this.congresistas.length : CONGRESO_TOTAL_SEATS
        }
        const row = this.departamentos.find((d) => d.region === this.depSelected)
        return row ? row.seats : this.depObject.seats
      },
      /**
       * Senado: 60 a nivel nacional (como el gráfico). Por región, cantidad de senadores
       * en los datos con esa región.
       */
      headingSenadoSeats() {
        return SENADO_TOTAL_SEATS
      },
      departamentos_conteo() {
        if (this.depSelected === REGION_NACIONAL) return 0
        const row = this.departamentos.find((d) => d.region === this.depSelected)
        return row ? Number(row.conteo) || 0 : 0
      },
      departamentos_hora() {
        if (this.depSelected === REGION_NACIONAL) return ''
        const row = this.departamentos.find((d) => d.region === this.depSelected)
        return row ? row.hora : ''
      },
      /** Regiones que aparecen en el hemiciclo (diputados + senadores), no solo en congreso_total. */
      departamentos() {
        const cong = Array.isArray(this.congresistas) ? this.congresistas : []
        const sen = Array.isArray(this.senadores) ? this.senadores : []
        const keys = new Set()
        for (const row of cong) {
          const r = row?.region
          if (r != null && String(r).trim() !== '') keys.add(String(r))
        }
        for (const row of sen) {
          const r = row?.region
          if (r != null && String(r).trim() !== '') keys.add(String(r))
        }
        const sorted = [...keys].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
        return sorted.map((r) => {
          const itemsC = cong.filter((x) => String(x?.region) === r)
          const itemsS = sen.filter((x) => String(x?.region) === r)
          const metaRows = [...itemsC, ...itemsS]
          return {
            region: r,
            departamento: uniq(map(itemsC, 'departamento')).join(''),
            hora: joinHoras(metaRows),
            conteo: maxConteo(metaRows),
            seats: itemsC.length,
            congresistas: itemsC,
          }
        })
      },
      congresistas_parse() {
        return orderBy(this.congresistas, ['partido_id'], ['desc'])
      },
      /** Scope for the left Diputados list: national or selected circunscripción. */
      congresistas_scope() {
        const all = Array.isArray(this.congresistas) ? this.congresistas : []
        if (this.depSelected === REGION_NACIONAL) return all
        return all.filter((r) => String(r?.region || '') === this.depSelected)
      },
      congresistas_partido() {
        return orderBy(map(groupBy(this.congresistas_scope, 'partido_id'), (items, p) => {
          // ONPE `total_votos_partido` is party total per circunscripción. A party can have
          // multiple candidates/seats in the same region, so first keep one total per region
          // and then sum regions. This avoids undercount from global `uniq(total)` collisions.
          const porRegion = groupBy(items, (i) => String(i?.region || '').toLowerCase())
          let total_partido = sum(
            map(porRegion, (rows) => {
              const totalLista = Math.max(...map(rows, (r) => Number(r.total_votos_partido) || 0))
              return totalLista
            }),
          )
          // If a specific región is selected and ONPE resumen exists, prefer official
          // `totalVotosValidos` from `participantes-ubicacion-geografica-nombre`.
          if (this.depSelected !== REGION_NACIONAL) {
            const fromSummary =
              this.diputadosSummaryByRegion?.[this.depSelected]?.[p]?.total_votos_validos
            if (Number.isFinite(fromSummary)) total_partido = fromSummary
            const byNormName = this.diputadosOnpeByRegion?.[this.depSelected]?.byNormName
            const partidoNombre = uniq(map(items, 'partido')).join("")
            const fromOnpe = this.lookupOnpePartyTotal(byNormName, partidoNombre)
            if (Number.isFinite(fromOnpe)) total_partido = fromOnpe
          }
          return {
            partido_id: p,
            partido: uniq(map(items, 'partido')).join(""),
            total_votos_partido: total_partido,
            seats: items.length,
            congresistas: items, 
            color: uniq(map(items, 'color')).join("")
          }
        }), ['seats', 'total_votos_partido'], ['desc', 'desc'])
      },
      congresistasPartidoForList() {
        if (this.congresistas_partido.length) return this.congresistas_partido
        return Array.from({ length: PLACEHOLDER_LIST_ROWS }, (_, i) => ({
          partido_id: `${PARLIAMENT_PLACEHOLDER_PARTIDO_ID}-${i + 1}`,
          partido: '',
          total_votos_partido: 0,
          seats: 0,
          congresistas: [],
          color: EMPTY_PARLIAMENT_COLOR,
        }))
      },
      senadores_partido() {
        if (!this.senadores || !this.senadores.length) return []
        return orderBy(
          map(groupBy(this.senadores, 'partido_id'), (items, p) => {
            const { vn, vr, fantasma } = senadoListaTotalsByTipo(items)
            const samePool = vn > 0 && vr > 0 && vn === vr
            const sortVotes = Math.max(vn, vr)
            return {
              partido_id: p,
              partido: uniq(map(items, 'partido')).join(''),
              total_votos_nacional_lista: vn,
              total_votos_regional_lista: vr,
              senado_votos_misma_base: samePool,
              total_votos_partido: sortVotes,
              fantasma,
              seats: items.length,
              color: uniq(map(items, 'color')).join(''),
            }
          }),
          ['seats', 'total_votos_partido'],
          ['desc', 'desc'],
        )
      },
      senadoresPartidoForList() {
        if (this.senadores_partido.length) return this.senadores_partido
        return Array.from({ length: PLACEHOLDER_LIST_ROWS }, (_, i) => ({
          partido_id: `${PARLIAMENT_PLACEHOLDER_PARTIDO_ID}-s-${i + 1}`,
          partido: '',
          total_votos_partido: 0,
          total_votos_nacional_lista: 0,
          total_votos_regional_lista: 0,
          senado_votos_misma_base: false,
          seats: 0,
          color: EMPTY_PARLIAMENT_COLOR,
        }))
      },
      /** Por partido (nombre + partido_id). Dentro del partido: voto preferencial y candidato_id — sin usar senado_tipo (ordenar por candidato_id mezcla nacional/regional por el prefijo en el id). */
      senadores_parse_60() {
        if (!this.senadores || !this.senadores.length) return []
        const grouped = groupBy(this.senadores, 'partido_id')
        const byParty = orderBy(
          map(grouped, (items, partido_id) => ({
            partido_id,
            partido: uniq(map(items, 'partido')).join(''),
            items: orderBy(items, ['voto_preferencial', 'candidato_id'], ['desc', 'asc']),
          })),
          ['partido', 'partido_id'],
          ['asc', 'asc']
        )
        const all = byParty.flatMap((g) => g.items)
        const n = all.length
        if (n >= SENADO_TOTAL_SEATS) return all.slice(0, SENADO_TOTAL_SEATS)
        const repeated = []
        for (let i = 0; i < SENADO_TOTAL_SEATS; i++) {
          repeated.push({ ...all[i % n], _idx: i })
        }
        return repeated
      },
      /** Semicircles: real data or gray placeholders (130 / 60 curules). */
      congresistasForChart() {
        if (this.congresistas?.length) return this.congresistas_parse
        return makePlaceholderCongresoSeats()
      },
      senadoresForChart() {
        if (this.senadores?.length) return this.senadores_parse_60
        return makePlaceholderSenadoSeats()
      },
    },
    watch: {
      congresistas() {
        this.renderCongreso()
      },
      senadores() {
        this.renderCongreso()
      },
      depSelected(nextRegion) {
        if (nextRegion && nextRegion !== REGION_NACIONAL) {
          this.loadDiputadosOnpeRegionTotals(nextRegion)
        }
      }
    },
    mounted() {
      acquireCongresoBodyTooltip()
      this.loadDiputadosSummaryTotals()
      this._onResizeParliament = () => this.renderCongreso()
      window.addEventListener('resize', this._onResizeParliament, { passive: true })
      this.renderCongreso()
    },
    beforeUnmount() {
      if (this._onResizeParliament) {
        window.removeEventListener('resize', this._onResizeParliament)
      }
      releaseCongresoBodyTooltip()
    },
    methods: {
      numeral,
      capitalizeWords,
      isParliamentPlaceholderSeat(d) {
        return isParliamentPlaceholderSeat(d)
      },
      /** List rows use partido_id `sin-resultados` or `sin-resultados-*`, not seat objects */
      isCongresoPartyListPlaceholder(c) {
        const id = c?.partido_id
        if (typeof id !== 'string') return false
        return id === PARLIAMENT_PLACEHOLDER_PARTIDO_ID || id.startsWith(`${PARLIAMENT_PLACEHOLDER_PARTIDO_ID}-`)
      },
      formatRegionLabel(region) {
        if (!region) return ''
        if (region === REGION_NACIONAL) return 'Todas las regiones'
        return capitalizeWords(String(region).replace(/-/g, ' ').toLowerCase())
      },
      normalizePartyName(name) {
        return String(name || '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, ' ')
          .trim()
      },
      getDiputadosOnpeRegionUrl(code) {
        const qs =
          `idEleccion=13&tipoFiltro=distrito_electoral&idDistritoElectoral=${encodeURIComponent(code)}`
        if (import.meta.env.DEV) {
          return `/onpe-backend/eleccion-diputado/participantes-ubicacion-geografica-nombre?${qs}`
        }
        return (
          `https://resultadoelectoral.onpe.gob.pe/presentacion-backend/eleccion-diputado/` +
          `participantes-ubicacion-geografica-nombre?${qs}`
        )
      },
      lookupOnpePartyTotal(byNormName, partidoNombre) {
        if (!byNormName || !partidoNombre) return null
        const norm = this.normalizePartyName(partidoNombre)
        if (Object.prototype.hasOwnProperty.call(byNormName, norm)) return byNormName[norm]
        // Fallback for naming variants (e.g. "Partido Cívico Obras" vs "Partido Obras").
        for (const [k, v] of Object.entries(byNormName)) {
          if (k.includes(norm) || norm.includes(k)) return v
        }
        return null
      },
      async loadDiputadosSummaryTotals() {
        try {
          const payload = await api.getCongresoPartidoRegion()
          const regions = Array.isArray(payload?.regions) ? payload.regions : []
          const byRegion = {}
          for (const r of regions) {
            const slug = String(r?.region || '').trim().toLowerCase()
            if (!slug) continue
            const partidos = Array.isArray(r?.partidos) ? r.partidos : []
            const pMap = {}
            for (const p of partidos) {
              const pid = String(p?.partido_id || '').trim()
              if (!pid) continue
              const total = Number(p?.total_votos_validos)
              if (!Number.isFinite(total)) continue
              pMap[pid] = { total_votos_validos: total }
            }
            byRegion[slug] = pMap
          }
          this.diputadosSummaryByRegion = byRegion
        } catch (_e) {
          // Optional file; keep existing aggregation / ONPE live fallback.
        }
      },
      async loadDiputadosOnpeRegionTotals(regionSlug) {
        const slug = String(regionSlug || '').trim().toLowerCase()
        if (!slug || slug === REGION_NACIONAL.toLowerCase()) return
        if (this.diputadosOnpeByRegion?.[slug]) return
        const code = DIPUTADOS_ONPE_REGION_CODE[slug]
        if (!code) return
        const url = this.getDiputadosOnpeRegionUrl(code)
        try {
          const res = await fetch(url)
          if (!res.ok) return
          const payload = await res.json()
          const data = Array.isArray(payload?.data) ? payload.data : []
          const byNormName = {}
          for (const row of data) {
            const n = this.normalizePartyName(row?.nombreAgrupacionPolitica)
            const v = Number(row?.totalVotosValidos)
            if (!n || !Number.isFinite(v)) continue
            byNormName[n] = v
          }
          this.diputadosOnpeByRegion = {
            ...this.diputadosOnpeByRegion,
            [slug]: { byNormName },
          }
        } catch (_e) {
          // Keep UI totals from local JSON when ONPE fetch is unavailable.
        }
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
        const uniqSet = [...new Set(rounded)]
        if (uniqSet.length === 1) return this._fmtPct(uniqSet[0])
        const lo = Math.min(...uniqSet)
        const hi = Math.max(...uniqSet)
        return `${this._fmtPct(lo)}–${this._fmtPct(hi)}`
      },
      getImagePartido(c) {
        return getPartidoImage(c)
      },
      /** Si el PNG del partido no existe en CDN, mostrar icono genérico con color de la lista. */
      onPartidoListImgError(c, ev) {
        const img = ev?.target
        if (!(img instanceof HTMLImageElement) || img.dataset.partyFallback === '1') return
        img.dataset.partyFallback = '1'
        img.src = getPartidoFallbackImageDataUrl(c?.color)
      },
      isSplitParliamentCharts() {
        return typeof window !== 'undefined' && window.innerWidth < PARLIAMENT_SPLIT_MAX_WIDTH_PX
      },
      show_partidos(c) {
        this.depObject = {
          region: REGION_NACIONAL,
          seats: this.congresistas?.length || CONGRESO_TOTAL_SEATS,
        }
        d3.selectAll('.svg-congreso circle').classed('active', false)
        d3.selectAll(`.svg-congreso circle.${c.partido_id}`).classed('active', true)
      },
      regionSlugForSeatClass(region) {
        return String(region || '')
          .trim()
          .replace(/\s+/g, '-')
          .toLowerCase()
      },
      show_departamentos(d) {
        this.depSelected = d.region
        const _r = this.regionSlugForSeatClass(d.region)
        this.depObject = d
        this.loadDiputadosOnpeRegionTotals(d.region)
        d3.selectAll('.svg-congreso circle').classed('active', false)
        d3.selectAll(`.svg-congreso circle.${CSS.escape(_r)}`).classed('active', true)
      },
      reset_congreso() {
        this.depSelected = REGION_NACIONAL
        this.depObject = {
          region: REGION_NACIONAL,
          seats: this.congresistas?.length || CONGRESO_TOTAL_SEATS,
        }
        d3.selectAll('.svg-congreso circle').classed('active', true)
      },
      /** ONPE suele mandar ``totalVotosValidos``; el JSON exportado usa ``voto_preferencial``. */
      seatVotoPreferencial(d) {
        if (!d || typeof d !== 'object') return 0
        const raw =
          d.voto_preferencial ??
          d.totalVotosValidos ??
          d.total_votos_validos ??
          d.votoPreferencial ??
          d.votosPreferenciales ??
          d.totalVotosCandidato
        const n = Number(raw)
        return Number.isFinite(n) ? n : 0
      },
      seatTotalVotosPartido(d) {
        if (!d || typeof d !== 'object') return 0
        const raw =
          d.total_votos_partido ??
          d.totalVotosPartido ??
          d.totalVotosValidosAgrupacion ??
          d.totalVotosValidos
        const n = Number(raw)
        return Number.isFinite(n) ? n : 0
      },
      show_congresista(event, d) {
        const tooltip = d3.select(`#${CONGRESO_TOOLTIP_ID}`)
        const pref = this.seatVotoPreferencial(d)
        const totalPartido = this.seatTotalVotosPartido(d)
        let table = ''
        if (isParliamentPlaceholderSeat(d)) {
          table = tooltipInformacionNoDisponibleHtml()
        } else if (d.senado_tipo) {
          table = `<h5 class="mb-2 border-bottom pb-2">Senado (${this.formatRegionLabel(d.region || REGION_NACIONAL)})</h5>`
          table += `<h3>${d.nombre}</h3>`
          table += `<h4><img width="35px" src="${this.getImagePartido(d.partido_id)}" /> ${d.partido}</h4>`
          table += `<h4>Votos válidos de la agrupación: <span class="text-success">${numeral(totalPartido).format('0,0')}</span></h4>`
          table += `<h4>Voto preferencial: <span class="text-success">${numeral(pref).format('0,0')}</span></h4>`
        } else {
          table = `<h5 class="mb-2 border-bottom pb-2">${this.formatRegionLabel(d.region || REGION_NACIONAL)}</h5>`
          table += `<h3>${d.nombre}</h3>`
          table += `<h4 class="text-light"><img width="35px" src="${this.getImagePartido(d.partido_id)}" /> ${d.partido} - Nro. ${d.nro}</h4>`
          table += `<h4>Votos válidos de la agrupación: <span class="text-success">${numeral(totalPartido).format('0,0')}</span></h4>`
          table += `<h4>Voto preferencial del candidato: <span class="text-success">${numeral(pref).format('0,0')}</span></h4>`
        }
        tooltip.interrupt()
        tooltip.html(table)
          .style('pointer-events', 'none')
          .style('visibility', 'visible')
          .style('opacity', 0)
        const node = tooltip.node()
        if (node) {
          clampCongresoTooltipToViewport(node, event.clientX, event.clientY, 28)
        }
        tooltip.transition()
          .duration(200)
          .style('opacity', 1)
      },
      renderCongreso() {
        const split = this.isSplitParliamentCharts()

        const clearDesktop = () => {
          const root = this.$refs.svgCongresoDesktop
          if (!root) return
          d3.select(root).select('#parliament-senado').selectAll('*').remove()
          d3.select(root).select('#parliament-congreso').selectAll('*').remove()
        }
        const clearMobile = () => {
          const rs = this.$refs.svgSenadoMobile
          const rc = this.$refs.svgCongresoMobile
          if (rs) d3.select(rs).select('#parliament-senado-mobile').selectAll('*').remove()
          if (rc) d3.select(rc).select('#parliament-congreso-mobile').selectAll('*').remove()
        }

        if (split) {
          clearDesktop()
          const elS = this.$refs.svgSenadoMobile
          const elC = this.$refs.svgCongresoMobile
          if (!elS || !elC) return

          const wS =
            elS.getBoundingClientRect
              ? elS.getBoundingClientRect().width || null
              : null
          const wC =
            elC.getBoundingClientRect
              ? elC.getBoundingClientRect().width || null
              : null
          const LS = resolveSplitSenadoSvgLayout(wS ?? undefined)
          const LC = resolveSplitCongresoSvgLayout(wC ?? wS ?? undefined)
          this.svgSizeSenadoMobile = { ...LS.svg }
          this.svgSizeCongresoMobile = { ...LC.svg }

          const gSenadoM = d3.select(elS).select('#parliament-senado-mobile')
          gSenadoM.selectAll('*').remove()
          gSenadoM.call(
            parliament
              .parliamentChart(this.senadoresForChart, LS.ring.chartWidth)
              .debug(false)
              .sections(LS.ring.sections)
              .sectionGap(LS.ring.sectionGap)
              .seatRadius(LS.ring.seatRadius)
              .rowHeight(LS.ring.rowHeight)
          )

          const gCongresoM = d3.select(elC).select('#parliament-congreso-mobile')
          gCongresoM.selectAll('*').remove()
          gCongresoM.call(
            parliament
              .parliamentChart(this.congresistasForChart, LC.ring.chartWidth)
              .debug(false)
              .sections(LC.ring.sections)
              .sectionGap(LC.ring.sectionGap)
              .seatRadius(LC.ring.seatRadius)
              .rowHeight(LC.ring.rowHeight)
          )
        } else {
          clearMobile()
          const el = this.$refs.svgCongresoDesktop
          if (!el) return
          const measured =
            el && el.getBoundingClientRect
              ? el.getBoundingClientRect().width || null
              : null
          const L = resolveCongresoChartLayout(measured ?? undefined)
          this.svgSize = { width: L.svg.width, height: L.svg.height }

          const gSenado = d3.select(el).select('#parliament-senado')
          gSenado.selectAll('*').remove()
          gSenado.call(
            parliament
              .parliamentChart(this.senadoresForChart, L.senado.chartWidth)
              .debug(false)
              .sections(L.senado.sections)
              .sectionGap(L.senado.sectionGap)
              .seatRadius(L.senado.seatRadius)
              .rowHeight(L.senado.rowHeight)
          )

          const gCongreso = d3.select(el).select('#parliament-congreso')
          gCongreso
            .attr(
              'transform',
              `translate(${L.congreso.translate.x}, ${L.congreso.translate.y})`
            )
          gCongreso.selectAll('*').remove()
          gCongreso.call(
            parliament
              .parliamentChart(this.congresistasForChart, L.congreso.chartWidth)
              .debug(false)
              .sections(L.congreso.sections)
              .sectionGap(L.congreso.sectionGap)
              .seatRadius(L.congreso.seatRadius)
              .rowHeight(L.congreso.rowHeight)
          )
        }

        // Classes and events for all circles (senado + congreso)
        d3.selectAll('.svg-congreso circle')
          .attr("class", function (d) {
            if (d.senado_tipo) {
              return `active seat-senado ${d.partido_id}`
            }
            const _r = (d.region || '').replace(/\s/g, '-').toLowerCase()
            return `active seat-congreso ${_r} ${d.partido_id}`
          })

        d3.selectAll('.svg-congreso circle.active')
          .on("mouseover", (e, d) => {
            if (d.senado_tipo) {
              this.show_congresista(e, d)
              return
            }
            const _r = (d.region || '').replace(/\s/g, '-').toLowerCase()
            if (this.depSelected === REGION_NACIONAL)
              this.show_congresista(e, d)
            else if (d.region === this.depSelected)
              this.show_congresista(e, d)
          })
          .on('mouseout', () => {
            d3.select(`#${CONGRESO_TOOLTIP_ID}`)
              .interrupt()
              .transition()
              .duration(70)
              .style('opacity', 0)
              .on('end', function () {
                this.style.visibility = 'hidden'
              })
          })
      }
    }
  }

</script>
