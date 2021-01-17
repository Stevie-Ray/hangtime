import { shallowMount } from '@vue/test-utils'
import DialogAppleAddToHomeScreen from './DialogAppleAddToHomeScreen.vue'

describe('DialogAppleAddToHomeScreen.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(DialogAppleAddToHomeScreen)
    expect(component.contains('.apple-add-to-home-screen-modal')).toBe(true)
  })
})
