import { shallowMount } from '@vue/test-utils'
import WorkoutShare from './WorkoutShare.vue'

describe('WorkoutShare.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(WorkoutShare)
    expect(component.contains('.workout-share')).toBe(true)
  })
})
