import AppContainer from './AppContainer.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Organisms/AppContainer',
  component: AppContainer,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    extension: false,
    hideFooter: false,
    prepend: false,
    title: ''
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {}
}
