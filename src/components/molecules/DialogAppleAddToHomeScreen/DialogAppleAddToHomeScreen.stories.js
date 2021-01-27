import DialogAppleAddToHomeScreen from './DialogAppleAddToHomeScreen'

export default {
  title: 'Components/Molecules/DialogAppleAddToHomeScreen',
  component: DialogAppleAddToHomeScreen,
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
    showAddToHomeScreenModalForApple: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'showAddToHomeScreenModalForApple',
      type: 'boolean'
    },
    closeAddToHomeScreenModalForApple: {
      action: "close-add-to-home-screen-modal-for-apple'",
      table: { category: 'Events' }
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { DialogAppleAddToHomeScreen },
  props: Object.keys(argTypes),
  template: `<dialog-apple-add-to-home-screen
        v-if="showAddToHomeScreenModalForApple"
        class="apple-add-to-home-screen-modal"
        @close="closeAddToHomeScreenModalForApple(false)"
    />`
})

export const Common = Template.bind({})

Common.args = { showAddToHomeScreenModalForApple: true }
