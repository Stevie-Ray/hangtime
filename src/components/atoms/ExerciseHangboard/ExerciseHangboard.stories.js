import ExerciseHangboard from './ExerciseHangboard'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Atoms/ExerciseHangboard',
  component: ExerciseHangboard,
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
  components: { ExerciseHangboard },
  setup() {
    return { args }
  },
  template: '<exercise-hangboard v-bind="args"/>'
})
// 👇 Each story then reuses that template
export const Primary = Template.bind({})
Primary.args = { background: '#ff0', label: 'Button' }

export const Secondary = Template.bind({})
Secondary.args = { ...Primary.args, label: '😄👍😍💯' }

export const Tertiary = Template.bind({})
Tertiary.args = { ...Primary.args, label: '📚📕📈🤓' }
