import { shallowMount } from '@vue/test-utils'
import DialogUserImage from './DialogUserImage.vue'

describe('DialogUserImage.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(DialogUserImage)
    expect(component.contains('.dialog-user-image')).toBe(true)
  })
})
