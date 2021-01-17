import './Button.stories.scss'
// import { action } from "@storybook/addon-actions";
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, text, boolean } from '@storybook/addon-knobs'
import Button from './Button'

export default {
  title: 'Example|Button',
  decorators: [withKnobs]
}

export const Example = () => ({
  props: {
    name: {
      type: String,
      default: text('Name', 'MyButton!')
    },
    isLoading: {
      type: Boolean,
      default: boolean('isLoading', true)
    }
  },
  components: { Button },
  template: `<Button :name="name" :isLoading="isLoading">Click Me!</Button>`
})
