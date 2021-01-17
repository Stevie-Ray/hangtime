import { shallowMount } from '@vue/test-utils'
import DialogNewWorkoutAdd from './DialogNewWorkoutAdd.vue'

describe('DialogNewWorkoutAdd.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(DialogNewWorkoutAdd)
    expect(component.contains('.dialog-new-workout-add')).toBe(true)
  })
})
