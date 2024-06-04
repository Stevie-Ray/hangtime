import { createI18n } from 'vue-i18n'
import defaultMessages from '@/i18n/en-US.json'

const defaultLocale = 'en-US'

const i18n = createI18n({
  legacy: false, // use composition mode
  locale: defaultLocale, // set locale
  fallbackLocale: defaultLocale
  // If you need to specify other options, you can set other options
  // ...
  // missingWarn: false,
  // fallbackWarn: false,
  // silentTranslationWarn: true
})

i18n.global.setLocaleMessage(defaultLocale, defaultMessages)

const loadedLanguages = ['en-US'] // our default language that is preloaded

function setI18nLanguage(locale) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    i18n.global.locale.value = locale
  }
  const htmlLang = locale.slice(0, 2)
  document.querySelector('html')?.setAttribute('lang', htmlLang)
}

export async function loadLanguageAsync(locale: string) {
  // If the same language or already loaded
  if (i18n.global.locale === locale || loadedLanguages.includes(locale)) {
    return setI18nLanguage(locale)
  }
  // If the language hasn't been loaded yet
  const modules = import.meta.glob('@/i18n/*.json')
  const loadLanguage = async (path) => {
    try {
      const messages = await modules[path]()
      i18n.global.setLocaleMessage(locale, messages.default)
      loadedLanguages.push(locale)
      return setI18nLanguage(locale)
    } catch (error) {
      console.error(`Error loading language ${locale}:`, error)
      // Handle the error as needed
      return Promise.reject(error)
    }
  }

  const matchingPaths = Object.keys(modules).filter((path) => path.includes(locale))

  if (matchingPaths.length === 0) {
    console.warn(`No matching language files found for locale: ${locale}`)
    return Promise.reject(new Error(`No matching language files found for locale: ${locale}`))
  }

  // Load the first matching language file
  return loadLanguage(matchingPaths[0])
}

export default i18n
