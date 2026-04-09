<template>
  <template v-for="(c, i) in candidatos" :key="c.candidato_id">
    <div class="col-12 col-md-4 p-1">
      
        <div
          class="card card-candidate border-1"
          :class="[
            i === 0 ? 'custom-rounded-left  border-right' : i === 2 ? 'custom-rounded-right  border-left' : '',
            { 'home-widget__card--waiting': isPresidentialPlaceholder(c) },
          ]"
        >
          <div class="card-body d-flex align-items-center justify-content-between p-2">
            <div
              v-if="isPresidentialPlaceholder(c)"
              class="home-widget__avatar-placeholder rounded-circle border border-2 flex-shrink-0"
              role="img"
              aria-hidden="true"
            />
            <img
              v-else
              :src="getImageCandidate(c.candidato_id)"
              class="rounded-circle border border-3 flex-shrink-0 img-candidato"
              :style="`border-color: ${c.color} !important;`"
              alt="Foto de candidato a la presidencia del Perú"
            />
            <div class="ml-2 text-dark text-left">
              <p class="p-0 candidato-nombre mb-1" :class="{ 'text-light': isPresidentialPlaceholder(c) }">{{ c.candidato }}</p>
              <p class="p-0 partido-nombre mb-0" :class="{ 'text-light': isPresidentialPlaceholder(c) }">
                <img
                  v-if="!isPresidentialPlaceholder(c)"
                  width="20"
                  height="20"
                  class="partido-icon"
                  :src="getImagePartido(c.partido_id)"
                  alt=""
                />
                {{ isPresidentialPlaceholder(c) ? c.partido : capitalizeWords(c.partido) }}
              </p>
            </div>
            <div style="min-width: 65px; line-height: 0.5em" class="ml-2 text-light overflow-hidden justify-content-end mr-3">
              <div class="d-block text-right align-items-baseline flex-wrap">
                <span class="porcentaje-top d-block" :style="`font-size: 1.1rem; color: ${isPresidentialPlaceholder(c) ? WIDGET_PLACEHOLDER_COLOR : c.color}`">
                  {{ c.validos.toFixed(1) }}%
                </span>
                <span style="font-size: 0.7rem;" class="votos-top m-1 p-0 d-block">
                  {{ numeral(c.votos).format('0,0') }}
                </span>
                <span style="font-size: 10px;" class="m-0 votos-top d-block">
                  Votos válidos
                </span>
              </div>
            </div>
          </div>
        </div>
      
    </div>
  </template>
</template>

<script>
import numeral from 'numeral'
import { getPartidoImage, getCandidatoImage } from '../../utils/assets'
import { capitalizeWords } from '../../utils/formatText'
import {
  WIDGET_PLACEHOLDER_COLOR,
  isPresidentialPlaceholder as isPresPlaceholder,
} from '../../utils/presidencialWidget'

export default {
  name: 'PresidencialTopThreeCards',
  props: {
    candidatos: { type: Array, required: true },
    /** `home`: placeholders + embed styling; `new`: compact embed without placeholders */
    variant: {
      type: String,
      default: 'home',
      validator: (v) => v === 'home' || v === 'new',
    },
  },
  data() {
    return {
      WIDGET_PLACEHOLDER_COLOR,
    }
  },
  methods: {
    numeral,
    capitalizeWords,
    getImageCandidate(id) {
      return getCandidatoImage(id)
    },
    getImagePartido(id) {
      return getPartidoImage(id)
    },
    isPresidentialPlaceholder(c) {
      return isPresPlaceholder(c)
    },
  },
}
</script>

<style scoped>
.home-widget__card--waiting {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15) !important;
}

.home-widget__avatar-placeholder {
  width: 56px;
  height: 56px;
  min-width: 56px;
  background-color: #ADB5BD;
  border-color: rgba(255, 255, 255, 0.35) !important;
}
</style>
