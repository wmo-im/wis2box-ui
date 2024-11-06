// global.d.ts
export {}

import languageAbbreviation from '@/locales/i18n'

// Type definitions for global variables that
// we load via the environment variable env.js file in the public folder
// and then access them via the global window object
declare global {
  interface Window {
    VUE_APP_URL: string // URL for the frontend itself
    VUE_APP_BASEMAP_URL: string // URL to the base map
    VUE_APP_OAPI: string // API URL to the wis2box API
    VUE_APP_BASEMAP_ATTRIBUTION: string // Attribution text displayed at the bottom of the base map
    VUE_APP_LANG: languageAbbreviation // The language to use in the UI
    VUE_APP_WAF: string
    VUE_APP_CLUSTER: boolean // cluster the stations on the map instead of having each one as a separate marker
  }
}
