// import './ExerciseListItem.stories.scss'
// // eslint-disable-next-line import/no-extraneous-dependencies
// import { withKnobs, boolean, number, object } from '@storybook/addon-knobs'
// // eslint-disable-next-line import/no-extraneous-dependencies
// import { action } from '@storybook/addon-actions'
// import ExerciseListItem from './ExerciseListItem'
//
// export default {
//   title: 'Molecules/ExerciseListItem',
//   decorators: [withKnobs]
// }
//
// export const Default = () => ({
//   props: {
//     index: {
//       type: Number,
//       default: number('index', 1)
//     },
//     disableActions: {
//       type: Boolean,
//       default: boolean('disableAction', false)
//     },
//     editWorkout: {
//       type: Boolean,
//       default: boolean('editWorkout', true)
//     }
//   },
//   components: { ExerciseListItem },
//   methods: {
//     input: action('input')
//   },
//   template: `
//   </exercise-list-item>`
// })
import ExerciseListItem from './ExerciseListItem'

export default {
  title: 'Components/Molecules/ExerciseListItem',
  component: ExerciseListItem,
  argTypes: {
    data: {
      control: 'object',
      table: {
        category: 'Attributes'
      },
      defaultValue: {
        exercise: 1,
        grip: 1,
        hold: 20,
        left: 1,
        level: 1,
        pause: 10,
        pullups: 5,
        repeat: 2,
        rest: 3,
        right: 1,
        time: 80,
        weight: 10
      }
    },
    index: {
      control: 'number',
      table: { category: 'Attributes' },
      description: 'index',
      type: 'number'
    },
    disableActions: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'disableAction',
      type: 'boolean'
    },
    editWorkout: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'editWorkout',
      type: 'boolean'
    },
    input: {
      action: 'input',
      table: { category: 'Events' }
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { ExerciseListItem },
  props: Object.keys(argTypes),
  template: `<exercise-list-item :data="data" :index="index" :disable-actions="disableActions" :edit-workout="editWorkout"/>`
})

export const Common = Template.bind({})

Common.args = { editWorkout: true }
