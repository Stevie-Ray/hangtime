import { shallowMount } from '@vue/test-utils'
import WorkoutSubscribe from './WorkoutSubscribe.vue'

describe('WorkoutSubscribe.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(WorkoutSubscribe)
    expect(component.contains('.workout-subscribe')).toBe(true)
  })
})
