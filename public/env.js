// env.js sets global environment variables for the application
// to override these in your application, change these values or mount
// a new env.js file into your docker container

window.VUE_APP_LANG = 'en'
window.VUE_APP_BASEMAP_ATTRIBUTION =
  '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors}'
window.VUE_APP_URL = 'localhost:5173'
