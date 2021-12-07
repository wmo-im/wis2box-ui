<template>
  <v-app id="v-app">
    <app-header></app-header>
    <v-main>
      <v-card>
        <v-container>
          <router-view />
        </v-container>
      </v-card>
    </v-main>
    <app-footer></app-footer>
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
