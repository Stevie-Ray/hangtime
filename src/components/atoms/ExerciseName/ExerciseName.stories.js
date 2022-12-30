import ExerciseName from './ExerciseName'

export default {
  title: 'Components/Atoms/ExerciseName',
  component: ExerciseName,
  argTypes: {
    exercise: {
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
    }
  }
}

// 👇 We create a “template” of how args map to rendering
const Template = (args) => ({
  components: { ExerciseName },
  setup() {
    return { args }
  },
  template: '<exercise-name v-bind="args"/>'
})

export const Default = Template.bind({})
Default.args = {}

export const Secondary = Template.bind({})
Secondary.args = {
  exercise: {
    exercise: 2,
    grip: 2,
    hold: 30,
    left: 1,
    level: 1,
    pause: 30,
    pullups: 10,
    repeat: 2,
    rest: 10,
    right: 1,
    time: 80,
    weight: 10
  }
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  exercise: {
    exercise: 0,
    grip: 0,
    hold: 30,
    left: 1,
    level: 1,
    pause: 30,
    pullups: 10,
    repeat: 2,
    rest: 10,
    right: null,
    time: 80,
    weight: 10
  }
}
