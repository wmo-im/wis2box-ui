<template>
  <v-app id="v-app">
    <app-header />

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

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
      console.log(this.dialog);
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
