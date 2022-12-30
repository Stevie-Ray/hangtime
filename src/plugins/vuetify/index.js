// Styles
import '@mdi/font/css/materialdesignicons.css'
// import 'vuetify/styles'
import './main.scss'
// Vuetify
import { createVuetify } from 'vuetify'
// Material Design 3
import { md3 } from 'vuetify/blueprints'

export default createVuetify({
  blueprint: md3,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#012E40',
          secondary: '#366D73',
          tertiary: '#5A8C8C',
          accent: '#BCBFA4'
        }
      },
      dark: {
        colors: {
          primary: '#BCBFA4',
          secondary: '#BCBFA4',
          tertiary: '#BCBFA4',
          accent: '#BCBFA4'
        }
      }
    }
  }
})
