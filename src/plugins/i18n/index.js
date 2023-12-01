import { createI18n } from 'vue-i18n'
import defaultMessages from '@/i18n/en-US.json'

const i18n = createI18n({
  legacy: false, // use composition mode
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages: defaultMessages, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
  missingWarn: false,
  fallbackWarn: false,
  silentTranslationWarn: true
})

const loadedLanguages = ['en'] // our default language that is preloaded

function setI18nLanguage(locale) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    i18n.global.locale.value = locale
  }
  document.querySelector('html').setAttribute('lang', locale)
}

export async function loadLanguageAsync(locale) {
  // If the same language
  if (i18n.global.locale === locale) {
    return Promise.resolve(setI18nLanguage(locale))
  }
  // If the language was already loaded
  if (loadedLanguages.includes(locale)) {
    return Promise.resolve(setI18nLanguage(locale))
  }

  // If the language hasn't been loaded yet
  return await import(/* @vite-ignore */ `/src/i18n/${locale}.json`).then((messages) => {
    i18n.global.setLocaleMessage(locale, messages.default)
    loadedLanguages.push(locale)
    return setI18nLanguage(locale)
  })
}

export default i18n
