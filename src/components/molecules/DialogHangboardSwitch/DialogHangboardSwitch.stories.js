import './DialogHangboardSwitch.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import DialogHangboardSwitch from './DialogHangboardSwitch'

export default {
  title: 'Molecules|DialogHangboardSwitch',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    hangboardDialog: {
      type: Boolean,
      default: boolean('hangboardDialog', true)
    }
  },
  components: { DialogHangboardSwitch },
  methods: {
    input: action('input')
  },
  template: `<dialog-hangboard-switch  :value="hangboardDialog" @input="input">
  </dialog-hangboard-switch>`
})
