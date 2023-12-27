import WorkoutSubscribe from './WorkoutSubscribe.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Atoms/WorkoutSubscribe',
  component: WorkoutSubscribe,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    workout: {
      subscribers: ['sadfghsgsfa1', 'sadfghsgsfa2', 'sadfghsgsfa3']
    }
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {}
}
