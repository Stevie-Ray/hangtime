import { createApp } from 'vue'
import VueGtag from 'vue-gtag'
import App from '@/App'
import head from '@/plugins/head'
import i18n from '@/plugins/i18n'
import pinia from '@/plugins/pinia'
import vuetify from '@/plugins/vuetify'
import router from '@/router'

import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import '@/plugins/firebase'

const app = createApp(App)

app
  .use(head)
  .use(i18n)
  .use(pinia)
  .use(vuetify)
  .use(router)
  .use(
    VueGtag,
    {
      appName: 'HangTime',
      pageTrackerScreenviewEnabled: true,
      config: { id: 'G-D2DR5GPWS3' }
    },
    router
  )
  .mount('#app')

// make sure app is ready
if (app) {
  import('@/plugins/firebase/authentication')
  import('@/helpers/online')
  import('@/plugins/register-service-worker')
}
