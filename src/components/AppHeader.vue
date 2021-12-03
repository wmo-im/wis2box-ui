<template id="app-header">
  <div class="app-header">
    <v-system-bar :height="height">
      <v-row justify="center">
        <v-card
          :height="height - 1"
          width="1279"
          :style="{
            'background-image': `url(${require('@/assets/img/wmo-banner.png')})`,
          }"
        >
          <v-container>
            <v-row align="end">
              <a
                href="https://community.wmo.int/activity-areas/wis/wis2-implementation"
                title="wis2node"
              >
                <img :src="`${require('@/assets/img/logo.png')}`" />
              </a>
              <div id="wis2node-nav">
                <router-link to="/">
                  {{ $t("navigation.homepage") }}
                </router-link>
                |
                <a
                  target="_window_catalogue"
                  href="http://localhost:8999/pygeoapi"
                >
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
              <v-spacer />
              <select-locale />
            </v-row>
          </v-container>
        </v-card>
      </v-row>
    </v-system-bar>
  </div>
</template>

<script>
import SelectLocale from "./SelectLocale.vue";
import { documentation } from "../../package";

export default {
  name: "AppHeader",
  template: "#app-header",
  components: {
    SelectLocale,
  },
  data: function () {
    return {
      documentation: documentation,
      height: 110,
    };
  },
};
</script>
