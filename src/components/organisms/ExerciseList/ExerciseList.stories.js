import './ExerciseList.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean, text } from '@storybook/addon-knobs'
import ExerciseList from './ExerciseList'

export default {
  title: 'Organisms|ExerciseList',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    id: {
      type: String,
      default: text('id', 'XXXX-00-XXXX-0')
    },
    editWorkout: {
      type: Boolean,
      default: boolean('editWorkout', true)
    }
  },
  components: { ExerciseList },
  methods: {},
  template: `<exercise-list :id="id" :edit-workout="editWorkout" class="exercise-list"></exercise-list>`
})
