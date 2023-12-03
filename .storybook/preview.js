import { setup } from '@storybook/vue3'
// import { withVuetify } from 'storybook-addon-vuetify3/dist/decorators'

import { registerPlugins } from '@/plugins'

setup((app) => {
  registerPlugins(app)
})

/** @type { import('@storybook/vue3').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
// export const decorators = [withVuetify]
