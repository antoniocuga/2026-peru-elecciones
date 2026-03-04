/**
 * Generates resultados_total_2026.json from public/2026-lista/candidatos.json
 * Run: node scripts/generate-2026-results.js
 * Output: public/data-primera-vuelta/resultados_total_2026.json
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CANDIDATOS_PATH = path.join(ROOT, 'public/2026-lista/candidatos.json')
const OUTPUT_PATH = path.join(ROOT, 'public/data-primera-vuelta/resultados_total_2026.json')

const ACCENTS = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n', Á: 'a', É: 'e', Í: 'i', Ó: 'o', Ú: 'u', Ñ: 'n' }
function slug (str) {
  let s = String(str)
  Object.keys(ACCENTS).forEach(k => { s = s.replace(new RegExp(k, 'g'), ACCENTS[k]) })
  return s.replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase()
}

const REGIONS = [
  { region: 'amazonas', departamento: 'AMAZONAS' },
  { region: 'ancash', departamento: 'ANCASH' },
  { region: 'apurimac', departamento: 'APURIMAC' },
  { region: 'arequipa', departamento: 'AREQUIPA' },
  { region: 'ayacucho', departamento: 'AYACUCHO' },
  { region: 'cajamarca', departamento: 'CAJAMARCA' },
  { region: 'callao', departamento: 'CALLAO' },
  { region: 'cusco', departamento: 'CUSCO' },
  { region: 'extranjero', departamento: 'EXTRANJERO' },
  { region: 'huancavelica', departamento: 'HUANCAVELICA' },
  { region: 'huanuco', departamento: 'HUANUCO' },
  { region: 'ica', departamento: 'ICA' },
  { region: 'junin', departamento: 'JUNIN' },
  { region: 'la-libertad', departamento: 'LA LIBERTAD' },
  { region: 'lambayeque', departamento: 'LAMBAYEQUE' },
  { region: 'lima', departamento: 'LIMA' },
  { region: 'lima-provincias', departamento: 'LIMA-PROVINCIAS' },
  { region: 'loreto', departamento: 'LORETO' },
  { region: 'madre-de-dios', departamento: 'MADRE DE DIOS' },
  { region: 'moquegua', departamento: 'MOQUEGUA' },
  { region: 'pasco', departamento: 'PASCO' },
  { region: 'piura', departamento: 'PIURA' },
  { region: 'puno', departamento: 'PUNO' },
  { region: 'san-martin', departamento: 'SAN MARTIN' },
  { region: 'tacna', departamento: 'TACNA' },
  { region: 'tumbes', departamento: 'TUMBES' },
  { region: 'ucayali', departamento: 'UCAYALI' },
  { region: 'total', departamento: 'TOTAL' },
]

const COLOR_PALETTE = [
  '#00aede', '#fd6600', '#2fc100', '#f40201', '#0050a0', '#4f1b7f', '#1022b9',
  '#ff2600', '#009a21', '#4e5405', '#ff2c79', '#004da3', '#0055a2', '#ff2607',
  '#000000', '#fff000', '#f52300', '#436b1c', '#8b4513', '#2e5090', '#a0522d',
  '#556b2f', '#6a0dad', '#b22222', '#006400', '#4b0082', '#808000', '#ff6347',
  '#20b2aa', '#9370db', '#dda0dd', '#f0e68c', '#e6e6fa',
]

function main () {
  const raw = fs.readFileSync(CANDIDATOS_PATH, 'utf8')
  const candidatos = JSON.parse(raw)
  const hora = '12:00 h - 26/02/2026'
  const conteo = 100

  const normalized = candidatos.map((c, i) => ({
    candidato: c.candidato,
    candidato_id: slug(c.candidato),
    partido: c.partido_politico,
    partido_id: slug(c.partido_politico),
    color: COLOR_PALETTE[i % COLOR_PALETTE.length],
  }))

  const totalVotos = 14_000_000
  const totalValidosPct = normalized.map((_, i) => Math.max(0.5, 18 - i * 0.6))
  const sumPct = totalValidosPct.reduce((a, b) => a + b, 0)
  const validosPct = totalValidosPct.map(p => Math.round((p / sumPct) * 10000) / 100)

  const out = []
  for (const { region, departamento } of REGIONS) {
    for (let i = 0; i < normalized.length; i++) {
      const c = normalized[i]
      let total, validos
      if (region === 'total') {
        total = Math.round((validosPct[i] / 100) * totalVotos)
        validos = validosPct[i]
      } else {
        const regionShare = 0.02 + Math.random() * 0.04
        total = Math.round(totalVotos * regionShare * (0.3 + Math.random() * 0.7) / normalized.length)
        validos = Math.round((validosPct[i] + (Math.random() * 4 - 2)) * 100) / 100
        validos = Math.max(0.1, Math.min(30, validos))
      }
      out.push({
        departamento,
        total,
        validos,
        hora,
        candidato_id: c.candidato_id,
        candidato: c.candidato,
        color: c.color,
        partido: c.partido,
        partido_id: c.partido_id,
        region,
        conteo: region === 'extranjero' ? undefined : conteo,
      })
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2), 'utf8')
  console.log('Wrote', OUTPUT_PATH, '-', out.length, 'rows')
}

main()
