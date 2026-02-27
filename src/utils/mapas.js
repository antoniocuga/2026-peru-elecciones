/**
 * Vite-compatible mapas JSON loader (no require()).
 */
const mapasModules = import.meta.glob('../data/mapas/*.json', { eager: true, import: 'default' })

export function getMapaData(region) {
  if (!region || region === 'total') return null
  const normalized = String(region).replace(/\s/g, '-').toLowerCase()
  const key = Object.keys(mapasModules).find((k) => k.includes(`/${normalized}.json`))
  return key ? mapasModules[key] : null
}

export function getPerugeo() {
  return mapasModules[Object.keys(mapasModules).find((k) => k.includes('/perugeo.json'))] || null
}
