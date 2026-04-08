<template>
  <div class="container py-3 pb-0" style="background-color:#506573;">
    <div class="container" v-if="topCandidatos.length">

      <div class="row">
        <div class="col-12">
          <div class="pb-1">
            <p class="small text-light mb-0 text-center" style="font-size:0.75rem; opacity:0.8;">
              Última actualización: {{ fechaHora }} 
            </p>
          </div>
        </div>
        <div class="col-12 col-md-4 p-1" v-for="(c, i) in topCandidatos" :key="c.candidato_id">
          <div class="card card-candidate border-1"
               :class="i === 0 ? 'custom-rounded-left  border-right' : i === 2 ? 'custom-rounded-right  border-left' : ''"
               >
            <div class="card-body d-flex align-items-center justify-content-between p-2">
              <img :src="getImageCandidate(c.candidato_id)"
                   class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                   :style="`background-color: ${c.color} !important;`"
                   width="60" height="60" alt="" />
              <div class="ml-2 text-dark text-left overflow-hidden">
                <p class="p-0 candidato-nombre mb-0">{{ c.candidato }}</p>
                <p class="p-0 partido-nombre mb-0">
                  <img width="20" height="20" class="partido-icon" :src="getImagePartido(c.partido_id)" alt="" />
                  {{ c.partido }}
                </p>
              </div>
              <div style="min-width: 70px;" class="ml-2 text-dark overflow-hidden justify-content-end mr-3">
                <div class="d-block text-right align-items-baseline flex-wrap">
                  <span class="porcentaje-top d-block" :style="`color: ${c.color}`">
                    {{ c.validos.toFixed(1) }}%
                  </span>
                  <span style="font-size: 0.8rem;" class="votos-top ml-1 d-block">
                    {{ numeral(c.votos).format('0,0') }} 
                  </span>
                  <span style="font-size: 0.6rem;" class="votos-top ml-1 d-block text-small small">
                    votos válidos
                  </span>
                </div>
              </div>
            </div>
          </div>
         
        </div>
        <div class="col-12">
          <div class="text-right text-white mt-2 small text-light">Fuente:ONPE</div>
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
  name: 'NewWidget',
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
