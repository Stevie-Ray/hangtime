import './Hangboard.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { object, withKnobs } from '@storybook/addon-knobs'
import Hangboard from './Hangboard'

export default {
  title: 'Atoms|Hangboard',
  decorators: [withKnobs]
}

export const Default = () => ({
  props: {
    user: {
      type: Object,
      default: object('user', {
        settings: {
          selected: 1,
          hangboards: [
            {
              company: 1,
              hangboard: 0
            },
            {
              company: 1,
              hangboard: 1
            }
          ]
        }
      })
    },
    data: {
      type: Object,
      default: object('data', {
        left: 0,
        right: 0
      })
    }
  },
  components: { Hangboard },
  methods: {},
  template: `<hangboard :user="user" :data="data"></hangboard>`
})
