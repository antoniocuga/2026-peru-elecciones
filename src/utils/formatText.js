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
