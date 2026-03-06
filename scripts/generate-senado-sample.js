/**
 * Generates senado_total.json: 60 senators (30 nacional + 30 regional).
 * Regional: LIMA gets 4 seats; each other region from congreso_total.json gets 1.
 * Run: node scripts/generate-senado-sample.js
 * Output: public/data-primera-vuelta/senado_total.json
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONGRESO_PATH = path.join(ROOT, 'public/data-primera-vuelta/congreso_total.json')
// Use 2026 resultados so senado has same 36 parties (names, colors, partido_id for logos)
const RESULTADOS_PATH = path.join(ROOT, 'public/data-primera-vuelta/resultados_total_2026.json')
const OUTPUT_PATH = path.join(ROOT, 'public/data-primera-vuelta/senado_total.json')

const HORA = '12:00 h - 26/02/2026'
const MAX_PARTIES_SENADO = 6 // voting system allows at most 6 parties in senate
const COLORES = ['#00aede', '#fd6600', '#2fc100', '#f40201', '#0050a0', '#4f1b7f', '#1022b9', '#ff2600', '#009a21', '#4e5405', '#ff2c79', '#004da3']

/** Build partido_id -> color from resultados_total.json (legacy helper). */
function loadPartyColorsFromResultados (filePath) {
  if (!fs.existsSync(filePath)) return {}
  const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const map = {}
  for (const row of rows) {
    if (row.partido_id && row.color && map[row.partido_id] == null) {
      map[row.partido_id] = row.color
    }
  }
  return map
}

/** Build list of parties from resultados_total.json (names + colors) so senado matches running parties and logos. */
function loadPartyTemplatesFromResultados (filePath) {
  if (!fs.existsSync(filePath)) return []
  const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const seen = new Set()
  const list = []
  for (const row of rows) {
    if (row.partido_id && row.partido && row.color && !seen.has(row.partido_id)) {
      seen.add(row.partido_id)
      list.push({
        partido_id: row.partido_id,
        partido: row.partido,
        color: row.color,
        nro: list.length + 1,
        total_votos_partido: 200000 - list.length * 5000,
        voto_preferencial: 100000,
        voto_fantasma: 80000,
      })
    }
  }
  return list
}

function slug (str) {
  return String(str)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase()
}

function buildRow (opts) {
  const { senado_tipo, region, nombre, candidato_id, partido, partido_id, nro, color, total_votos_partido, voto_preferencial, voto_fantasma } = opts
  return {
    senado_tipo,
    region,
    nombre,
    candidato_id,
    partido,
    partido_id,
    nro: nro ?? 1,
    color: color ?? COLORES[0],
    total_votos_partido: total_votos_partido ?? 100000,
    hora: HORA,
    conteo: 100,
    voto_preferencial: voto_preferencial ?? 50000,
    voto_fantasma: voto_fantasma ?? 40000,
    conteo_general: 100,
  }
}

function main () {
  const congreso = JSON.parse(fs.readFileSync(CONGRESO_PATH, 'utf8'))
  const regionesUnicas = [...new Set(congreso.map(r => r.region))].filter(r => r !== 'LIMA').sort()

  // Use at most 6 parties from resultados (senate voting system limit) – same names, colors, partido_id for logos
  let partyTemplates = loadPartyTemplatesFromResultados(RESULTADOS_PATH)
  if (partyTemplates.length === 0) {
    console.warn('No parties in resultados file; using single fallback party.')
    partyTemplates = [{ partido_id: 'partido-sample', partido: 'Partido Sample', color: COLORES[0], nro: 1, total_votos_partido: 200000, voto_preferencial: 100000, voto_fantasma: 80000 }]
  }
  partyTemplates = partyTemplates.slice(0, MAX_PARTIES_SENADO)
  const numParties = partyTemplates.length
  const nacionales = []
  const regionales = []

  // 30 nacional senators: round-robin across parties from resultados (same names/colors as running parties)
  for (let i = 0; i < 30; i++) {
    const template = partyTemplates[i % numParties] || partyTemplates[0]
    nacionales.push(buildRow({
      senado_tipo: 'nacional',
      region: 'NACIONAL',
      nombre: `Senador Nacional ${template.partido} ${Math.floor(i / numParties) + 1}`,
      candidato_id: `senador-nacional-${template.partido_id}-${i + 1}`,
      partido: template.partido,
      partido_id: template.partido_id,
      nro: template.nro,
      color: template.color,
      total_votos_partido: template.total_votos_partido - i * 1000,
      voto_preferencial: template.voto_preferencial - i * 500,
      voto_fantasma: template.voto_fantasma,
    }))
  }

  const regionalSlots = []
  for (let i = 0; i < 4; i++) regionalSlots.push('LIMA')
  regionesUnicas.forEach(r => regionalSlots.push(r))

  const byRegion = congreso.reduce((acc, row) => {
    if (!acc[row.region]) acc[row.region] = []
    acc[row.region].push(row)
    return acc
  }, {})

  regionalSlots.forEach((region, idx) => {
    const pool = byRegion[region] || byRegion['LIMA'] || congreso
    const source = pool[idx % pool.length]
    const template = partyTemplates[idx % numParties] || partyTemplates[0]
    const nombre = source?.nombre ?? `Senador Regional ${region} ${idx + 1}`
    const candidato_id = source?.candidato_id ?? `senador-regional-${slug(region)}-${idx + 1}`
    regionales.push(buildRow({
      senado_tipo: 'regional',
      region,
      nombre,
      candidato_id,
      partido: template.partido,
      partido_id: template.partido_id,
      nro: template.nro,
      color: template.color,
      total_votos_partido: template.total_votos_partido ?? 150000,
      voto_preferencial: template.voto_preferencial ?? 75000,
      voto_fantasma: template.voto_fantasma ?? 60000,
    }))
  })

  const out = [...nacionales, ...regionales]
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2), 'utf8')
  console.log('Wrote', OUTPUT_PATH, '-', out.length, 'senators (30 nacional, 30 regional; LIMA = 4 regional)')
}

main()
