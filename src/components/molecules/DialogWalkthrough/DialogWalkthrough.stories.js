import './DialogWalkthrough.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import DialogWalkthrough from './DialogWalkthrough'

export default {
  title: 'Molecules|DialogWalkthrough',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    dialog: {
      type: Boolean,
      default: boolean('dialog', true)
    }
  },
  components: { DialogWalkthrough },
  methods: {
    input: action('input')
  },
  template: `<dialog-walkthrough :value="dialog" @input="input">
  </dialog-walkthrough>`
})
