import './DialogWorkoutGeneral.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, object, boolean } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import DialogWorkoutGeneral from './DialogWorkoutGeneral'

export default {
  title: 'Molecules|DialogWorkoutGeneral',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    edit: {
      type: Boolean,
      default: boolean('edit', true)
    },
    editWorkout: {
      type: Boolean,
      default: boolean('editWorkout', true)
    },
    userWorkout: {
      type: Boolean,
      default: boolean('userWorkout', true)
    },
    dialog: {
      type: Boolean,
      default: boolean('dialog', true)
    },
    currentWorkout: {
      default: object('currentWorkout', {
        company: 1,
        description: 'Storybook',
        exercises: [
          {
            exercise: 0,
            hold: 20,
            left: 1,
            level: 0,
            pause: 10,
            pullups: 0,
            repeat: 2,
            rest: 3,
            right: 1,
            time: 80
          }
        ],
        hangboard: 0,
        subscribers: [
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        ],
        level: 1,
        name: 'Storybook',
        share: false,
        time: 100
      })
    }
  },
  components: { DialogWorkoutGeneral },
  methods: {
    input: action('input')
  },
  template: `<dialog-workout-general
      :edit="edit"
      :edit-workout="editWorkout"
      :current-workout="currentWorkout"
      :user-workout="userWorkout"
      @edit="edit = true"
      :value="dialog" 
      @input="input">
  </dialog-workout-general>`
})
