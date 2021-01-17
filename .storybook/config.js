// Imports
import { configure, addDecorator, addParameters } from '@storybook/vue'
import { withA11y } from '@storybook/addon-a11y'
import { withKnobs } from '@storybook/addon-knobs'
import { withTemplate } from '~storybook/addon-show-vue-markup'
import { withVuetify } from '~storybook/addon-vuetify'
import StoryRouter from '~storybook/addon-router'
import i18n from '@/misc/i18n'

function loadStories() {
  const stories = []
  // Get example stories
  const example = require.context('./stories', true, /.stories.(js|mdx)$/)
  example.keys().forEach(filename => stories.push(example(filename)))

  // add component stories
  const req = require.context('../src/components', true, /.stories.js$/)
  req.keys().forEach(filename => stories.push(req(filename)))
  return stories
}

// Storybook customization
import theme from '~storybook/theme'
addParameters({
  options: {
    brandTitle: 'HangTime UI',
    showPanel: true,
    isToolshown: true,
    theme,
    storySort: (a, b) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, { numeric: true })
  }
})

// add addons for all stories
addDecorator(withA11y)
addDecorator(withKnobs)
addDecorator(withTemplate)
addDecorator(withVuetify)
// vue router support
addDecorator(storyFn => StoryRouter()(storyFn))
// vue i18n support
addDecorator(() => ({
  template: '<story/>',
  i18n
}))

configure(loadStories, module)
