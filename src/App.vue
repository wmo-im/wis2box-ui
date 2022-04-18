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
import AppHeader from "@/components/util/AppHeader.vue";
import AppFooter from "@/components/util/AppFooter.vue";

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
