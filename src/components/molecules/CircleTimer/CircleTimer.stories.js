import CircleTimer from './CircleTimer'

export default {
  title: 'Components/Molecules/CircleTimer',
  component: CircleTimer,
  argTypes: {
    currentExercise: {
      control: 'object',
      table: {
        category: 'Attributes'
      },
      defaultValue: {
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
      }
    },
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
        level: 1,
        name: 'Storybook',
        share: true,
        time: 100
      }
    },
    startWorkout: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'startWorkout',
      type: 'boolean'
    },
    pauseWorkout: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'startWorkout',
      type: 'boolean'
    },
    editCurrentStep: {
      action: 'edit-current-step',
      table: { category: 'Events' }
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { CircleTimer },
  props: Object.keys(argTypes),
  template: `<circle-timer
           :current-exercise="currentExercise"
           :current-workout="currentWorkout"
           :start-button="startWorkout"
           :pause-button="pauseWorkout"
           @current-step="editCurrentStep"
          />`
})

export const Common = Template.bind({})

Common.args = {}
