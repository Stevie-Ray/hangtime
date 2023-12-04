import ExerciseCard from './ExerciseCard.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Molecules/ExerciseCard',
  component: ExerciseCard,
  tags: ['autodocs'],
  argTypes: {},
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
    editHangboard: false,
    sort: false,
    editHand: false,
    hideRest: false
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {}
}
