import ExerciseCard from './ExerciseCard.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Molecules/ExerciseCard',
  component: ExerciseCard,
  tags: ['autodocs'],
  argTypes: {
    onLeft: { action: 'left' },
    onRight: { action: 'right' },
    onRotate: { action: 'rotate' }
  },
  render: (args) => ({
    components: { ExerciseCard },
    // add functions for storybook
    setup() {
      const onLeft = (number) => {
        args.exercise = { ...args.exercise, left: number }
      }
      const onRight = (number) => {
        args.exercise = { ...args.exercise, right: number }
      }
      const onRotate = (number) => {
        args.exercise = { ...args.exercise, rotate: number }
      }
      return { args, onRight, onLeft, onRotate }
    },
    template: '<exercise-card v-bind="args" @left="onLeft" @right="onRight" @rotate="onRotate" />'
  }),
  args: {
    hangboard: {
      company: 1,
      hangboard: 0
    },
    exercise: {
      exercise: 0,
      grip: 0,
      hold: 30,
      left: 0,
      level: 1,
      pause: 30,
      pullups: 10,
      repeat: 4,
      rest: 10,
      right: 0,
      time: 80,
      weight: 10
    },
    index: 1,
    editHangboard: true,
    sort: false,
    editHand: false,
    hideRest: false
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {}
}
