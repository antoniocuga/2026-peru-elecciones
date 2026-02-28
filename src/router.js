import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Widget from './pages/Widget.vue'
import NewWidget from './pages/NewWidget.vue'
import CongresoWidget from './pages/CongresoWidget.vue'
import ConteoWidget from './pages/ConteoWidget.vue'
import HistoricoWidget from './pages/HistoricoWidget.vue'
import MapaWidget from './pages/MapaWidget.vue'


const routes = [
  { path: '/', name: 'Home', component: Home, props: true },
  { path: '/resultados/embed', name: 'Widget', component: Widget, props: true },
  { path: '/resultados/newembed', name: 'NewWidget', component: NewWidget, props: true },
  { path: '/resultados/congreso', name: 'CongresoWidget', component: CongresoWidget, props: true },
  { path: '/resultados/conteo', name: 'ConteoWidget', component: ConteoWidget, props: true },
  { path: '/resultados/historico', name: 'HistoricoWidget', component: HistoricoWidget, props: true },
  { path: '/resultados/mapa', name: 'MapaWidget', component: MapaWidget, props: true }

]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
