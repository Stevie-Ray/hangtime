import './HangboardSelect.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { boolean, withKnobs } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import HangboardSelect from './HangboardSelect'

export default {
  title: 'Molecules|HangboardSelect',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    newContentAvailable: {
      type: Boolean,
      default: boolean('newContentAvailable', true)
    },
    refreshingApp: {
      type: Boolean,
      default: boolean('refreshingApp', false)
    }
  },
  components: { HangboardSelect },
  methods: {
    serviceWorkerSkipWaiting: action('serviceWorkerSkipWaiting')
  },
  template: `<hangboard-select/>`
})
