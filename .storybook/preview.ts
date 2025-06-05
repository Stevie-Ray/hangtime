import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import { registerPlugins } from '@/plugins'
import { withVuetifyTheme } from './withVuetifyTheme.decorator'

setup((app) => {
  registerPlugins(app)
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    toolbar: {
      icon: 'paintbrush',
      // Array of plain string values or MenuItem shape
      items: [
        { value: 'light', title: 'Light', left: '🌞' },
        { value: 'dark', title: 'Dark', left: '🌛' }
      ],
      // Change title based on selected value
      dynamicTitle: true
    }
  }
}

export const decorators = [withVuetifyTheme]

export default preview
