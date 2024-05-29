// Components & Composables
import { createApp } from 'vue'
import App from '@/App.vue'

import { registerPlugins } from '@/plugins'

import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-500.css'
import '@fontsource/roboto/latin-700.css'

import '@/plugins/firebase'

const app = createApp(App)

// Plugins
registerPlugins(app)

app.mount('#app')

// make sure app is ready
if (app) {
  import('@/plugins/firebase/authentication')
  import('@/helpers/online')
  import('@/plugins/register-service-worker')
}
