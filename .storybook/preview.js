// Imports
import Vue from 'vue'
import Vuetify from 'vuetify'
import options from '@/misc/theme'
import StoryRouter from './addon-router'

// Theme
import '@/theme/global.scss'

// Vuetify
import 'vuetify/dist/vuetify.min.css'
import '@mdi/js'

Vue.use(Vuetify)

// Vue i18n
import i18n from '@/misc/i18n'

// Import Vue plugins
import Vuex from 'vuex'
import store from '@/store'
import router from '../src/router'

Vue.use(Vuex)
Vue.prototype.$store = store

// this was the only thing here by default
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' }
}

// Custom decorator
export const decorators = [
  (story, context) => {
    // wrap the passed component within the passed context
    const wrapped = story(context)
    // extend Vue to use Vuetify around the wrapped component
    return Vue.extend({
      router,
      store,
      vuetify: new Vuetify(options),
      i18n,
      components: { wrapped },
      props: {
        dark: {
          type: Boolean,
          default: context.args.dark
        },
        locale: {
          type: String,
          default: 'nl-NL'
        }
      },
      watch: {
        dark: {
          immediate: true,
          handler(val) {
            this.$vuetify.theme.dark = val
          }
        },
        locale: {
          immediate: true,
          handler(val) {
            this.$i18n.locale = val
          }
        }
      },
      template: `
        <v-app>
          <v-container fluid>
            <wrapped />
          </v-container>
        </v-app>
      `
    })
  },
  StoryRouter()
]
