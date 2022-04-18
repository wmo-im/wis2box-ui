<template id="select-locale">
  <div class="select-locale">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn color="#FFFFFF" class="font-weight-bold" v-bind="props">
          {{ $t('language') }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(name, lang) in languages"
          :key="`lang-${name}`"
          @click="$i18n.locale = lang"
        >
          <v-list-item-title>{{ name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
// https://www.digitalocean.com/community/tutorials/vuejs-vue-with-i18n
import { loadLocale } from "@/locales/i18n";
import { defineComponent } from "vue";

export default defineComponent({
  name: "SelectLocale",
  template: "#select-locale",
  computed: {
    languages: function () {
      const temp = {};
      for (const [key, value] of Object.entries(loadLocale())) {
        temp[key] = value.language;
      }
      return temp;
    },
  },
});
</script>
