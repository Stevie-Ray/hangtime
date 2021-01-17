import './NewContentAvailable.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { boolean, withKnobs } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import NewContentAvailable from './NewContentAvailable'

export default {
  title: 'Molecules|NewContentAvailable',
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
  components: { NewContentAvailable },
  methods: {
    serviceWorkerSkipWaiting: action('serviceWorkerSkipWaiting')
  },
  template: `<new-content-available
      v-if="newContentAvailable"
      class="new-content-available"
      :refreshing-app="refreshingApp"
      @refresh="serviceWorkerSkipWaiting">
  </new-content-available>`
})
