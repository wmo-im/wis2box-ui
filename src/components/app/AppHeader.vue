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
        <v-row justify="center">
          <v-responsive width="90%" max-width="1130">
            <v-container fluid>
              <v-row align="start">
                <a :href="wis2" title="wis2box">
                  <img :src="logo" class="pl-8 py-auto" />
                </a>
                <v-spacer />
                <token-auth class="mt-n2" />
                <select-locale class="mt-n2 pr-8" />
              </v-row>
            </v-container>
          </v-responsive>
        </v-row>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import SelectLocale from "./SelectLocale.vue";
import TokenAuth from "./TokenAuth.vue";
import logo from "@/assets/img/logo.png";
import banner from "@/assets/img/wmo-banner.png";
import foot from "@/assets/img/wmo-foot.png";

import { defineComponent } from "vue";

export default defineComponent({
  name: "AppHeader",
  template: "#app-header",
  components: {
    SelectLocale,
    TokenAuth,
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
