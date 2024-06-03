import WalkthroughApp from './WalkthroughApp.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Molecules/Dialog/WalkthroughApp',
  component: WalkthroughApp,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    limit: 30
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {}
}
