import './DialogAddProgress.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean } from '@storybook/addon-knobs'
import DialogAddProgress from './DialogAddProgress'

export default {
  title: 'Molecules|DialogAddProgress',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    addProgressDialog: {
      type: Boolean,
      default: boolean('addProgressDialog', true)
    }
  },
  components: { DialogAddProgress },
  template: `<dialog-add-progress
      :value="addProgressDialog"
      class="dialog-add-progress"
  ></dialog-add-progress>`
})
