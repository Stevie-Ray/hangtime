import './WorkoutItemName.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, object } from '@storybook/addon-knobs'
import WorkoutItemName from './WorkoutItemName'

export default {
  title: 'Atoms|WorkoutItemName',
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
    }
  },
  components: { WorkoutItemName },
  methods: {},
  template: `<workout-item-name :data="data"></workout-item-name>`
})
