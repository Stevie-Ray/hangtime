import './DialogAddProgress.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean, object } from '@storybook/addon-knobs'
import DialogAddProgress from './DialogAddProgress'

export default {
  title: 'Molecules|DialogAddProgress',
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
    addProgressDialog: {
      type: Boolean,
      default: boolean('addProgressDialog', true)
    }
  },
  components: { DialogAddProgress },
  template: `<dialog-add-progress
      :user="user"
      :value="addProgressDialog"
      class="dialog-add-progress"
  ></dialog-add-progress>`
})
