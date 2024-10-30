// global.d.ts
export {}

// Adds proper type definitions for global variables that
// we load via the environment variable env.js file in the public folder
declare global {
  interface Window {
    VUE_APP_URL: string // URL for the frontend itself
    VUE_APP_BASEMAP_URL: string // URL to the base map
    VUE_APP_OAPI: string // API URL to the wis2box API
    VUE_APP_BASEMAP_ATTRIBUTION: string // Attribution text displayed at the bottom of the base map
    VUE_APP_LANG: string // What language to use in the UI
    VUE_APP_WAF: string
    VUE_APP_CLUSTER: boolean
  }
}
