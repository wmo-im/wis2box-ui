// i18n
import { createI18n } from "vue-i18n";

function loadLocale() {
  const locales = require.context(".", true, /[\w-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([\w-_]+)\./i);
    if (matched && matched.length > 1 && matched[1] !== "_template") {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

export { loadLocale };

export default createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: "en",
  fallbackLocale: "fr",
  globalInjection: true,
  messages: loadLocale(),
});
