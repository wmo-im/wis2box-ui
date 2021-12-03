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
// https://www.digitalocean.com/community/tutorials/vuejs-vue-with-i18n
import { loadLocale } from "../locales/i18n";
import { defineComponent } from "vue";

export default defineComponent({
  name: "SelectLocale",
  template: "#select-locale",
  data: function () {
    return {
      langs: Object.keys(loadLocale()),
    };
  },
});
</script>
