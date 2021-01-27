import CommunityList from './CommunityList'

export default {
  title: 'Components/Organisms/CommunityList',
  component: CommunityList,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  components: { CommunityList },
  props: Object.keys(argTypes),
  template: `<community-list class="community-list"/>`
})

export const Common = Template.bind({})
