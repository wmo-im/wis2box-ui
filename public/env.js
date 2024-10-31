// env.js sets global environment variables for the application
// to override these in your application, change these values or mount
// a new env.js file into your docker container

window.VUE_APP_LANG = 'en'
window.VUE_APP_BASEMAP_ATTRIBUTION =
  '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors}'
window.VUE_APP_URL = 'http://localhost:5173'
// by default use a local proxy when testing locally. This can be achieved with a tool like https://github.com/garmeeh/local-cors-proxy
window.VUE_APP_OAPI = 'http://localhost:8010/proxy'
window.VUE_APP_BASEMAP_URL =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
