import Hangboard from './Hangboard'

export default {
  title: 'Components/Atoms/Hangboard',
  components: Hangboard,
  argTypes: {
    classes: {
      control: {
        type: 'select',
        options: ['']
      },
      table: {
        category: 'CSS Modifiers'
      }
    },
    editWorkout: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'editWorkout',
      type: 'boolean'
    },
    user: {
      control: 'object',
      table: {
        category: 'Attributes'
      },
      defaultValue: {
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
      }
    },
    selected: {
      control: 'object',
      table: {
        category: 'Attributes'
      },
      defaultValue: {
        left: 0,
        right: 0
      }
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { Hangboard },
  props: Object.keys(argTypes),
  template: `<hangboard :class="classes" :edit-workout="editWorkout" :user="user" :data="selected"></hangboard>`
})

export const Common = Template.bind({})

Common.args = {}
