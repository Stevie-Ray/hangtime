import AppContainer from './AppContainer'

export default {
  title: 'Components/Molecules/AppContainer',
  component: AppContainer,
  argTypes: {
    className: {
      defaultValue: ''
    },
    tabName: {
      name: 'tab-name',
      type: { name: 'string', required: false },
      defaultValue: '',
      description: 'demo description'
    }
  }
}

const Template = (args, { argTypes }) => ({
  components: { AppContainer },
  props: Object.keys(argTypes),
  template: `<app-container class-name="test" :tab-name="tabName"/>`
})

export const Common = Template.bind({})

Common.args = { tabName: 'Common' }

export const Icons = Template.bind({})

Icons.template = `<app-container class-name="test" tab-name="tabName"><v-btn v-if="networkOnLine" class="button-logout" icon @click="logout">
        <v-icon>T</v-icon>
      </v-btn></app-container>`
Icons.args = { tabName: 'Icons' }
