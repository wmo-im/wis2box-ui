<template>
  <v-app id="v-app">
    <app-header app />

    <v-main>
      <v-row justify="center">
        <v-card flat width="80%" class="pt-4">
          <router-view />
        </v-card>
      </v-row>
    </v-main>

    <app-footer app class="pt-4" />
  </v-app>
</template>

<script>
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";

import { useI18n } from "vue-i18n";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    toggleDialog: function () {
      this.dialog = this.dialog === true ? false : true;
    },
    clean(word) {
      if (typeof word === "string") {
        return (
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).replaceAll("_", " ");
      }
    },
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
};
</script>
