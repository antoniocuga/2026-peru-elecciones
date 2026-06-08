const ESPECIAL_IDS = new Set(['blanco', 'nulo', 'nulos'])

function nacionalTotalRows(candidatos) {
  return (Array.isArray(candidatos) ? candidatos : []).filter(
    (r) => String(r.region).toLowerCase() === 'total',
  )
}

function findRow(rows, ids) {
  const want = ids.map((id) => id.toLowerCase())
  return rows.find((r) => want.includes(String(r.candidato_id || '').toLowerCase()))
}

function isEspecialRow(row) {
  return ESPECIAL_IDS.has(String(row?.candidato_id || '').toLowerCase())
}

function mapEspecial(row) {
  if (!row) return null
  return {
    label: row.candidato || '',
    votos: Number(row.total) || 0,
    pct: row.validos != null ? Number(row.validos) : null,
  }
}

function roundPct3(n) {
  return Math.round(Number(n) * 1000) / 1000
}

/**
 * Suma emitidos / válidos desde filas de una región (no requiere ``region: total``).
 */
export function computeEmitidosValidosFromRows(rows) {
  const list = Array.isArray(rows) ? rows : []
  let emitidos = 0
  let validos = 0
  for (const row of list) {
    const v = Number(row.total) || 0
    emitidos += v
    if (!isEspecialRow(row)) {
      validos += v
    }
  }
  let validosPct = null
  if (emitidos > 0) {
    validosPct = roundPct3((validos / emitidos) * 100)
  }
  return {
    emitidos: emitidos > 0 ? emitidos : null,
    validosVotos: validos > 0 ? validos : null,
    validosPct,
  }
}

/**
 * @param {Array} candidatos - filas ``resultados_total`` (incl. ``region: total``)
 * @param {object|null} [onpeParticipacion] - parseParticipacionCiudadanaTotales
 */
export function computeBlancoNuloSegunda(candidatos, onpeParticipacion = null) {
  const rows = nacionalTotalRows(candidatos)
  const blanco = mapEspecial(findRow(rows, ['blanco']))
  const nulo = mapEspecial(findRow(rows, ['nulo', 'nulos']))

  let emitidosFromRows = 0
  let validosFromRows = 0
  for (const row of rows) {
    const v = Number(row.total) || 0
    emitidosFromRows += v
    if (!isEspecialRow(row)) {
      validosFromRows += v
    }
  }

  const emitidosVotos =
    onpeParticipacion?.emitidos != null && onpeParticipacion.emitidos > 0
      ? onpeParticipacion.emitidos
      : emitidosFromRows

  const validosVotos =
    onpeParticipacion?.totalVotosValidos != null && onpeParticipacion.totalVotosValidos >= 0
      ? onpeParticipacion.totalVotosValidos
      : validosFromRows

  let validosPct = null
  if (onpeParticipacion?.validos != null) {
    validosPct = onpeParticipacion.validos
  } else if (blanco?.pct != null && nulo?.pct != null) {
    validosPct = roundPct3(Math.max(0, 100 - blanco.pct - nulo.pct))
  } else if (emitidosVotos > 0 && validosVotos >= 0) {
    validosPct = roundPct3((validosVotos / emitidosVotos) * 100)
  }

  const blancoNulo =
    blanco?.pct != null && nulo?.pct != null ? roundPct3(blanco.pct + nulo.pct) : null
  const conteo = rows.reduce((m, r) => Math.max(m, Number(r.conteo) || 0), 0)
  const hora = rows.find((r) => r.hora)?.hora || ''

  return {
    emitidos: emitidosVotos > 0 ? { votos: emitidosVotos, pct: null } : null,
    validos:
      validosVotos > 0 || validosPct != null
        ? { votos: validosVotos, pct: validosPct }
        : null,
    blanco,
    nulo,
    blancoNulo,
    conteo,
    hora,
  }
}
