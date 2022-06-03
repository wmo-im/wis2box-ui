<template>
  <v-app id="v-app">
    <app-header app />

    <v-main>
      <v-card flat class="py-3">
        <v-row justify="center">
          <v-responsive width="90%" max-width="1130">
            <router-view />
          </v-responsive>
        </v-row>
      </v-card>
    </v-main>

    <app-footer app class="pt-4" />
  </v-app>
</template>

<script>
import AppFooter from "@/components/app/AppFooter.vue";
import AppHeader from "@/components/app/AppHeader.vue";

import { useI18n } from "vue-i18n";

export default {
  components: {
    AppFooter,
    AppHeader,
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
