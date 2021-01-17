import { shallowMount } from '@vue/test-utils'
import DialogWorkoutDelete from './DialogWorkoutDelete.vue'

describe('DialogWorkoutDelete.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(DialogWorkoutDelete)
    expect(component.contains('.dialog-workout-delete')).toBe(true)
  })
})
