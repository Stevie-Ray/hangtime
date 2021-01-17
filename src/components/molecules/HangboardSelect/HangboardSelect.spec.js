import { shallowMount } from '@vue/test-utils'
import HangboardSelect from './HangboardSelect.vue'

describe('ExerciseListItem.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(HangboardSelect)
    expect(component.contains('.new-content-available')).toBe(true)
  })
})
