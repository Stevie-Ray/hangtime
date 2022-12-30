import WorkoutCommunityFilter from './WorkoutCommunityFilter'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Molecules/WorkoutCommunityFilter',
  component: WorkoutCommunityFilter,
  args: {
    exercise: {
      control: 'object',
      table: {
        category: 'Attributes'
      },
      defaultValue: {
        left: 1,
        right: 1
      }
    }
  }
}
// 👇 We create a “template” of how args map to rendering
const Template = (args) => ({
  components: { WorkoutCommunityFilter },
  setup() {
    return { args }
  },
  template: '<dialog-workout-community-filter v-bind="args"/>'
})
// 👇 Each story then reuses that template
export const Default = Template.bind({})
Default.args = {}
