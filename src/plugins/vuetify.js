// Styles
// import "@mdi/font/css/materialdesignicons.css";
// import "vuetify/styles";
// import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

// Vuetify
import { createVuetify } from "vuetify";

// i18n
import i18n from "../locales/i18n";
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import { useI18n } from 'vue-i18n';

export default createVuetify({
  // icons: {
  //   defaultSet: "mdi",
  //   aliases,
  //   sets: {
  //     mdi,
  //   },
  // },
  theme: {
    themes: {
      light: {
        dark: false,
        primary: "#014e9e",
        secondary: "#75b942",
        accent: "#d5e3f0",
        warning: "#f8a700",
        error: "#B00020"
      },
      dark: {
        light: false,
        primary: "#01aad3",
        secondary: "#75b942",
        accent: "#d5e3f0",
        warning: "#f8a700",
        error: "#B00020"
      },
    }
  },
  locale: createVueI18nAdapter({
    i18n,
    useI18n
  }),
});
