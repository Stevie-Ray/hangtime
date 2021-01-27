import WorkoutShare from './WorkoutShare'

export default {
  title: 'Components/Molecules/WorkoutShare',
  component: WorkoutShare,
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
    small: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'small',
      type: 'boolean'
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { WorkoutShare },
  props: Object.keys(argTypes),
  template: `<workout-share :current-workout="currentWorkout" :small="small"/>`
})

export const Common = Template.bind({})

export const Shared = Template.bind({})

Shared.args = {
  currentWorkout: {
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
    time: 100,
    user: {
      id: 'xxxxx',
      photoURL: 'https://thispersondoesnotexist.com/image',
      displayName: 'Person Does Not Exist'
    }
  }
}
