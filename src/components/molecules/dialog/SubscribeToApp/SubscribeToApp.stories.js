import SubscribeToApp from './SubscribeToApp.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Molecules/Dialog/SubscribeToApp',
  component: SubscribeToApp,
  tags: ['autodocs'],
  argTypes: {},
  render: (args) => ({
    components: { SubscribeToApp },
    // add functions for storybook
    setup() {
      return { args }
    },
    template: '<subscribe-to-app v-model="args.value" v-bind="args" />'
  }),
  args: {
    value: true,
    limit: 30
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {}
}
