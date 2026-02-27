/**
 * Vite-compatible asset helpers (no require()).
 * Uses import.meta.glob so paths are known at build time.
 */

const partidoModules = import.meta.glob('../assets/partidos/*.png', { eager: true, query: '?url', import: 'default' })
const candidatoModules = import.meta.glob('../assets/candidatos/*.png', { eager: true, query: '?url', import: 'default' })

function findUrl(globResult, id, fallbackKey) {
  const key = Object.keys(globResult).find((k) => k.includes(`/${id}.png`))
  if (key) return globResult[key] ?? ''
  const fallback = Object.keys(globResult).find((k) => k.includes(fallbackKey || 'blanco-viciado'))
  return fallback ? (globResult[fallback] ?? '') : ''
}

export function getPartidoImage(id) {
  return findUrl(partidoModules, id, 'blanco-viciado') || ''
}

export function getCandidatoImage(id) {
  return findUrl(candidatoModules, id, 'blanco-viciado') || ''
}
