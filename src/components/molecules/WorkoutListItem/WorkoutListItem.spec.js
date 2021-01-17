import { shallowMount } from '@vue/test-utils'
import WorkoutListItem from './WorkoutListItem.vue'

describe('WorkoutListItem.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(WorkoutListItem)
    expect(component.contains('.workout-list-item')).toBe(true)
  })
})
