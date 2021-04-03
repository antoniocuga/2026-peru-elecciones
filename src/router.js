import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home.vue'
import Widget from './pages/Widget.vue'

Vue.use(Router)
const routes = [
  { path: '/', name: 'Home', component: Home, props: true },
  { path: '/resultados/embed', name: 'Widget', component: Widget, props: true }
]

export default new Router({
  routes
});