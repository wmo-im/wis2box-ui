<!-- TODO: If arabic is selected, the settings drop down disappears. This appears to be an issue with arabic specifically -->

<template id="select-locale">
  <div class="select-locale">
    <v-menu location="start">
      <template v-slot:activator="{ props }">
        <v-btn block variant="text" :color="color" class="font-weight-bold" v-bind="props">
          <v-icon icon="mdi-web" />&nbsp;{{ $t('code') }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="language in Object.keys(languages)" :key="`lang-${language}`"
          :active="$i18n.locale === language" color="#014e9e" @click="$i18n.locale = String(language)">
          <v-list-item-title>{{ languages[(language as keyof typeof languages)].language }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
// https://www.digitalocean.com/community/tutorials/vuejs-vue-with-i18n
import { loadLocale } from "@/locales/i18n";
import { defineComponent } from "vue";

export default defineComponent({
  name: "SelectLocale",
  props: ["header"],
  computed: {
    languages: () => {
      return loadLocale()
    },
    color: function () {
      if (this.header) {
        return "#FFFFFF"
      } else {
        return "#014e9e"
      }
    }
  },
});
</script>
