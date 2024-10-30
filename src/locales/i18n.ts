// i18n.ts
import { createI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MessageSchema = { [key: string]: any }

export function loadLocale(): Record<string, MessageSchema> {
  const locales = import.meta.glob<MessageSchema>('./*.json', { eager: true })
  const messages: Record<string, MessageSchema> = {}

  for (const path in locales) {
    const matched = path.match(/\.\/([\w-_]+)\.json$/i)
    if (matched && matched.length > 1 && matched[1] !== '_template') {
      const locale = matched[1]
      messages[locale] = locales[path]
    }
  }

  return messages
}

const messages = loadLocale()

export default createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale:
    messages[window.VUE_APP_LANG as string] !== undefined
      ? (window.VUE_APP_LANG as string)
      : 'en',
  fallbackLocale: 'fr',
  globalInjection: true,
  messages: messages,
})
