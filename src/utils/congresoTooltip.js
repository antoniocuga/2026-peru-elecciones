/** Body-mounted tooltip for parliament seats (embed-safe). Ref-counted for multiple consumers. */
export const CONGRESO_TOOLTIP_ID = 'tooltip-congresista'

/** Single copy for map + parliament + embed when there is no real data yet */
export const TOOLTIP_INFORMACION_NO_DISPONIBLE = 'Información no disponible'

/** Matches placeholder seats in congresoGrafico when congreso/senado arrays are empty */
export const PARLIAMENT_PLACEHOLDER_PARTIDO_ID = 'sin-resultados'

export function isParliamentPlaceholderSeat(d) {
  if (!d || typeof d !== 'object') return false
  if (d.partido_id === PARLIAMENT_PLACEHOLDER_PARTIDO_ID) return true
  const cid = d.candidato_id
  return typeof cid === 'string' && cid.startsWith('placeholder-')
}

/** Preferencial por curul: JSON exportado vs campos crudos ONPE (p. ej. totalVotosValidos). */
export function seatVotoPreferencial(d) {
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
}

export function tooltipInformacionNoDisponibleHtml() {
  return `<p class="mb-0">${TOOLTIP_INFORMACION_NO_DISPONIBLE}</p>`
}

let refCount = 0

/**
 * Keep fixed tooltip inside the viewport (embeds / small widths).
 * Call after inner HTML is set so size can be measured.
 */
export function clampCongresoTooltipToViewport(tooltipEl, clientX, clientY, offsetY = 28) {
  if (!tooltipEl || typeof window === 'undefined') return
  const pad = 12
  const vw = window.innerWidth
  const vh = window.innerHeight
  let left = clientX
  let top = clientY - offsetY
  for (let i = 0; i < 2; i++) {
    tooltipEl.style.left = `${left}px`
    tooltipEl.style.top = `${top}px`
    const rect = tooltipEl.getBoundingClientRect()
    if (rect.right > vw - pad) left -= rect.right - (vw - pad)
    if (rect.left < pad) left += pad - rect.left
    if (rect.bottom > vh - pad) top -= rect.bottom - (vh - pad)
    if (rect.top < pad) top += pad - rect.top
  }
}

export function acquireCongresoBodyTooltip() {
  let el = document.getElementById(CONGRESO_TOOLTIP_ID)
  if (!el) {
    el = document.createElement('div')
    el.id = CONGRESO_TOOLTIP_ID
    // Namespaced token + shared styles (see styles.scss: #tooltip-congresista.tooltip_congresista)
    el.className = 'ej2026-congreso-tooltip tooltip_congresista'
    el.style.pointerEvents = 'none'
    document.body.appendChild(el)
  }
  refCount++
}

export function releaseCongresoBodyTooltip() {
  refCount = Math.max(0, refCount - 1)
  if (refCount === 0) {
    const el = document.getElementById(CONGRESO_TOOLTIP_ID)
    if (el) el.remove()
  }
}
