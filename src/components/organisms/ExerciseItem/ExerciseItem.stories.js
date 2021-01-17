import './ExerciseItem.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean, text, number } from '@storybook/addon-knobs'
import ExerciseItem from './ExerciseItem'

export default {
  title: 'Organisms|ExerciseItem',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    id: {
      type: String,
      default: text('id', 'XXXX-00-XXXX-0')
    },
    index: {
      type: Number,
      default: number('index', 1)
    },
    editWorkout: {
      type: Boolean,
      default: boolean('editWorkout', true)
    }
  },
  components: { ExerciseItem },
  methods: {},
  template: `<exercise-item :id="id" :index="index" :edit-workout="editWorkout" class="exercise-item"></exercise-item>`
})
