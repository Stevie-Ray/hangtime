import ExerciseList from './ExerciseList'

export default {
  title: 'Components/Organisms/ExerciseList',
  component: ExerciseList,
  argTypes: {
    id: {
      control: 'text',
      table: { category: 'Attributes' },
      description: 'id',
      type: 'string'
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
  components: { ExerciseList },
  props: Object.keys(argTypes),
  template: `<exercise-list :id="id" :edit-workout="editWorkout" class="exercise-list"/>`
})

export const Common = Template.bind({})

Common.args = { editWorkout: true }
