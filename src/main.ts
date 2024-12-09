import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { createPinia } from 'pinia'
import { i18n } from '@/locales/i18n'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { useI18n } from 'vue-i18n'

const app = createApp(App)

const wis2boxLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#014e9e',
    secondary: '#75b942',
    accent: '#d5e3f0',
    warning: '#f8a700',
    error: '#B00020',
  },
}

const wis2boxDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#01aad3',
    secondary: '#75b942',
    accent: '#d5e3f0',
    warning: '#f8a700',
    error: '#B00020',
  },
}

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      wis2boxLightTheme,
      wis2boxDarkTheme,
    },
    defaultTheme: 'wis2boxLightTheme',
  },
  locale: {
    adapter: createVueI18nAdapter({
      i18n,
      useI18n,
    }),
  },
})

const pinia = createPinia()
app.use(pinia).use(i18n).use(vuetify).use(router)

app.mount('#app')
