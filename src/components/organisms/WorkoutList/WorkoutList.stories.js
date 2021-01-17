import './WorkoutList.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs } from '@storybook/addon-knobs'
import WorkoutList from './WorkoutList'

export default {
  title: 'Organisms|WorkoutList',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {},
  components: { WorkoutList },
  methods: {},
  template: `<workout-list class="workout-list"></workout-list>`
})
