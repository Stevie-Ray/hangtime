import ExerciseHangboard from './ExerciseHangboard'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Atoms/ExerciseHangboard',
  component: ExerciseHangboard,
  tags: ['autodocs'],
  argTypes: {
    onLeft: { action: 'left' },
    onRight: { action: 'right' },
    onRotate: { action: 'rotate' }
  },
  render: (args) => ({
    components: { ExerciseHangboard },
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
    template:
      '<ExerciseHangboard v-bind="args"  @left="onLeft" @right="onRight" @rotate="onRotate" />'
  }),
  args: {
    hangboard: {
      company: 0,
      hangboard: 0
    },
    edit: true
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Antworks = {
  args: {
    hangboard: {
      company: 0,
      hangboard: 0
    }
  }
}

export const Beastmaker = {
  args: {
    hangboard: {
      company: 1,
      hangboard: 0
    }
  }
}

export const Core = {
  args: {
    hangboard: {
      company: 2,
      hangboard: 0
    }
  }
}

export const Flash = {
  args: {
    exercise: {
      rotate: 0
    },
    hangboard: {
      company: 15,
      hangboard: 3
    }
  }
}

export const Pivot = {
  args: {
    exercise: {
      rotate: 0
    },
    hangboard: {
      company: 16,
      hangboard: 2
    }
  }
}
