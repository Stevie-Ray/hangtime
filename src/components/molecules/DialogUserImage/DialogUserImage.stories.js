import './DialogUserImage.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, object, boolean } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import DialogUserImage from './DialogUserImage'

export default {
  title: 'Molecules|DialogUserImage',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    dialog: {
      type: Boolean,
      default: boolean('dialog', true)
    },
    user: {
      default: object('user', {
        photoURL: 'https://thispersondoesnotexist.com/image',
        displayName: 'Person Does Not Exist'
      })
    }
  },
  components: { DialogUserImage },
  methods: {
    input: action('input')
  },
  template: `<dialog-user-image :data="user" :value="dialog" @input="input">
  </dialog-user-image>`
})
