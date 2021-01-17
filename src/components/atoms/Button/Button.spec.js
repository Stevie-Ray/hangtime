import { shallowMount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(Button)
    expect(component.contains('.button')).toBe(true)
  })
})
