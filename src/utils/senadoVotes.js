import { map, sum, uniq } from 'lodash'

/**
 * Senado: cada escaño repite los votos de lista de su circunscripción.
 * Nacional y regional son cómputos distintos — no deben sumarse en un solo “total”.
 */
export function senadoListaTotalsByTipo(items) {
  const nac = items.filter((i) => i.senado_tipo === 'nacional')
  const reg = items.filter((i) => i.senado_tipo === 'regional')
  const onePool = (rows) => {
    if (!rows.length) return 0
    const vals = uniq(map(rows, (i) => Number(i.total_votos_partido) || 0)).filter((n) => n > 0)
    if (!vals.length) return 0
    if (vals.length === 1) return vals[0]
    return Math.max(...vals)
  }
  const vn = onePool(nac)
  const vr = onePool(reg)
  const fantasma = sum(uniq(map(items, (i) => Number(i.voto_fantasma) || 0)))
  return { vn, vr, fantasma }
}
