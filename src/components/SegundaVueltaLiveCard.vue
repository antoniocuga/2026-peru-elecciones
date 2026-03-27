<template>
  <div class="col-12 col-md-6 mb-3">
    <BTabs>
      <BTab :title="title">
        <div class="card p-3 card-candidate border-top-0">
          <div
            v-for="(candidato, ix) in candidates.slice(0, 2)"
            :key="candidato.candidato_id"
            class="mt-2 pb-2 col-12 col-md-12"
            :class="{ 'border-bottom': ix === 0 }"
          >
            <div class="row">
              <div class="col-12 col-md-12">
                <div class="row justify-content-center">
                  <div class="col-3 col-md-3 col-lg-3 text-center">
                    <img
                      class="rounded-circle border border-3 flex-shrink-0 img-candidato"
                      :style="`border-color: ${candidato.color} !important`"
                      :src="getImageCandidate(candidato.candidato_id)"
                    />
                  </div>
                  <div class="col-5 col-md-5 col-lg-5 p-0 align-self-center">
                    <h4 class="candidato-mapa m-0">{{ candidato.candidato }}</h4>
                    <h4 class="partido-mapa p-0">
                      <img width="25px" :src="getImagePartido(candidato.partido_id)" />
                      {{ candidato.partido }}
                    </h4>
                    <div>
                      <span class="badge text-success m-0 p-0" v-if="ix === 0">
                        Ganando por +{{ numeral(leadVotes).format('0,0') }} votos
                      </span>
                    </div>
                  </div>
                  <div class="col-4 col-md-3 col-lg-4 align-sef-center text-right">
                    <div class="tooltip-c" style="font-size: 1rem; font-weight: 600;">
                      <span class="d-block badge font-weight-light small text-right text-secondary">
                        Validos
                      </span>
                      <span :style="`font-size:1rem; font-weight: 600;`">
                        {{ candidato.validos.toFixed(3) + "%" }}
                      </span>
                      <span :style="`font-weight: 600;`" class="d-block badge text-secondary small text-right d-block">
                        {{ numeral(candidato.votos).format('0,0') }}
                      </span>
                      <span class="d-block badge font-weight-light small text-right text-secondary">
                        Votos estimados
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BTab>
      <BTab disabled :title="`Conteo al ${conteo}%`"></BTab>
    </BTabs>
  </div>
</template>

<script>
import numeral from 'numeral'
import { getPartidoImage, getCandidatoImage } from '../utils/assets'

export default {
  name: 'SegundaVueltaLiveCard',
  props: {
    candidates: {
      type: Array,
      default: () => [],
    },
    conteo: {
      type: [Number, String],
      default: 0,
    },
    title: {
      type: String,
      default: 'Elecciones 2026 - resultados en vivo',
    },
  },
  computed: {
    leadVotes() {
      if (!this.candidates || this.candidates.length < 2) return 0
      return (this.candidates[0].votos || 0) - (this.candidates[1].votos || 0)
    },
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
}
</script>
