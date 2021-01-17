import { shallowMount } from '@vue/test-utils'
import DialogWorkoutSubscribe from './DialogWorkoutSubscribe.vue'

describe('DialogWorkoutSubscribe.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(DialogWorkoutSubscribe)
    expect(component.contains('.dialog-user-image')).toBe(true)
  })
})
