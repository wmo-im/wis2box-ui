// Styles
// import "@mdi/font/css/materialdesignicons.css";
// import "vuetify/styles";
// import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

// Vuetify
import { createVuetify } from "vuetify";

// i18n
import { loadLocale } from "../locales/i18n";
// import { createVueI18nAdapter } from 'vuetify/locale/adapters'
// import { useI18n } from 'vue-i18n'

export default createVuetify({
  // icons: {
  //   defaultSet: "mdi",
  //   aliases,
  //   sets: {
  //     mdi,
  //   },
  // },
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
  locale: {
    legacy: false, // Vuetify does not support the legacy mode of vue-i18n
    defaultLocale: "en",
    fallbackLocale: "en",
    globalInjection: true,
    messages: loadLocale(),
  },
  // locale: createVueI18nAdapter({ // Pending https://github.com/vuetifyjs/vuetify/issues/14408
  //   i18n,
  //   useI18n
  // }),
});
