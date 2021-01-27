import DialogCommunityFilter from './DialogCommunityFilter'

export default {
  title: 'Components/Molecules/DialogCommunityFilter',
  component: DialogCommunityFilter,
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
    filterDialog: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'filterDialog',
      type: 'boolean'
    },
    input: {
      action: 'input',
      table: { category: 'Events' }
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { DialogCommunityFilter },
  props: Object.keys(argTypes),
  template: `<dialog-community-filter :value="filterDialog" @input="input"/>`
})

export const Common = Template.bind({})

Common.args = { filterDialog: true }
