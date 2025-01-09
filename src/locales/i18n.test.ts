import { describe, it, expect } from 'vitest'
import { loadLocale } from './i18n'
import template from '../locales/_template.json'

describe('i18n', () => {
  it('loads translations', () => {
    const locales = loadLocale()
    expect(locales['en']).toBeDefined()
    expect(locales['fr']).toBeDefined()

    expect(locales['en'].language).toBe('English')
    expect(locales['fr'].language).toBe('Français')
  })

  it('has the same keys for each locale', () => {

      // recursively get all keys from an object, but not the final object
    const getKeys = (obj: Record<string, unknown>) => {
      const keys = Object.keys(obj)

      // if "default" is present, remove it. the default key is added due to vite glob imports adding a default export
      // we want to ignore this since it isnt a user facing key
      if (keys.includes('default')) {
        keys.splice(keys.indexOf('default'), 1)
      }
  
      const allKeys = keys.filter(key => typeof obj[key] === 'object' && obj[key] !== null)
      for (const nestedKey of allKeys) {
        keys.push(...getKeys(obj[nestedKey] as Record<string, unknown>).map(subKey => `${nestedKey}.${subKey}`))      }
      return keys
    }

    const templateKeys = getKeys(template)

    const locales = loadLocale()

    for (const [locale, localeObject] of Object.entries(locales)) {
      const localeKeys = getKeys(localeObject)
      expect(localeKeys.sort(), `Missing keys in ${locale}`).toEqual(templateKeys.sort())
    }
  })
})


