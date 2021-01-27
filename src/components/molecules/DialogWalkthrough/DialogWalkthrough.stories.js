import DialogWalkthrough from './DialogWalkthrough'

export default {
  title: 'Components/Molecules/DialogWalkthrough',
  component: DialogWalkthrough,
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
  components: { DialogWalkthrough },
  props: Object.keys(argTypes),
  template: `<dialog-walkthrough :value="dialog" @input="input"/>`
})

export const Common = Template.bind({})

Common.args = { dialog: true }
