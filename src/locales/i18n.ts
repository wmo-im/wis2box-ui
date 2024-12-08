import { createI18n } from 'vue-i18n'
import template from "@/locales/_template.json";

// all languages that can be used in translation
type languageAbbreviation = 'en' | 'fr' | 'zh' | 'ru' | 'es' | 'ar'

// i18n schema represents the structure of the translation files
type i18nSchema =
  // there can be a category nesting the translation
  | Record<string, Record<string, string>>
  // or there can be a flat mapping of one english word to a translation
  | Record<string, string>

export function loadLocale(): Record<languageAbbreviation, i18nSchema> {
  const importedJSONTranslations = import.meta.glob<i18nSchema>('./*.json', { eager: true })
  const messages: Record<string, i18nSchema> = {}

  for (const path in importedJSONTranslations) {
    const matched = path.match(/\.\/([\w-_]+)\.json$/i)
    if (matched && matched.length > 1 && matched[1] !== '_template') {
      const locale = matched[1]
      messages[locale] = importedJSONTranslations[path]
    }
  }

  return messages
}

// Load all translation files at startup
const locales = loadLocale()

export const i18n = createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: locales[window.VUE_APP_LANG as languageAbbreviation]
    ? window.VUE_APP_LANG
    : 'en',
  fallbackLocale: 'fr',
  globalInjection: true,
  messages: locales,
})

// NestedKey is a type which validates the nested keys of an object using dot notation
// i.e. if the object is { a: { b: { c: 1 } } } then NestedKey<{ a: { b: { c: 1 } } }> is 'a.b.c'
type NestedKey<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
      // recursively define the type of the nested key
        ? `${K}` | `${K}.${NestedKey<T[K]>}`
        // base case
        : `${K}`;
    }[keyof T & string]
  // if the object is not an object it should be valid to index into
  : never;


/**
 * Translate a given message using the global i18n instance
 *
 * @param key - The key to translate. The key is expected to be a nested key of the i18n template, using
 * dot notation. For example, if the template is { a: { b: { c: 1 } } } then the key can be 'a.b.c'.
 * @returns The translated string.
 *
 * @example
 * const translatedString = t('a.b.c')
 */
export function t(message: NestedKey<typeof template>) {
  return i18n.global.t(message)
}
