<template>
  <app-header></app-header>
  <v-content>
    <v-container>
      <div id="wis2node-nav">
        <router-link to="/">
          {{ $t("$vuetify.navigation.homepage") }}
        </router-link>
        |
        <router-link to="/plot">
          {{ $t("$vuetify.navigation.plot") }}
        </router-link>
        |
        <a target="_window_catalogue" href="http://localhost:8999/pygeoapi">
          {{ $t("$vuetify.navigation.catalogue") }}
        </a>
        |
        <a
          target="_window_service_monitor"
          href="http://localhost:8999/monitor"
        >
          {{ $t("$vuetify.navigation.service_monitor") }}
        </a>
        |
        <a target="_window_docs" :href="documentation">
          {{ $t("$vuetify.navigation.documentation") }}
        </a>
      </div>
    </v-container>
    <v-container>
      <router-view />
    </v-container>
  </v-content>
  <app-footer></app-footer>
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
    };
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
};
</script>
