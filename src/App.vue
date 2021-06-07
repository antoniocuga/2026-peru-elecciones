<template>
  <div class="wrapper">
    <router-view></router-view>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import router from './router'
import store from './store'

export default {
  name: 'App',
  router,
  store,
  computed: {
    ...mapState({
      candidatos: state => state.candidatos.todos
    })
  },
  created () {
    this.$store.dispatch('candidatos/getAllCandidatos')
    this.$store.dispatch('candidatos/getAllCandidatosSegunda')
  },
}
</script>

<style lang="scss">
  @import "assets/styles.scss";
</style>
