// import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import App from './App.vue'
import router from './router'
import store from './store'

import '@/misc/register-service-worker'
import '@/misc/handle-network-status'
import '@/firebase/init'
import '@/firebase/authentication'
import '@/misc/handle-apple-install-prompt'
import 'pwacompat'

Vue.config.productionTip = false

const opts = {
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    dark: true,
    themes: {
      light: {
        primary: '#4E7352',
        secondary: '#739270',
        tertiary: '#FE0064',
        accent: '#739270'
      },
      dark: {
        primary: '#4E7352',
        secondary: '#739270',
        accent: '#739270'
      }
    }
  }
}

Vue.use(Vuetify)

new Vue({
  router,
  store,
  vuetify: new Vuetify(opts),
  render: h => h(App)
}).$mount('#app')
