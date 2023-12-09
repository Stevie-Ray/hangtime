import NewContentAvailable from './NewContentAvailable.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Molecules/NewContentAvailable',
  component: NewContentAvailable,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    refreshingApp: false
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {}
}

export const Refreshing = {
  args: {
    refreshingApp: true
  }
}
