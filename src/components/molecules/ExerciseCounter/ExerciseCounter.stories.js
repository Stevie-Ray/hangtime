import ExerciseCounter from './ExerciseCounter.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Molecules/ExerciseCounter',
  component: ExerciseCounter,
  tags: ['autodocs'],
  argTypes: {
    onInput: { action: 'input' }
  },
  render: (args) => ({
    components: { ExerciseCounter },
    // add functions for storybook
    setup() {
      const onInput = (number) => {
        args.value = number
      }
      return { args, onInput }
    },
    template: '<exercise-counter v-bind="args" @input="onInput" />'
  }),
  args: {
    title: '',
    subtitle: '',
    suffix: 'x',
    timer: true,
    disabled: false,
    value: 0
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    title: 'Hang'
  }
}
