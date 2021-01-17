import './Hangboard.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs } from '@storybook/addon-knobs'
import Hangboard from './Hangboard'

export default {
  title: 'Atoms|Hangboard',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {},
  components: { Hangboard },
  methods: {},
  template: `<hangboard></hangboard>`
})
