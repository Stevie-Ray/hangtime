import { shallowMount } from '@vue/test-utils'
import ExerciseItem from './ExerciseItem.vue'

describe('ExerciseItem.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(ExerciseItem)
    expect(component.contains('.exercise-item')).toBe(true)
  })
})
