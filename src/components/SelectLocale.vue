<template>
  <div id="select-locale">
    <select v-model="$i18n.locale">
      <option v-for="(lang, i) in langs" :key="`lang-${i}`" :value="lang">
        <v-btn class="mx-2" outlined rounded>
          {{ lang }}
        </v-btn>
      </option>
    </select>
  </div>
</template>

<script>
import { loadLocale } from "../locales/i18n";
// https://www.digitalocean.com/community/tutorials/vuejs-vue-with-i18n

export default {
  name: "SelectLocale",
  template: "#select-locale",
  data() {
    return {
      langs: Object.keys(loadLocale()),
    };
  },
};
</script>
