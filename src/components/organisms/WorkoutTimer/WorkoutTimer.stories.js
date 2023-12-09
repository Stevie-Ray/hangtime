import WorkoutTimer from './WorkoutTimer.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Organisms/WorkoutTimer',
  component: WorkoutTimer,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    workout: {
      hangboard: 0,
      company: 1,
      exercises: [
        {
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
        {
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
        }
      ]
    }
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {}
}
