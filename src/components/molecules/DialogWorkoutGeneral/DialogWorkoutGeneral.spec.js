import { shallowMount } from '@vue/test-utils'
import DialogWorkoutGeneral from './DialogWorkoutGeneral.vue'

describe('DialogWorkoutGeneral.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(DialogWorkoutGeneral)
    expect(component.contains('.dialog-workout-general')).toBe(true)
  })
})
