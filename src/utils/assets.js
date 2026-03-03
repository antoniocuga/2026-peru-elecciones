/**
 * Asset helpers — images are served from a CDN or the deployment origin.
 *
 * Set VITE_ASSETS_CDN to the full URL of the assets folder (e.g. for a CDN).
 * Set VITE_PUBLIC_BASE_URL to the full app URL (e.g. https://yoursite.com/especiales/resultados-onpe-elecciones-2026)
 * so image URLs are absolute and work when the widget is embedded on other pages.
 * All images land in dist/assets/ after build: <base>/assets/<id>.png
 */
const ASSETS_BASE = (() => {
  const cdn = import.meta.env.VITE_ASSETS_CDN
  if (cdn && typeof cdn === 'string') return cdn.replace(/\/$/, '')
  const publicBase = import.meta.env.VITE_PUBLIC_BASE_URL
  if (publicBase && typeof publicBase === 'string') return publicBase.replace(/\/$/, '') + '/assets'
  const pathBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  return pathBase + '/assets'
})()

const FALLBACK_IMAGE = `${ASSETS_BASE}/blanco-viciado.png`

export function getPartidoImage(id) {
  if (!id) return FALLBACK_IMAGE
  return `${ASSETS_BASE}/${id}.png`
}

export function getCandidatoImage(id) {
  if (!id) return FALLBACK_IMAGE
  return `${ASSETS_BASE}/${id}.png`
}
