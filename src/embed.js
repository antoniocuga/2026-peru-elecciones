import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerBootstrap } from './plugins/bootstrap-vue'

import Widget from './pages/Widget.vue'
import NewWidget from './pages/NewWidget.vue'
import CongresoWidget from './pages/CongresoWidget.vue'
import SenadoWidget from './pages/SenadoWidget.vue'
import ConteoWidget from './pages/ConteoWidget.vue'
import HistoricoWidget from './pages/HistoricoWidget.vue'
import MapaWidget from './pages/MapaWidget.vue'

import './assets/styles.scss'

/**
 * Single shared Pinia instance — store data is fetched once and shared
 * across all widgets mounted on the same page.
 */
const pinia = createPinia()

/**
 * Map of div#id → component.
 * Editors place <div id="widget-xxx"></div> anywhere in the article
 * and the matching component mounts to it automatically.
 *
 * Available widget IDs:
 *   widget-resultados   → full results embed (Widget.vue)
 *   widget-new          → new results layout (NewWidget.vue)
 *   widget-congreso     → congress results (CongresoWidget.vue)
 *   widget-senado       → senate results (SenadoWidget.vue)
 *   widget-conteo       → vote count (ConteoWidget.vue)
 *   widget-historico    → historical results (HistoricoWidget.vue)
 *   widget-mapa         → interactive map (MapaWidget.vue)
 */
const widgets = {
  'widget-resultados': Widget,
  'widget-new':        NewWidget,
  'widget-congreso':   CongresoWidget,
  'widget-senado':     SenadoWidget,
  'widget-conteo':     ConteoWidget,
  'widget-historico':  HistoricoWidget,
  'widget-mapa':       MapaWidget,
}

Object.entries(widgets).forEach(([id, Component]) => {
  const el = document.getElementById(id)
  if (!el) return

  const app = createApp(Component)
  registerBootstrap(app)
  app.use(pinia)
  app.mount(el)
})
