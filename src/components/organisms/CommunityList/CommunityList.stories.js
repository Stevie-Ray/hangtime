import './CommunityList.stories.scss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { object, array } from '@storybook/addon-knobs'
import CommunityList from './CommunityList'

export default {
  title: 'Organisms|CommunityList'
}

export const Default = () => ({
  props: {
    user: {
      type: Object,
      default: object('user', {
        company: 1,
        hangboard: 1,
        settings: {
          selected: 0
        }
      })
    },
    workouts: {
      type: Array,
      default: array('workouts', [
        {
          company: 1,
          description: 'Storybook',
          exercises: [
            {
              exercise: 0,
              hold: 20,
              left: 1,
              level: 0,
              pause: 10,
              pullups: 0,
              repeat: 2,
              rest: 3,
              right: 1,
              time: 80
            }
          ],
          hangboard: 0,
          level: 1,
          name: 'Storybook',
          share: true,
          time: 100
        }
      ])
    }
  },
  components: { CommunityList },
  template: `<community-list class="community-list"></community-list>`
})
