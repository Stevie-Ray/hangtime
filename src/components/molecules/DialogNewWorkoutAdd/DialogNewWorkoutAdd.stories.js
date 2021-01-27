import DialogNewWorkoutAdd from './DialogNewWorkoutAdd'

export default {
  title: 'Components/Molecules/DialogNewWorkoutAdd',
  component: DialogNewWorkoutAdd,
  argTypes: {
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
  components: { DialogNewWorkoutAdd },
  props: Object.keys(argTypes),
  template: `<dialog-new-workout-add :value="dialog" @input="input"/>`
})

export const Common = Template.bind({})

Common.args = { dialog: true }
