import { filter, map, orderBy, groupBy, uniq } from 'lodash'
import { PARLIAMENT_PLACEHOLDER_PARTIDO_ID } from './congresoTooltip'

export const WIDGET_PLACEHOLDER_COLOR = '#ADB5BD'
export const WIDGET_PRES_PLACEHOLDER_PREFIX = 'widget-pres-placeholder-'
export const WIDGET_PRES_TOP_COUNT = 2
export const WIDGET_SENADO_TOTAL = 60
export const WIDGET_CONGRESO_TOTAL = 130

export function computeTopCandidatos(candidatos) {
  const filtered = filter(candidatos, (d) =>
    d.region === 'total' &&
    d.candidato_id !== 'blanco' &&
    d.candidato_id !== 'nulos' &&
    d.candidato_id !== 'nulo'
  )
  return orderBy(
    map(groupBy(filtered, 'candidato_id'), (d, id) => ({
      candidato_id: id,
      candidato: uniq(map(d, 'candidato')).join(''),
      partido_id: uniq(map(d, 'partido_id')).join(''),
      partido: uniq(map(d, 'partido')).join(''),
      color: uniq(map(d, 'color')).join(''),
      votos: parseFloat(uniq(map(d, 'total')).join('')) || 0,
      validos: parseFloat(uniq(map(d, 'validos')).join('')) || 0,
      conteo: parseFloat(uniq(map(d, 'conteo')).join('')) || 0,
      hora: uniq(map(d, 'hora')).join(''),
    })),
    ['validos'],
    ['desc']
  ).slice(0, WIDGET_PRES_TOP_COUNT)
}

function presVotosFromRow(row) {
  if (!row) return 0
  return Number(row.total ?? row.total_votos ?? row.votos ?? 0) || 0
}

function presVotosForCandidate(candidatos, region, candidatoId) {
  const list = Array.isArray(candidatos) ? candidatos : []
  const row = list.find(
    (d) => String(d.region || '').toLowerCase() === region && String(d.candidato_id || '') === String(candidatoId || ''),
  )
  return presVotosFromRow(row)
}

/** Prioriza ``extranjero.json`` sobre filas ``region: extranjero`` en ``resultados_total``. */
export function mergeExtranjeroIntoCandidatos(candidatos, extranjeroRows) {
  const base = (Array.isArray(candidatos) ? candidatos : []).filter(
    (r) => String(r.region || '').toLowerCase() !== 'extranjero',
  )
  if (!Array.isArray(extranjeroRows) || !extranjeroRows.length) return base
  const normalized = extranjeroRows
    .filter((r) => r && r.candidato_id && !['blanco', 'nulo', 'nulos'].includes(String(r.candidato_id)))
    .map((row) => ({
      ...row,
      region: 'extranjero',
      total: presVotosFromRow(row),
    }))
  return [...base, ...normalized]
}

/**
 * Brecha de un candidato vs su rival en total, nacional (total−extranjero) y extranjero.
 */
export function computePresCandidateBreakdown(candidatos, candidatoId, opponentId) {
  if (!candidatoId || !opponentId) return null

  const scopePair = (votosC, votosO) => {
    const diff = votosC - votosO
    return {
      diff,
      votos: votosC,
      gap: Math.max(0, diff),
      winning: diff > 0,
      tied: diff === 0,
      losing: diff < 0,
    }
  }

  const totalC = presVotosForCandidate(candidatos, 'total', candidatoId)
  const totalO = presVotosForCandidate(candidatos, 'total', opponentId)
  const extC = presVotosForCandidate(candidatos, 'extranjero', candidatoId)
  const extO = presVotosForCandidate(candidatos, 'extranjero', opponentId)
  const nacC = Math.max(0, totalC - extC)
  const nacO = Math.max(0, totalO - extO)

  return {
    total: scopePair(totalC, totalO),
    nacional: scopePair(nacC, nacO),
    extranjero: scopePair(extC, extO),
  }
}

/**
 * Brecha del líder vs 2.º (vista global; preferir ``computePresCandidateBreakdown`` por tarjeta).
 */
export function computePresLeadBreakdown(candidatos, topCandidatos) {
  const top = (topCandidatos || []).slice(0, WIDGET_PRES_TOP_COUNT)
  if (top.length < 2) return null
  const [a, b] = top
  const idA = a.candidato_id
  const idB = b.candidato_id

  const scope = (votosA, votosB) => {
    const diff = votosA - votosB
    return {
      diff,
      gap: Math.max(0, diff),
      winning: diff >= 0,
      tied: diff === 0,
    }
  }

  const totalA = presVotosForCandidate(candidatos, 'total', idA)
  const totalB = presVotosForCandidate(candidatos, 'total', idB)
  const extA = presVotosForCandidate(candidatos, 'extranjero', idA)
  const extB = presVotosForCandidate(candidatos, 'extranjero', idB)
  const nacA = Math.max(0, totalA - extA)
  const nacB = Math.max(0, totalB - extB)

  return {
    total: scope(totalA, totalB),
    nacional: scope(nacA, nacB),
    extranjero: scope(extA, extB),
  }
}

export function computeConteoFromTop(topCandidatos) {
  return parseFloat(uniq(map(topCandidatos, 'conteo')).join('')) || 0
}

export function computeFechaHoraFromTop(topCandidatos) {
  const s = uniq(map(topCandidatos, 'hora'))
    .join('')
    .trim()
  if (s) return s
  try {
    return new Intl.DateTimeFormat('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date())
  } catch {
    return ''
  }
}

export function isPresidentialPlaceholder(c) {
  const id = c?.candidato_id
  return typeof id === 'string' && id.startsWith(WIDGET_PRES_PLACEHOLDER_PREFIX)
}

export function displayTopCandidatosWithPlaceholders(topCandidatos) {
  if (topCandidatos.length) return topCandidatos.slice(0, WIDGET_PRES_TOP_COUNT)
  return Array.from({ length: WIDGET_PRES_TOP_COUNT }, (_, i) => ({
    candidato_id: `${WIDGET_PRES_PLACEHOLDER_PREFIX}${i}`,
    candidato: '',
    partido_id: PARLIAMENT_PLACEHOLDER_PARTIDO_ID,
    partido: 'INFORMACIÓN NO DISPONIBLE',
    color: WIDGET_PLACEHOLDER_COLOR,
    votos: 0,
    validos: 0,
    conteo: 0,
    hora: '',
  }))
}

export function computeCongresoStackRows(congresistas) {
  if (!congresistas?.length) return []
  return orderBy(
    map(groupBy(congresistas, 'partido_id'), (items, p) => ({
      partido_id: p,
      partido: uniq(map(items, 'partido')).join(''),
      seats: items.length,
      color: uniq(map(items, 'color')).join('') || '#6c757d',
    })),
    ['seats'],
    ['desc']
  )
}

export function computeSenadoStackRows(senadores) {
  if (!senadores?.length) return []
  return orderBy(
    map(groupBy(senadores, 'partido_id'), (items, p) => ({
      partido_id: p,
      partido: uniq(map(items, 'partido')).join(''),
      seats: items.length,
      color: uniq(map(items, 'color')).join('') || '#6c757d',
    })),
    ['seats'],
    ['desc']
  )
}

export function displayCongresoStackRows(congresoStackRows) {
  if (congresoStackRows.length) return congresoStackRows
  return [
    {
      partido_id: PARLIAMENT_PLACEHOLDER_PARTIDO_ID,
      partido: '—',
      seats: WIDGET_CONGRESO_TOTAL,
      color: WIDGET_PLACEHOLDER_COLOR,
    },
  ]
}

export function displaySenadoStackRows(senadoStackRows) {
  if (senadoStackRows.length) return senadoStackRows
  return [
    {
      partido_id: PARLIAMENT_PLACEHOLDER_PARTIDO_ID,
      partido: '—',
      seats: WIDGET_SENADO_TOTAL,
      color: WIDGET_PLACEHOLDER_COLOR,
    },
  ]
}
