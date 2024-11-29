// i18n.ts
import { createI18n } from 'vue-i18n'

type languageAbbreviation = 'en' | 'fr' | 'zh' | 'ru' | 'es' | 'ar'

type i18nSchema =
  // there can be a category nesting the translation
  | Record<string, Record<string, string>>
  // or there can be a flat mapping of one english word to a translation
  | Record<string, string>

export function loadLocale(): Record<languageAbbreviation, i18nSchema> {
  const locales = import.meta.glob<i18nSchema>('./*.json', { eager: true })
  const messages: Record<string, i18nSchema> = {}

  for (const path in locales) {
    const matched = path.match(/\.\/([\w-_]+)\.json$/i)
    if (matched && matched.length > 1 && matched[1] !== '_template') {
      const locale = matched[1]
      messages[locale] = locales[path]
    }
  }

  return messages
}

const locales = loadLocale()

export default createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: locales[window.VUE_APP_LANG as languageAbbreviation]
    ? window.VUE_APP_LANG
    : 'en',
  fallbackLocale: 'fr',
  globalInjection: true,
  messages: locales,
})
