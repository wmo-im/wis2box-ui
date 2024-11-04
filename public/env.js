/// env.js sets global environment variables for the entire application. It is static and does not change
/// at build time since it is inside the public/ folder.
/// To override these in your application, change these values or if deploying with Docker mount
/// a new env.js file into your docker container

window.VUE_APP_LANG = 'en' // what language to use when translating with i18n
window.VUE_APP_BASEMAP_ATTRIBUTION =
  '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors}'

// by default use a local proxy when testing locally. This can be achieved with a tool like https://github.com/garmeeh/local-cors-proxy
// i.e. running -> lcp --proxyUrl "https://wis2box.kma.go.kr/"
window.VUE_APP_OAPI = 'http://localhost:8010/proxy/oapi' // backend to use for wis2box
window.VUE_APP_BASEMAP_URL =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

window.VUE_APP_WAF = `${window.VUE_APP_OAPI}/data/`
