/** Body-mounted tooltip for parliament seats (embed-safe). Ref-counted for multiple consumers. */
export const CONGRESO_TOOLTIP_ID = 'tooltip-congresista'

let refCount = 0

export function acquireCongresoBodyTooltip() {
  let el = document.getElementById(CONGRESO_TOOLTIP_ID)
  if (!el) {
    el = document.createElement('div')
    el.id = CONGRESO_TOOLTIP_ID
    el.className = 'tooltip_congresista'
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
