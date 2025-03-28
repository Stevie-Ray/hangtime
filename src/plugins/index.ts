/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { createGtag } from 'vue-gtag'
import head from '@/plugins/head'
import i18n from '@/plugins/i18n'
import pinia from '@/plugins/pinia'
import vuetify from '@/plugins/vuetify'
import router from '@/router'
import { App } from 'vue'

const gtag = createGtag({
  tagId: 'G-D2DR5GPWS3',
  appName: 'HangTime',
  resource: {
    defer: true
  },
  pageTracker: {
    router
  }
})

export function registerPlugins(app: App): void {
  app.use(head).use(i18n).use(pinia).use(vuetify).use(router).use(gtag)
}
