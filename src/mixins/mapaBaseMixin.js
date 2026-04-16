import { geoMercator } from 'd3-geo'
import numeral from 'numeral'
import { getMapaData, getPerugeo } from '../utils/mapas'
import { getPartidoImage, getCandidatoImage } from '../utils/assets'
import * as d3 from 'd3'
import { feature } from 'topojson'
import { find, filter, map, maxBy, minBy, orderBy, sumBy, groupBy, uniq } from 'lodash'
import { TOOLTIP_INFORMACION_NO_DISPONIBLE, clampTooltipToViewport } from '../utils/congresoTooltip'
import { maxConteo } from '../utils/conteoAggregate'

/** Sum votos válidos por candidato en una región / distrito (JSON puede traer total o total_votos). */
function sumCandidatoVoteTotals(candidatos) {
  if (!Array.isArray(candidatos) || !candidatos.length) return 0
  return sumBy(candidatos, (c) => Number(c.total ?? c.total_votos ?? 0) || 0)
}

function isMapGeoFeature(f) {
  return f != null && typeof f === 'object' && f.properties != null
}

/** Callao / Lima metro / extranjero: en D3 el datum es un string, no un feature GeoJSON. */
function mapExtraRegionSlugTitle(slug) {
  if (slug === 'extranjero') return 'Extranjero'
  if (slug === 'lima') return 'Lima Metropolitana'
  if (slug === 'callao') return 'Callao'
  return ''
}

const MAPA_DEP_GRAY_PATH = 'fill:rgb(151, 151, 151);'
const MAPA_DEP_GRAY_SPAN = 'background: #eaeaea;'

export const mapaBaseMixin = {
  data() {
    return {
      openMenu: false,
      width: 720,
      height: 720,
      center: [],
      scale: 1500,
      distance: 0,
      bounds: [],
      center_device: [],
      zoomed: false,
      legendaValues: {},
      // Configuration defaults — override in component data()
      _mapId: 'mapa',
      _regionesExtraId: 'regiones',
      _tooltipId: '#tooltip',
      _rawDistritosKey: 'distritos',
      /** SVG height when innerWidth < 768 (phones / narrow) */
      _mobileHeight: 640,
      /** SVG height for tablet in fluid layout (768–992) and desktop */
      _desktopHeight: 720,
      _mobileScaleMultiplier: 1.45,
      _tooltipCandidatosCount: 4,
    }
  },

  mounted() {
    // Ensure the tooltip div exists on document.body (needed when component is
    // used standalone/embedded and the parent page didn't provide it)
    if (this._tooltipId && !document.querySelector(this._tooltipId)) {
      const tip = document.createElement('div')
      tip.id = this._tooltipId.replace(/^#/, '')
      tip.className = 'tooltip tooltip-data'
      tip.style.pointerEvents = 'none'
      document.body.appendChild(tip)
      this._tooltipCreatedByMixin = true
    }
    this.renderMapa()
  },

  beforeUnmount() {
    if (this._tooltipCreatedByMixin) {
      const el = document.querySelector(this._tooltipId)
      if (el) el.remove()
    }
  },

  props: {
    lista_candidatos: Array,
  },

  watch: {
    candidatos() {
      this.renderMapa()
    },
    distritos() {
      if (this.zoomed === true) {
        this.$nextTick(() => this.render_distritos())
      }
    },
    distritos_parse: {
      handler() {
        if (this.zoomed === true) {
          this.$nextTick(() => this.render_distritos())
        }
      },
    },
    partidoSeleccionado(v) {
      this.zoomed = false
      if (v.partido_id !== 'TODOS') {
        const depsConVotos = filter(this.departamentos_parse, (d) => this.mapDepartamentoHasVotes(d))
        if (!depsConVotos.length) {
          this.legendaValues.max = '0'
          this.legendaValues.min = '0'
        } else {
          const max = maxBy(depsConVotos, 'total_departamento').total_departamento
          const min = minBy(depsConVotos, 'total_departamento').total_departamento
          this.legendaValues.max = max.toFixed(1)
          this.legendaValues.min = min.toFixed(1)
        }
      }
      this.applyDepartamentoFills()
    },
    regionSeleccionada(v) {
      if (v.region !== 'NACIONAL') {
        d3.selectAll(`#${this._mapId} path.departamento-path`).classed('inactive', true)
        d3.select(`#${this._mapId} path.${v.region}-path`).classed('inactive', false)
        d3.selectAll('text.departamento-label').classed('active', false)
        d3.select(`text.${v.region}-label`).classed('active', true)
      }

      if (v.region !== 'NACIONAL') {
        this._fetchDistritos(v)
          .then(() => this.$nextTick(() => this.transitionPath()))
          .catch(() => this.$nextTick(() => this.transitionPath()))
      } else {
        this.transitionPath()
      }

      if (v.region === 'NACIONAL' && this.partidoSeleccionado.partido_id !== 'TODOS') {
        this.zoomed = false
        const depsConVotos = filter(this.departamentos_parse, (d) => this.mapDepartamentoHasVotes(d))
        if (depsConVotos.length) {
          const max = maxBy(depsConVotos, 'total_departamento').total_departamento
          const min = minBy(depsConVotos, 'total_departamento').total_departamento
          this.legendaValues.max = max.toFixed(1)
          this.legendaValues.min = min.toFixed(1)
        }
      }
    },
  },

  computed: {
    perugeo() {
      return getPerugeo()
    },
    partidos() {
      const rows = map(groupBy(this.candidatos, 'partido_id'), (item, partido_id) => ({
        partido_id,
        partido: uniq(map(item, 'partido')).join(''),
        color: uniq(map(item, 'color')).join(''),
        departamentos: groupBy(item, 'region'),
      }))
      return orderBy(rows, [(p) => String(p.partido || '').toLocaleLowerCase('es')], ['asc'])
    },
    distritos_parse() {
      let filtered = this.distritos
      const rNorm = this.normalizeRegionId(this.regionSeleccionada.region)

      if (this.partidoSeleccionado.partido_id !== 'TODOS' && this.regionSeleccionada.region === 'NACIONAL') {
        filtered = filter(this.distritos, ['partido_id', this.partidoSeleccionado.partido_id])
      } else if (this.regionSeleccionada.region !== 'NACIONAL' && this.partidoSeleccionado.partido_id === 'TODOS') {
        filtered = filter(this.distritos, d =>
          this.normalizeRegionId(d.departamento_id || d.region) === rNorm
        )
      } else if (this.regionSeleccionada.region !== 'NACIONAL' && this.partidoSeleccionado.partido_id !== 'TODOS') {
        filtered = filter(this.distritos, d =>
          this.normalizeRegionId(d.departamento_id || d.region) === rNorm &&
          d.partido_id === this.partidoSeleccionado.partido_id
        )
      }

      return orderBy(map(
        groupBy(filtered, d => (d.ubigeo_inei != null && d.ubigeo_inei !== '') ? d.ubigeo_inei : d.ubigeo),
        (item, ubigeo_inei) => {
          const first = item[0]
          const ubigeoNorm = this.normalizeUbigeo(ubigeo_inei)
          return {
            ubigeo_inei: ubigeoNorm,
            ubigeo: ubigeoNorm,
            ubigeo_reniec: first && first.ubigeo_reniec != null && first.ubigeo_reniec !== ''
              ? this.normalizeUbigeo(first.ubigeo_reniec) : null,
            region: this.regionSeleccionada.region,
            distrito: uniq(map(item, 'distrito')).join(''),
            provincia: uniq(map(item, 'provincia')).join(''),
            departamento: this.regionSeleccionada.departamento,
            conteo: maxConteo(item),
            validos: parseFloat(uniq(map(item, 'validos')).join('')),
            total: sumBy(map(item, d => d.total != null ? d.total : d.total_votos)),
            candidatos: orderBy(item, ['validos'], ['desc']),
            winner: maxBy(item, 'validos'),
          }
        }
      ), ['departamento'])
    },
    departamentos_parse() {
      const filtered = filter(this.lista_candidatos, c => c.partido_id === this.partidoSeleccionado.partido_id)
      const rows = map(groupBy(filtered, 'region'), (item, region) => {
        const _r = region.replace(/ /g, '-')
        return {
          region: _r,
          departamento: uniq(map(item, 'region')).join(''),
          total_departamento: maxBy(item, 'validos').validos,
          candidatos: orderBy(item, ['validos'], ['desc']),
          geodata: region !== 'total' ? getMapaData(_r) : {},
          winner: maxBy(item, 'validos'),
        }
      })
      return orderBy(rows, [(d) => String(d.departamento || '').toLocaleLowerCase('es')], ['asc'])
    },
    departamentos() {
      const filtered = filter(this.candidatos, c => c.candidato_id !== '' && c.region !== 'total')
      const rows = map(groupBy(filtered, 'region'), (item, region) => {
        const _r = region.replace(/ /g, '-')
        return {
          region: _r,
          departamento: region !== 'extranjero' ? uniq(map(item, 'departamento')).join('') : 'EXTRANJERO',
          total_departamento: parseFloat(sumBy(map(item, 'total'))),
          candidatos: orderBy(item, ['validos'], ['desc']),
          conteo: maxConteo(item),
          geodata: getMapaData(_r),
          winner: maxBy(item, 'validos'),
        }
      })
      return orderBy(rows, [(d) => String(d.departamento || '').toLocaleLowerCase('es')], ['asc'])
    },
    projection() {
      return geoMercator()
        .translate([this.width / 2, this.height / 2])
        .scale(this.scale)
    },
    path() {
      return d3.geoPath().projection(this.projection)
    },
    tooltip() {
      return d3.select(this._tooltipId)
    },
  },

  methods: {
    // ── Abstract hooks — override in each component ───────────────────────
    _fetchDistritos(/* v */) { return Promise.resolve() },
    _updateRegionSeleccionada(/* dep */) {},
    _updatePartidoSeleccionado(/* partido */) {},
    _getDefaultRegionLabel() { return 'Ver región'},
    _getDefaultPartidoLabel() { return 'Ver por partido' },

    // ── Public actions ────────────────────────────────────────────────────
    resetPartidos() {
      this.zoomed = false
      this._updatePartidoSeleccionado({ partido_id: 'TODOS', partido: this._getDefaultPartidoLabel() })
    },
    resetPresidente() {
      this.zoomed = false
      this._updateRegionSeleccionada({ region: 'NACIONAL', departamento: this._getDefaultRegionLabel() })
    },
    openDepartamentos() {
      this.openMenu = !this.openMenu
    },
    show_partido(partido) {
      this._updateRegionSeleccionada({ region: 'NACIONAL', departamento: this._getDefaultRegionLabel() })
      this._updatePartidoSeleccionado(partido)
    },
    show_departamento(id) {
      const dep = find(this.departamentos, d => d.region === id)
      this._updateRegionSeleccionada(dep)
    },
    getImageCandidate(c) { return getCandidatoImage(c) },
    getImagePartido(c) { return getPartidoImage(c) },

    /** Mapa en gris si no hay votos en esa región (evita pintar “ganador” con 0%). */
    mapDepartamentoHasVotes(dep) {
      if (!dep) return false
      if (sumCandidatoVoteTotals(dep.candidatos) > 0) return true
      const td = Number(dep.total_departamento)
      return !Number.isNaN(td) && td > 0
    },

    mapDistritoHasVotes(dep) {
      if (!dep) return false
      const t = Number(dep.total)
      return !Number.isNaN(t) && t > 0
    },

    mapOpacityByConteo(dep) {
      const raw = Number(maxConteo(dep?.candidatos || []))
      if (Number.isNaN(raw) || raw <= 0) return 0.35
      return Math.max(0.35, Math.min(1, raw / 100))
    },

    /** Estilo de relleno para un departamento (vista nacional, sin recorte por zoom). */
    _fillStyleDepartamentoPathByRegionId(depId) {
      if (this.partidoSeleccionado.partido_id !== 'TODOS') {
        const dep = find(this.departamentos_parse, (d) => d.region === depId)
        const depsConVotos = filter(this.departamentos_parse, (d) => this.mapDepartamentoHasVotes(d))
        if (!depsConVotos.length) return MAPA_DEP_GRAY_PATH
        const max = maxBy(depsConVotos, 'total_departamento').total_departamento
        const min = minBy(depsConVotos, 'total_departamento').total_departamento
        const color = d3
          .scaleLinear()
          .domain([min, max])
          .range(['#eaeaea', `${this.partidoSeleccionado.color}ab`])
        if (dep && this.mapDepartamentoHasVotes(dep)) {
          return `fill: ${color(dep.winner.validos)}; opacity: ${this.mapOpacityByConteo(dep)};`
        }
        return MAPA_DEP_GRAY_PATH
      }
      const dep = find(this.departamentos, (d) => d.region === depId)
      if (dep && this.mapDepartamentoHasVotes(dep) && dep.winner?.color) {
        return `fill: ${dep.winner.color}ab; opacity: ${this.mapOpacityByConteo(dep)};`
      }
      return MAPA_DEP_GRAY_PATH
    },

    _fillStyleDepartamentoSpanByRegionId(rid) {
      if (this.partidoSeleccionado.partido_id !== 'TODOS') {
        const dep = find(this.departamentos_parse, (d) => d.region === rid)
        const depsConVotos = filter(this.departamentos_parse, (d) => this.mapDepartamentoHasVotes(d))
        if (!depsConVotos.length) return MAPA_DEP_GRAY_SPAN
        const max = maxBy(depsConVotos, 'total_departamento').total_departamento
        const min = minBy(depsConVotos, 'total_departamento').total_departamento
        const color = d3
          .scaleLinear()
          .domain([min, max])
          .range(['#eaeaea', `${this.partidoSeleccionado.color}ab`])
        if (dep && this.mapDepartamentoHasVotes(dep)) {
          return `background: ${color(dep.winner.validos)}; opacity: ${this.mapOpacityByConteo(dep)};`
        }
        return MAPA_DEP_GRAY_SPAN
      }
      const dep = find(this.departamentos, (d) => d.region === rid)
      if (dep && this.mapDepartamentoHasVotes(dep) && dep.winner?.color) {
        return `background: ${dep.winner.color}ab; opacity: ${this.mapOpacityByConteo(dep)};`
      }
      return MAPA_DEP_GRAY_SPAN
    },

    /**
     * Con zoom a distritos: todos los departamentos en gris (el color va en los distritos).
     * Vista nacional: colorea departamentos según datos.
     */
    applyDepartamentoFills() {
      const base = d3.select(this.$refs['svgmap'])
      if (base.empty()) return

      const zoomed = this.zoomed === true
      const reg = this.regionSeleccionada?.region
      const distritoView =
        zoomed && reg && reg !== 'NACIONAL'

      base.selectAll('path.departamento-path').attr('style', (f) => {
        if (distritoView) {
          return MAPA_DEP_GRAY_PATH
        }
        const id = f.properties.dep_id
        return this._fillStyleDepartamentoPathByRegionId(id)
      })

      const extra = d3.select(`#${this._regionesExtraId}`)
      if (!extra.empty()) {
        const ids = ['callao', 'lima', 'extranjero']
        const self = this
        extra.selectAll('span.departamento-path').each(function (_d, i) {
          const rid = ids[i]
          if (!rid) return
          const el = d3.select(this)
          if (distritoView) {
            el.attr('style', MAPA_DEP_GRAY_SPAN)
          } else {
            el.attr('style', self._fillStyleDepartamentoSpanByRegionId(rid))
          }
        })
      }
    },

    // ── Normalization ─────────────────────────────────────────────────────
    normalizeUbigeo(val) {
      if (val == null) return ''
      const s = String(val).trim()
      return s.length >= 6 ? s.slice(0, 6) : s.padStart(6, '0')
    },
    normalizeRegionId(val) {
      if (val == null) return ''
      return String(val).toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').trim()
    },

    // ── Dynamic zoom ──────────────────────────────────────────────────────
    computeZoom(geoFeature) {
      const padding = window.innerWidth < 993 ? 16 : 40
      const tempProj = geoMercator()
      tempProj.fitExtent(
        [[padding, padding], [this.width - padding, this.height - padding]],
        geoFeature
      )
      return {
        center: tempProj.invert([this.width / 2, this.height / 2]),
        scale: tempProj.scale(),
      }
    },

    // ── Animated transition ───────────────────────────────────────────────
    transitionPath() {
      const base = d3.select(this.$refs['svgmap'])
      if (base.empty() || !this.perugeo) return
      let center, scale

      if (this.regionSeleccionada.region !== 'NACIONAL') {
        const regionNorm = this.normalizeRegionId(this.regionSeleccionada.region)
        const dep = find(this.perugeo.features, d =>
          this.normalizeRegionId(d.properties.dep_id) === regionNorm
        )
        if (!dep || !dep.properties) {
          center = d3.geoCentroid(this.perugeo)
          scale = window.innerWidth < 993
            ? this.width * this._mobileScaleMultiplier / this.distance
            : this.width / this.distance
        } else {
          const zoom = this.computeZoom(dep)
          center = zoom.center
          scale = zoom.scale
        }
      } else {
        center = d3.geoCentroid(this.perugeo)
        scale = window.innerWidth < 993
          ? this.width * this._mobileScaleMultiplier / this.distance
          : this.width / this.distance
      }

      const r = d3.interpolate(this.center, center)
      const s = d3.interpolate(this.scale, scale)

      // Avoid stacked transitions: interrupted ones may not run on('end'), leaving zoomed/distritos stale.
      base.selectAll('path.departamento-path').interrupt()

      base.selectAll('path.departamento-path')
        .transition()
        .duration(1000)
        .attrTween('d', (d) => (t) => {
          this.projection
            .scale(s(Math.pow(t, 2)))
            .center(r(Math.pow(t, 0.33)))
            .translate(this.center_device)
          this.path.projection(this.projection)
          return this.path(d)
        })
        .on('start', () => {
          base.selectAll('text.departamento-label').classed('inactive', true)
          base.selectAll('path.distrito-path').remove()
          d3.select('.candidate-results-vivo').style('opacity', 0).classed('active', false)
        })
        .on('end', () => {
          this.scale = scale
          this.center = center
          if (this.regionSeleccionada.region !== 'NACIONAL') {
            this.renderLabels()
            this.render_distritos()
            d3.select('.candidate-results-vivo').style('opacity', 1).classed('active', true)
            this.zoomed = true
            this.applyDepartamentoFills()
          } else {
            this.zoomed = false
            base.selectAll('path.departamento-path').classed('inactive', false).attr('style', MAPA_DEP_GRAY_PATH)
            d3.select('.candidate-results-vivo').style('opacity', 1).classed('active', true)
            this.applyDepartamentoFills()
          }
        })
    },

    // ── Initial map render ────────────────────────────────────────────────
    renderMapa() {
      if (!this.perugeo) return
      const base = d3.select(this.$refs['base'])

      this.bounds = d3.geoBounds(this.perugeo)
      this.center = d3.geoCentroid(this.perugeo)
      this.distance = d3.geoDistance(this.bounds[0], this.bounds[1])

      if (window.innerWidth < 993) {
        this.width = window.innerWidth > 500 ? window.innerWidth / 1.7 : window.innerWidth
        this.height =
          window.innerWidth < 768 ? this._mobileHeight : this._desktopHeight
        this.center_device = [this.width / 2, this.height / 2]
        this.scale = this.width * this._mobileScaleMultiplier / this.distance
      } else if (window.innerWidth > 720) {
        this.width = 720
        this.height = this._desktopHeight
        this.center_device = [this.width / 2, this.height / 2]
        this.scale = this.width / this.distance
      }

      this.projection.translate(this.center_device).center(this.center).scale(this.scale)
      base.selectAll('path.departamento-path').remove()

      base.selectAll('path.departamento-path')
        .data(this.perugeo.features)
        .enter()
        .append('path')
        .attr('d', this.path)
        .attr('class', d => `departamento-path ${d.properties.dep_id}-path`)
        .attr('id', d => d.properties.dep_id)
        .on('click', (event, f) => {
          const dep = find(this.departamentos, d => d.region === f.properties.dep_id)
          if (window.innerWidth > 798 && !this.zoomed && dep) {
            this._updateRegionSeleccionada(dep)
          }
        })
        .on('mouseover', (event, f) => {
          if (window.innerWidth > 798 && !this.zoomed) {
            let dep = find(this.departamentos, d => d.region === f.properties.dep_id)
            if (this.partidoSeleccionado.partido_id !== 'TODOS') {
              dep = find(this.departamentos_parse, d => d.region === f.properties.dep_id)
            }
            this._showTooltip(event, dep, f)
          }
        })
        .on('mouseout', () => { if (window.innerWidth > 798) this._hideTooltip() })

      d3.selectAll(`#${this._regionesExtraId} span.departamento-path`)
        .data(['callao', 'lima', 'extranjero'])
        .on('click', (event, f) => {
          const dep = find(this.departamentos, d => d.region === f)
          if (window.innerWidth > 798 && !this.zoomed && f !== 'extranjero' && dep) {
            this._updateRegionSeleccionada(dep)
          }
        })
        .on('mouseover', (event, f) => {
          if (window.innerWidth > 798 && !this.zoomed) {
            let dep = find(this.departamentos, d => d.region === f)
            if (this.partidoSeleccionado.partido_id !== 'TODOS') {
              dep = find(this.departamentos_parse, d => d.region === f)
            }
            this._showTooltip(event, dep, f)
          }
        })
        .on('mouseout', () => { if (window.innerWidth > 798) this._hideTooltip() })

      d3.select(this.$refs['labels'])
        .selectAll('text')
        .data(this.perugeo.features)
        .enter()
        .append('text')
        .attr('class', d => `departamento-label inactive ${d.properties.dep_id}-label`)
        .text(d => d.properties.NOMBDEP)

      this.applyDepartamentoFills()
    },

    renderLabels() {
      d3.select(this.$refs['labels'])
        .selectAll('text.departamento-label')
        .attr('transform', d => {
          const translate = this.projection(d.properties.center)
          if (!isNaN(translate[0])) return `translate(${translate})`
        })
        .classed('inactive', false)
    },

    // ── District polygons ─────────────────────────────────────────────────
    render_distritos() {
      let geo = this.regionSeleccionada?.geodata
      if (!geo && this.regionSeleccionada?.region && this.regionSeleccionada.region !== 'NACIONAL') {
        const r = (this.regionSeleccionada.region || '').toString().replace(/\s+/g, '-')
        geo = getMapaData(r) || getMapaData(this.regionSeleccionada.region)
      }
      if (!geo || !geo.objects) return
      const objectKey = Object.keys(geo.objects)[0]
      if (!objectKey) return

      const _raw = this.store[this._rawDistritosKey]
      const rawDistritos = Array.isArray(_raw) ? _raw : []
      let parsed = this.distritos_parse

      if (!parsed.length && rawDistritos.length) {
        const rNorm = this.normalizeRegionId(this.regionSeleccionada.region)
        const filtered = rawDistritos.filter(d =>
          this.normalizeRegionId(d.departamento_id || d.region) === rNorm
        )
        const keyFn = d => (d.ubigeo_inei != null && d.ubigeo_inei !== '') ? d.ubigeo_inei : d.ubigeo
        parsed = orderBy(map(groupBy(filtered, keyFn), (item, ubigeo_inei) => {
          const first = item[0]
          const ubigeoNorm = this.normalizeUbigeo(ubigeo_inei)
          return {
            ubigeo_inei: ubigeoNorm,
            ubigeo: ubigeoNorm,
            ubigeo_reniec: first && first.ubigeo_reniec != null && first.ubigeo_reniec !== ''
              ? this.normalizeUbigeo(first.ubigeo_reniec) : null,
            region: this.regionSeleccionada.region,
            distrito: uniq(map(item, 'distrito')).join(''),
            provincia: uniq(map(item, 'provincia')).join(''),
            departamento: this.regionSeleccionada.departamento,
            conteo: maxConteo(item),
            validos: parseFloat(uniq(map(item, 'validos')).join('')),
            total: sumBy(map(item, d => d.total != null ? d.total : d.total_votos)),
            candidatos: orderBy(item, ['validos'], ['desc']),
            winner: maxBy(item, 'validos'),
          }
        }), ['departamento'])
      }

      if (!parsed.length) return

      const matchDep = (idDist) => {
        const id = this.normalizeUbigeo(idDist != null ? idDist : '')
        return find(parsed, d =>
          (d.ubigeo_inei != null && this.normalizeUbigeo(d.ubigeo_inei) === id) ||
          (d.ubigeo != null && this.normalizeUbigeo(d.ubigeo) === id) ||
          (d.ubigeo_reniec != null && this.normalizeUbigeo(d.ubigeo_reniec) === id)
        )
      }

      const base = d3.select(this.$refs['base'])
      let color

      if (this.partidoSeleccionado.partido_id !== 'TODOS') {
        const conVotos = parsed.filter((d) => this.mapDistritoHasVotes(d))
        if (conVotos.length) {
          const max = maxBy(conVotos, 'validos')
          const min = minBy(conVotos, 'validos')
          if (max && min && max.winner) {
            color = d3.scaleLinear().domain([min.validos, max.validos]).range(['#eaeaea', `${max.winner.color}ab`])
            this.legendaValues.max = max.validos.toFixed(1)
            this.legendaValues.min = min.validos.toFixed(1)
          }
        }
      }

      const features_distrito = feature(geo, geo.objects[objectKey])
      if (!features_distrito || !Array.isArray(features_distrito.features)) return

      const zoomedProjection = geoMercator()
        .translate(this.center_device)
        .center(this.center)
        .scale(this.scale)
      const zoomedPath = d3.geoPath().projection(zoomedProjection)

      base.selectAll('path.distrito-path').remove()
      base.selectAll('path.distrito-path')
        .data(features_distrito.features)
        .enter()
        .append('path')
        .attr('d', zoomedPath)
        .attr('class', d => `distrito-path ${d.properties.IDDIST}-path`)
        .attr('style', (f) => {
          const rawId = f.properties.IDDIST ?? f.properties.ubigeo
          const dep = matchDep(this.normalizeUbigeo(rawId))
          if (!dep || !this.mapDistritoHasVotes(dep)) {
            return MAPA_DEP_GRAY_PATH
          }
          if (this.partidoSeleccionado.partido_id !== 'TODOS' && color && dep.winner) {
            return `fill: ${color(dep.winner.validos)}; opacity: ${this.mapOpacityByConteo(dep)};`
          }
          if (dep.winner && dep.winner.color) {
            const c = String(dep.winner.color).trim()
            const hex = c.startsWith('#') ? c : '#' + c
            return `fill: ${hex.length === 7 ? hex + 'ab' : hex}; opacity: ${this.mapOpacityByConteo(dep)};`
          }
          return MAPA_DEP_GRAY_PATH
        })
        .on('mouseover', (event, f) => {
          if (window.innerWidth > 798) {
            const rawId = f.properties.IDDIST ?? f.properties.ubigeo
            const dep = matchDep(this.normalizeUbigeo(rawId))
            this._showTooltip(event, dep, f)
          }
        })
        .on('mouseout', () => { if (window.innerWidth > 798) this._hideTooltip() })
    },

    // ── Tooltip ───────────────────────────────────────────────────────────
    _showTooltip(event, dep, f) {
      this.tooltip
        .html(this.load_tooltip(dep, f))
        .style('display', 'block')
        .style('visibility', 'visible')
        .style('opacity', 0)
      this.$nextTick(() => {
        const node = this.tooltip.node()
        if (node) {
          clampTooltipToViewport(node, event.clientX, event.clientY, {
            offsetY: 28,
            padding: 12,
            gapBelowCursor: 10,
          })
        }
        this.tooltip.transition().duration(180).style('opacity', 1)
      })
    },
    _hideTooltip() {
      this.tooltip
        .interrupt()
        .transition()
        .duration(200)
        .style('opacity', 0)
    },
    load_tooltip(dep, f) {
      if (!dep) {
        const name = isMapGeoFeature(f)
          ? (f.properties.DISTRITO || f.properties.NAME_1 || 'Distrito')
          : (typeof f === 'string' && mapExtraRegionSlugTitle(f)) || 'Distrito'
        return `<div class="row border-bottom pb-2 mb-2"><div class="col-12 depa"><b>${name}</b></div><div class="col-12">${TOOLTIP_INFORMACION_NO_DISPONIBLE}</div></div>`
      }

      const count = this._tooltipCandidatosCount || 4
      let candidatos = ''
      let table = ''
      const conteo = maxConteo(dep.candidatos || [])

      if (!this.zoomed) {
        const name = isMapGeoFeature(f)
          ? (f.properties.NAME_1 || f.properties.DISTRITO || '')
          : (typeof f === 'string' && mapExtraRegionSlugTitle(f)) || dep.departamento
        table = `
          <div class="row border-bottom pb-2 mb-2">
            <div class="col-6 depa"><b>${name}</b></div>
            <div class="col-6 text-right"><span class="badge badge-secondary">Conteo ONPE al ${conteo}%</span></div>
          </div>`
        if (dep.candidatos?.length) {
          const top = orderBy(
            dep.candidatos,
            [(c) => Number(c.total_departamento ?? c.total ?? c.total_votos ?? 0)],
            ['desc'],
          ).slice(0, count)
          map(top, dp => {
            const borderColor = dp.color || '#6c757d'
            candidatos += `
              <div class="tooltip-content row mt-2 pb-1 border-bottom">
                <div class="col-3"><div><img style="min-width: 40px; min-height: 40px;" class="rounded-circle border border-3 flex-shrink-0 img-candidato" width="40px" height="40px" style="border-color: ${borderColor} !important; object-fit: cover;" src="${this.getImageCandidate(dp.candidato_id)}" alt="" /></div></div>
                <div class="col-5 pr-0">
                  <div class="candidato-mapa"><b>${dp.candidato}</b></div>
                  <div class="partido-mapa"><img width="25px" src="${this.getImagePartido(dp.partido_id)}" />${dp.partido}</div>
                </div>
                <div class="pl-0 col-4 text-right">
                  <div class="candidato-mapa"><b>${dp.validos != null ? dp.validos.toFixed(3) : '0.000'}%</b></div>
                  <div class="partido-mapa text-success">${numeral(dp.total ?? dp.total_votos ?? 0).format('0,0')} votos</div>
                </div>
              </div>`
          })
          if (!candidatos.trim()) {
            candidatos = TOOLTIP_INFORMACION_NO_DISPONIBLE
          }
        } else {
          candidatos = TOOLTIP_INFORMACION_NO_DISPONIBLE
        }
        table += `<div>${candidatos}</div>`
      } else {
        const zoomedHeader = isMapGeoFeature(f)
          ? `<b>${f.properties.DISTRITO ?? ''}</b> - ${f.properties.PROVINCIA ?? ''}`
          : `<b>${(typeof f === 'string' && mapExtraRegionSlugTitle(f)) || dep.departamento || ''}</b>`
        table = `
          <div class="row border-bottom pb-2 mb-2">
            <div class="col-7 depa">${zoomedHeader}</div>
            <div class="col-5 text-right"><span class="badge badge-secondary">Conteo ONPE al ${dep.conteo ?? 0}%</span></div>
          </div>`
        if (dep.conteo > 0 && dep.candidatos?.length) {
          const top = orderBy(dep.candidatos || [], ['validos'], ['desc']).slice(0, count)
          map(top, dp => {
            if (dp.candidato_id) {
              const borderColor = dp.color || '#6c757d'
              candidatos += `
                <div class="tooltip-content row mt-2 pb-1 border-bottom">
                  <div class="col-2"><div><img class="rounded-circle border border-3 flex-shrink-0 img-candidato" width="40" height="40" style="border-color: ${borderColor} !important; object-fit: cover;" src="${this.getImageCandidate(dp.candidato_id)}" alt="" /></div></div>
                  <div class="col-6 pr-0">
                    <div class="candidato-mapa"><b>${dp.candidato}</b></div>
                    <div class="partido-mapa"><img width="25px" src="${this.getImagePartido(dp.partido_id)}" />${dp.partido}</div>
                  </div>
                  <div class="pl-0 col-4 text-right">
                    <div class="candidato-mapa"><b>${dp.validos != null ? dp.validos.toFixed(3) : '0.000'}%</b></div>
                    <div class="partido-mapa text-success">${numeral(dp.total_votos ?? dp.total ?? 0).format('0,0')} votos</div>
                  </div>
                </div>`
            }
          })
          if (!candidatos.trim()) {
            candidatos = TOOLTIP_INFORMACION_NO_DISPONIBLE
          }
        } else {
          candidatos = TOOLTIP_INFORMACION_NO_DISPONIBLE
        }
        table += `<div>${candidatos}</div>`
      }
      return table
    },
  },
}
