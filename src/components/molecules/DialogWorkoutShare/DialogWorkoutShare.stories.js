import './DialogWorkoutShare.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, object, boolean } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import DialogWorkoutShare from './DialogWorkoutShare'

export default {
  title: 'Molecules|DialogWorkoutShare',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
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
  components: { DialogWorkoutShare },
  methods: {
    input: action('input')
  },
  template: `<dialog-workout-share :current-workout="currentWorkout" :value="dialog" @input="input">
  </dialog-workout-share>`
})
