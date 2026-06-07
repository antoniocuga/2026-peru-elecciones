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

export function computeBlancoNuloSegunda(candidatos) {
  const rows = nacionalTotalRows(candidatos)
  const blanco = mapEspecial(findRow(rows, ['blanco']))
  const nulo = mapEspecial(findRow(rows, ['nulo', 'nulos']))

  let emitidosVotos = 0
  let validosVotos = 0
  for (const row of rows) {
    const v = Number(row.total) || 0
    emitidosVotos += v
    if (!isEspecialRow(row)) {
      validosVotos += v
    }
  }

  let validosPct = null
  if (blanco?.pct != null && nulo?.pct != null) {
    validosPct = Math.max(0, 100 - blanco.pct - nulo.pct)
  } else if (emitidosVotos > 0) {
    validosPct = (validosVotos / emitidosVotos) * 100
  }

  const blancoNulo =
    blanco?.pct != null && nulo?.pct != null ? blanco.pct + nulo.pct : null
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
