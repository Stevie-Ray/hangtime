import WorkoutListItem from './WorkoutListItem'

export default {
  title: 'Components/Molecules/WorkoutListItem',
  component: WorkoutListItem,
  argTypes: {
    workout: {
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
    index: {
      control: 'number',
      table: { category: 'Attributes' },
      description: 'index',
      type: 'number'
    },
    disableActions: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'disableActions',
      type: 'boolean'
    },
    input: {
      action: 'input',
      table: { category: 'Events' }
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { WorkoutListItem },
  props: Object.keys(argTypes),
  template: `<workout-list-item
        :key="workout.id"
        class="community-workout-row"
        :index="index"
        :disable-actions="disableActions"
        :data="workout"
        @go-to-workout-details=""/>
    `
})

export const Common = Template.bind({})

Common.args = { WorkoutListItem: true }
