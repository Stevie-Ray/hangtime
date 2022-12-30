import { app } from '@storybook/vue3'
import { createPinia } from 'pinia'
const pinia = createPinia()
import i18n from '@/plugins/i18n'

app.use(i18n).use(pinia)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}

import { withVuetify } from 'storybook-addon-vuetify3/dist/decorators'

export const decorators = [withVuetify]
