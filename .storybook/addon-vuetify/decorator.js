// Imports
import Vue from 'vue'
import Vuetify from 'vuetify'
import { makeDecorator } from '@storybook/addons'

// Utilities
import deepmerge from 'deepmerge'

// Vuetify
import 'vuetify/dist/vuetify.min.css'
import '@mdi/js'

Vue.use(Vuetify)

// Import Vue plugins
import Vuex from 'vuex'
import opts from '@/misc/theme'
import store from '@/store'

Vue.use(Vuex)
Vue.prototype.$store = store

export default makeDecorator({
  name: 'withVuetify',
  parameterName: 'vuetify',
  wrapper: (storyFn, context, { parameters = opts }) => {
    // Reduce to one new URL?
    const searchParams = new URL(window.location).searchParams
    const dark = searchParams.get('eyes-variation') === 'dark'
    const rtl = searchParams.get('eyes-variation') === 'rtl'
    const vuetify = new Vuetify(
      deepmerge(
        {
          rtl,
          theme: { dark }
        },
        parameters
      )
    )
    const WrappedComponent = storyFn(context)

    return Vue.extend({
      vuetify,
      components: { WrappedComponent },
      template: `
        <v-app id="app">
          <v-container fluid>
            <wrapped-component />
          </v-container>
        </v-app>
      `
    })
  }
})
