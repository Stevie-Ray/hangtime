import { shallowMount } from '@vue/test-utils'
import DialogWalkthrough from './DialogWalkthrough.vue'

describe('DialogWalkthrough.vue', () => {
  it('renders a component', () => {
    const component = shallowMount(DialogWalkthrough)
    expect(component.contains('.dialog-walkthrough')).toBe(true)
  })
})
