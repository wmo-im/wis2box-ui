<template>
  <div>
    <select v-model="$i18n.locale">
      <option v-for="(lang, i) in langs" :key="`lang-${i}`" :value="lang">
        <v-btn class="mx-2" outlined rounded> 
          <v-icon dark> mdi-web </v-icon> {{ lang }} 
        </v-btn>
      </option>
    </select>
  </div>
</template>

<script>
import { messages } from "../locales/i18n";
// https://www.digitalocean.com/community/tutorials/vuejs-vue-with-i18n

export default {
  name: "SelectLocale",
  data() {
    return {
      langs: Object.keys(messages),
    };
  },
};
</script>
