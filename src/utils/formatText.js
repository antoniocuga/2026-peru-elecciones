/** Escape a plain string for safe insertion into HTML. */
export function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * ONPE-style vote share (3 decimals), e.g. 52.497%.
 */
export function formatValidosPct(value) {
  if (value == null || value === '') return '—'
  const n = Number(value)
  if (Number.isNaN(n)) return '—'
  return `${n.toFixed(3)}%`
}

/** Integer vote count, e.g. 3,736,990 */
export function formatVotos(value) {
  if (value == null || value === '') return '—'
  const n = Number(value)
  if (Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('es-PE').format(Math.round(n))
}

/**
 * ``3,736,990 (93.424%)`` when both values exist; falls back to count or pct alone.
 */
export function formatVotosConPct(votos, pct) {
  if (votos != null && pct != null) {
    return `${formatVotos(votos)} (${formatValidosPct(pct)})`
  }
  if (pct != null) return formatValidosPct(pct)
  if (votos != null) return formatVotos(votos)
  return '—'
}

/**
 * Title-case each whitespace-separated word (first letter upper, rest lower per word).
 */
export function capitalizeWords(value) {
  if (value == null || value === '') return ''
  return String(value)
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (!word) return word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}
