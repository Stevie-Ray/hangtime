import { shallowMount } from '@vue/test-utils'
import CircleTimer from './CircleTimer.vue'

describe('DialogAppleAddToHomeScreen.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(CircleTimer)
    expect(component.contains('.button')).toBe(true)
  })
})
