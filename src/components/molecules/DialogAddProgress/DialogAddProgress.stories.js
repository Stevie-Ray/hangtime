import DialogAddProgress from './DialogAddProgress'

export default {
  title: 'Components/Molecules/DialogAddProgress',
  component: DialogAddProgress,
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
    addProgressDialog: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'addProgressDialog',
      type: 'boolean'
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { DialogAddProgress },
  props: Object.keys(argTypes),
  template: `<dialog-add-progress
        :user="user"
        :value="addProgressDialog"
        class="dialog-add-progress"
    />`
})

export const Common = Template.bind({})

Common.args = { addProgressDialog: true }
