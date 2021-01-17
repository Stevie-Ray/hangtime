import './DialogNewWorkoutAdd.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import DialogNewWorkoutAdd from './DialogNewWorkoutAdd'

export default {
  title: 'Molecules|DialogNewWorkoutAdd',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    dialog: {
      type: Boolean,
      default: boolean('dialog', true)
    }
  },
  components: { DialogNewWorkoutAdd },
  methods: {
    input: action('input')
  },
  template: `<dialog-new-workout-add  :value="dialog" @input="input">
  </dialog-new-workout-add>`
})
