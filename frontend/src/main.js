import { createApp, watch } from 'vue'
import App from './App.vue'
import router from '@/router'
import '@mdi/font/css/materialdesignicons.css'
import "@fontsource/poppins";
import { VueTheMask } from 'vue-the-mask'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import { useAppStore } from '@/modules/commons/store';


const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

const pinia = createPinia()
// registra o plugin
pinia.use(piniaPersist)

app.use(pinia)

app.use(router)
app.use(vuetify)
app.use(VueTheMask)

// --- Watch global de userData ---
const appStore = useAppStore()
watch(
  () => appStore.userData,
  (newVal) => {
    if (!newVal) {
      console.log('userData perdido, fazendo logout...')
      appStore.logout()
    }
  }
)

app.mount('#app')
