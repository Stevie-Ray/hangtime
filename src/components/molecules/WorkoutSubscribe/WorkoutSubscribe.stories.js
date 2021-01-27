import WorkoutSubscribe from './WorkoutSubscribe'

export default {
  title: 'Components/Molecules/WorkoutSubscribe',
  component: WorkoutSubscribe,
  argTypes: {
    currentWorkout: {
      control: 'object',
      table: {
        category: 'Attributes'
      },
      defaultValue: {
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
        time: 100,
        user: {
          id: 'xxxxx',
          photoURL: 'https://thispersondoesnotexist.com/image',
          displayName: 'Person Does Not Exist'
        }
      }
    },
    userId: {
      control: 'text',
      table: { category: 'Attributes' },
      description: 'userId',
      type: 'string'
    },
    isSubscribed: {},
    id: {
      control: 'text',
      table: { category: 'Attributes' },
      description: 'id',
      type: 'string'
    },
    small: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'small',
      type: 'boolean'
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { WorkoutSubscribe },
  props: Object.keys(argTypes),
  template: `<workout-subscribe
        :id="id"
        :value="true"
        :current-workout="currentWorkout"
        :user-id="userId"
        :small="small"
    />`
})

export const Common = Template.bind({})

Common.args = {}
