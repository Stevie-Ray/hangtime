import { shallowMount } from '@vue/test-utils'
import Hand from './Hand.vue'

describe('Hand.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(Hand)
    expect(component.contains('.hand')).toBe(true)
  })
})
