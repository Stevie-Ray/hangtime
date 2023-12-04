import ExerciseName from './ExerciseName.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Atoms/ExerciseName',
  component: ExerciseName,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    exercise: {
      exercise: 0,
      grip: 0,
      hold: 30,
      left: 1,
      level: 1,
      pause: 30,
      pullups: 0,
      repeat: 0,
      rest: 10,
      right: 1,
      time: 80,
      weight: 10
    },
    hideRepeat: false
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {}
}

export const Repeat = {
  args: {
    exercise: {
      exercise: 1,
      grip: 0,
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
}

export const Max = {
  args: {
    exercise: {
      exercise: 2,
      grip: 0,
      hold: 30,
      left: 1,
      level: 1,
      pause: 30,
      pullups: 10,
      repeat: 2,
      rest: 10,
      right: 1,
      time: 80,
      weight: 10,
      max: true
    }
  }
}
