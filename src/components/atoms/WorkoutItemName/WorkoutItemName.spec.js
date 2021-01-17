import { shallowMount } from '@vue/test-utils'
import WorkoutItemName from './WorkoutItemName.vue'

describe('WorkoutItemName.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(WorkoutItemName)
    expect(component.contains('.hand')).toBe(true)
  })
})
