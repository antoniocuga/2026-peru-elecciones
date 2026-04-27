/**
 * ONPE ``participacion-ciudadana/totales`` (nacional, ``tipoFiltro=total``).
 * https://resultadoelectoral.onpe.gob.pe/presentacion-backend/participacion-ciudadana/totales?tipoFiltro=total
 *
 * Requiere cabeceras tipo navegador; en dev usar proxy ``/onpe-backend`` (``vite.config.js``).
 */

function toNumber(value) {
  if (value == null || value === '') return null
  if (typeof value === 'number') return Number.isNaN(value) ? null : value
  const n = parseFloat(String(value).replace(/%/g, '').replace(',', '.').trim())
  return Number.isNaN(n) ? null : n
}

/**
 * @param {unknown} payload - cuerpo JSON ONPE o snapshot ``{ success, data }``
 * @returns {{ participacion: number|null, ausentismo: number|null, emitidos: number|null, habiles: number|null } | null}
 */
export function parseParticipacionCiudadanaTotales(payload) {
  const root = payload && typeof payload === 'object' ? payload : {}
  if (Object.prototype.hasOwnProperty.call(root, 'success') && root.success === false) {
    return null
  }
  const d = root.data && typeof root.data === 'object' ? root.data : root
  if (!d || typeof d !== 'object') return null

  const participacion = toNumber(
    d.porcentajeAsistentes ?? d.porcentaje_asistentes ?? d.porcentajeParticipacionCiudadana,
  )
  const ausentismo = toNumber(d.porcentajeAusentes ?? d.porcentaje_ausentes)
  const emitidos = toNumber(d.totalAsistentes ?? d.total_asistentes ?? d.participacionCiudadana)
  const habiles = toNumber(d.totalElectoresHabiles ?? d.total_electores_habiles)

  if (
    participacion == null &&
    ausentismo == null &&
    emitidos == null &&
    habiles == null
  ) {
    return null
  }
  return { participacion, ausentismo, emitidos, habiles }
}

/**
 * Sobreescribe participación / ausentismo / emitidos / hábiles del contexto cuando ONPE trae datos.
 * @param {Record<string, unknown>} contextoFromRows - objeto ``contextoElectoral`` derivado de filas candidatos
 * @param {{ participacion: number|null, ausentismo: number|null, emitidos: number|null, habiles: number|null }|null|undefined} onpe
 */
export function mergeContextoParticipacionCiudadana(contextoFromRows, onpe) {
  if (!onpe || typeof onpe !== 'object') return contextoFromRows
  return {
    ...contextoFromRows,
    ...(onpe.participacion != null ? { participacion: onpe.participacion } : {}),
    ...(onpe.ausentismo != null ? { ausentismo: onpe.ausentismo } : {}),
    ...(onpe.emitidos != null ? { emitidos: onpe.emitidos } : {}),
    ...(onpe.habiles != null ? { habiles: onpe.habiles } : {}),
  }
}

export const ONPE_PARTICIPACION_CIUDADANA_TOTALES_QUERY = 'tipoFiltro=total'

/** Dev: proxy Vite. Prod: JSON estático bajo data-primera-vuelta (evita CORS). */
export function buildParticipacionCiudadanaTotalesUrl() {
  const qs = ONPE_PARTICIPACION_CIUDADANA_TOTALES_QUERY
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    return new URL(`/onpe-backend/participacion-ciudadana/totales?${qs}`, window.location.origin).href
  }
  if (import.meta.env.DEV) {
    return `/onpe-backend/participacion-ciudadana/totales?${qs}`
  }
  const BASE = import.meta.env.VITE_API_BASE || '/especiales/resultados-onpe-elecciones-2026'
  const DATA_PRIMERA_DIR = import.meta.env.VITE_DATA_PRIMERA_DIR || 'data-primera-vuelta'
  return `${BASE.replace(/\/$/, '')}/${DATA_PRIMERA_DIR}/participacion_ciudadana_totales.json`
}
