import './WorkoutListItem.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean, number, object } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import WorkoutListItem from './WorkoutListItem'

export default {
  title: 'Molecules|WorkoutListItem',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    data: {
      type: Object,
      default: object('data', {
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
        id: 'xxxxx',
        level: 1,
        name: 'Storybook',
        share: true,
        time: 100,
        user: {
          id: 'xxxxx',
          photoURL: 'https://thispersondoesnotexist.com/image',
          displayName: 'Person Does Not Exist'
        }
      })
    },
    index: {
      type: Number,
      default: number('index', 1)
    },
    disableActions: {
      type: Boolean,
      default: boolean('disableAction', false)
    }
  },
  components: { WorkoutListItem },
  methods: {
    input: action('input')
  },
  template: `<workout-list-item
      :key="data.id"
      class="community-workout-row"
      :index="index"
      :disable-actions="disableActions"
      :data="data"
      @go-to-workout-details="">
  </workout-list-item>`
})
