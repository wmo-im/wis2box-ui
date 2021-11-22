// i18n
import { createI18n } from "vue-i18n";

const messages = {
  en: {
    $vuetify: {
      nagivation: {
        homepage: "Homepage",
        plot: "Plot",
        catalogue: "Catalogue",
        service_monitor: "Service Monitor",
        documentation: "Documentation",
      },
      footer: {
        poweredby: "Powered by"
      },
      messages: {
        welcome: "Welcome to WIS 2.0 node in box!",
      },
    },
  },
  fr: {
    $vuetify: {
      navigation: {
        homepage: "Page d'accueil",
        plot: "Graphique",
        catalogue: "Catalogue",
        service_monitor: "Moniteur de service",
        documentation: "Documentation",
      },
      footer: {
        poweredby: "Alimenté par"
      },
      messages: {
        welcome: "Bienvenue dans le nud WIS 2.0 dans la boîte !",
      },
    },
  },
  es: {
    $vuetify: {
      navigation: {
        homepage: "Página Principal",
        plot: "Gráfico",
        catalogue: "Catálogo",
        service_monitor: "Monitor de servicio",
        documentation: "Documentación",
      },
      footer: {
        poweredby: "Desarrollada por"
      },
      messages: {
        welcome: "¡Bienvenido al nodo WIS 2.0 en caja!",
      },
    }
  },
};

let i18n_config = {
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  defaultLocale: "en",
  fallbackLocale: "fr",
  globalInjection: true,
  messages,
};

export { i18n_config };

export default createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: "en",
  fallbackLocale: "fr",
  globalInjection: true,
  messages,
});
