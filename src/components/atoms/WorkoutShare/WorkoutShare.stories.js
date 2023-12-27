import WorkoutShare from './WorkoutShare.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Atoms/WorkoutShare',
  component: WorkoutShare,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    workout: {
      share: true
    }
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {}
}
