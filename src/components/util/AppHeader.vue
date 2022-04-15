<template id="app-header">
  <div class="app-header">
    <v-app-bar app flat height="124">
      <template v-slot:image>
        <v-container fluid class="pt-0">
          <v-img height="110" cover :src="banner" />
          <v-img cover :src="foot" />
        </v-container>
      </template>

      <template v-slot:default>
        <v-container fluid>
          <v-row>
            <v-spacer />
            <select-locale class="pt-4" />
          </v-row>
          <v-row fill-height align="center">
            <a :href="wis2" title="wis2box">
              <img :src="logo" class="px-4 pb-6" />
            </a>
            <v-btn-group divided>
              <v-btn
                v-text="$t('navigation.home')"
                class="font-weight-bold"
                to="/"
              />
              <v-btn
                v-text="$t('navigation.services')"
                class="font-weight-bold"
                to="/services"
              />
              <v-btn
                v-text="$t('navigation.documentation')"
                class="font-weight-bold"
                :href="documentation"
                target="_window_docs"
              />
            </v-btn-group>
          </v-row>
        </v-container>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import SelectLocale from "./SelectLocale.vue";
import logo from "@/assets/img/logo.png";
import banner from "@/assets/img/wmo-banner.png";
import foot from "@/assets/img/wmo-foot.png";
import { documentation } from "../../../package";

import { defineComponent } from "vue";

export default defineComponent({
  name: "AppHeader",
  template: "#app-header",
  components: {
    SelectLocale,
  },
  data: function () {
    return {
      documentation: documentation,
      wis2: "https://community.wmo.int/activity-areas/wis/wis2-implementation",
      logo: logo,
      banner: banner,
      foot: foot,
    };
  },
});
</script>
