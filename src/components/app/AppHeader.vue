<template id="app-header">
  <div class="app-header">
    <v-app-bar flat height="124">
      <template v-slot:image>
        <v-container fluid class="pt-0">
          <v-img height="110" cover :src="banner" :lazy-src="banner" />
          <v-img cover :src="foot" :lazy-src="foot" />
        </v-container>
      </template>

      <template v-slot:default>
        <v-responsive
          width="90%"
          max-width="1130"
          height="100%"
          class="mx-auto"
        >
          <v-container fluid>
            <v-row align="start" fill-height>
              <a :href="wis2" title="wis2box">
                <img :src="logo" class="pl-6 my-3" />
              </a>
              <v-spacer />
              <app-settings class="ma-3" />
            </v-row>
          </v-container>
        </v-responsive>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import AppSettings from "./AppSettings.vue";
import logo from "@/assets/img/logo.png";
import banner from "@/assets/img/wmo-banner.png";
import foot from "@/assets/img/wmo-foot.png";

import { defineComponent } from "vue";

export default defineComponent({
  name: "AppHeader",
  template: "#app-header",
  components: {
    AppSettings
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
