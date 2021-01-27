import NewContentAvailable from './NewContentAvailable'

export default {
  title: 'Components/Molecules/NewContentAvailable',
  component: NewContentAvailable,
  argTypes: {
    newContentAvailable: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'newContentAvailable',
      type: 'boolean'
    },
    refreshingApp: {
      control: 'boolean',
      table: { category: 'Attributes' },
      description: 'refreshingApp',
      type: 'boolean'
    },
    serviceWorkerSkipWaiting: {
      action: 'service-worker-skip-waiting',
      table: { category: 'Events' }
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { NewContentAvailable },
  props: Object.keys(argTypes),
  template: `<new-content-available
        v-if="newContentAvailable"
        class="new-content-available"
        :refreshing-app="refreshingApp"
        @refresh="serviceWorkerSkipWaiting"/>`
})

export const Common = Template.bind({})

Common.args = { newContentAvailable: true }
