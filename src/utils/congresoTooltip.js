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
 * Keep a fixed-position tooltip inside the viewport (embeds, map edges, mobile).
 * Call after inner HTML is set so size can be measured.
 *
 * @param {HTMLElement} tooltipEl
 * @param {number} clientX
 * @param {number} clientY
 * @param {number | { offsetY?: number, padding?: number, gapBelowCursor?: number, position?: string }} [offsetYOrOpts]
 */
export function clampTooltipToViewport(tooltipEl, clientX, clientY, offsetYOrOpts = 28) {
  if (!tooltipEl || typeof window === 'undefined') return
  const opts = typeof offsetYOrOpts === 'number' ? { offsetY: offsetYOrOpts } : offsetYOrOpts || {}
  const pad = opts.padding ?? 12
  const offsetY = opts.offsetY ?? 28
  const gapBelow = opts.gapBelowCursor ?? 10
  const vw = window.innerWidth
  const vh = window.innerHeight

  tooltipEl.style.position = opts.position ?? 'fixed'

  const apply = (left, top) => {
    tooltipEl.style.left = `${Math.round(left)}px`
    tooltipEl.style.top = `${Math.round(top)}px`
  }

  // Measure size off-screen (do not toggle visibility — host CSS may control it)
  tooltipEl.style.left = '-10000px'
  tooltipEl.style.top = '0px'
  const w = tooltipEl.getBoundingClientRect().width

  // Center horizontally on cursor; place above pointer (legacy: top ≈ clientY - offsetY)
  let left = clientX - w / 2
  let top = clientY - offsetY

  apply(left, top)
  let rect = tooltipEl.getBoundingClientRect()

  // If not enough space above, show below cursor
  if (rect.top < pad) {
    top = clientY + gapBelow
    apply(left, top)
    rect = tooltipEl.getBoundingClientRect()
  }

  // Nudge until inside viewport (wide tooltips, bottom edge, small viewports)
  for (let i = 0; i < 8; i++) {
    rect = tooltipEl.getBoundingClientRect()
    let dl = 0
    let dt = 0
    if (rect.right > vw - pad) dl -= rect.right - (vw - pad)
    if (rect.left < pad) dl += pad - rect.left
    if (rect.bottom > vh - pad) dt -= rect.bottom - (vh - pad)
    if (rect.top < pad) dt += pad - rect.top
    if (dl === 0 && dt === 0) break
    left += dl
    top += dt
    apply(left, top)
  }
}

/** Alias of {@link clampTooltipToViewport} for parliament / embed tooltips. */
export function clampCongresoTooltipToViewport(tooltipEl, clientX, clientY, offsetYOrOpts = 28) {
  return clampTooltipToViewport(tooltipEl, clientX, clientY, offsetYOrOpts)
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
