import './Hand.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean, object } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import Hand from './Hand'

export default {
  title: 'Atoms|Hand',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    editWorkout: {
      type: Boolean,
      default: boolean('editWorkout', true)
    },
    currentExercise: {
      type: Object,
      default: object('currentExercise:', {
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
    }
  },
  components: { Hand },
  methods: {
    setLeftHand: action('set-left-hand'),
    setRightHand: action('set-right-hand')
  },
  template: `<hand class="mb-2"
  :data="currentExercise"
  :edit-workout="editWorkout"
  @left="setLeftHand($event)"
  @right="setRightHand($event)"></hand>`
})
