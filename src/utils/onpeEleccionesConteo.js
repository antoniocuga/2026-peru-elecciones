/**
 * ONPE ``resumen-general/elecciones`` (lista de elecciones / conteo por idEleccion).
 * Payload alineado a ONPE (misma query que la web):
 * https://resultadoelectoral.onpe.gob.pe/presentacion-backend/resumen-general/elecciones?activo=1&idProceso=2&tipoFiltro=eleccion
 * La app lee el snapshot ``genera_elecciones.json``; esta URL sirve para regenerarlo.
 *
 * Usado para el titular nacional de conteo en diputados y senado sin depender del ``conteo``
 * incrustado en filas regionales del JSON exportado.
 */

/** Cámara de Diputados (EG 2026, mismo ``idEleccion`` que ``diputados_circuits.json``). */
export const ONPE_ID_ELECCION_DIPUTADOS = '13'

/** Senadores distrito único / nacional (mismo ``idEleccion`` que ``senado_circuits.json`` circuito nacional). */
export const ONPE_ID_ELECCION_SENADO_NACIONAL = '15'

function parsePctValue(value) {
  if (value == null || value === '') return null
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  const s = String(value)
    .trim()
    .replace(/%/g, '')
    .replace(/\s/g, '')
    .replace(',', '.')
  const n = parseFloat(s)
  return Number.isNaN(n) ? null : n
}

function formatPctLabel(n) {
  const r = Math.round(n * 100) / 100
  return Number.isInteger(r) ? String(r) : r.toFixed(2)
}

function pickConteoFromRow(row) {
  if (!row || typeof row !== 'object') return null
  // Prefer explicit % fields first. ``actasContabilizadas`` is often a **count** of mesas/actas,
  // not 0–100; reading it first produced wrong titulares diputados/senado.
  const pctKeys = [
    'porcentajeActasContabilizadas',
    'porcentaje_actas_contabilizadas',
    'porcentajeActas',
    'porcentaje_actas',
    'porcentajeAvanceActas',
    'porcentaje_avance_actas',
    'porcentajeAvance',
    'porcentaje_avance',
    'avanceActas',
    'avance_actas',
    'conteoGeneral',
    'conteo_general',
    'conteo',
    'porcentaje',
    'pct',
  ]
  for (const k of pctKeys) {
    const v = parsePctValue(row[k])
    if (v != null) return v
  }
  const ac = parsePctValue(row.actasContabilizadas ?? row.actas_contabilizadas)
  if (ac != null && ac >= 0 && ac <= 100) return ac
  return null
}

function collectObjectArrays(node, out, depth) {
  if (depth <= 0 || node == null) return
  if (Array.isArray(node)) {
    if (node.length && typeof node[0] === 'object') out.push(node)
    return
  }
  if (typeof node !== 'object') return
  for (const v of Object.values(node)) {
    if (Array.isArray(v) && v.length && typeof v[0] === 'object') {
      out.push(v)
    } else if (v && typeof v === 'object') {
      collectObjectArrays(v, out, depth - 1)
    }
  }
}

function flattenCandidateRows(data) {
  /** @type {any[][]} */
  const buckets = []
  if (Array.isArray(data)) {
    if (data.length && typeof data[0] === 'object') return data
    return []
  }
  if (data && typeof data === 'object') {
    for (const key of ['content', 'lista', 'elecciones', 'items', 'resultado', 'data']) {
      const v = data[key]
      if (Array.isArray(v) && v.length && typeof v[0] === 'object') {
        return v
      }
    }
    collectObjectArrays(data, buckets, 6)
  }
  if (!buckets.length) return []
  /** @type {any[]} */
  const merged = []
  const seen = new Set()
  for (const arr of buckets) {
    for (const row of arr) {
      if (!row || typeof row !== 'object') continue
      const id = row.idEleccion ?? row.id_eleccion ?? row.codigoEleccion ?? row.codigo_eleccion
      if (id == null) continue
      const key = String(id)
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(row)
    }
  }
  return merged.length ? merged : []
}

/**
 * @param {unknown} payload - respuesta axios (``data``) o cuerpo ``{ success, data }``
 * @returns {Record<string, string>} ``idEleccion`` (string) → porcentaje como en titulares (p. ej. ``43.06``)
 */
export function parseConteoPctByIdEleccion(payload) {
  const root = payload && typeof payload === 'object' ? payload : {}
  if (Object.prototype.hasOwnProperty.call(root, 'success') && root.success === false) {
    return {}
  }
  const inner = 'data' in root ? root.data : root
  const rows = Array.isArray(inner) ? inner : flattenCandidateRows(inner)
  /** @type {Record<string, string>} */
  const out = {}
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    const idRaw =
      row.idEleccion ??
      row.id_eleccion ??
      row.id ??
      row.codigoEleccion ??
      row.codigo_eleccion
    if (idRaw == null) continue
    const id = String(idRaw).trim()
    if (!id) continue
    const pct = pickConteoFromRow(row)
    if (pct == null) continue
    out[id] = formatPctLabel(pct)
  }
  return out
}

/** Query fija alineada a la URL oficial de listado de elecciones / conteo por ``idEleccion``. */
export const ONPE_RESUMEN_GENERAL_ELECCIONES_QUERY = 'activo=1&idProceso=2&tipoFiltro=eleccion'

/**
 * URL absoluta ONPE, o ruta proxificada en dev (``vite.config.js`` → ``/onpe-backend``).
 */
export function buildOnpeResumenGeneralEleccionesUrl() {
  const qs = ONPE_RESUMEN_GENERAL_ELECCIONES_QUERY
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    return `/onpe-backend/resumen-general/elecciones?${qs}`
  }
  return `https://resultadoelectoral.onpe.gob.pe/presentacion-backend/resumen-general/elecciones?${qs}`
}
