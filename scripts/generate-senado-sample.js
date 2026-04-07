/**
 * Generates senado_total.json: 60 senators (30 nacional + 30 regional).
 * Regional: LIMA gets 4 seats; each other region from congreso_total.json gets 1.
 * Run: node scripts/generate-senado-sample.js
 * Output: public/data-primera-vuelta/senado_total.json
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadPartyTemplatesFromCrawler } from './lib/crawler-national.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONGRESO_PATH = path.join(ROOT, 'public/data-primera-vuelta/congreso_total.json')
const CRAWLLER_RESULTS_PATH = path.join(ROOT, 'crawller/resultados.json')
const OUTPUT_PATH = path.join(ROOT, 'public/data-primera-vuelta/senado_total.json')

const HORA = '12:00 h - 26/02/2026'
const MAX_PARTIES_SENADO = 6 // voting system allows at most 6 parties in senate
const FALLBACK_COLOR = '#9CA3AF'

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
    color: color ?? FALLBACK_COLOR,
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

  // At most 6 parties (senate limit) — names, colors, partido_id from crawller/resultados.json only
  let partyTemplates = loadPartyTemplatesFromCrawler(CRAWLLER_RESULTS_PATH)
  if (partyTemplates.length === 0) {
    console.warn('No parties in crawler file; using single fallback party.')
    partyTemplates = [{ partido_id: 'partido-sample', partido: 'Partido Sample', color: FALLBACK_COLOR, nro: 1, total_votos_partido: 200000, voto_preferencial: 100000, voto_fantasma: 80000 }]
  }
  partyTemplates = partyTemplates.slice(0, MAX_PARTIES_SENADO)
  const numParties = partyTemplates.length
  const nacionales = []
  const regionales = []

  // 30 nacional senators: round-robin across parties from crawler (same names/colors as running parties)
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
