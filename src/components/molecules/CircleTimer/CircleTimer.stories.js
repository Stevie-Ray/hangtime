import './CircleTimer.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, object } from '@storybook/addon-knobs'
import CircleTimer from './CircleTimer'

export default {
  title: 'Molecules|CircleTimer',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    currentExercise: {
      type: Object,
      default: object('currentExercise', {
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
      })
    },
    currentWorkout: {
      type: Object,
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
        level: 1,
        name: 'Storybook',
        share: true,
        time: 100
      })
    },
    startWorkout: {},
    pauseWorkout: {}
  },
  components: { CircleTimer },
  methods: {
    editCurrentStep: action('edit-current-step')
  },
  template: `<circle-timer
      :current-exercise="currentExercise"
      :current-workout="currentWorkout"
      :start-button="startWorkout"
      :pause-button="pauseWorkout"
      @current-step="editCurrentStep">
  </circle-timer>`
})
