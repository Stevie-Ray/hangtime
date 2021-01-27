import DialogUserImage from './DialogUserImage'

export default {
  title: 'Components/Molecules/DialogUserImage',
  component: DialogUserImage,
  argTypes: {
    user: {
      control: 'object',
      table: {
        category: 'Attributes'
      },
      defaultValue: {
        id: 'xxxxx',
        photoURL: 'https://thispersondoesnotexist.com/image',
        displayName: 'Person Does Not Exist',
        settings: {
          selected: 1,
          hangboards: [
            {
              company: 1,
              hangboard: 0
            },
            {
              company: 1,
              hangboard: 1
            }
          ]
        }
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
  components: { DialogUserImage },
  props: Object.keys(argTypes),
  template: `<dialog-user-image :data="user" :value="dialog" @input="input"></dialog-user-image>`
})

export const Common = Template.bind({})

Common.args = { dialog: true }
