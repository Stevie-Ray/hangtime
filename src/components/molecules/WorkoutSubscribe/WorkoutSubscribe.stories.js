import './WorkoutSubscribe.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, object, boolean, text } from '@storybook/addon-knobs'
import WorkoutSubscribe from './WorkoutSubscribe'

export default {
  title: 'Molecules|WorkoutSubscribe',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
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
        subscribers: [
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        ],
        level: 1,
        name: 'Storybook',
        share: true,
        time: 100
      })
    },
    id: {
      type: String,
      default: text('id', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    },
    userId: {
      type: String,
      default: text(
        'userId',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      )
    },
    small: {
      type: Boolean,
      default: boolean('small', false)
    }
  },
  components: { WorkoutSubscribe },
  methods: {},
  template: `<workout-subscribe
      :id="id"
      :value="true"
      :current-workout="currentWorkout"
      :is-subscribed="isSubscribed"
      :user-id="userId"
      :small="small"
  ></workout-subscribe>`
})
