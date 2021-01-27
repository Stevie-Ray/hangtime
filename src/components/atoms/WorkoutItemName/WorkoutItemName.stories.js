import WorkoutItemName from './WorkoutItemName'

export default {
  title: 'Components/Atoms/WorkoutItemName',
  component: WorkoutItemName,
  argTypes: {
    workout: {
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
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { WorkoutItemName },
  props: Object.keys(argTypes),
  template: `<workout-item-name :data="workout"/>`
})

export const Common = Template.bind({})

Common.args = {}
