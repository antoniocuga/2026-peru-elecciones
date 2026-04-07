/**
 * Shared: presidential / nacional rows from crawller/resultados.json
 */
import fs from 'fs'

const NEUTRAL = '#9CA3AF'

export function isNacionalRow (row) {
  return String(row?.departamento ?? '').trim().toLowerCase() === 'nacional'
}

/** First-seen order, unique by candidato_id */
export function loadNationalCandidatesFromCrawler (filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn('Crawler file missing:', filePath)
    return []
  }
  const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const seen = new Set()
  const out = []
  for (const r of rows) {
    if (!isNacionalRow(r)) continue
    const cid = String(r.candidato_id ?? '').trim()
    if (!cid) continue
    if (seen.has(cid)) continue
    seen.add(cid)
    const colorRaw = r.color
    const color =
      typeof colorRaw === 'string' && colorRaw.trim() ? colorRaw.trim() : NEUTRAL
    if (color === NEUTRAL) {
      console.warn('Crawler row missing color; using neutral:', cid)
    }
    const partidoId = String(r.partido_id ?? '').trim()
    out.push({
      candidato: r.candidato,
      candidato_id: cid,
      partido: r.partido,
      partido_id: partidoId || slugPartido(r.partido),
      color,
    })
  }
  return out
}

/** Unique partido_id in first-seen order (for senado party cap). */
export function loadPartyTemplatesFromCrawler (filePath, startNro = 1) {
  const candidates = loadNationalCandidatesFromCrawler(filePath)
  const seen = new Set()
  const list = []
  let nro = startNro
  for (const c of candidates) {
    if (!c.partido_id || seen.has(c.partido_id)) continue
    seen.add(c.partido_id)
    list.push({
      partido_id: c.partido_id,
      partido: c.partido,
      color: c.color,
      nro,
      total_votos_partido: 200000 - (nro - startNro) * 5000,
      voto_preferencial: 100000,
      voto_fantasma: 80000,
    })
    nro += 1
  }
  return list
}

function slugPartido (str) {
  const ACCENTS = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n', Á: 'a', É: 'e', Í: 'i', Ó: 'o', Ú: 'u', Ñ: 'n' }
  let s = String(str ?? '')
  Object.keys(ACCENTS).forEach((k) => {
    s = s.replace(new RegExp(k, 'g'), ACCENTS[k])
  })
  return s.replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase()
}
