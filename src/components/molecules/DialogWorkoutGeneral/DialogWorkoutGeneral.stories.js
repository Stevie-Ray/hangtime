import DialogWorkoutGeneral from './DialogWorkoutGeneral'

export default {
  title: 'Components/Molecules/DialogWorkoutGeneral',
  component: DialogWorkoutGeneral,
  argTypes: {
    edit: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'edit',
      type: 'boolean'
    },
    editWorkout: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'editWorkout',
      type: 'boolean'
    },
    userWorkout: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'userWorkout',
      type: 'boolean'
    },
    currentWorkout: {
      control: 'object',
      table: {
        category: 'Attributes'
      },
      defaultValue: {
        company: 1,
        description: 'Storybook',
        exercises: [
          {
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
        ],
        hangboard: 0,
        subscribers: [
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        ],
        level: 1,
        name: 'Storybook',
        share: false,
        time: 100
      }
    },
    dialog: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'dialog',
      type: 'boolean'
    },
    input: {
      action: 'input',
      table: { category: 'Events' }
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { DialogWorkoutGeneral },
  props: Object.keys(argTypes),
  template: `<dialog-workout-general
        :edit="edit"
        :edit-workout="editWorkout"
        :current-workout="currentWorkout"
        :user-workout="userWorkout"
        @edit="edit = true"
        :value="dialog"
        @input="input"/>`
})

export const Common = Template.bind({})

Common.args = { dialog: true, editWorkout: true, userWorkout: true, edit: true }
