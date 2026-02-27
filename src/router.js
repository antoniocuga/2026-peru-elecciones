import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Widget from './pages/Widget.vue'

const routes = [
  { path: '/', name: 'Home', component: Home, props: true },
  { path: '/resultados/embed', name: 'Widget', component: Widget, props: true },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
