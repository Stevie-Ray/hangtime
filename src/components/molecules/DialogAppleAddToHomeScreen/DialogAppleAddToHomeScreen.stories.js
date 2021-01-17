import './DialogAppleAddToHomeScreen.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean } from '@storybook/addon-knobs'
import DialogAppleAddToHomeScreen from './DialogAppleAddToHomeScreen'

export default {
  title: 'Molecules|DialogAppleAddToHomeScreen',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    showAddToHomeScreenModalForApple: {
      type: Boolean,
      default: boolean('showAddToHomeScreenModalForApple', true)
    }
  },
  components: { DialogAppleAddToHomeScreen },
  methods: {
    closeAddToHomeScreenModalForApple: action(
      'close-add-to-home-screen-modal-for-apple'
    )
  },
  template: `<dialog-apple-add-to-home-screen
      v-if="showAddToHomeScreenModalForApple"
      class="apple-add-to-home-screen-modal"
      @close="closeAddToHomeScreenModalForApple(false)"
  ></dialog-apple-add-to-home-screen>`
})
