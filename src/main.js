import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import i18n from '@/misc/i18n'
import options from '@/misc/theme'
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

Vue.use(Vuetify)

new Vue({
  router,
  store,
  vuetify: new Vuetify(options),
  i18n,
  render: (h) => h(App)
}).$mount('#app')
