import HangboardSelect from './HangboardSelect.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/Molecules/HangboardSelect',
  component: HangboardSelect,
  tags: ['autodocs'],
  argTypes: {
    onUpdateSelected: { action: 'item' }
  },
  render: (args) => ({
    components: { HangboardSelect },
    // add functions for storybook
    setup() {
      const onUpdateSelected = (item) => {
        console.log(item)
      }
      return { args, onUpdateSelected }
    },
    template: '<hangboard-select v-bind="args" @update-selected="onUpdateSelected" />'
  }),
  args: {
    selectedHangboard: {
      company: 10,
      hangboard: 0
    }
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    selectedHangboard: {
      company: 10,
      hangboard: 0
    }
  }
}
