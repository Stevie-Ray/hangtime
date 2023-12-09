import NewsCards from './NewsCards.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Molecules/NewsCards',
  component: NewsCards,
  tags: ['autodocs'],
  argTypes: {},
  args: {}
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {}
}
