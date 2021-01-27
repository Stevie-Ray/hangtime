import DialogWorkoutComplete from './DialogWorkoutComplete'

export default {
  title: 'Components/Molecules/DialogWorkoutComplete',
  component: DialogWorkoutComplete,
  argTypes: {
    user: {
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
        level: 1,
        name: 'Storybook',
        share: true,
        time: 100
      }
    },
    dialog: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'dialog',
      type: 'boolean'
    },
    input: {
      action: 'input',
      table: { category: 'Events' }
    },
    currentWorkout: {
      control: 'object',
      table: {
        category: 'Attributes'
      },
      defaultValue: {
        settings: {
          selected: 1,
          hangboards: [
            {
              company: 1,
              hangboard: 0
            },
            {
              company: 1,
              hangboard: 1
            }
          ]
        }
      }
    },
    timeInWorkout: {
      control: 'number',
      table: { category: 'Attributes' },
      description: 'timeInWorkout',
      type: 'number'
    },
    timeHoldingOn: {
      control: 'number',
      table: { category: 'Attributes' },
      description: 'timeHoldingOn',
      type: 'number'
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { DialogWorkoutComplete },
  props: Object.keys(argTypes),
  template: `<dialog-workout-complete
        :user="user"
        :value="dialog"
        @input="input"
        :current-workout="currentWorkout"
        :time-in-workout="timeInWorkout"
        :time-holding-on="timeHoldingOn"
    />`
})

export const Common = Template.bind({})

Common.args = { dialog: true, timeInWorkout: 123, timeHoldingOn: 96 }
