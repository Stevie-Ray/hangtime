import { shallowMount } from '@vue/test-utils'
import CommunityList from './CommunityList.vue'

describe('CommunityList.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(CommunityList)
    expect(component.contains('.community-list')).toBe(true)
  })
})
