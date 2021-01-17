import { shallowMount } from '@vue/test-utils'
import DialogAddProgress from './DialogAddProgress.vue'

describe('DialogAddProgress.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(DialogAddProgress)
    expect(component.contains('.dialog-add-progress')).toBe(true)
  })
})
