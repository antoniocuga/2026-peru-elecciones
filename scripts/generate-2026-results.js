/**
 * Generates resultados_total_2026.json from elecciones2026/crawller/resultados.json
 * (nacional rows only: candidato, partido, color). Colors are taken only from that file.
 * Run: npm run generate:2026
 * Output: public/data-primera-vuelta/resultados_total_2026.json
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadNationalCandidatesFromCrawler } from './lib/crawler-national.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CRAWLLER_RESULTS_PATH = path.join(ROOT, 'crawller/resultados.json')
const OUTPUT_PATH = path.join(ROOT, 'public/data-primera-vuelta/resultados_total_2026.json')

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

function main () {
  const normalized = loadNationalCandidatesFromCrawler(CRAWLLER_RESULTS_PATH)
  if (normalized.length === 0) {
    console.error('No nacional candidates in crawler; aborting.')
    process.exit(1)
  }

  const hora = '12:00 h - 26/02/2026'
  const conteo = 100

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
  console.log('Wrote', OUTPUT_PATH, '-', out.length, 'rows (', normalized.length, 'candidates from crawler )')
}

main()
