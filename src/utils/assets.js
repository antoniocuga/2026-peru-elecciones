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

export function getPartidoImage(id) {
  if (!id) return FALLBACK_IMAGE
  const sub = PARTIDOS_SUBPATH ? PARTIDOS_SUBPATH + '/' : ''
  return `${IMAGES_BASE}/${sub}${id}.png`
}

export function getCandidatoImage(id) {
  if (!id) return FALLBACK_IMAGE
  const sub = CANDIDATOS_SUBPATH ? CANDIDATOS_SUBPATH + '/' : ''
  return `${IMAGES_BASE}/${sub}${id}.png`
}
