import DialogHangboardSwitch from './DialogHangboardSwitch'

export default {
  title: 'Components/Molecules/DialogHangboardSwitch',
  component: DialogHangboardSwitch,
  argTypes: {
    user: {
      control: 'object',
      table: {
        category: 'Attributes'
      },
      defaultValue: {
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
    hangboardDialog: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'hangboardDialog',
      type: 'boolean'
    },
    input: {
      action: 'input',
      table: { category: 'Events' }
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { DialogHangboardSwitch },
  props: Object.keys(argTypes),
  template: `<dialog-hangboard-switch :user="user" :value="hangboardDialog" @input="input"/>`
})

export const Common = Template.bind({})

Common.args = { hangboardDialog: true }
