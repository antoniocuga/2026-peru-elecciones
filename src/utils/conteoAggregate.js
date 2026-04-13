/**
 * ONPE ``conteo`` (% actas) puede variar por distrito dentro del mismo ``{region}.json``.
 * Para un titular regional único usamos el máximo (mayor avance reportado).
 */
export function maxConteo(rows) {
  if (!rows?.length) return 0
  let m = 0
  for (const r of rows) {
    const v = parseFloat(r?.conteo)
    if (!Number.isNaN(v) && v > m) m = v
  }
  return Math.round(m * 100) / 100
}

/** Varias ``hora`` por distrito → una cadena legible. */
export function joinHoras(rows) {
  if (!rows?.length) return ''
  const seen = new Set()
  const out = []
  for (const r of rows) {
    const h = r?.hora != null ? String(r.hora).trim() : ''
    if (h && !seen.has(h)) {
      seen.add(h)
      out.push(h)
    }
  }
  return out.join(' · ')
}
