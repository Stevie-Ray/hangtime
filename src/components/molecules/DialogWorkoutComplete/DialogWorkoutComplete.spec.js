import { shallowMount } from '@vue/test-utils'
import DialogWorkoutComplete from './DialogWorkoutComplete.vue'

describe('DialogWorkoutComplete.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(DialogWorkoutComplete)
    expect(component.contains('.dialog-workout-complete')).toBe(true)
  })
})
