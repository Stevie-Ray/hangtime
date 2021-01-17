import { shallowMount } from '@vue/test-utils'
import ExerciseListItem from './ExerciseListItem.vue'

describe('ExerciseListItem.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(ExerciseListItem)
    expect(component.contains('.exercise-list-item')).toBe(true)
  })
})
