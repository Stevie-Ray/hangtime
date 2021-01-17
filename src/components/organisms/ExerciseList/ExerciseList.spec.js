import { shallowMount } from '@vue/test-utils'
import ExerciseList from './ExerciseList.vue'

describe('ExerciseList.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(ExerciseList)
    expect(component.contains('.exercise-list')).toBe(true)
  })
})
