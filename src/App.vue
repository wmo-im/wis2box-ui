<template>
  <v-app id="v-app">
    <app-header />
    <v-divider class="my-1" />

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-divider class="my-1" />
    <app-footer />
  </v-app>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

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
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
};
</script>
