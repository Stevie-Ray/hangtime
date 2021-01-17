import './ExerciseListItem.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean, number, object } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import ExerciseListItem from './ExerciseListItem'

export default {
  title: 'Molecules|ExerciseListItem',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    data: {
      type: Object,
      default: object('data', {
        exercise: 1,
        grip: 1,
        hold: 20,
        left: 1,
        level: 1,
        pause: 10,
        pullups: 5,
        repeat: 2,
        rest: 3,
        right: 1,
        time: 80,
        weight: 10
      })
    },
    index: {
      type: Number,
      default: number('index', 1)
    },
    disableActions: {
      type: Boolean,
      default: boolean('disableAction', false)
    },
    editWorkout: {
      type: Boolean,
      default: boolean('editWorkout', true)
    }
  },
  components: { ExerciseListItem },
  methods: {
    input: action('input')
  },
  template: `<exercise-list-item :data="data" :index="index" :disable-actions="disableActions" :edit-workout="editWorkout">
  </exercise-list-item>`
})
