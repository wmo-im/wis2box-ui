// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

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
});
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
