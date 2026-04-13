import { filter, map, orderBy, groupBy, uniq } from 'lodash'
import { PARLIAMENT_PLACEHOLDER_PARTIDO_ID } from './congresoTooltip'

export const WIDGET_PLACEHOLDER_COLOR = '#ADB5BD'
export const WIDGET_PRES_PLACEHOLDER_PREFIX = 'widget-pres-placeholder-'
export const WIDGET_SENADO_TOTAL = 60
export const WIDGET_CONGRESO_TOTAL = 130

export function computeTopCandidatos(candidatos) {
  const filtered = filter(candidatos, (d) =>
    d.region === 'total' &&
    d.candidato_id !== 'blanco' &&
    d.candidato_id !== 'nulos'
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
  ).slice(0, 3)
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
  if (topCandidatos.length) return topCandidatos
  return [0, 1, 2].map((i) => ({
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
