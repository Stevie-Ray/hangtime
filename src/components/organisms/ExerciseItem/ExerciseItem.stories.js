import ExerciseItem from './ExerciseItem'

export default {
  title: 'Components/Organisms/ExerciseItem',
  component: ExerciseItem,
  argTypes: {
    id: {
      control: 'text',
      table: { category: 'Attributes' },
      description: 'id',
      type: 'string'
    },
    index: {
      control: 'number',
      table: { category: 'Attributes' },
      description: 'index',
      type: 'number'
    },
    editWorkout: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'editWorkout',
      type: 'boolean'
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { ExerciseItem },
  props: Object.keys(argTypes),
  template: `<exercise-item :id="id" :index="index" :edit-workout="editWorkout" class="exercise-item"/>`
})

export const Common = Template.bind({})

Common.args = { editWorkout: true, index: 1 }
