import { shallowMount } from '@vue/test-utils'
import NewContentAvailable from './NewContentAvailable.vue'

describe('ExerciseListItem.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(NewContentAvailable)
    expect(component.contains('.new-content-available')).toBe(true)
  })
})
