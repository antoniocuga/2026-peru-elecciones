<template>
  <div class="extranjero-panel bg-white py-5 text-left">


    <div v-if="loading" class="small text-muted mb-2">
      Cargando resultados por pais...
    </div>

    <div v-if="!rows.length" class="small text-muted">
      No hay data de paises en extranjero_paises.json
    </div>

    <svg
      ref="worldMap"
      class="w-100"
      viewBox="0 0 960 540"
      role="img"
      aria-label="Mapa mundial por pais con resultados de extranjero"
    ></svg>

        <div class="justify-content-between align-items-start mb-2">
      <div class="text-center">
        <p class="small text-muted mb-0">
          Voto de peruanos en el exterior al {{ summary?.conteo || '0.00' }}%. | Total de votos:
        <strong>Votos:</strong> {{ formatVotes(summary?.total_votos) }}</p>
      </div>
    </div>

    <div v-if="continentGroups.length" class="mt-3">
      <details
        v-for="group in continentGroups"
        :key="group.key"
        class="mb-2 border rounded bg-white"
      >
        <summary class="px-3 py-2 font-weight-bold" style="cursor: pointer;">
          {{ group.label }} ({{ group.rows.length }})
        </summary>
        <div class="table-responsive px-2 pb-2">
          <table class="table table-sm table-striped mb-0 small">
            <thead>
              <tr>
                <th>Pais</th>
                <th class="text-right">Conteo</th>
                <th
                  v-for="party in topPartyColumns"
                  :key="`col-${group.key}-${party.partido_id}`"
                  class="text-right"
                  :title="party.partido"
                >
                  <img
                    :src="getPartidoImage(party.partido_id)"
                    :alt="party.partido"
                    :title="party.partido"
                    width="22"
                    height="22"
                    style="object-fit: contain;"
                  />
                </th>
                <th class="text-right">Otros</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in group.rows" :key="`${group.key}-${row.country}`" class="small">
                <td>{{ row.country }}</td>
                <td class="text-right">{{ formatPct(row.actasContabilizadas || row.conteo || 0) }}</td>
                <td
                  v-for="party in topPartyColumns"
                  :key="`val-${group.key}-${row.country}-${party.partido_id}`"
                  class="text-right"
                  :style="leadingPartyCellStyle(row, party.partido_id)"
                >
                  {{ formatVotes(partyVotesForRow(row, party.partido_id)) }}
                </td>
                <td class="text-right">{{ formatVotes(otherVotesForRow(row)) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { getMapaData } from '../utils/mapas'
import worldData from '../data/mapas/world.json'
import { clampTooltipToViewport, TOOLTIP_INFORMACION_NO_DISPONIBLE } from '../utils/congresoTooltip'
import { getPartidoImage as getPartidoImageSrc, getCandidatoImage } from '../utils/assets'

export default {
  name: 'ExtranjeroCartogram',
  props: {
    rows: { type: Array, default: () => [] },
    layout: { type: Object, default: null },
    summary: { type: Object, default: () => ({ total_votos: 0, conteo: '0.00' }) },
    loading: { type: Boolean, default: false },
    candidateRows: { type: Array, default: () => [] },
    tooltipId: { type: String, default: '#tooltip_primera' },
  },
  watch: {
    rows: {
      deep: true,
      handler() {
        this.$nextTick(() => this.renderWorldMap())
      },
    },
  },
  computed: {
    topPartyColumns() {
      const targetParties = [
        ['Fuerza Popular'],
        ['Juntos Por el Peru', 'Juntos Por el Perú'],
        ['Renovacion Popular', 'Renovación Popular'],
        ['Partido del Buen Gobierno'],
        ['Partido Obras', 'Partido Civico Obras', 'Partido Cívico Obras'],
      ]
      const rows = Array.isArray(this.rows) ? this.rows : []
      const totals = new Map()
      rows.forEach((row) => {
        const details = Array.isArray(row?.details) ? row.details : []
        details.forEach((d) => {
          const id = String(d?.partido_id || '').trim()
          const name = String(d?.partido || '').trim() || 'Sin partido'
          const votos = Number(d?.votos || 0) || 0
          const key = this.normalizeName(name)
          if (!totals.has(key)) totals.set(key, { partido_id: id, partido: name, votos: 0 })
          const current = totals.get(key)
          current.votos += votos
          if (!current.partido_id && id) current.partido_id = id
          if (!current.partido && name) current.partido = name
        })
      })
      return targetParties
        .map((aliases) => {
          for (const alias of aliases) {
            const match = totals.get(this.normalizeName(alias))
            if (match) return match
          }
          return {
            partido_id: '',
            partido: aliases[0],
            votos: 0,
          }
        })
    },
    continentGroups() {
      const rows = Array.isArray(this.rows) ? this.rows : []
      if (!rows.length) return []
      const grouped = new Map()
      rows.forEach((row) => {
        const key = this.continentKey(row)
        if (!grouped.has(key)) grouped.set(key, [])
        grouped.get(key).push(row)
      })
      return Array.from(grouped.entries())
        .map(([key, groupRows]) => ({
          key,
          label: this.continentLabel(key),
          rows: [...groupRows].sort((a, b) => String(a.country || '').localeCompare(String(b.country || ''), 'es')),
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'es'))
    },
  },
  mounted() {
    this.$nextTick(() => this.renderWorldMap())
  },
  methods: {
    getPartidoImage(id) {
      return getPartidoImageSrc(id)
    },
    formatVotes(value) {
      return Number(value || 0).toLocaleString('es-PE')
    },
    normalizeName(v) {
      return String(v || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
    },
    normalizeCountryKey(v) {
      const n = this.normalizeName(v)
      const aliases = {
        'estados unidos de america': 'united states of america',
        holanda: 'netherlands',
        'republica de corea': 'south korea',
        'republica popular china': 'china',
        'republica checa': 'czechia',
        rusia: 'russia',
        // In this world GeoJSON, these overseas territories are not always
        // represented as standalone country features, so we map them to the
        // sovereign state to keep them "active" in the map.
        'antillas holandesas': 'netherlands',
        'republica arabe de egipto': 'egypt',
        'emiratos arabes unidos': 'united arab emirates',
        'principado de andorra': 'spain',
        'gran ducado de luxemburgo': 'luxembourg',
        turquia: 'turkey',
        argelia: 'algeria',
        kenia: 'kenya',
        marruecos: 'morocco',
        sudafrica: 'south africa',
        brasil: 'brazil',
        'guayana francesa': 'france',
        'republica dominicana': 'dominican rep',
        catar: 'qatar',
        filipinas: 'philippines',
        japon: 'japan',
        jordania: 'jordan',
        libano: 'lebanon',
        malasia: 'malaysia',
        // Singapore is not present as a standalone polygon in this dataset.
        // Map to Malaysia so the ONPE country remains visually active.
        singapur: 'malaysia',
        singapore: 'malaysia',
        tailandia: 'thailand',
        alemania: 'germany',
        bielorrusia: 'belarus',
        belgica: 'belgium',
        dinamarca: 'denmark',
        espana: 'spain',
        finlandia: 'finland',
        francia: 'france',
        grecia: 'greece',
        hungria: 'hungary',
        irlanda: 'ireland',
        italia: 'italy',
        malta: 'italy',
        macedonia: 'north macedonia',
        noruega: 'norway',
        polonia: 'poland',
        rumania: 'romania',
        romania: 'romania',
        suecia: 'sweden',
        suiza: 'switzerland',
        'nueva zelanda': 'new zealand',
        'united states of america': 'united states of america',
        'republica popular china': 'china',
      }
      return this.normalizeName(aliases[n] || n)
    },
    buildWorldNameIndex(countries) {
      const index = new Map()
      // Pass 1: exact Spanish labels from world.json (preferred).
      ;(Array.isArray(countries) ? countries : []).forEach((f) => {
        const nk = this.normalizeName(f?.properties?.name_es)
        if (nk && !index.has(nk)) index.set(nk, f)
      })
      // Pass 2: other direct country labels.
      ;(Array.isArray(countries) ? countries : []).forEach((f) => {
        const props = f?.properties || {}
        const keys = [
          props.name,
          props.name_long,
          props.admin,
          props.geounit,
        ]
        keys.forEach((k) => {
          const nk = this.normalizeName(k)
          if (nk && !index.has(nk)) index.set(nk, f)
        })
      })
      // Pass 3: aliases / normalized fallback.
      ;(Array.isArray(countries) ? countries : []).forEach((f) => {
        const props = f?.properties || {}
        const keys = [
          props.name_es,
          props.name,
          props.name_long,
          props.admin,
          props.geounit,
        ]
        keys.forEach((k) => {
          const nk = this.normalizeCountryKey(k)
          if (nk && !index.has(nk)) index.set(nk, f)
        })
      })
      // Pass 4: sovereignty fallback (only if no direct match)
      ;(Array.isArray(countries) ? countries : []).forEach((f) => {
        const props = f?.properties || {}
        const nk = this.normalizeCountryKey(props.sovereignt)
        if (nk && !index.has(nk)) index.set(nk, f)
      })
      return index
    },
    featureRowKey(feature) {
      const props = feature?.properties || {}
      return [
        props.iso_a3,
        props.iso_n3,
        props.name,
        props.name_long,
        props.admin,
        props.geounit,
      ]
        .map((v) => String(v || '').trim())
        .find(Boolean) || ''
    },
    directFeatureKeys(feature) {
      const props = feature?.properties || {}
      return [
        props.name_es,
        props.name,
        props.name_long,
        props.admin,
        props.geounit,
      ]
        .map((v) => this.normalizeName(v))
        .filter(Boolean)
    },
    buildFeatureRowMap(countries) {
      const featureByRowKey = new Map()
      const worldIndex = this.buildWorldNameIndex(countries)
      const rows = Array.isArray(this.rows) ? this.rows : []

      // First pass: exact Spanish names from world.json.
      rows.forEach((row) => {
        const rawName = this.normalizeName(row?.country)
        if (!rawName) return
        const feature = countries.find((candidate) => this.normalizeName(candidate?.properties?.name_es) === rawName)
        if (!feature) return
        const featureKey = this.featureRowKey(feature)
        if (!featureKey || featureByRowKey.has(featureKey)) return
        featureByRowKey.set(featureKey, row)
      })

      // Second pass: other direct country-name matches.
      rows.forEach((row) => {
        const rawName = this.normalizeName(row?.country)
        if (!rawName) return
        const feature = countries.find((candidate) => this.directFeatureKeys(candidate).includes(rawName))
        if (!feature) return
        const featureKey = this.featureRowKey(feature)
        if (!featureKey || featureByRowKey.has(featureKey)) return
        featureByRowKey.set(featureKey, row)
      })

      // Third pass: aliases / sovereign fallback only for still-unassigned polygons.
      rows.forEach((row) => {
        const rowKey = this.normalizeCountryKey(row?.country)
        if (!rowKey) return
        const feature = worldIndex.get(rowKey)
        if (!feature) return
        const featureKey = this.featureRowKey(feature)
        if (!featureKey || featureByRowKey.has(featureKey)) return
        featureByRowKey.set(featureKey, row)
      })
      return featureByRowKey
    },
    topDetail(countryRow) {
      const details = Array.isArray(countryRow?.details) ? countryRow.details : []
      if (details.length) return details[0]
      if (countryRow?.winner && typeof countryRow.winner === 'object') {
        return {
          partido: countryRow.winner.partido || 'Sin data',
          partido_id: countryRow.winner.partido_id || '',
          color: countryRow.winner.color || '#e3e3e3',
          votos: Number(countryRow.winner.votos || 0) || 0,
          porcentaje_valido: Number(countryRow.winner.porcentaje_valido || 0) || 0,
        }
      }
      return null
    },
    formatPct(value) {
      return `${Number(value || 0).toFixed(2)}%`
    },
    continentKey(row) {
      const c = String(row?.continent || '').trim()
      if (c) return this.normalizeName(c)
      const byCode = {
        '910000': 'africa',
        '920000': 'america',
        '930000': 'asia',
        '940000': 'europa',
        '950000': 'oceania',
        '960000': 'otros',
      }
      return byCode[String(row?.ubigeoNivel1 || '')] || 'otros'
    },
    continentLabel(key) {
      const labels = {
        africa: 'Africa',
        america: 'America',
        asia: 'Asia',
        europa: 'Europa',
        europe: 'Europa',
        oceania: 'Oceania',
        otros: 'Otros',
      }
      return labels[key] || key
    },
    candidateForParty(partidoId, partidoName) {
      const rows = Array.isArray(this.candidateRows) ? this.candidateRows : []
      if (!rows.length) return null
      const preferredRegions = new Set(['nacional', 'total'])
      const rowsByPid = rows.filter((r) => String(r?.partido_id || '') === String(partidoId || ''))
      const rowsByParty = rows.filter((r) =>
        String(r?.partido || '').trim().toLowerCase() === String(partidoName || '').trim().toLowerCase()
      )
      const pickBest = (list) => {
        if (!list.length) return null
        const byPreferredRegion = list.find((r) => preferredRegions.has(String(r?.region || '').toLowerCase()))
        if (byPreferredRegion) return byPreferredRegion
        return list.find((r) => String(r?.candidato || '').trim() !== '') || list[0]
      }
      return pickBest(rowsByPid) || pickBest(rowsByParty) || null
    },
    partyVotesForRow(row, partidoId) {
      const details = Array.isArray(row?.details) ? row.details : []
      const match = details.find((d) => String(d?.partido_id || '') === String(partidoId || ''))
      return Number(match?.votos || 0) || 0
    },
    otherVotesForRow(row) {
      const details = Array.isArray(row?.details) ? row.details : []
      if (!details.length) return 0
      const topIds = new Set(this.topPartyColumns.map((p) => String(p.partido_id || '')))
      return details.reduce((acc, d) => {
        const id = String(d?.partido_id || '')
        if (topIds.has(id)) return acc
        return acc + (Number(d?.votos || 0) || 0)
      }, 0)
    },
    leadingPartyIdForRow(row) {
      const details = Array.isArray(row?.details) ? row.details : []
      if (details.length) {
        const sorted = [...details].sort((a, b) => (Number(b?.votos || 0) || 0) - (Number(a?.votos || 0) || 0))
        return String(sorted[0]?.partido_id || '')
      }
      const leader = this.topDetail(row)
      return String(leader?.partido_id || '')
    },
    leadingPartyCellStyle(row, partidoId) {
      const leadingId = this.leadingPartyIdForRow(row)
      if (!leadingId || String(partidoId || '') !== leadingId) return ''
      const details = Array.isArray(row?.details) ? row.details : []
      const detail = details.find((d) => String(d?.partido_id || '') === leadingId)
      const leader = detail || this.topDetail(row)
      const color = String(leader?.color || '').trim()
      if (!color) return 'background-color: rgba(40, 167, 69, 0.16); font-weight: 700;'
      return `background-color: ${color}22; box-shadow: inset 0 0 0 1px ${color}55; font-weight: 700;`
    },
    positionTooltip(event) {
      const tipEl = this.tooltipId ? document.querySelector(this.tooltipId) : null
      if (!tipEl) return
      clampTooltipToViewport(
        tipEl,
        event?.clientX || Math.round(window.innerWidth / 2),
        event?.clientY || Math.round(window.innerHeight / 2),
        { offsetY: 18, padding: 10, gapBelowCursor: 12 }
      )
    },
    showTooltip(event, html) {
      const tipEl = this.tooltipId ? document.querySelector(this.tooltipId) : null
      if (!tipEl) return
      tipEl.innerHTML = html
      tipEl.style.display = 'block'
      tipEl.style.visibility = 'visible'
      tipEl.style.opacity = '1'
      tipEl.style.maxHeight = '70vh'
      tipEl.style.overflowY = 'auto'
      tipEl.style.overflowX = 'hidden'
      tipEl.classList.add('show')
      this.$nextTick(() => this.positionTooltip(event))
    },
    hideTooltip() {
      const tipEl = this.tooltipId ? document.querySelector(this.tooltipId) : null
      if (!tipEl) return
      tipEl.classList.remove('show')
      tipEl.style.opacity = '0'
      tipEl.style.visibility = 'hidden'
      tipEl.style.display = 'none'
    },
    tooltipTopCandidatesHtml(countryRow) {
      const details = Array.isArray(countryRow?.details) ? [...countryRow.details] : []
      if (!details.length) {
        const leader = this.topDetail(countryRow)
        if (!leader) return `<div class="small text-muted">${TOOLTIP_INFORMACION_NO_DISPONIBLE}</div>`
        const candidate = this.candidateForParty(leader?.partido_id || '', leader?.partido || '')
        const candidatoNombre = candidate?.candidato || leader?.partido || 'Sin data'
        const candidatoId = candidate?.candidato_id || ''
        const candidatoImg = getCandidatoImage(candidatoId, candidatoNombre)
        const partidoImg = getPartidoImageSrc(leader?.partido_id || '')
        const leaderPct = Number(leader?.porcentaje_valido || 0)
        return `
          <div class="tooltip-content row mt-2 pb-1 border-bottom">
            <div class="col-2">
              <img class="rounded-circle border border-3 flex-shrink-0 img-candidato" width="34" height="34" style="border-color: ${leader?.color || '#6c757d'} !important; object-fit: cover;" src="${candidatoImg}" alt="" />
            </div>
            <div class="col-6 pr-0">
              <div class="candidato-mapa"><b>${candidatoNombre}</b></div>
              <div class="partido-mapa"><img width="20" src="${partidoImg}" alt="" />${leader?.partido || 'Sin data'}</div>
            </div>
            <div class="pl-0 col-4 text-right">
              <div class="candidato-mapa"><b>${this.formatPct(leaderPct)}</b></div>
              <div class="partido-mapa text-success">${this.formatVotes(leader?.votos || 0)} votos</div>
            </div>
          </div>
        `
      }
      return details
        .slice(0, 4)
        .map((d) => {
          const votos = Number(d?.votos || 0)
          const pct = Number(d?.porcentaje_valido || 0)
          const partidoId = d?.partido_id || ''
          const partido = d?.partido || 'Sin partido'
          const candidate = this.candidateForParty(partidoId, partido)
          const candidatoNombre = candidate?.candidato || partido
          const candidatoId = candidate?.candidato_id || ''
          const candidatoImg = getCandidatoImage(candidatoId, candidatoNombre)
          const partidoImg = getPartidoImageSrc(partidoId)
          const borderColor = d?.color || '#6c757d'
          return `
            <div class="tooltip-content row mt-2 pb-1 border-bottom">
              <div class="col-2">
                <img class="rounded-circle border border-3 flex-shrink-0 img-candidato" width="34" height="34" style="border-color: ${borderColor} !important; object-fit: cover;" src="${candidatoImg}" alt="" />
              </div>
              <div class="col-6 pr-0">
                <div class="candidato-mapa"><b>${candidatoNombre}</b></div>
                <div class="partido-mapa"><img width="20" src="${partidoImg}" alt="" />${partido}</div>
              </div>
              <div class="pl-0 col-4 text-right">
                <div class="candidato-mapa"><b>${this.formatPct(pct)}</b></div>
                <div class="partido-mapa text-success">${this.formatVotes(votos)} votos</div>
              </div>
            </div>
          `
        })
        .join('')
    },
    buildCountryTooltipHtml(row, countryName) {
      const conteoCountry = Number(row?.actasContabilizadas || 0)
      const votos = this.formatVotes(row?.totalValidos || row?.totalVotes || 0)
      const leader = this.topDetail(row)
      const leaderLabel = leader?.partido || 'Sin data'
      const detailsHtml = this.tooltipTopCandidatesHtml(row)
      return `
        <div class="row border-bottom pb-2 mb-2">
          <div class="col-7 depa"><b>${countryName}</b></div>
          <div class="col-5 text-right"><span class="badge badge-secondary">Conteo ONPE al ${this.formatPct(conteoCountry)}</span></div>
        </div>
        <div>${detailsHtml}</div>
      `
    },
    leaderColor(countryRow) {
      const leader = this.topDetail(countryRow)
      if (leader?.color) return leader.color
      const hasVotes = Number(countryRow?.totalValidos || countryRow?.totalVotes || 0) > 0
      // Keep countries with valid votes visible even when ONPE details are empty.
      if (hasVotes) return '#333'
      return '#e3e3e3'
    },
    getWorldGeoJson() {
      const worldRaw = getMapaData('world') || worldData
      if (worldRaw?.type === 'FeatureCollection' && Array.isArray(worldRaw?.features)) return worldRaw
      if (worldRaw?.default?.type === 'FeatureCollection' && Array.isArray(worldRaw?.default?.features)) return worldRaw.default
      return null
    },
    getWorldCountries(worldGeoJson) {
      return Array.isArray(worldGeoJson?.features) ? worldGeoJson.features : []
    },
    renderWorldMap() {
      const svgEl = this.$refs.worldMap
      if (!svgEl) return
      const svg = d3.select(svgEl)
      svg.selectAll('*').remove()

      const width = 960
      const height = 540
      const projection = d3.geoNaturalEarth1()
        .scale(175)
        .translate([width / 2, height / 2])
      const geoPath = d3.geoPath().projection(projection)

      svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#ffffff')

      const world = this.getWorldGeoJson()
      const countries = this.getWorldCountries(world)
      if (!countries.length) {
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', height / 2)
          .attr('fill', '#fff')
          .attr('text-anchor', 'middle')
          .text('No se pudo cargar world.json')
        return
      }

      const featureRowMap = this.buildFeatureRowMap(countries)

      svg.append('g')
        .selectAll('path.country')
        .data(countries)
        .join('path')
        .attr('class', 'country')
        .attr('d', geoPath)
        .attr('fill', (d) => {
          const row = featureRowMap.get(this.featureRowKey(d))
          return this.leaderColor(row)
        })
        .attr('stroke', '#e3e3e3')
        .attr('stroke-width', 0.5)
        .on('mouseenter', (event, d) => {
          const name = d?.properties?.name_es || d?.properties?.name || 'Pais'
          const row = featureRowMap.get(this.featureRowKey(d)) || { details: [] }
          this.showTooltip(event, this.buildCountryTooltipHtml(row, name))
        })
        .on('mousemove', (event) => this.positionTooltip(event))
        .on('mouseleave', () => this.hideTooltip())
    },
  },
}
</script>
