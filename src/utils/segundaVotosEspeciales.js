function nacionalTotalRows(candidatos) {
  return (Array.isArray(candidatos) ? candidatos : []).filter(
    (r) => String(r.region).toLowerCase() === 'total',
  )
}

function findRow(rows, ids) {
  const want = ids.map((id) => id.toLowerCase())
  return rows.find((r) => want.includes(String(r.candidato_id || '').toLowerCase()))
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
  const blancoNulo =
    blanco?.pct != null && nulo?.pct != null ? blanco.pct + nulo.pct : null
  const conteo = rows.reduce((m, r) => Math.max(m, Number(r.conteo) || 0), 0)
  const hora = rows.find((r) => r.hora)?.hora || ''
  return { blanco, nulo, blancoNulo, conteo, hora }
}
