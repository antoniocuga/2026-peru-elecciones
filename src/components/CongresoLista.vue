<template>
  <div class="list-resultados-partidos congreso-lista">
    <div class="row item-partido pb-2 pt-2" :key="candidato.candidato_id" v-for="candidato in candidatos_congreso_real">
      <div class="col-auto pr-1 img-candidato">
        <img width="65px" :src="getImagePartido(candidato.partido_id)" />
      </div>
      <div class="col-7 pl-0 pr-md-0 align-self-center">
        <div class="candidato-mapa m-md-0"><b>{{ candidato.nombre }}</b></div>
        <div class="total-votos">Región: {{ candidato.region }}</div>
      </div>
      <div class="col-auto align-self-center text-center pr-0">
        <div class="text-success d-flex align-self-center">{{ numeral(candidato.voto_preferencial).format('0,0') }}</div>
      </div>
    </div>

    <BCollapse v-model="open" id="collapse-congreso-lista" class="col-12">
      <div class="row item-partido pb-2 pt-2" :key="candidato.candidato_id" v-for="candidato in candidatos_congreso_real_all">
        <div class="col-auto pr-1 img-candidato">
          <img width="65px" :src="getImagePartido(candidato.partido_id)" />
        </div>
        <div class="col-7 pl-0 pr-md-0 align-self-center">
          <div class="candidato-mapa m-md-0"><b>{{ candidato.nombre }}</b></div>
          <div class="total-votos">Región: {{ candidato.region }}</div>
        </div>
        <div class="col-auto align-self-center text-center pr-0">
          <div class="text-success d-flex align-self-center">{{ numeral(candidato.voto_preferencial).format('0,0') }}</div>
        </div>
      </div>
    </BCollapse>

    <div class="col-12 mt-3 button-more pl-0 pr-0" v-if="depObject.region === 'NACIONAL'">
      <a v-if="!open" @click="open = true" class="d-block btn-light text-center" href="javascript:void(0)">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-down" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
        </svg>
      </a>
      <a v-if="open" @click="open = false" class="d-block btn-light text-center" href="javascript:void(0)">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-up" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"/>
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import { storeToRefs } from 'pinia'
import { useCandidatosStore } from '../stores/candidatos'
import { getPartidoImage } from '../utils/assets'
import { filter, orderBy } from 'lodash'

export default {
  name: 'CongresoLista',
  props: {
    depObject: {
      type: Object,
      default: () => ({ region: 'NACIONAL', seats: 130 }),
    },
  },
  setup() {
    const store = useCandidatosStore()
    return { ...storeToRefs(store) }
  },
  data() {
    return {
      open: false,
    }
  },
  computed: {
    congresistas_parse() {
      return orderBy(this.congresistas, ['partido_id'], ['desc'])
    },
    candidatos_congreso_real() {
      if (this.depObject.region !== 'NACIONAL') {
        const filtered = filter(this.congresistas_parse, ['region', this.depObject.region])
        return orderBy(filtered, ['voto_preferencial'], ['desc'])
      }
      return orderBy(this.congresistas_parse, ['voto_preferencial'], ['desc']).slice(0, 10)
    },
    candidatos_congreso_real_all() {
      if (this.depObject.region !== 'NACIONAL') {
        const filtered = filter(this.congresistas_parse, ['region', this.depObject.region])
        return orderBy(filtered, ['voto_preferencial'], ['desc'])
      }
      return orderBy(this.congresistas_parse, ['voto_preferencial'], ['desc']).slice(10, this.congresistas_parse.length)
    },
  },
  methods: {
    numeral,
    getImagePartido(id) {
      return getPartidoImage(id)
    },
  },
}
</script>
