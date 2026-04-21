import { PARLIAMENT_PLACEHOLDER_PARTIDO_ID } from './congresoTooltip'

/**
 * @param {unknown[]} resultadosRows - e.g. resultados_total_2026.json (array of rows)
 * @returns {Record<string, number>} partido_id -> validos (%) on rows with region "total"
 */
export function buildNacionalValidosPctMapFromResultados(resultadosRows) {
  const rows = Array.isArray(resultadosRows) ? resultadosRows : []
  /** @type {Record<string, number>} */
  const out = {}
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    if (String(row.region || '').trim().toLowerCase() !== 'total') continue
    const pid = String(row.partido_id || '').trim()
    if (!pid) continue
    const v = Number(row.validos)
    if (!Number.isFinite(v)) continue
    out[pid] = v
  }
  return out
}

function isParliamentPlaceholderPartidoId(partidoId) {
  const id = String(partidoId || '')
  return id === PARLIAMENT_PLACEHOLDER_PARTIDO_ID || id.startsWith(`${PARLIAMENT_PLACEHOLDER_PARTIDO_ID}-`)
}

/**
 * Keep only diputado rows whose lista has nacional validos **>** thresholdPct on region total,
 * plus parliament placeholder rows. If pctMap is empty, returns rows unchanged.
 *
 * @param {unknown[]} congresoRows
 * @param {Record<string, number>} nacionalPctByPartidoId
 * @param {number} [thresholdPct=5]
 */
export function filterCongresoRowsByNacionalUmbral(congresoRows, nacionalPctByPartidoId, thresholdPct = 5) {
  const rows = Array.isArray(congresoRows) ? congresoRows : []
  const map = nacionalPctByPartidoId && typeof nacionalPctByPartidoId === 'object' ? nacionalPctByPartidoId : {}
  if (Object.keys(map).length === 0) return rows
  const thr = Number(thresholdPct)
  if (!Number.isFinite(thr) || thr <= 0) return rows
  return rows.filter((r) => {
    const pid = String(r?.partido_id || '')
    if (isParliamentPlaceholderPartidoId(pid)) return true
    const v = map[pid]
    return v !== undefined && Number(v) > thr
  })
}
