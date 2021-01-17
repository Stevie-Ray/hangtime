import './WorkoutShare.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, object, boolean } from '@storybook/addon-knobs'
import WorkoutShare from '@/components/molecules/WorkoutShare/WorkoutShare'

export default {
  title: 'Molecules|WorkoutShare',
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
        share: false,
        time: 100
      })
    },
    small: {
      type: Boolean,
      default: boolean('small', false)
    }
  },
  components: { WorkoutShare },
  methods: {},
  template: `<workout-share 
      :current-workout="currentWorkout"
      :small="small"
  ></workout-share>`
})
