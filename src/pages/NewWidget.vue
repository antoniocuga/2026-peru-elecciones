<template>
  <div class="container py-4" style="background-color:#dce8ec;">
    <div class="container" v-if="topCandidatos.length">

     <div class="mb-2">
        <p class="small text-dark mb-0 text-center" style="font-size:0.75rem; opacity:0.8;">
          Última actualización: {{ fechaHora }} · Datos ONPE, actualizados cada 20 minutos.
        </p>
      </div>

      <div class="row">
        <div class="col-12 col-md-4" v-for="(c, i) in topCandidatos" :key="c.candidato_id">
          <div class="card card-candidate border-1"
               :class="i === 0 ? 'custom-rounded-left' : i === 2 ? 'custom-rounded-right' : ''"
               >
            <div class="card-body d-flex align-items-center p-2">
              <img :src="getImageCandidate(c.candidato_id)"
                   class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                   :style="`background-color: ${c.color} !important;`"
                   width="60" height="60" alt="" />
              <div class="ml-2 text-dark overflow-hidden">
                <div class="d-flex align-items-baseline flex-wrap">
                  <span class="porcentaje-top" :style="`color: ${c.color}`">
                    {{ c.validos.toFixed(1) }}%
                  </span>
                  <small class="votos-top ml-1">
                    {{ numeral(c.votos).format('0,0') }} votos
                  </small>
                </div>
                <p class="candidato-nombre mb-0">{{ c.candidato }}</p>
                <p class="partido-nombre mb-0">
                  <img width="20" height="20" class="partido-icon mr-1" :src="getImagePartido(c.partido_id)" alt="" />
                  {{ c.partido }}
                </p>
              </div>
            </div>
          </div>
          <div class="segunda-vuelta-badge" v-if="i === 0 || i === 1">
            ✓ En segunda vuelta
          </div>
        </div>
      </div>

     

    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import { storeToRefs } from 'pinia'
import { useCandidatosStore } from '../stores/candidatos'
import { getPartidoImage, getCandidatoImage } from '../utils/assets'
import { filter, map, orderBy, groupBy, uniq } from 'lodash'

export default {
  name: 'TopResultados',
  setup() {
    const store = useCandidatosStore()
    const refs = storeToRefs(store)
    return { ...refs, store, candidatos: refs.todos }
  },
  mounted() {
    this.store.getAllCandidatos()
  },
  methods: {
    numeral,
    getImageCandidate(id) {
      return getCandidatoImage(id)
    },
    getImagePartido(id) {
      return getPartidoImage(id)
    },
  },
  computed: {
    conteo() {
      return parseFloat(uniq(map(this.topCandidatos, 'conteo')).join('')) || 0
    },
    fechaHora() {
      return uniq(map(this.topCandidatos, 'hora')).join('')
    },
    topCandidatos() {
      const filtered = filter(this.candidatos, d =>
        d.region === 'total' &&
        d.candidato_id !== 'blanco' &&
        d.candidato_id !== 'nulos'
      )
      return orderBy(
        map(groupBy(filtered, 'candidato_id'), (d, id) => ({
          candidato_id: id,
          candidato:  uniq(map(d, 'candidato')).join(''),
          partido_id: uniq(map(d, 'partido_id')).join(''),
          partido:    uniq(map(d, 'partido')).join(''),
          color:      uniq(map(d, 'color')).join(''),
          votos:      parseFloat(uniq(map(d, 'total')).join('')) || 0,
          validos:    parseFloat(uniq(map(d, 'validos')).join('')) || 0,
          conteo:     parseFloat(uniq(map(d, 'conteo')).join('')) || 0,
          hora:       uniq(map(d, 'hora')).join(''),
        })),
        ['validos'], ['desc']
      ).slice(0, 3)
    },
  },
}
</script>
