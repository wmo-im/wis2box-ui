import "vuetify/styles";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import i18n from "./locales/i18n";
import axios from "axios";
import VueAxios from "vue-axios";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(i18n)
  .use(VueAxios, axios)
  .mount("#wis2box-ui-app");
