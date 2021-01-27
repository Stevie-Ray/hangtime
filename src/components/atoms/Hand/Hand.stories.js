import Hand from './Hand'

export default {
  title: 'Components/Atoms/Hand',
  components: Hand,
  argTypes: {
    editWorkout: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'editWorkout',
      type: 'boolean'
    },
    currentExercise: {
      control: 'object',
      table: {
        category: 'Attributes'
      },
      defaultValue: {
        exercise: 0,
        hold: 20,
        left: 1,
        level: 0,
        pause: 10,
        pullups: 0,
        repeat: 2,
        rest: 3,
        right: 1,
        time: 80
      }
    },
    setLeftHand: { action: 'set-left-hand', table: { category: 'Events' } },
    setRightHand: { action: 'set-right-hand', table: { category: 'Events' } },
    classes: {
      control: {
        type: 'select',
        options: ['', 'mb2']
      },
      table: {
        category: 'Modifier classes'
      }
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { Hand },
  props: Object.keys(argTypes),
  template: `<hand :class="classes" :data="currentExercise" :edit-workout="editWorkout" @left="setLeftHand($event)" @right="setRightHand($event)"/>`
})

export const Common = Template.bind({})

Common.args = { editWorkout: false }

export const EditWorkout = Template.bind({})

EditWorkout.args = { editWorkout: true }
