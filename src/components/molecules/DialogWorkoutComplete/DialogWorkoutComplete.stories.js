import './DialogWorkoutComplete.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, object, boolean, number } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import DialogWorkoutComplete from './DialogWorkoutComplete'

export default {
  title: 'Molecules|DialogWorkoutComplete',
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
    },
    timeInWorkout: {
      type: Number,
      default: number('timeInWorkout', 123)
    },
    timeHoldingOn: {
      type: Number,
      default: number('timeHoldingOn', 96)
    }
  },
  components: { DialogWorkoutComplete },
  methods: {
    input: action('input')
  },
  template: `<dialog-workout-complete
:value="dialog" 
@input="input"
:current-workout="currentWorkout"
:time-in-workout="timeInWorkout"
:time-holding-on="timeHoldingOn"
  >
  </dialog-workout-complete>`
})
