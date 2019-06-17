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

// https://color.adobe.com/_DS89712-color-theme-12679944
const opts = {
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#012E40',
        secondary: '#366D73',
        tertiary: '#5A8C8C',
        accent: '#BCBFA4'
      },
      dark: {
        primary: '#012E40',
        secondary: '#366D73',
        tertiary: '#5A8C8C',
        accent: '#BCBFA4'
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
