/**
 * Asset helpers — images are served from a CDN or the deployment origin.
 *
 * Env (optional):
 *   VITE_ASSETS_CDN           - full URL of assets folder (e.g. CDN).
 *   VITE_PUBLIC_BASE_URL     - full app URL so embedded widgets get absolute image URLs.
 *   VITE_IMAGES_BASE         - base URL for candidate/party images. When set (e.g. to app root),
 *                              images load from public root, e.g. .../2026-candidatos/<id>.png.
 *                              When unset, images use the same base as assets ( .../assets/... ).
 *   VITE_ASSETS_CANDIDATOS   - subpath for candidate images (e.g. 2026-candidatos).
 *   VITE_ASSETS_PARTIDOS     - subpath for party images (e.g. 2026-partidos).
 */
const ASSETS_BASE = (() => {
  const cdn = import.meta.env.VITE_ASSETS_CDN
  if (cdn && typeof cdn === 'string') return cdn.replace(/\/$/, '')
  const publicBase = import.meta.env.VITE_PUBLIC_BASE_URL
  if (publicBase && typeof publicBase === 'string') return publicBase.replace(/\/$/, '') + '/assets'
  const pathBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  return pathBase + '/assets'
})()

const IMAGES_BASE = (() => {
  const base = import.meta.env.VITE_IMAGES_BASE
  if (base && typeof base === 'string') return base.replace(/\/$/, '')
  return ASSETS_BASE
})()

const CANDIDATOS_SUBPATH = (import.meta.env.VITE_ASSETS_CANDIDATOS || '').replace(/\/+$/, '')
const PARTIDOS_SUBPATH = (import.meta.env.VITE_ASSETS_PARTIDOS || '').replace(/\/+$/, '')
const FALLBACK_IMAGE = `${IMAGES_BASE}/${CANDIDATOS_SUBPATH ? CANDIDATOS_SUBPATH + '/' : ''}blanco-viciado.png`

/** Nombre completo → slug kebab-case para archivos PNG (coincide con convención de carpeta de candidatos). */
export function nombreACandidatoSlug(nombre) {
  if (nombre == null) return ''
  const s = String(nombre).trim()
  if (!s) return ''
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getPartidoImage(id) {
  if (!id) return FALLBACK_IMAGE
  const sub = PARTIDOS_SUBPATH ? PARTIDOS_SUBPATH + '/' : ''
  return `${IMAGES_BASE}/${sub}${id}.png?2026`
}

/** SVG embebido (marco + bloque estilo logo) cuando no existe el PNG del partido; usa el color del partido si es hex válido. */
export function getPartidoFallbackImageDataUrl(hexColor) {
  let stroke = '#6c757d'
  if (hexColor != null && typeof hexColor === 'string') {
    const t = hexColor.trim()
    if (/^#[0-9A-Fa-f]{3}$/.test(t)) {
      stroke = `#${t[1]}${t[1]}${t[2]}${t[2]}${t[3]}${t[3]}`
    } else if (/^#[0-9A-Fa-f]{6}$/.test(t)) {
      stroke = t
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="#f8f9fa"/><rect x="6" y="6" width="52" height="52" fill="none" stroke="${stroke}" stroke-width="3"/><rect x="16" y="18" width="32" height="22" rx="2" fill="none" stroke="${stroke}" stroke-width="2"/><path d="M16 44h32M22 50h20" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

/**
 * @param {string} [id] - slug legado / id (fallback si no hay nombre útil)
 * @param {string} [nombre] - nombre para derivar ``<kebab>.png``
 */
export function getCandidatoImage(id, nombre) {
  const sub = CANDIDATOS_SUBPATH ? CANDIDATOS_SUBPATH + '/' : ''
  const fromNombre = nombreACandidatoSlug(nombre)
  const fromId = id != null && String(id).trim() ? String(id).trim() : ''
  const base = fromNombre || fromId
  if (!base) return FALLBACK_IMAGE
  return `${IMAGES_BASE}/${sub}${base}.png?actualizado`
}
