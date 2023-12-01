// import VueI18n from 'vue-i18n'
import { createI18n } from 'vue-i18n'

import { languages, defaultLocale } from '@/plugins/i18n/languages'

// 2. Create i18n instance with options
const index = createI18n({
  legacy: false, // use composition mode
  locale: defaultLocale, // set locale
  fallbackLocale: defaultLocale, // set fallback locale
  messages: Object.assign(languages), // set locale messages
  // If you need to specify other options, you can set other options
  // ...
  missingWarn: false,
  fallbackWarn: false,
  silentTranslationWarn: true
})

export default index
