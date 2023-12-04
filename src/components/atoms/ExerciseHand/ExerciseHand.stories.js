import ExerciseHand from './ExerciseHand.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Atoms/ExerciseHand',
  component: ExerciseHand,
  tags: ['autodocs'],
  argTypes: {
    onLeft: { action: 'left' },
    onRight: { action: 'right' }
  },
  render: (args) => ({
    components: { ExerciseHand },
    // add functions for storybook
    setup() {
      const onLeft = (number) => {
        args.exercise = { ...args.exercise, leftHand: number }
      }
      const onRight = (number) => {
        args.exercise = { ...args.exercise, rightHand: number }
      }
      return { args, onRight, onLeft }
    },
    template: '<exercise-hand v-bind="args" @left="onLeft" @right="onRight" />'
  }),
  args: {
    exercise: {},
    edit: false
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {}
}

export const Edit = {
  args: {
    edit: true
  }
}
