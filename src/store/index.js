import Vue from 'vue'
import Vuex from 'vuex'
import candidatos from './modules/candidatos'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    candidatos
  },
  strict: debug
})