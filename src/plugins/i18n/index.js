// import VueI18n from 'vue-i18n'
import { createI18n } from 'vue-i18n'

// 1. Ready translated locale messages
// The structure of the locale message is the hierarchical object structure with each locale as the top property
function loadLocaleMessages() {
  const locales = require.context('@/i18n', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

// 2. Create i18n instance with options
const index = createI18n({
  legacy: false, // use composition mode
  locale: 'en-US', // set locale
  fallbackLocale: 'en-US', // set fallback locale
  messages: loadLocaleMessages(), // set locale messages
  // If you need to specify other options, you can set other options
  // ...
  missingWarn: false,
  fallbackWarn: false,
  silentTranslationWarn: true
})

export default index
