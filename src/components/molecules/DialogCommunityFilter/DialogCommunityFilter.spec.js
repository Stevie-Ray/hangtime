import { shallowMount } from '@vue/test-utils'
import DialogCommunityFilter from './DialogCommunityFilter.vue'

describe('DialogCommunityFilter.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(DialogCommunityFilter)
    expect(component.contains('.dialog-add-progress')).toBe(true)
  })
})
