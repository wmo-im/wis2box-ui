// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

// i18n
import { i18n_config } from "../locales/i18n";
// import { createVueI18nAdapter } from 'vuetify/locale/adapters'
// import { useI18n } from 'vue-i18n'

export default createVuetify({
  icons: {
    iconfont: "mdi" || "md",
  },
  theme: {
    dark: false,
  },
  themes: {
    light: {
      primary: "#4682b4",
      secondary: "#b0bec5",
      accent: "#8c9eff",
      error: "#b71c1c",
    },
  },
  locale: i18n_config,
  // locale: createVueI18nAdapter({ // Pending https://github.com/vuetifyjs/vuetify/issues/14408
  //   i18n,
  //   useI18n
  // }),
});
