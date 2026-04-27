import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerBootstrap } from './plugins/bootstrap-vue'

import Widget from './pages/Widget.vue'
import HomeWidget from './pages/HomeWidget.vue'
import NewWidget from './pages/NewWidget.vue'
import CongresoWidget from './pages/CongresoWidget.vue'
import CongresoListaWidget from './pages/CongresoListaWidget.vue'
import SenadoWidget from './pages/SenadoWidget.vue'
import ConteoWidget from './pages/ConteoWidget.vue'
import HistoricoWidget from './pages/HistoricoWidget.vue'
import MapaWidget from './pages/MapaWidget.vue'
import MapaSegundaWidget from './pages/MapaSegundaWidget.vue'

import './assets/styles.scss'

const pinia = createPinia()

const widgets = {
  'widget-resultados': Widget,
  'widget-home': HomeWidget,
  'widget-new':        NewWidget,
  'widget-congreso':        CongresoWidget,
  'widget-congreso-lista':  CongresoListaWidget,
  'widget-senado':          SenadoWidget,
  'widget-conteo':     ConteoWidget,
  'widget-historico':  HistoricoWidget,
  'widget-mapa':       MapaWidget,
  'widget-mapa-segunda': MapaSegundaWidget,
}

Object.entries(widgets).forEach(([id, Component]) => {
  const el = document.getElementById(id)
  if (!el) return

  const app = createApp(Component)
  registerBootstrap(app)
  app.use(pinia)
  app.mount(el)
})
