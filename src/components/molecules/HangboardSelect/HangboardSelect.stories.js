import HangboardSelect from './HangboardSelect'

export default {
  title: 'Components/Molecules/HangboardSelect',
  component: HangboardSelect,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  components: { HangboardSelect },
  props: Object.keys(argTypes),
  template: `<hangboard-select/>`
})

export const Common = Template.bind({})
