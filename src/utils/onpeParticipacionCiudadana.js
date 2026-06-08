/**
 * ONPE ``participacion-ciudadana/totales`` (nacional, ``tipoFiltro=total``).
 * Segunda: ``resultadosegundavuelta.onpe.gob.pe`` (+ ``resumen-general/totales`` en snapshot).
 *
 * En dev usar proxy ``/onpe-backend`` (primera) o ``/onpe-backend-segunda`` (segunda).
 */

function toNumber(value) {
  if (value == null || value === '') return null
  if (typeof value === 'number') return Number.isNaN(value) ? null : value
  const n = parseFloat(String(value).replace(/%/g, '').replace(',', '.').trim())
  return Number.isNaN(n) ? null : n
}

/**
 * @param {unknown} payload - cuerpo JSON ONPE o snapshot ``{ success, data }``
 * @returns {{
 *   participacion: number|null,
 *   ausentismo: number|null,
 *   emitidos: number|null,
 *   habiles: number|null,
 *   totalVotosValidos: number|null,
 *   validos: number|null,
 *   actasContabilizadas: number|null,
 * } | null}
 */
export function parseParticipacionCiudadanaTotales(payload) {
  const root = payload && typeof payload === 'object' ? payload : {}
  if (Object.prototype.hasOwnProperty.call(root, 'success') && root.success === false) {
    return null
  }
  const d = root.data && typeof root.data === 'object' ? root.data : root
  if (!d || typeof d !== 'object') return null

  const participacion = toNumber(
    d.porcentajeAsistentes
      ?? d.porcentaje_asistentes
      ?? d.porcentajeParticipacionCiudadana
      ?? d.participacionCiudadana,
  )
  const ausentismo = toNumber(d.porcentajeAusentes ?? d.porcentaje_ausentes)
  const emitidos = toNumber(
    d.totalVotosEmitidos ?? d.totalAsistentes ?? d.total_asistentes ?? d.participacionCiudadana,
  )
  const habiles = toNumber(d.totalElectoresHabiles ?? d.total_electores_habiles)
  const totalVotosValidos = toNumber(d.totalVotosValidos ?? d.total_votos_validos)
  const actasContabilizadas = toNumber(d.actasContabilizadas ?? d.actas_contabilizadas)

  let validos = toNumber(d.porcentajeVotosValidos ?? d.porcentaje_votos_validos)
  if (emitidos != null && emitidos > 0 && totalVotosValidos != null) {
    const computed = Math.round((totalVotosValidos / emitidos) * 100000) / 1000
    if (validos == null || validos >= 99.99) {
      validos = computed
    }
  }

  if (
    participacion == null &&
    ausentismo == null &&
    emitidos == null &&
    habiles == null &&
    totalVotosValidos == null &&
    validos == null &&
    actasContabilizadas == null
  ) {
    return null
  }
  return { participacion, ausentismo, emitidos, habiles, totalVotosValidos, validos, actasContabilizadas }
}

/**
 * @param {Record<string, unknown>} contextoFromRows
 * @param {ReturnType<typeof parseParticipacionCiudadanaTotales>|null|undefined} onpe
 */
export function mergeContextoParticipacionCiudadana(contextoFromRows, onpe) {
  if (!onpe || typeof onpe !== 'object') return contextoFromRows
  return {
    ...contextoFromRows,
    ...(onpe.participacion != null ? { participacion: onpe.participacion } : {}),
    ...(onpe.ausentismo != null ? { ausentismo: onpe.ausentismo } : {}),
    ...(onpe.emitidos != null ? { emitidos: onpe.emitidos } : {}),
    ...(onpe.habiles != null ? { habiles: onpe.habiles } : {}),
    ...(onpe.validos != null ? { validos: onpe.validos } : {}),
    ...(onpe.totalVotosValidos != null ? { validosVotos: onpe.totalVotosValidos } : {}),
    ...(onpe.actasContabilizadas != null ? { actasContabilizadas: onpe.actasContabilizadas } : {}),
  }
}

export const ONPE_PARTICIPACION_CIUDADANA_TOTALES_QUERY = 'tipoFiltro=total'

/**
 * @param {{ profile?: 'primera'|'segunda', live?: boolean }} [opts]
 * ``live`` solo en dev con ``VITE_ONPE_LIVE_PARTICIPACION=1`` (primera). Segunda usa JSON estático.
 */
export function buildParticipacionCiudadanaTotalesUrl(opts = {}) {
  const profile = opts.profile === 'segunda' ? 'segunda' : 'primera'
  const qs = ONPE_PARTICIPACION_CIUDADANA_TOTALES_QUERY
  const proxyPrefix = profile === 'segunda' ? '/onpe-backend-segunda' : '/onpe-backend'

  const BASE = import.meta.env.VITE_API_BASE || '/especiales/resultados-onpe-elecciones-2026'
  const dataDir =
    profile === 'segunda'
      ? (import.meta.env.VITE_DATA_SEGUNDA_DIR || 'data-segunda-vuelta')
      : (import.meta.env.VITE_DATA_PRIMERA_DIR || 'data-primera-vuelta')

  if (profile === 'segunda' || !opts.live) {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      return new URL(`/${dataDir}/participacion_ciudadana_totales.json`, window.location.origin).href
    }
    if (import.meta.env.DEV) {
      return `/${dataDir}/participacion_ciudadana_totales.json`
    }
    return `${BASE.replace(/\/$/, '')}/${dataDir}/participacion_ciudadana_totales.json`
  }

  if (import.meta.env.DEV && typeof window !== 'undefined') {
    return new URL(`${proxyPrefix}/participacion-ciudadana/totales?${qs}`, window.location.origin).href
  }
  if (import.meta.env.DEV) {
    return `${proxyPrefix}/participacion-ciudadana/totales?${qs}`
  }

  return `${BASE.replace(/\/$/, '')}/${dataDir}/participacion_ciudadana_totales.json`
}
