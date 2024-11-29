/// env.js sets global environment variables for the entire application. It is static and does not change
/// at build time since it is inside the public/ folder.
/// To override these in your application, change these values in this file directly or if deploying with Docker, 
/// set the proper environment variables. The dockerfile will then use entrypoint.sh and override this file at runtime

window.VUE_APP_LANG = 'en' // what language to use when translating with i18n
window.VUE_APP_BASEMAP_ATTRIBUTION =
  '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors}'

window.VUE_APP_URL = 'http://localhost:5173' // the base url for the frontend

// by default use a local proxy when testing locally. This can be achieved with a tool like https://github.com/garmeeh/local-cors-proxy
// i.e. running -> lcp --proxyUrl "https://wis2box.kma.go.kr/"
window.VUE_APP_OAPI = 'http://localhost:8010/proxy/oapi' // backend to use for wis2box
window.VUE_APP_BASEMAP_URL =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' // pattern to use when fetching openstreetmap tiles

window.VUE_APP_WAF = `${window.VUE_APP_URL}/data/` // endpoint that describes the s3 ListBucketResult and its associated metadata 
window.VUE_APP_CLUSTER = false // cluster the stations on the map instead of having each one as a separate marker
