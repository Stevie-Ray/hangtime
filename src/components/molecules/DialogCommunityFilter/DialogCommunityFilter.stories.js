import './DialogCommunityFilter.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean } from '@storybook/addon-knobs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'
import DialogCommunityFilter from './DialogCommunityFilter'

export default {
  title: 'Molecules|DialogCommunityFilter',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    filterDialog: {
      type: Boolean,
      default: boolean('filterDialog', true)
    }
  },
  components: { DialogCommunityFilter },
  methods: {
    input: action('input')
  },
  template: `<dialog-community-filter :value="filterDialog" @input="input">
  </dialog-community-filter>`
})
