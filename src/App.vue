<template>
  <v-app id="v-app">
    <app-header></app-header>
    <v-main>
      <v-card>
        <v-container>
          <div id="wis2node-nav">
            <router-link to="/">
              {{ $t("navigation.homepage") }}
            </router-link>
            |
            <router-link to="/plot">
              {{ $t("navigation.plot") }}
            </router-link>
            |
            <a target="_window_catalogue" href="http://localhost:8999/pygeoapi">
              {{ $t("navigation.catalogue") }}
            </a>
            |
            <a
              target="_window_service_monitor"
              href="http://localhost:8999/monitor"
            >
              {{ $t("navigation.service_monitor") }}
            </a>
            |
            <a target="_window_docs" :href="documentation">
              {{ $t("navigation.documentation") }}
            </a>
          </div>
        </v-container>
        <v-container>
          <router-view />
        </v-container>
      </v-card>
    </v-main>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import { documentation } from "../package";

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
      documentation: documentation,
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
