import { shallowMount } from '@vue/test-utils'
import WorkoutList from './WorkoutList.vue'

describe('WorkoutList.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(WorkoutList)
    expect(component.contains('.workout-list')).toBe(true)
  })
})
