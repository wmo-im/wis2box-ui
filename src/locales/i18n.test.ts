import { describe, it, expect } from 'vitest'
import { loadLocale } from './i18n'

describe('i18n', () => {
  it('loads translations', () => {
    const locales = loadLocale()
    expect(locales['en']).toBeDefined()
    expect(locales['fr']).toBeDefined()

    expect(locales['en'].language).toBe('English')
    expect(locales['fr'].language).toBe('Français')
  })
})
