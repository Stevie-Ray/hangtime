import { shallowMount } from '@vue/test-utils'
import DialogHangboardSwitch from './DialogHangboardSwitch.vue'

describe('DialogHangboardSwitch.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(DialogHangboardSwitch)
    expect(component.contains('.dialog-add-progress')).toBe(true)
  })
})
