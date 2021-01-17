import './DialogHangboardSwitch.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean, object } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import DialogHangboardSwitch from './DialogHangboardSwitch'

export default {
  title: 'Molecules|DialogHangboardSwitch',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    user: {
      type: Object,
      default: object('user', {
        settings: {
          selected: 1,
          hangboards: [
            {
              company: 1,
              hangboard: 0
            },
            {
              company: 1,
              hangboard: 1
            }
          ]
        }
      })
    },
    hangboardDialog: {
      type: Boolean,
      default: boolean('hangboardDialog', true)
    }
  },
  components: { DialogHangboardSwitch },
  methods: {
    input: action('input')
  },
  template: `<dialog-hangboard-switch :user="user" :value="hangboardDialog" @input="input">
  </dialog-hangboard-switch>`
})
