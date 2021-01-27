import WorkoutList from './WorkoutList'

export default {
  title: 'Components/Organisms/WorkoutList',
  component: WorkoutList,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  components: { WorkoutList },
  props: Object.keys(argTypes),
  template: `<workout-list class="workout-list"></workout-list>`
})

export const Common = Template.bind({})
