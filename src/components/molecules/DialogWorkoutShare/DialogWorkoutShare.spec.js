import { shallowMount } from '@vue/test-utils'
import DialogWorkoutShare from './DialogWorkoutShare.vue'

describe('DialogWorkoutShare.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(DialogWorkoutShare)
    expect(component.contains('.dialog-workout-share')).toBe(true)
  })
})
