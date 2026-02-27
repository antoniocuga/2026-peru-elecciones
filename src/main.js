import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerBootstrap } from './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

registerBootstrap(app)
app.use(pinia)
app.use(router)
app.mount('#app')
