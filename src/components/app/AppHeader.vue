<template id="app-header">
  <div class="app-header">
    <v-app-bar flat height="124">
      <template v-slot:image>
        <v-container fluid class="pt-0">
          <v-img height="110" cover :src="banner" />
          <v-img cover :src="foot" />
        </v-container>
      </template>

      <template v-slot:default>
        <v-row justify="center">
          <v-responsive width="90%" max-width="1130">
            <v-container fluid>
              <v-row>
                <v-spacer />
                <select-locale class="pt-4 pr-4" />
              </v-row>
              <v-row>
                <a :href="wis2" title="wis2box">
                  <img :src="logo" class="px-4 pb-6" />
                </a>
              </v-row>
            </v-container>
          </v-responsive>
        </v-row>
      </template>
    </v-app-bar>
    <v-row justify="center">
      <v-responsive width="90%" max-width="1130">
        <app-nav />
      </v-responsive>
    </v-row>
  </div>
</template>

<script>
import SelectLocale from "./SelectLocale.vue";
import AppNav from "./AppNav.vue";
import logo from "@/assets/img/logo.png";
import banner from "@/assets/img/wmo-banner.png";
import foot from "@/assets/img/wmo-foot.png";

import { defineComponent } from "vue";

export default defineComponent({
  name: "AppHeader",
  template: "#app-header",
  components: {
    AppNav,
    SelectLocale,
  },
  data: function () {
    return {
      wis2: "https://community.wmo.int/activity-areas/wis/wis2-implementation",
      logo: logo,
      banner: banner,
      foot: foot,
    };
  },
});
</script>
